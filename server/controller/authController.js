import User from "../models/user.js";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from "../config/nodemailer.js";
import { email_verify, password_reset_otp } from "../config/emailTemplate.js";
export const register=async(req,res)=>{
    try {
        const {username,password,email}=req.body;
        if(!username || !password || !email){
            return res.json({success:false,message:"please provide username and password and email"});
        }
        const existUser=await User.findOne({email});
        if(existUser){
            return res. json({success:false,message:"User already exists"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const newUser=new User({username,email,password:hashPassword});
        await newUser.save();
        const token=jsonwebtoken.sign({id:newUser._id},process.env.JWT_REFRESH_TOKEN,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV=='production',
            samesite:process.env.NODE_ENV=='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true,message:"User registered successfully",user:newUser})
    } catch (error) {
        return res.json({success:false,message:error.message})       
    }
}
export const login=async(req,res)=>{
    try {
        const {password,email}=req.body;
        if(!password || !email){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.json({success:false,message:"Invalid Credentials"});
        }

        const token=jsonwebtoken.sign({id:user._id},process.env.JWT_REFRESH_TOKEN,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV=='production',
            sameSite:process.env.NODE_ENV=='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true,message:"User logged in successfully",user})
    } catch (error) {
        return res.json({success:false,message:error.message})       
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV=='production',
            sameSite:process.env.NODE_ENV=='production'?'none':'strict',
        })
        return res.json({success:true,message:"User logged out successfully"})
    } catch (error) {
        return res.json({success:false,message:error.message})       
    }
}

export const sendVerifyOtp=async(req,res)=>{
    try {
        const userId=req.userId;
        //const {userId}=req.body;
        const user=await User.findById(userId);
        if(user.isAccountVerify){
            return res.json({success:false,message:"Account already verified"});
        }
        const otp=Math.floor(100000+Math.random()*900000).toString();
        user.verifyOtp=otp;
        user.verifyOtpExpires=Date.now()+24*60*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            //text:`Hello ${user.username},your OTP verification code is ${otp}.It is valid for 24 hrs.`
            html:email_verify.replace('{{email}}',user.email).replace('{{otp}}',otp)
        }
        await transporter.sendMail(mailOptions);       
        return res.json({success:true,message:"OTP sent successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const verifyEmail=async(req,res)=>{
    try {
        const userId=req.userId;
        const {otp}=req.body;
        if(!otp || !userId){
            return res.json({success:false,message:"Please provide otp and userId"});
        }
        const user=await User.findById(userId);
        if(!user){
            return res.json({success:false,message:"User not found"});
        }        
        if(user.verifyOtp==="" ||user.verifyOtp!==otp ){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.verifyOtpExpires<Date.now()){
            return res.json({success:false,message:"OTP expired"});
        }
        user.isAccountVerify=true;
        user.verifyOtp="";
        user.VerifyOtpExpires=0;
        await user.save();
        return res.json({success:true,message:"Email Verified Successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const resetOtp=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email || email==""){
            return res.json({success:false,message:"Please provide email"})
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const otp=Math.floor(100000+Math.random()*900000).toString();
        user.resetOtp=otp;
        user.resetOtpExpires=Date.now()+15*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password reset OTP',
            //text:`Hello ${user.username},your OTP verification code is ${otp} for password reset.It is valid for 24 hrs.`
            html:password_reset_otp.replace('{{email}}',user.email).replace('{{otp}}',otp)
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"OTP sent successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const PasswordReset=async(req,res)=>{
    try {
        const {email,otp,newPassword}=req.body;
        if(!email || !otp || !newPassword){
            return res.json({success:false,message:"Please provide email,otp and password"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        if(user.resetOtp==="" || user.resetOtp!==otp ){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.resetOtpExpires<Date.now()){
            return res.json({success:false,message:"OTP expired"});
        }
        const hashPassword=await bcrypt.hash(newPassword,10);
        user.password=hashPassword;
        user.resetOtp="";
        user.resetOtpExpires=0;
        await user.save();
        return res.json({success:true,message:"Password changed successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const authenticate=async(req,res)=>{
    try {
        return res.json({success:true,message:"User authenticated successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}