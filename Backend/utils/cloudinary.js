import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();



cloudinary.config({
  cloud_name:"dtickwhmn",
  api_key:"526628427873274",
  api_secret: "HBs9fTFBDxY3q4aWDV5hfqQ9QK4",
  
});

const UploadOnCloudinary = async (filePath) => {

  
  try {
    if (!filePath) {
    return null;
  }
      const fixedPath = filePath.replace(/\\/g,"/");
   
    const result = await cloudinary.uploader.upload(
     fixedPath,{folder:"shops"}
      
    );

    if (!result) {
      return result;
    }
    console.log("Upload successful:", result.secure_url);

       if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }


    return result.secure_url;
  } catch (err) {
   
    console.log("Cloudinary upload error:", err);
    return null;
  }
};

export default UploadOnCloudinary;

