import express from "express";
import { signUp,signIn,signOut,sendOtp, verifyOtp, resetPassword,googleAuth } from "../controlers/auth.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const authRouter = express.Router();
authRouter.post("/", isAuth);
authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.post("/signout",signOut)
authRouter.post("/send-otp",sendOtp);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/reset-password",resetPassword);
authRouter.post("/google-auth",googleAuth);


export default authRouter;