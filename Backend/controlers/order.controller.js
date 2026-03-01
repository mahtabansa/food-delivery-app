import { Shop } from "../models/shop.model.js";
import { Order } from "../models/order.model.js";
import User from "../models/user.model.js";
import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";
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

      return res.status(200).json({ orders });
    }
  } catch (err) {
    res.status(500).json({ message: "error in getting orders", err });
  }
};

export { getMyOrders };

const updateorderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "order not found" });

    const shopOrder = order.shopOrder.find((o) => o.shop.equals(shopId));
    if (!shopOrder) return res.status(404).json({ message: "shop order not found" });

    shopOrder.status = status;
    let deliveryBoysPayload = [];

    if (status === "out of delivery" && !shopOrder.assignment) {
      
      // ✅ Bug 1 Fix — order ki delivery location use karo
      console.log("order",order)
      console.log("shopOrder",shopOrder)
      const {longitude, latitude }= order;
      console.log("longitude, latitude",longitude, latitude)

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: 1000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busySet = new Set(busyIds.map((id) => String(id)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busySet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save(); // ✅ Bug 2 Fix — await lagaya
        return res.json({
          message: "order status updated but no delivery boy available",
          availableDeliveryBoys: [],
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadCastedTo: candidates,
        status: "broadcasted",
      });

      // shopOrder.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await order.save();

    // ✅ Bug 3 Fix — pehle populate, phir find
    await order.populate("shopOrder.shop", "name");
    await order.populate("shopOrder.assignedDeliveryBoy", "fullName email mobile");

    const updatedShopOrder = order.shopOrder.find((o) =>
      o.shop._id.equals(shopId)
    );

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableDeliveryBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "order status error" });
  }
};

export { updateorderStatus };
