import express from 'express'
import {isAuth} from '../middlewares/isAuth.js'
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getOrderById, getTodaysDeliveries, placeOrder, sendDeliveryOtp, verifyDeliveryOtp, verifyPayment } from '../controlers/order.controller.js';
import { getMyOrders } from '../controlers/order.controller.js';
import { updateorderStatus } from '../controlers/order.controller.js';


const orderRouter = express.Router();
orderRouter.post("/place-order",isAuth,placeOrder);
orderRouter.post("/verify-payment",isAuth,verifyPayment);
orderRouter.get("/my-orders",isAuth,getMyOrders);
orderRouter.get("/get-current-order",isAuth,getCurrentOrder);
orderRouter.get("/get-assignmets",isAuth,getDeliveryBoyAssignment);
orderRouter.post("/send-delivery-otp",isAuth,sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp",isAuth,verifyDeliveryOtp);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateorderStatus);
orderRouter.get("/accept-order/:assignmentId",isAuth,acceptOrder);
orderRouter.get("/get-order-by-id/:orderId",isAuth,getOrderById);
orderRouter.get("/get-todays-deliveries",isAuth,getTodaysDeliveries);




export { orderRouter }