import mongoose from "mongoose";
import { Schema } from "mongoose";

const shopOrderItemSchema =new Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    price: Number,
    quantity: Number,
    name:String,
    foodType:String,
  },
  { timestamps: true },
);



const ShopOrderSchema =new Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal:Number,
    shopOrderItems: [shopOrderItemSchema],
    status:{
      type:String,
      enum:["pending","preparing","out of delivery","delivered"],
      default:"pending"
    },

    assignment:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    },
    assignedDeliveryBoy:{
       type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    }

    
  },
  { timestamps: true },
);


const orderSchema =new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryAddress:{
      type: String,
     
    },
    longitude: Number,
    latitude: Number,

    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrder: [ShopOrderSchema],
  },


  { timestamps: true },
);



const Order =  mongoose.model("Order", orderSchema);
export { Order };
