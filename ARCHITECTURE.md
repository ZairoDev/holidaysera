# System Architecture Diagram

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOLIDAYSERA PLATFORM                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CLIENT LAYER (Frontend)                   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  TRAVELLER                       OWNER                       │  │
│  │  ┌──────────────┐              ┌──────────────┐             │  │
│  │  │ Property     │              │ Owner        │             │  │
│  │  │ Details Page │              │ Dashboard    │             │  │
│  │  └──────────────┘              └──────────────┘             │  │
│  │       │                              │                      │  │
│  │       │ Request Booking              │ View Requests        │  │
│  │       ↓                              ↓                      │  │
│  │  ┌──────────────┐              ┌──────────────┐             │  │
│  │  │ Payment      │              │ Approve/     │             │  │
│  │  │ Page         │              │ Reject       │             │  │
│  │  │ (After       │              │ Dialog       │             │  │
│  │  │  Approval)   │              └──────────────┘             │  │
│  │  └──────────────┘                                           │  │
│  │       │                                                     │  │
│  │       │ Complete Payment                                    │  │
│  │       ↓                                                     │  │
│  │  ┌──────────────┐                                           │  │
│  │  │ Confirmation │                                           │  │
│  │  └──────────────┘                                           │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│           │                                      │                  │
│           │ Socket.io Connection                │                  │
│           │ (Real-time Events)                  │                  │
│           ↓                                      ↓                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              REALTIME LAYER (Socket.io)                      │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Socket.io Server                                            │  │
│  │  ├─ Traveller Rooms: traveller-${userId}                    │  │
│  │  └─ Owner Rooms: owner-${userId}                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            API/BACKEND LAYER (tRPC)                          │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  /api/trpc                                                  │  │
│  │  ├─ booking.createBookingRequest()                          │  │
│  │  │  └─ emitToOwner("booking-request-received", data)       │  │
│  │  │                                                           │  │
│  │  ├─ booking.approveBookingRequest()                         │  │
│  │  │  └─ emitToTraveller("booking-approved-notification"...)  │  │
│  │  │                                                           │  │
│  │  ├─ booking.rejectBookingRequest()                          │  │
│  │  │  └─ emitToTraveller("booking-rejected-notification"...)  │  │
│  │  │                                                           │  │
│  │  ├─ booking.completePayment()                               │  │
│  │  │  └─ emitToOwner("payment-received", data)               │  │
│  │  │                                                           │  │
│  │  ├─ booking.getOwnerPendingBookings()                       │  │
│  │  └─ booking.getBookingById()                                │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                         │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            DATABASE LAYER (MongoDB)                          │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Bookings Collection                                        │  │
│  │  {                                                          │  │
│  │    _id: ObjectId,                                           │  │
│  │    propertyId: ObjectId,                                    │  │
│  │    ownerId: ObjectId,                                       │  │
│  │    travellerId: ObjectId,                                   │  │
│  │    startDate: Date,                                         │  │
│  │    endDate: Date,                                           │  │
│  │    guests: Number,                                          │  │
│  │    price: Number,                                           │  │
│  │    serviceCharge: Number (price × 0.12),                    │  │
│  │    bookingStatus: String,                                   │  │
│  │    ownerApprovalStatus: "pending" | "approved" | "rejected" │  │
│  │    paymentStatus: "awaiting" | "paid" | "failed" | "refunded"│ │
│  │    transactionId: String,                                   │  │
│  │    paymentIntentId: String,                                 │  │
│  │    createdAt: Date                                          │  │
│  │  }                                                          │  │
│  │                                                              │  │
│  │  + Properties, Users, Favourites Collections                │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Request Flow: Traveller Creates Booking

```
TRAVELLER CLIENT
     │
     ├─ User selects dates, guests
     ├─ Clicks "Request to Book"
     │
     ├─ HTTP POST /api/trpc (tRPC)
     │ {
     │   method: "booking.createBookingRequest",
     │   params: {
     │     propertyId, startDate, endDate, guests, price
     │   }
     │ }
     │
     └─ Response: { success: true, bookingId: "..." }
```

---

## 📊 Real-Time Flow: Owner Dashboard Updates

```
OWNER CLIENT                    SERVER                  TRAVELLER CLIENT
     │                            │                             │
     ├─ Connect to Socket.io ─────→ Socket Server              │
     │                            │                             │
     │ Join Room              ─────→ owner-${ownerId}           │
     │                            │                             │
     │                            │ ← Traveller creates booking │
     │                            │                             │
     │                            ├─ emitToOwner()             │
     │                            │ booking-request-received   │
     │                            │ (travels via Socket.io)    │
     │                            │                             │
     ├─ Receive Event ←───────────┤                             │
     │ (auto update)              │                             │
     │                            │                             │
     ├─ Owner clicks Approve ─────→ approveBookingRequest()    │
     │                            │                             │
     │                            ├─ Update in MongoDB         │
     │                            │                             │
     │                            ├─ emitToTraveller()         │
     │                            │ booking-approved-notification
     │                            │                             │
     │                            │ (travels via Socket.io) ───→ ├─ Receive Event
     │                            │                             ├─ Show Payment Page
     │                            │                             └─ Update State
     │
```

