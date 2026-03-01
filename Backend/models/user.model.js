import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },
    resetOpt: {
      type: String,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpire: {
      type: Date,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
       
       
      },
      coordinates: {
        type: [Number], // [lng, lat]
      
      
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });
const User = mongoose.model("User", userSchema);
export default User;
