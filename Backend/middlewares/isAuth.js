import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
export const isAuth =async(req,res,next)=> {
   try{ 
     const token = req.cookies.token;
     if(!token){
      return res.status(400).json({message:"token not found"})
     }
     const decodeToken = jwt.verify(token,process.env.JWT_KEY);
    //  async(err,data)=> {
    //   if(err){
    //     return res.status(400).json({message:"Token not verified"})
    //   }
    //    else{
    //     const user =  await User.findOne({_id:data.userId});
    //     if(user){
    //       return res.json({message:"User is authenticated", user:{name:user.name,email:user.email,_id:user._id}})
    //     }
    //     else {
    //       return res.status(400).json({status:false,message:"user not found"});
    //     }
    //    }
    //  })
    console.log("decodetoeken",decodeToken);
    req.userId = decodeToken.userId;
     if(!decodeToken){
         return res.status(400).json({message:"Token not verified"})
     }
     next();
     
   }catch(err){
       return res.status(400).json({message:"isAuth error", error:err.message})
   }
}


// if(!decodeToken){
//       return res.status(400).json({message:"Token not verified"})
//     }
//      console.log(decodeToken);
//     req.userId = decodeToken.userId;
//     next();
