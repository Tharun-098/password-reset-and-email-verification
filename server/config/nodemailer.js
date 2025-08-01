import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);
const transporter=nodemailer.createTransport({
     service:'gmail',
     auth:{
         user:process.env.SMTP_USER,
         pass:process.env.SMTP_PASSWORD
     }
 })

export default transporter;