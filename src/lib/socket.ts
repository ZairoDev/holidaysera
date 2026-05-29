// ⬅️ FRONTEND CLIENT SOCKET

import { io } from "socket.io-client";

const socketUrl =
  typeof window !== "undefined"
    ? process.env.NODE_ENV === "production"
      ? `${window.location.protocol}//${window.location.hostname}`
      : `${window.location.protocol}//${window.location.hostname}:3001`
    : "";

export const socket = io(socketUrl, {
  path: "/api/socket",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, 
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Connection logging
socket.on("connect", () => {
});

socket.on("disconnect", (reason) => {
});

socket.on("connect_error", (error) => {
  console.error("[Socket.io] ❌ Connection Error:", error);
});

socket.on("reconnect", (attemptNumber) => {
});

socket.on("reconnect_attempt", () => {
});
