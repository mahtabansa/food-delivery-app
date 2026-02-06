import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connect_mongodb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(cors({
      origin:"http://localhost:5173",
      credentials:true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);

let port = process.env.PORT;
connect_mongodb();
app.listen(port,()=> {
      console.log("server is running on port",port);
}) 
