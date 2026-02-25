import mongoose from "mongoose";
import User from "./user.model";

const deliveryAssignmentSchema = new mongoose.Schema({

      order:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"Order"
      },
       shop:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"Shop"
      },
      shopOrderId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
      },

      broadCastedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
      },
      assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
      },
      status:{
            type:String,
            enum:["broadcasted","assigned","completed"],
            default:"broadcasted"
      },
      accepedAt:Date


},{timestamps:true})

const deliveryAssignment = new mongoose.model("deliveryAssignment",deliveryAssignmentSchema);


export {deliveryAssignment}