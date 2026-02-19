import { Shop } from "../models/shop.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js";
import { Item } from "../models/item.model.js";

const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
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

    shop.items.push(item._id);
    await shop.save();
    await shop.populate({
      path: "owner items",
      Options: { sort: { updatedAt: -1 } },
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
    const ItemId = req.params.itemId;

    const { name, category, foodType, price } = req.body;

    const updateData = { name, category, foodType, price };

    if (req.file) {
      updateData.image = await UploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      ItemId,
      updateData,
      { name, category, foodType, price },
      { new: true },
    );

    if (!item) {
      return res.status(500).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    if (!shop) {
      return res
        .status(401)
        .json({ message: "shop not found error in editItem controller" });
    }

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json({ message: "error occured while edit item" });
  }
};
export { EditItem };

export const getItemById = async (req, res) => {
  try {
    const ItemId = req.params.itemId;
    const item = await Item.findById(ItemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(201).json(item);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error occured in controller  getItemById" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });

    shop.items = shop.items.filter((i) => i.toString() !== item._id.toString());
    shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "error occured while deleting item", err });
  }
};
export { deleteItem };


const getItemBycity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: "city required" });

    const shops = await Shop.find({
  city: { $regex: `^${city}$`, $options: "i" }
}).populate("items");

  
    if (shops.length === 0) {
      return res.status(404).json({ message: "shop not found" });
    }

    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({
      shop: { $in: shopIds },
    });

    return res.status(200).json(items);

  } catch (err) {
    console.log("error occured while get shop by city controller", err);
    res.status(500).json({ message: "server error" });
  }
};
export {getItemBycity}