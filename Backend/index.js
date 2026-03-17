import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect_mongodb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { itemRouter } from "./routes/item.route.js";
import { shopRouter } from "./routes/shop.route.js";
import { orderRouter } from "./routes/order.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("io",io)

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
socketHandler(io);
let port = process.env.PORT;
connect_mongodb();
server.listen(port, () => {
  console.log("server is running on port", port);
});
