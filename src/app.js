import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Require all the (Auth)routes here
import AuthRouter from './routes/auth.routes.js';
// Require all the (Interview)routes here
import interviewRouter from './routes/interview.routes.js';


// Using all the (Auth) routes here
app.use('/api/auth', AuthRouter);
//Using all the (Interview) routes here
app.use('/api/interview', interviewRouter);

export { app }