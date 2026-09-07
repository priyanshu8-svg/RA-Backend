import * as pdfModule from "pdf-parse/lib/pdf-parse.js";
const PDFParse = pdfModule.PDFParse;
import {GenerateInterviewReport, generateResumePdf} from "../Services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";

/**
 * @route POST /api/interview/generate-report
 * @description Generate interview report
 * @access Private
 * 
 */

export const generateInterviewReportController = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    let resumeContent;
    try {
        resumeContent = await (new PDFParse(Uint8Array.from(req.file.buffer)).getText());
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return res.status(400).json({ message: "Failed to parse resume PDF. Please ensure the file is valid." });
    }

    if (!resumeContent) {
        return res.status(400).json({ message: "No text found in the PDF file." });
    }
    const { selfDescription, jobDescription } = req.body;


    const InterviewReportByAI = await GenerateInterviewReport(
        resumeContent.text,
        selfDescription,
        jobDescription
    );
    console.log(InterviewReportByAI.technicalQuestions);
    const interviewReport = await InterviewReportModel.create({
        user: req.user.id,
        resumeText: resumeContent.text,
        title: req.body.title,
        selfDescription,
        jobDescription,

        technicalQuestions: InterviewReportByAI.technicalQuestions,

        behavioralQuestions: InterviewReportByAI.behavioralQuestions,
        skillGaps: InterviewReportByAI.skillGaps,
        preparationPlan: InterviewReportByAI.preparationPlan,
        matchScore: InterviewReportByAI.matchScore,
    });
    console.log(resumeContent.text)
    res.status(201).json({
        success: true,
        message: "Interview Report Generated Successfully",
        data: interviewReport
    })

}

/**
 * @route POST /api/interview/get-report/:interviewId
 * @description Get the report of logged in user
 * @access Private
 */

export const getInterviewReportController = async (req, res) => {
    const { interviewId } = req.params;
    const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview Report Not Found",
        })
    }
    res.status(200).json({
        success: true,
        message: "Interview Report Fetched Successfully",
        data: interviewReport
    })
}

/**
 * @route POST /api/interview/get-all-reports
 * @description Get all the report of logged in user
 * @access Private
 */
export const getAllReportsController = async (req, res) => {
    const interviewReports = await InterviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        success: true,
        message: "Interview Reports Fetched Successfully",
        data: interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */

export const generateResumePdfController= async (req,res)=>{
    const {interviewReportId}= req.params

    const interviewReport= await InterviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found."
        })
    }

    const {resume, selfDescription, jobDescription}= interviewReport

    const PdfBuffer= await generateResumePdf({resume, selfDescription, jobDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(PdfBuffer)
}