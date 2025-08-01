import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
const app=express();
const PORT=process.env.PORT || 4000;
const allowedOrigins=['http://localhost:5173','https://password-frontend-five.vercel.app']
connectDb();

app.use(cors({origin:allowedOrigins,credentials:true}));
app.use(express.json());
app.use(cookieParser())
app.get('/',(req,res)=>{
    res.send("Server is running");
})
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
})
