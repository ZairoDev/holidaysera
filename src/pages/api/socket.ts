import { NextApiRequest, NextApiResponse } from "next";
import { initializeSocketIO, setSocketIO } from "@/server/socket";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // If socket.io is already attached to the server, do nothing
  // Next.js provides access to the underlying HTTP server via res.socket.server
  // We attach the io instance to res.socket.server.io to avoid re-initializing
  try {
    // @ts-ignore - Next.js augments the server object at runtime
    if (!res.socket.server.io) {
      // @ts-ignore
      const io = initializeSocketIO(res.socket.server);
      // @ts-ignore
      res.socket.server.io = io;
      
      // Also set the global io instance so getSocketIO() can access it
      setSocketIO(io);
      
      console.log("Initialized Socket.io on server");
    } else {
      // Socket already initialized, set the global reference
      // @ts-ignore
      setSocketIO(res.socket.server.io);
    }

    res.status(200).json({ success: true, message: "Socket.io initialized" });
  } catch (error) {
    console.error("Error initializing Socket.io API route:", error);
    res.status(500).json({ success: false, message: "Failed to initialize Socket.io" });
  }
}
