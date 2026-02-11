import UploadOnCloudinary from "../utils/cloudinary.js";
import { Shop } from "../models/shop.model.js";


const createEditShop = async (req,res)=>{
 try{

   console.log("BODY:",req.body);
   console.log("FILE:",req.file);
   console.log("USER:",req.userId);

   let image=null;

   if(req.file){
     image = await UploadOnCloudinary(req.file.path);
   }

   console.log("IMAGE URL:",image);

   let shop = await Shop.findOne({owner:req.userId});

   if(!shop){
     shop = await Shop.create({
       ...req.body,
       image,
       owner:req.userId
     });
   }

   console.log("SHOP:",shop);

   res.json(shop);

 }catch(err){
   console.log("🔥 REAL ERROR:",err);
   res.status(500).send(err.message);
 }
}


export {createEditShop}


const getMyshop = async (req, res) => {
  console.log("req.userId", req.userId);
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate("owner items");
    if (!shop) {
      return res.status(500).json({ message: "shop not found" });
    }
    return res.status(200).json(shop);
  } catch (err) {
    return res.status(401).json({ message: "error in finding shop ", err });
  }
};
export { getMyshop };
