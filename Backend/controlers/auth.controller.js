import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import gentoken from "../utils/token.js";
import { sendOptMail } from "../utils/mail.js";


export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json("user already exist");
    }
    if(password.length < 6){
          return res.status(400).json("password must be at least 6 characters.");
    }
    if(mobile.length < 10){
          return res.status(400).json("user phone number must be 10 digits");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashPassword,
      mobile,
      role,
    });
    const token = await gentoken(user._id);
    console.log("Token gen",token);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
   
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json(`signup error ${err}`);
  }
};

export const signIn = async (req, res) => {

  try {
    let { email, password } = req.body;
    if(!email || !password) { 
      return res.status(400).json({ message: "Email and password required" });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await gentoken(user._id);
    console.log(token);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
 
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(`signIn error ${err}`);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "signOut successfully" });
  } catch (err) {
    return res.status(500).json(`singOut error ${err}`);
  }
};


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist." });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOpt = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOptMail(email, otp);
    return res.status(200).json({ message: "otp send succesfull" });
  } catch (err) {
    return res.status(500).json(`send otp error ${err}`);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const {email, otp} = req.body;
    let user =await User.findOne({ email });
    if (!user || user.resetOpt != otp || user.otpExpire < Date.now())  {
      return res.status(400).json({ message: "invalid/expired otp" })}
      user.isOtpVerified = true;
      user.resetOpt = undefined;
      user.otpExpire = undefined;
      await user.save();
      return res.status(200).json({ message: "otp verify seccessfully" });
   
  } catch (err) {
    return res.status(500).json(`send opt error ${err}`)
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Input validation
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check OTP verification
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }
    
    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false;
    await user.save();
    
    return res.status(200).json({ 
      success: true,
      message: "Password reset successfully" 
    });
    
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Server error. Please try again" 
    });
  }
}

export const googleAuth = async(req,res) => {

        let {fullName,email,mobile,role}=req.body;
        let user =await User.findOne({email});
        if(!user){
        user = await User.create({
            fullName,email,mobile,role
          })
        }
        const token=await gentoken(user._id);
        res.cookie("token",token,{
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        });
     
        return res.status(200).json(user);

}