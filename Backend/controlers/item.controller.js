import { Shop } from "../models/shop.model.js";
import  UploadOnCloudinary  from "../utils/cloudinary.js";
import { Item } from "../models/item.model.js";

const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(500).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });
  } catch (err) {
    console.log("error in the item creation in item controller", err);
    return res
      .status(401)
      .json({ message: "error occured during item creation", err });
  }
};
export { addItem };

const EditItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image: await UploadOnCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true },
    );
    if (!item) {
      return res.status(500).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "error occured while edit item" });
  }
};
export {EditItem}
