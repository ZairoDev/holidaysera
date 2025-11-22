// server.js - Custom Next.js server with Socket.io support
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${PORT}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Make io available globally so TRPC server can emit events
  (globalThis).io = io;

  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Owner joins their room
    socket.on('join-owner-room', (ownerId) => {
      socket.join(`owner-${ownerId}`);
      console.log(`[Socket] Owner ${ownerId} joined room: owner-${ownerId}`);
    });

    // Traveller joins their room
    socket.on('join-traveller-room', (travellerId) => {
      socket.join(`traveller-${travellerId}`);
      console.log(`[Socket] Traveller ${travellerId} joined room: traveller-${travellerId}`);
    });

    // Booking request from traveller to owner
    socket.on('new-booking-request', (data) => {
      const { ownerId } = data;
      io.to(`owner-${ownerId}`).emit('booking-request-received', data);
      console.log(`[Socket] Booking request sent to owner ${ownerId}`);
    });

    // Booking approval from owner to traveller
    socket.on('booking-approved', (data) => {
      const { travellerId, bookingData } = data;
      io.to(`traveller-${travellerId}`).emit('booking-approved-notification', bookingData);
      console.log(`[Socket] Booking approved sent to traveller ${travellerId}`);
    });

    // Booking rejection from owner to traveller
    socket.on('booking-rejected', (data) => {
      const { travellerId, bookingId, reason } = data;
      io.to(`traveller-${travellerId}`).emit('booking-rejected-notification', { bookingId, reason });
      console.log(`[Socket] Booking rejected sent to traveller ${travellerId}`);
    });

    // Payment confirmation from traveller to owner
    socket.on('payment-completed', (data) => {
      const { ownerId, bookingData } = data;
      io.to(`owner-${ownerId}`).emit('payment-received', bookingData);
      console.log(`[Socket] Payment confirmation sent to owner ${ownerId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io listening at ws://localhost:${PORT}/api/socket`);
  });
});
