import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();



cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_SECRET,
  
});

const UploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const fixedPath = filePath.replace(/\\/g, "/");

    const result = await cloudinary.uploader.upload(fixedPath, {
      folder: "shops",
    });

    if (!result) return null;

    console.log("Upload successful:", result.secure_url);

    // ✅ fixedPath ya original dono kaam karenge, but consistent rakho
    if (fs.existsSync(fixedPath)) {
      fs.unlinkSync(fixedPath);
    }

    return result.secure_url;

  } catch (err) {
    console.log("Cloudinary upload error:", err);
    // ✅ File fail hone par bhi delete karo
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
};
export default UploadOnCloudinary;