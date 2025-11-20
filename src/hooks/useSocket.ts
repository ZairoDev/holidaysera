"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket(userId?: string, userType?: "owner" | "traveller") {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const newSocket = io(socketUrl, {
      path: "/api/socket",
      // allow polling fallback to improve reliability during dev / proxies
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);

      // Join appropriate room based on user type
      if (userId && userType === "owner") {
        newSocket.emit("join-owner-room", userId);
      } else if (userId && userType === "traveller") {
        newSocket.emit("join-traveller-room", userId);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId, userType]);

  return { socket, isConnected };
}

export default useSocket;
