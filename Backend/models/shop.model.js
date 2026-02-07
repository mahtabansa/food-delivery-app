import mongoose from 'mongoose'

const shopSchema =new mongoose.schema({
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
            required:true
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
            type:mongoose.schema.Types.ObjectId,
            ref:"item"
      }

},{timestamps:true})

 const Shop =   mongoose.model("Shop",shopSchema);
 export {Shop}