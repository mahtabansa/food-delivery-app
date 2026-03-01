import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();
 console.log("JWT_KEY in gentoken:", process.env.JWT_KEY);
  function gentoken(userId){
  
  console.log("userId in the gentoken controller",userId)
 
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
  
  export { gentoken}
