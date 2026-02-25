import express from 'express'
import {isAuth} from '../middlewares/isAuth.js'
import { placeOrder } from '../controlers/order.controller.js';
import { getMyOrders } from '../controlers/order.controller.js';
import { updateorderStatus } from '../controlers/order.controller.js';


const orderRouter = express.Router();
orderRouter.post("/place-order",isAuth,placeOrder);
orderRouter.get("/my-orders",isAuth,getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateorderStatus);

export { orderRouter }