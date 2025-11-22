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

export function getSocketIO(): Server | null {
  // Get the global Socket.io instance created in server.js
  const globalIo = (globalThis as any).io as Server | undefined;
  if (!globalIo) {
    console.warn("[Socket] Socket.io not initialized yet");
    return null;
  }
  return globalIo;
}

export function emitToOwner(ownerId: string, event: string, data: any) {
  const io = getSocketIO();
  if (!io) {
    console.warn(`[Socket] Cannot emit to owner ${ownerId} - Socket.io not initialized`);
    return false;
  }
  
  const roomId = `owner-${ownerId}`;
  const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
  const recipientCount = socketsInRoom?.size || 0;
  
  console.log(`[Socket] Emitting "${event}" to owner room "${roomId}" (${recipientCount} recipient(s))`);
  io.to(roomId).emit(event, data);
  
  return true;
}

export function emitToTraveller(travellerId: string, event: string, data: any) {
  const io = getSocketIO();
  if (!io) {
    console.warn(`[Socket] Cannot emit to traveller ${travellerId} - Socket.io not initialized`);
    return false;
  }
  
  const roomId = `traveller-${travellerId}`;
  const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
  const recipientCount = socketsInRoom?.size || 0;
  
  console.log(`[Socket] Emitting "${event}" to traveller room "${roomId}" (${recipientCount} recipient(s))`);
  io.to(roomId).emit(event, data);
  
  return true;
}
