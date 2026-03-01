import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config()
export const isAuth = async (req, res, next) => {
  try {
   
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);

    req.userId = decodeToken.userId;

    if (!decodeToken) {
      return res.status(400).json({ message: "Token not verified" });
    }
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: "isAuth error", error: err.message });
  }
};

