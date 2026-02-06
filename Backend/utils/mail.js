import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host:"smtp.gmail.com",
  
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PASS, 
  },
});

export const sendOptMail= async (to,otp) => {
  const info = await transporter.sendMail({
    from:process.env.EMAIL,      
    to,
    subject: "Rest your Password",
    html:`<p>Your OTP for password reset is <b>${otp}.It expires in the 5 min</b></p>`, 
  });
}
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

