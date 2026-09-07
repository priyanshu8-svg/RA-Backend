import dotenv from 'dotenv'
dotenv.config();
import { app } from './src/app.js'
import connectToDB from './src/config/database.js';
// import GenerateInterviewReport from './src/Services/ai.service.js';





connectToDB();
//GenerateInterviewReport();

app.get("/", (req, res) => {
    res.send("Backend server is running");
})

// app.listen(3001, () => {
//     console.log("Server is running on port: http://localhost:3001")
// })
export default app;