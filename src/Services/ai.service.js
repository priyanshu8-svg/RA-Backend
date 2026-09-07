import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";
// zod is used to turn AI Outputs in enforced format.
//without zod AI can guess the output format and can return it in any format.
//zod is used to validate the output of the AI.
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: "gemini-2.5-flash",
})


const InterviewReportSchema = z.object({

    // technical questions
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The techincal question can be asked in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),


    // behavioral questions
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),


    // skill gaps
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill gap"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("Skill gaps that can be asked in the interview"),

    // preparation plan
    preparationPlan: z.array(z.object({
        day: z.number().describe("Give the 7 days plan for the interview preparation"),
        focus: z.string().describe("The focus of the preparation plan"),
        tasks: z.array(z.string()).describe("The tasks to be done in the preparation plan")
    })).describe("Preparation plan for the interview"),

    //title
    title: z.string().describe("The title of the interview report"),
    // match score
    matchScore: z.number().describe("The match score between the resume and the job description")
})



/**
 * Helper to safely parse JSON from AI response, stripping potential markdown blocks.
 */
function safelyParseJSON(text) {
    try {
        // Try direct parse first
        return JSON.parse(text.trim());
    } catch (e) {
        // If it fails, try to find the first '{' and last '}'
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && start < end) {
            const jsonPart = text.substring(start, end + 1);
            try {
                return JSON.parse(jsonPart);
            } catch (e2) {
                console.error("AI Response was not valid JSON even after stripping markdown headers.");
                throw new Error("Unable to parse AI response. Check the response body format.");
            }
        }
        throw new Error("AI did not return any JSON object.");
    }
}

async function GenerateInterviewReport(resume,
    selfDescription,
    jobDescription) {

    const prompt = `Task: Generate a comprehensive interview report for a candidate.
        
        Format: Return the result strictly as a raw JSON object. Do not include any introductory text or markdown code blocks.
        Information:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    technicalQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                intention: { type: "string" },
                                answer: { type: "string" }
                            },
                            required: ["question", "intention", "answer"]
                        }
                    },
                    behavioralQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                intention: { type: "string" },
                                answer: { type: "string" }
                            },
                            required: ["question", "intention", "answer"]
                        }
                    },
                    skillGaps: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                skill: { type: "string" },
                                severity: { type: "string", enum: ["low", "medium", "high"] }
                            },
                            required: ["skill", "severity"]
                        }
                    },
                    preparationPlan: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: { type: "number" },
                                focus: { type: "string" },
                                tasks: { type: "array", items: { type: "string" } }
                            },
                            required: ["day", "focus", "tasks"]
                        }
                    },
                    matchScore: { type: "number" }
                },
                required: ["technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "matchScore"]
            }
        }
    });

    return safelyParseJSON(response.text);
}



async function generatedPdffromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })


    const PdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close();

    return PdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {



    const resumepdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Task: Generate a resume PDF for a candidate.
                   Information:
                   Resume: ${resume};
                   Self Description: ${selfDescription};
                   Job Description: ${jobDescription}    

                   Output requirement: The response must be a raw JSON object with a single field "html" containing the HTML structure of the resume. 
                   Do not add markdown delimiters or text before/after the JSON.
                   The content should not be sound like it is generated by AI.
                   You can highlight the content using some colors or different font styles.
                   The content should be ATS friendly.i.e. it should be easy to parse by ATS.
                   The resume should not be lengthy., it should ideally be 1-2 pages.
                   Focus on quality over quantity and make sure to include all the important information that can increase the candidate's chances of getting selected
                    
                  `
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumepdfSchema)
        }
    })

    const jsonContent = safelyParseJSON(response.text);

    const PdfBuffer = await generatedPdffromHtml(jsonContent.html);

    return PdfBuffer;


}

export { GenerateInterviewReport, generateResumePdf };
