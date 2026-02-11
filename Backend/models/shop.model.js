import mongoose from 'mongoose'
import { Schema } from 'mongoose';

const shopSchema = Schema({
      name:{
            type:String,
            required:true
      },
      image:{
            type:String,
            required:true        
      },
      owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
      },

      state:{
            type:String,
            required:true
      },
      city:{
            type:String,
            required:true
      },
      address:{
            type:String,
            required:true
      },
      items:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"item"
      },

},{timestamps:true})

 const Shop =   mongoose.model("Shop",shopSchema);
 export {Shop}