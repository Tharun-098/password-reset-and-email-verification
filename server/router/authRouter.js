import express from 'express';
import { authenticate, login, logout, PasswordReset, register, resetOtp, sendVerifyOtp, verifyEmail } from '../controller/authController.js';
import authenticateUser from '../middleware/authuser.js';

const authRouter=express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/logout',logout);
authRouter.post('/password/change',PasswordReset);
authRouter.get('/isAuth',authenticateUser,authenticate);
authRouter.post('/password/reset-otp',resetOtp);
authRouter.post('/email/send-Otp',authenticateUser,sendVerifyOtp);
authRouter.post('/email/verify',authenticateUser,verifyEmail);

export default authRouter;