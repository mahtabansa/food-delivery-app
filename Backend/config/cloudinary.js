import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


const UploadCloudinary = async (file) => {
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET,
  });

try {
const result =  cloudinary.uploader.upload(file)
  .then(result=>console.log(result));
 fs.unlinkSync(file);
 return result.secure_url
}
catch(err){
      
      fs.unlinkSync(file);
      console.log("error occured during image upload on cloudinary",err);
}

};

export {UploadCloudinary}