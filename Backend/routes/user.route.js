import express from "express";

import { getCurrentUser } from "../controlers/user.controller.js";
import  { isAuth  } from "../middlewares/isAuth.js";

const userRouter = express.Router();
console.log("user route is running")
userRouter.get("/current_user",isAuth,getCurrentUser)
console.log("user route   is not running")

export default userRouter;