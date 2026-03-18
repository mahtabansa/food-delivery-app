import { Shop } from "../models/shop.model.js";
import { Order } from "../models/order.model.js";
import User from "../models/user.model.js";
import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";
import { sendDeliveryOptMail } from "../utils/mail.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import { configDotenv } from "dotenv";
configDotenv();
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
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
    console.log(" req.body;", req.body);
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

    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt._${Date.now()}`,
      });
      console.log("razorOrder", razorOrder);
      const newOrder = new Order({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        longitude: longitude,
        latitude: latitude,
        totalAmount: totalAmount,
        shopOrder: await Promise.all(shopOrders),
        razorpayOrderId: razorOrder._id,
        payment: false,
      });
      await newOrder.save();
      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }
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

    await newOrder.populate(
      "shopOrder.shopOrderItems.item",
      "name image price",
    );
    await newOrder.populate("shopOrder.shop", "name socketId");
    await newOrder.populate("user", "name email mobile");
    await newOrder.populate("shopOrder.owner", "name socketId");

    const io = req.app.get("io");    
    if(io) {
      newOrder.shopOrder.forEach((shoporder) => {
        const ownerSocketId = shoporder.owner.socketId;
        console.log("ownerSocketId in the order controller",ownerSocketId)
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            user: newOrder.user,
            payment:newOrder.paymentMethod,
            shopOrder:[shoporder],
            deliveryAddress: newOrder.deliveryAddress,
            createdAt: newOrder.createdAt,
          });
        }
      });
    }
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};
export { placeOrder };

const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderId,
  } = req.body;
  console.log("orderId in verify order", orderId);
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpayOrderId = orderId;
    await order.save();

    await order.populate("shopOrder.shopOrderItems.item", "name image price");
    await order.populate("shopOrder.shop", "name socketId");
    await order.populate("user", "name email mobile socketId");
        await order.populate("shopOrder.owner", "name socketId");

    const io = req.app.get("io");
    if(io) {
      order.shopOrder.forEach((shoporder) => {
        console.log("shopOrder after io consition", shoporder);
        const ownerSocketId = shoporder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            user:order.user,
            payment:order.paymentMethod,
            shopOrder: [shoporder],
            deliveryAddress:order.deliveryAddress,
            createdAt:order.createdAt,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Payment verify error:", error);
    return res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};
export { verifyPayment };

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
        .populate("shopOrder.shopOrderItems.item", "name image price ");

      return res.status(200).json({ orders });
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrder.owner": userid })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name image")
        .populate("user")
        .populate("shopOrder.shopOrderItems.item", "name image price")
        .populate("shopOrder.assignedDeliveryBoy", "fullName mobile email");

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
    if (!shopOrder)
      return res.status(404).json({ message: "shop order not found" });

    shopOrder.status = status;
    let deliveryBoysPayload = [];

    if (status==="out of delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order;

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
        (b) => !busySet.has(String(b._id)),
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message: "order status updated but no delivery boy available",
          availableDeliveryBoys: [],
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order?._id,
        shop: shopOrder?.shop,
        shopOrderId: shopOrder?._id,
        broadCastedTo: candidates,
        status: "broadcasted",
      });

      shopOrder.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
     await deliveryAssignment.populate('order');
    await  deliveryAssignment.populate('order.deliveryAddress','deliveryAddress');
    await  deliveryAssignment.populate('shop' ,'name')
    await  deliveryAssignment.populate('order.shopOrder' ,'assignment')

     const io = req.app.get('io');
     if(io){
      availableDeliveryBoys.forEach((boy)=>{
        const boySocketid = boy?.socketId;
        if(boySocketid){
          io.to(boySocketid).emit('newAssignment',{
            sentTo:boy?._id,
            assignmentId:deliveryAssignment._id,
            orderId:deliveryAssignment.order._id,
            shopName:deliveryAssignment?.shop?.name,
            deliveryAddress:deliveryAssignment?.order?.deliveryAddress,
             items:deliveryAssignment?.order?.shopOrder?.find(so=>so._id.equals(deliveryAssignment.shopOrderId)?.shopOrderItems || []),
            // subtotal:deliveryAssignment.order.shopOrder.find(so=>so._id.equals(deliveryAssignment.shopOrderId)?.subtotal) 
            subtotal:deliveryAssignment?.order?.totalAmount

          })
        }
      })
     }





    }

    await order.save();
    const updatedShopOrder = order.shopOrder.find((o) =>
      o.shop._id.equals(shopId),
    );
    await order.populate("shopOrder.shop", "name");
    await order.populate(
      "shopOrder.assignedDeliveryBoy",
      "fullName email mobile",
    );
       await order.populate(
      "user",
      "socketId",
    );

   const io = req.app.get("io"); 

    if(io) {
      
        const userSocketId = order.user.socketId;
        if (userSocketId) {
          io.to(userSocketId).emit('update-status', {
            orderId:order?._id,
            shopId:updatedShopOrder.shop?._id,
            status:updatedShopOrder.status,
            userId:order?.user?._id,
       
        })
      };
    }

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

const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const DeliveryboyId = req.userId;
    console.log("get delivery boy asssigment",DeliveryboyId);

    const assignments = await DeliveryAssignment.find({
      broadCastedTo: DeliveryboyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");
      console.log("assignments",assignments)
    const formatted = assignments.map((a) => {
      const shopOrderItem = a.order.shopOrder.find((so) =>
        so._id.equals(a.shopOrderId),
      );

      return {
        assignmentId: a._id,
        orderId: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress,
        items: shopOrderItem?.shopOrderItems || [],
        subtotal: shopOrderItem?.subtotal,
      };
    });

    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({
      message: "error occured during get DeliveryBoy Assignment",
      err,
    });
  }
};

export { getDeliveryBoyAssignment };

const acceptOrder = async (req, res) => {
  const { assignmentId } = req.params;
  const assignment = await DeliveryAssignment.findById(assignmentId);

  if (!assignment) {
    return res.status(500).json({ message: "assignment not found " });
  }

  if (assignment.status !== "broadcasted") {
    return res.status(400).json({ message: "asignment expired found " });
  }

  const alreadyAssigned = await DeliveryAssignment.findOne({
    assignedTo: req.userId,
    status: { $nin: ["broadcasted", "completed"] },
  });

  if (alreadyAssigned) {
    return res
      .status(400)
      .json({ message: "you are already assigned to another order" });
  }
  assignment.assignedTo = req.userId;
  assignment.status = "assigned";

  assignment.acceptedAt = new Date();
  await assignment.save();

  const order = await Order.findById(assignment.order);

  if (!order) {
    return res.status(400).json({ message: "order not found" });
  }

  const shopOrder = order.shopOrder.find((so) =>
    so._id.equals(assignment.shopOrderId),
  );

  shopOrder.assignedDeliveryBoy = req.userId;


  await order.save();
  console.log("order", order);
  return res.status(200).json({ message: "order accepted" });
};
export { acceptOrder };

const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName mobile email location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName mobile email location" }],
      });

    if (!assignment) {
      return res.status(404).json({ message: "assignment not found" });
    }

    if (!assignment.order) {
      return res.status(404).json({ message: "order not found" });
    }

    const shopOrder = assignment.order.shopOrder.find((so) =>
      so._id.equals(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res.status(404).json({ message: "shopOrder not found" });
    }

    let deliveryBoyLocation = { lat: null, long: null };
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.long = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, long: null };
    if (assignment.order?.longitude && assignment.order?.latitude) {
      customerLocation.lat = assignment.order.latitude;
      customerLocation.long = assignment.order.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shop: assignment.shop,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (err) {
    return res.status(500).json({ message: "get current order error", err });
  }
};
export { getCurrentOrder };

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrder",
        populate: [
          { path: "shop", model: "Shop" },
          { path: "shopOrderItems.item", model: "Item" },
          { path: "assignedDeliveryBoy", model: "User" },
        ],
      })
      .lean();
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.log("errro in getOrderById", err);
    return res
      .status(500)
      .json({ message: "error in the get order by id controller" });
  }
};
export { getOrderById };

const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const order = await Order.findById(orderId).populate("user");

    let userEmail = order.user.email;
    const shoporder = order.shopOrder.id(shopOrderId);

    if (!order || !shoporder) {
      return res.status(400).json({ message: "order / shoporder not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    shoporder.deliveryOtp = otp;
    shoporder.expiresOtp = new Date(Date.now() + 5 * 60 * 1000);

    await order.save();
    sendDeliveryOptMail(userEmail, otp);
    return res
      .status(200)
      .json({ message: `opt sent succesfully to ${order.user.fullName}` });
  } catch (err) {
    console.log("error while sending delivery otp");
  }
};
export { sendDeliveryOtp };

const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    console.log("otp in verify otp controller", otp);
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shoporder = order.shopOrder.id(shopOrderId);

    if (!shoporder) {
      return res.status(400).json({ message: "shoporder not found" });
    }

    if (
      shoporder.deliveryOtp !== otp ||
      !shoporder.expiresOtp ||
      shoporder.expiresOtp < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    shoporder.status = "delivered";
    shoporder.deliveredAt = Date.now();
    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shoporder._id,
      order: order._id,
      assignedTo: shoporder.assignedDeliveryBoy,
    });

    return res.status(200).json({
      message: `Order delivered successfully to ${order.user.fullName}`,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error while verifying delivery otp" });
  }
};
export { verifyDeliveryOtp };
