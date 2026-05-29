// server.ts (at project root)
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    await handle(req, res);
  });

  const io:Server = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/api/socket", // ⚠️ important
  });

  (globalThis as any).io = io;// <-- so emitToOwner() can access it

  io.on("connection", (socket) => {
    // console.log("🟢 Socket connected:", socket.id);

    socket.on("join-owner-room", (ownerId) => {
      socket.join(`owner-${ownerId}`);
      // console.log(`🏠 Owner room joined: owner-${ownerId}`);
    });

    socket.on("join-traveller-room", (travellerId) => {
      socket.join(`traveller-${travellerId}`);
      // console.log(`🧳 Traveller room joined: traveller-${travellerId}`);
    });

    socket.on("disconnect", () => {
      // console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server + Next running at http://localhost:${port}`);
  });
});
