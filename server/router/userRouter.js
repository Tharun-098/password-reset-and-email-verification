import express from 'express'
import getUserData from '../controller/userController.js';
import authenticateUser from '../middleware/authuser.js'
const userRouter=express.Router();
userRouter.get('/',authenticateUser,getUserData);
export default userRouter;