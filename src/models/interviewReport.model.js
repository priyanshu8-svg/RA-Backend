import mongoose from 'mongoose';


/**
 * Job description:String
 * Resume text:String
 * Self description:String
 *  
 * Technical Questions:
 *  [{
 *      question:"",
 *      intention:"",
 *      answer:"",
 *  }]
 *   
 * Behavioral Questions:
 *  [{
 *      question:"",
 *      intention:"",
 *      answer:"",
 * }]
 * Skill gaps:
 *  [{
 *      skill:"",
 *      severity:{
 *         type: String,
 *         enum:["low","medium","high"],
 *         default:"low",
 *      },
 *   
 * }]
 * 
 * -Match Score: Number
 * 
 * 
 * Preperation plan:
 *  [{
 *      day:Number,
 *      focus:String,
 *      tasks:[String],
 * }]
 */

// Technical Questions
const TechnicalSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

// Behavioral Questions
const BehavioralSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

// Skill Gaps
const SkillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    }
}, {
    _id: false
})

// Preparation Plan
const PreparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Tasks are required"]
    }
    ],
}, {
    _id: false
})

// Interview Report

const InterviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is required"]
    },
    resumeText: {
        type: String,
        required: [true, "Resume Text is required"]
    },
    selfDescription: {
        type: String,
    },
    title: {
        type: String,
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },

    technicalQuestions: [TechnicalSchema],
    behavioralQuestions: [BehavioralSchema],
    skillGaps: [SkillGapSchema],
    preparationPlan: [PreparationPlanSchema],


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const InterviewReportModel = mongoose.model('InterviewReport', InterviewReportSchema);

export default InterviewReportModel;