---

## 💰 Payment Processing Flow

```
TRAVELLER CLIENT
     │
     ├─ Socket receives "booking-approved-notification"
     ├─ Payment form displays
     ├─ Shows Service Charge = ₹{price × 0.12}
     │
     ├─ User enters card details
     ├─ Clicks "Pay" button
     │
     ├─ HTTP POST /api/trpc
     │ {
     │   method: "booking.completePayment",
     │   params: {
     │     bookingId,
     │     transactionId,
     │     paymentIntentId
     │   }
     │ }
     │
     ├─ Server updates MongoDB:
     │  ├─ paymentStatus = "paid"
     │  ├─ bookingStatus = "completed"
     │  └─ transactionId = "..."
     │
     ├─ Server emits to Owner: "payment-received"
     │
     ├─ Response: { success: true }
     └─ Redirect to confirmation page
```

---

## 🔄 State Management Flow

```
CLIENT STATE                    SERVER STATE                 SOCKET STATE
     │                               │                             │
     ├─ pendingBookings              │                             │
     │  (from tRPC query)            │                             │
     │                               │                             │
     ├─ socket (Socket.io instance)  │                             │
     │  ├─ isConnected               │                             │
     │  └─ listeners                 │                             │
     │                               │                             │
     │                               ├─ MongoDB Booking doc        │
     │                               │  ├─ bookingStatus           │
     │                               │  ├─ ownerApprovalStatus     │
     │                               │  ├─ paymentStatus           │
     │                               │  └─ serviceCharge           │
     │                               │                             │
     │                               │                             ├─ owner-${id} Room
     │                               │                             ├─ traveller-${id} Room
     │                               │                             └─ Events queue
     │
     ├─ User interaction             │                             │
     └─────────→ tRPC mutation ──────→ Update DB ────Socket.io────→ Broadcast
                                         │
                                         └──→ Client Query Cache Update
```

---

## 🎯 Component Hierarchy

```
App Layout
│
├─ Providers (Socket.io initialized here)
│
├─ Page Routes
│  │
│  ├─ /properties/[id] (Property Details)
│  │  └─ "Request to Book" Button
│  │     └─ createBookingRequest() mutation
│  │
│  ├─ /profile (Owner Profile)
│  │  └─ OwnerDashboard Component
│  │     ├─ useSocket(userId, "owner")
│  │     ├─ Pending Bookings List
│  │     ├─ Approve/Reject Dialogs
│  │     └─ Real-time updates
│  │
│  └─ /booking/payment (Payment Page)
│     └─ BookingPaymentPage Component
│        ├─ useSocket(userId, "traveller")
│        ├─ Waiting for Approval State
│        ├─ Payment Form (after approval)
│        ├─ completePayment() mutation
│        └─ Confirmation
│
└─ UI Components (Shadcn)
   ├─ Card
   ├─ Button
   ├─ Input
   ├─ Dialog/AlertDialog
   ├─ Select
   └─ etc.
```

---

## 🔐 Security Architecture

```
CLIENT                  NETWORK                  SERVER
   │                       │                        │
   ├─ Token in              │                        │
   │  localStorage           │                        │
   │                         │                        │
   ├─ Send tRPC ────→ Authorization ─────────→ Verify Token
   │  request with   │ Header Check            │
   │  Bearer token   │                         ├─ Check userType
   │                 │                         ├─ Check userId
   │                 │                         └─ Verify ownership
   │                 │                         
   │                 ←─── Response with ──────┤ Protected Data
   │                      verified token      │
   │                                          ├─ Only return own data
   │                 ← Only owner can ────┤ approveBooking
   │                  approve their       │
   │                  bookings            ├─ Only traveller can
   │                                      │  completPayment
   │ Socket.io ──→ CORS Check ─────→ Validate socket client
   │ connect    │                      │
   │            │                      ├─ Verify origin
   │            │                      └─ Verify credentials
   │
```

---

## 📡 Socket.io Room Structure

```
Socket.io Server
│
├─ owner-123 (Owner's room)
│  ├─ Socket A (Owner on Desktop)
│  └─ Socket B (Owner on Mobile)
│     Events: booking-request-received, payment-received
│
├─ traveller-456 (Traveller's room)
│  └─ Socket C (Traveller on Device)
│     Events: booking-approved-notification, booking-rejected-notification
│
├─ owner-789
│  └─ Socket D
│
└─ traveller-101
   └─ Socket E
```

---

## 🗄️ Database Schema Structure

