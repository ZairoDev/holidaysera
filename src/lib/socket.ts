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
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

console.log("[Socket.io] 🔌 Initialized at:", socketUrl);

// Connection logging
socket.on("connect", () => {
  console.log("[Socket.io] ✅ Connected - Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[Socket.io] 🔴 Disconnected - Reason:", reason);
});

socket.on("connect_error", (error) => {
  console.error("[Socket.io] ❌ Connection Error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("[Socket.io] 🔄 Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", () => {
  console.log("[Socket.io] 🔄 Attempting to reconnect...");
});
