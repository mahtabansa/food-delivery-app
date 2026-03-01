import express from "express";

import { getCurrentUser,updateuserLocation } from "../controlers/user.controller.js";
import  { isAuth  } from "../middlewares/isAuth.js";


const userRouter = express.Router();
userRouter.get("/current_user",isAuth,getCurrentUser)
userRouter.post("/update-location",isAuth,updateuserLocation)


export default userRouter;