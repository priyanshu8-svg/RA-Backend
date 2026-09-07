import express from 'express';
import authUser from '../middlewares/auth.middleware.js';
import * as InterviewController from '../controllers/interview.controller.js';
import upload from '../middlewares/file.middleware.js';
const interviewRouter = express.Router();


/**
 * @route POST /api/interview/create
 * @description Create a new interview report on the basis of resume, selfdescription and jobdescription
 * @access Private
 */
interviewRouter.post('/create', authUser, upload.single("resumeFile"), InterviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/report/:id
 * @description Get interview report by id
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authUser, InterviewController.getInterviewReportController)



/**
 * @route POST /api/interview/get-all-reports
 * @description Get all the report of logged in user
 * @access Private
 */
interviewRouter.post('/get-all-reports', authUser, InterviewController.getAllReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @decription generate resume pdf on the basis of user self description, resume, job decription.
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authUser, InterviewController.generateResumePdfController)
export default interviewRouter