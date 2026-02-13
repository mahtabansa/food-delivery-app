import UploadOnCloudinary from "../utils/cloudinary.js";
import { Shop } from "../models/shop.model.js";
import { Item } from "../models/item.model.js";


/// error in this and getshop route
const createEditShop = async (req,res)=>{
 try{

  const {name,state,city,address } = req.body;

  const updatedData = { name, state, city, address };

  let image;

  if(req.file){
    image = await UploadOnCloudinary(req.file.path);
    updatedData.image = image;
  }

  // Try update existing shop
  let shop = await Shop.findOneAndUpdate(
    { owner: req.userId },
    updatedData,
    { new:true }
  );

  // If not exist → create
  if(!shop){
    shop = await Shop.create({
      ...updatedData,
      owner:req.userId
    });
  }

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
