import { UploadOnCloudinary } from "../utils/cloudinary.js";
import { Shop } from "../models/shop.model.js";


const createEditShop = async (req, res) => {
  try {
    const { name, state, city, address } = req.body;
    let image
    if (req.file) {
      image : await UploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({owner:req.userId});
     if(!shop){
      shop = await Shop.create({
      name,
      state,
      city,
      address,
      image,
      owner: req.userId,
    });

     }else {
        shop= await Shop.findByIdAndUpdate(shop.id,{
          name,image,state,city,address,owner:req.userId },{new:true})
     }


    await shop.populate("owner");
    return res.status(201).json(shop);
  } catch (err) {
    return res.status(401).json({ message: "create shop error", err });
  }
};
 export {createEditShop} 


const getMyshop = async(req,res)=> {
      console.log("req.userId",req.userId);
  try {
    const shop = await Shop.findOne({owner:req.userId}).populate("owner items");
    if(!shop){
      return res.status(400).json({message:"shop not found"})
    }
    return res.status(200).json(shop);
  }catch(err){
    return res.status(401).json({message:"error in finding shop ",err})
  }
}
export {getMyshop}