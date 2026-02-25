import { Shop } from "../models/shop.model.js";
import { Order } from "../models/order.model.js";
import User from "../models/user.model.js";
const placeOrder = async (req, res) => {
  try {
    const {
      CardItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      longitude,
      latitude,
    } = req.body;

    // Here you would typically save the order to your database
    // For this example, we'll just return a success message
    if (
      CardItems.length === 0 ||
      !totalAmount ||
      !deliveryAddress ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Card is empty " });
    }

    const groupItemByShop = {};

    CardItems.forEach((item) => {
      const shopId = item.shop;

      if (!groupItemByShop[shopId]) {
        groupItemByShop[shopId] = [];
      }
      groupItemByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.entries(groupItemByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId[0]).populate("owner");

        if (!shop) {
          return res
            .status(404)
            .json({ message: `Shop with id ${shopId[0]} not found` });
        }

        const shopid = shop._id;
        const items = groupItemByShop[shopid];

        const subtotal = items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((item) => ({
            item: item._id,
            price: item.price,
            quantity: item.quantity,
            name: item.name,
            foodType: item.foodType,
          })),
        };
      }),
    );
    console.log("deliveryAddress", longitude, latitude);
    const newOrder = new Order({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      longitude: longitude,
      latitude: latitude,
      totalAmount: totalAmount,
      shopOrder: await Promise.all(shopOrders),
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

export { placeOrder };

const getMyOrders = async (req, res) => {
  try {
    const userid = req.userId;

    const user = await User.findById(userid);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "user") {
      const orders = await Order.find({ user: userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image")
        .populate("shopOrder.owner", "name email mobile")
        .populate("shopOrder.shopOrderItems.item", "name image price");

      return res.status(200).json({ orders });
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrder.owner": userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image")
        .populate("user")
        .populate("shopOrder.shopOrderItems.item", "name image price");

      console.log("orders", orders);
      return res.status(200).json({ orders });
    }
  } catch (err) {
    res.status(500).json({ message: "error in getting orders", err });
  }
};
// const getMyOrders = async (req, res) => {
//   try {
//     const userid = req.userId;
//     const role = req.role; // middleware se bhejo

//     let query = role === "owner"
//       ? { "shopOrder.owner": userid }
//       : { user: userid };

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .populate([
//         {
//           path: "user",
//           select: "name email mobile",
//         },
//         {
//           path: "shopOrder.shop",
//           select: "name image",
//         },
//         {
//           path: "shopOrder.owner",
//           select: "name email mobile",
//         },
//         {
//           path: "shopOrder.shopOrderItems.item",
//           select: "name image price",
//         },
//       ]);

//     return res.status(200).json({ orders });

//   } catch (err) {
//     res.status(500).json({ message: "error in getting orders", err });
//   }
// };

export { getMyOrders };
const updateorderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    // find correct shop order
    const shopOrder = order.shopOrder.find(o => o.shop.equals(shopId));

    if (!shopOrder) {
      return res.status(404).json({ message: "shop order not found" });
    }

    // update status
    shopOrder.status = status;

    // save parent document
    await order.save();

    // populate after save


    return res.status(200).json(shopOrder);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "order status error" });
  }
};

export { updateorderStatus };
