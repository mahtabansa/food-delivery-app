import { UploadCloudinary } from "../config/cloudinary";
import { Shop } from "../models/shop.model";

const createShop = async (req, res) => {
  try {
    const { name, state, city, address } = req.body;
    let image;
    if (req.file) {
      image: await UploadCloudinary(req.file.path);
    }
    const shop = await Shop.create({
      name,
      state,
      city,
      address,
      image,
      owner: req.userId,
    });
    await shop.populate("owner");
    return res.status(201).json(shop);
  } catch (err) {
    return res.status(401).json({ message: "create shop error", err });
  }
};

export { createShop };

