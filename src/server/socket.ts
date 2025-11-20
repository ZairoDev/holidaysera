import { Server as HTTPServer } from "http";
import { Socket as ServerSocket, Server } from "socket.io";

interface ExtendedHTTPServer extends HTTPServer {
  io?: Server;
}

interface BookingRequestData {
  bookingId: string;
  propertyId: string;
  travellerId: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  propertyName: string;
  travelerName: string;
}

let io: Server | null = null;

export function setSocketIO(socketInstance: Server): void {
  io = socketInstance;
  console.log("Global socket instance set");
}

export function initializeSocketIO(httpServer: ExtendedHTTPServer): Server {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: ServerSocket) => {
    console.log(`User connected: ${socket.id}`);

    try {
      console.log(`Socket rooms for ${socket.id}: ${Array.from(socket.rooms).join(", ")}`);
    } catch (err) {
      // ignore
    }

    // Join owner room for receiving booking requests
    socket.on("join-owner-room", (ownerId: string) => {
      socket.join(`owner-${ownerId}`);
      console.log(`Owner ${ownerId} joined room: owner-${ownerId}`);
    });

    // Join traveller room for payment status updates
    socket.on("join-traveller-room", (travellerId: string) => {
      socket.join(`traveller-${travellerId}`);
      console.log(`Traveller ${travellerId} joined room: traveller-${travellerId}`);
    });

    // Emit booking request to owner
    socket.on("new-booking-request", (data: BookingRequestData) => {
      const { ownerId } = data as any;
      io?.to(`owner-${ownerId}`).emit("booking-request-received", data);
      console.log(`Booking request sent to owner ${ownerId}`);
    });

    // Emit booking approval notification to traveller
    socket.on("booking-approved", (data: any) => {
      const { travellerId, bookingData } = data;
      io?.to(`traveller-${travellerId}`).emit("booking-approved-notification", bookingData);
      console.log(`Booking approved notification sent to traveller ${travellerId}`);
    });

    // Emit booking rejection notification
    socket.on("booking-rejected", (data: any) => {
      const { travellerId, bookingId } = data;
      io?.to(`traveller-${travellerId}`).emit("booking-rejected-notification", { bookingId });
      console.log(`Booking rejection notification sent to traveller ${travellerId}`);
    });

    // Payment confirmation
    socket.on("payment-completed", (data: any) => {
      const { ownerId, bookingData } = data;
      io?.to(`owner-${ownerId}`).emit("payment-received", bookingData);
      console.log(`Payment confirmation sent to owner ${ownerId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketIO(): Server | null {
  return io;
}

export function emitToOwner(ownerId: string, event: string, data: any) {
  console.log(`emitToOwner called: ownerId=${ownerId}, event=${event}, io=${!!io}`);
  if (io) {
    console.log(`emitting to room: owner-${ownerId}`);
    io.to(`owner-${ownerId}`).emit(event, data);
    console.log(`emitted successfully to owner-${ownerId}`);
  } else {
    console.warn(`emitToOwner called but Socket.io not initialized. ownerId=${ownerId}, event=${event}`);
  }
}

export function emitToTraveller(travellerId: string, event: string, data: any) {
  console.log(`emitToTraveller called: travellerId=${travellerId}, event=${event}, io=${!!io}`);
  if (io) {
    console.log(`emitting to room: traveller-${travellerId}`);
    io.to(`traveller-${travellerId}`).emit(event, data);
    console.log(`emitted successfully to traveller-${travellerId}`);
  } else {
    console.warn(`emitToTraveller called but Socket.io not initialized. travellerId=${travellerId}, event=${event}`);
  }
}
