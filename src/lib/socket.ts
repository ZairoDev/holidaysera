// ⬅️ FRONTEND CLIENT SOCKET

import { io } from "socket.io-client";

const socketUrl = typeof window !== "undefined" 
  ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  : "http://localhost:3001";

// Configure socket with transports that work in Next.js
export const socket = io(socketUrl, {
  path: "/api/socket",
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket"], // WebSocket only for performance
  withCredentials: true,
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
