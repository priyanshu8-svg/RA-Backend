import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: import.meta.env.VITE_FRONTEND_URL,
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