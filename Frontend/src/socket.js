// src/socket.js
import { io } from "socket.io-client";


const socket = io("http://localhost:8000", {
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// ✅ Global reconnect handler
socket.on("reconnect", () => {
  console.log("Socket reconnected:", socket.id);
});

export  {socket};