```
Bookings Collection
│
├─ Indexes (for performance)
│  ├─ { ownerId: 1, ownerApprovalStatus: 1 }
│  ├─ { travellerId: 1 }
│  └─ { propertyId: 1 }
│
├─ Required Fields
│  ├─ propertyId (refs Properties)
│  ├─ ownerId (refs Users)
│  ├─ travellerId (refs Users)
│  ├─ startDate
│  ├─ endDate
│  ├─ guests
│  ├─ price
│  ├─ bookingStatus
│  ├─ ownerApprovalStatus
│  └─ paymentStatus
│
└─ Optional Fields (for payment)
   ├─ serviceCharge (12% of price)
   ├─ transactionId
   ├─ paymentIntentId
   ├─ createdAt
   └─ updatedAt
```

---

## 🚀 Deployment Architecture

```
Production Environment
│
├─ Frontend (Vercel/Next.js)
│  ├─ Deployed at: https://yourdomain.com
│  ├─ Socket.io client connects to: https://yourdomain.com/socket
│  └─ tRPC endpoints: https://yourdomain.com/api/trpc
│
├─ Backend (Same Next.js instance)
│  ├─ Node.js server running
│  ├─ Socket.io server listening
│  ├─ tRPC server handling mutations
│  └─ MongoDB driver connected
│
├─ Database (MongoDB Atlas/Self-hosted)
│  ├─ Bookings collection
│  ├─ Properties collection
│  ├─ Users collection
│  └─ Indexes created for performance
│
└─ External Services
   ├─ Email service (SendGrid/Mailgun)
   ├─ Payment gateway (Stripe/Razorpay)
   └─ CDN (Bunny/Cloudflare)
```

---

## 📈 Performance Optimization

```
Client Side                Server Side             Database
│                           │                       │
├─ React Query Caching      │                       │
├─ Memoized Components      │ tRPC Query Cache      │
├─ Lazy Loading             │                       │
├─ Code Splitting           ├─ Batch Requests      │
└─ Image Optimization       │                       ├─ Indexed Queries
                            ├─ Connection Pooling   ├─ Aggregation Pipeline
                            └─ Rate Limiting        └─ Projection

Socket.io Optimization:
│
├─ Room-based broadcasting (not full emit)
├─ Event namespacing
├─ Binary protocol support
└─ Compression enabled
```

---

## 📊 Sequence Diagram: Complete Booking Flow

```
TIME    TRAVELLER           SERVER           OWNER              DATABASE
│       (Client)           (tRPC/Socket)    (Client)           (MongoDB)
│       
0s      Clicks "Book" ─────→
│
1s                    createBookingRequest()
│                     validation & creation
│                                          ─────→ Insert Doc
│
2s                                         ←──────
│       
3s                                         emitToOwner()
│                     booking-request-received
│                                          ←───────
│
4s                    ─────────────────────→ Update: Pending Bookings
│
5s                    Owner clicks "Approve" ──→
│
6s                    approveBookingRequest()
│                                          ─────→ Update ownerApprovalStatus
│
7s                                         ←──────
│
8s                    emitToTraveller()
│       ←──────────── booking-approved-notification
│
9s      Payment Page Updates
│       Shows ₹{serviceCharge}
│
10s     Enters Card & Submits ──→
│
11s                   completePayment()
│                                          ─────→ Update paymentStatus
│
12s                                        ←──────
│
13s                   emitToOwner()
│                     payment-received
│                                          ←───────
│
14s                   ─────────────────────→ Sees Payment Notification
│
```

---

## 🎯 Key Architectural Decisions

1. **Socket.io for Real-time**: Chosen for ease of implementation and bidirectional communication
2. **Room-based Messaging**: Isolates owner/traveller messages, reduces unnecessary broadcasts
3. **tRPC for API**: Type-safe, auto-generated client, built-in error handling
4. **Approval Gating**: Ensures owners control who can pay, prevents unauthorized bookings
5. **Service Charge Model**: 12% is collected upfront on payment, simplifies accounting
6. **Separation of Concerns**: UI, business logic, database cleanly separated

---

## 🔮 Future Architecture Enhancements

```
Current:                Future (Scalable):
│                       │
├─ Single Server        ├─ Load Balancer
├─ Socket.io In-Memory  ├─ Redis Adapter (Socket.io)
├─ Synchronous Ops      ├─ Message Queue (Bull/RabbitMQ)
└─ Email in-Process     ├─ Microservices (Payments, Emails)
                        ├─ WebSocket Gateway
                        ├─ CDN for Static Assets
                        └─ Multi-region Deployment
```

---

This architecture ensures:
- ✅ Scalability through room-based messaging
- ✅ Real-time updates via Socket.io
- ✅ Type safety via tRPC
- ✅ Security through auth verification
- ✅ Performance via caching and indexing
- ✅ Maintainability via clean separation of concerns
