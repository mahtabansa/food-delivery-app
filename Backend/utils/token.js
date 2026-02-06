import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();
export default function gentoken(userId){
    try {
      return (jwt.sign(
        {  userId },
        process.env.JWT_KEY,
        { expiresIn: "7d" },
    ))
    } catch(err){
      console.log("error in the gen token",err);
    }
  };
  
