import User from "./models/user.model.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        if (!userId) {
          return;
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true },
        );
        console.log(
          `user ${user?.fullName} registered with socket ${socket.id}`,
        );
      } catch (err) {
        console.log(`Error setting socketId: ${err}`);
      }
    });

    socket.on("updateLocation", async ({ userId, longitude, latitude }) => {
      try {
        if (!userId) {
          return;
        }
        const user = await User.findByIdAndUpdate(userId, {
          location: { type: "Point", coordinate: [longitude, latitude] },
          isOnline: true,
          socketId: socket.socket_id,
        });
        if(user) {
          io.emit("updateDeliveryLocation", { deliveryBoyId:userId, longitude, latitude });
        }
      } catch (err) {
        console.log(`Error while update live location ${err}`);
      }
    });

    socket.on("disconnect", async ({ userId }) => {
      try {
        if (!userId) return;
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false },
        );
        console.log(`User ${user?.fullName} disconnected`);
      } catch (err) {
        console.log(`Error on disconnect: ${err}`);
      }
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected:", socket.id);
    });
  });
};

export { socketHandler };
