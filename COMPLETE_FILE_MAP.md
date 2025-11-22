# 📍 Complete Notification System - File Location & Usage Map

## 🗂️ Directory Structure & File Locations

```
c:\DEV\holidaysera\
│
├── server.js (⭐ Entry Point - Socket.io Server)
│
├── src/
│   ├── lib/
│   │   └── socket.ts (⭐ Global Socket.io Client)
│   │
│   ├── hooks/
│   │   ├── useSocket.ts (⭐ Room Management)
│   │   └── useNotificationCenter.ts (⭐ Store + Listeners)
│   │
│   ├── server/
│   │   ├── socket.ts (⭐ Server Emission Functions)
│   │   └── routers/
│   │       └── booking.ts (⭐ Notification Triggers)
│   │
│   ├── components/
│   │   └── notification-dropdown.tsx (⭐ UI Component)
│   │
│   └── app/
│       ├── providers.tsx (⭐ App Initialization)
│       ├── profile/
│       │   └── owner-dashboard.tsx (⭐ Owner Page)
│       └── booking/
│           └── payment.tsx (⭐ Payment Page)
│
└── Documentation/
    ├── NOTIFICATION_SYSTEM_COMPLETE.md (3000+ words)
    ├── NOTIFICATION_SYSTEM_FILES.md (2500+ words)
    ├── NOTIFICATION_SYSTEM_REFINED.md (2000+ words)
    ├── REFINEMENT_COMPLETE.md (Summary)
    └── NOTIFICATION_FILES_INDEX.md (This file)
```

---

## 📊 File Dependencies Graph

```
INITIALIZATION PHASE
└── src/app/layout.tsx (wraps with providers)
    └── src/app/providers.tsx (SocketManager)
        ├── useSocket(userId, role)
        │   └── src/hooks/useSocket.ts
        │       └── src/lib/socket.ts
        │           └── server.js (global io instance)
        └── useNotificationSocketListener()
            └── src/hooks/useNotificationCenter.ts
                ├── Zustand store
                └── src/lib/socket.ts
                    └── 4 Socket.io event listeners
                        ├── booking-request-received
                        ├── booking-approved-notification
                        ├── booking-rejected-notification
                        └── payment-received

RUNTIME PHASE (User Actions)
├── src/app/profile/owner-dashboard.tsx
│   ├── useSocket(userId, "owner")
│   └── Listens for: booking-request-received
│       └── Updates pending bookings in real-time
│
└── src/app/booking/payment.tsx
    ├── useSocket(userId, "traveller")
    └── Listens for:
        ├── booking-approved-notification
        └── booking-rejected-notification

EVENT EMISSION (Mutations)
├── src/server/routers/booking.ts (4 mutations)
│   ├── createBookingRequest()
│   │   └── emitToOwner("booking-request-received")
│   │
│   ├── approveBookingRequest()
│   │   └── emitToTraveller("booking-approved-notification")
│   │
│   ├── rejectBookingRequest()
│   │   └── emitToTraveller("booking-rejected-notification")
│   │
│   └── completePayment()
│       └── emitToOwner("payment-received")
│           ↓
│           src/server/socket.ts
│           ├── emitToOwner(ownerId, event, data)
│           └── emitToTraveller(travellerId, event, data)
│               ↓
│               server.js
│               └── io.to(roomId).emit(event, data)

UI RENDERING
└── src/components/notification-dropdown.tsx
    ├── const { notifications, unreadCount } = useNotificationCenter()
    ├── Displays Bell icon + Badge + Dropdown list
    └── Actions: Mark as read, Remove, Clear all
        └── Updates Zustand store
```

---

## 🎯 10-File Complete Map with Cross-References

### **FILE 1: `server.js`**
**Path:** `c:\DEV\holidaysera\server.js`  
**Type:** Node.js Server  
**Purpose:** HTTP Server + Socket.io Initialization

**What it does:**
- Creates HTTP server for Next.js
- Initializes Socket.io on path `/api/socket`
- Exposes Socket.io globally as `(globalThis).io`
- Handles room join events from clients

**Used by:**
- `src/server/socket.ts` - Accesses global io instance
- Backend code - Can emit to rooms
- Server startup - Entry point for app

**Provides:**
- HTTP server on port 3001
- WebSocket server on `/api/socket`
- Global `io` instance for TRPC backend

**Key Code:**
```javascript
(globalThis).io = io;  // Makes Socket.io available everywhere
```

---

### **FILE 2: `src/lib/socket.ts`**
**Path:** `c:\DEV\holidaysera\src\lib\socket.ts`  
**Type:** Client Socket Instance  
**Purpose:** Global Socket.io Client Connection

**What it does:**
- Creates Socket.io client on app load
- Connects to `http://localhost:3001/api/socket`
- Provides singleton instance for entire app
- Logs connection events with emojis

**Imported by:**
- `src/hooks/useSocket.ts` - Gets socket to join rooms
- `src/hooks/useNotificationCenter.ts` - Gets socket to attach listeners
- `src/app/profile/owner-dashboard.tsx` - Custom listener
- `src/app/booking/payment.tsx` - Custom listener

**Exports:**
```typescript
export const socket = io(socketUrl, { ... });
```

**Key Features:**
- Singleton pattern (one connection per app)
- Auto-reconnection (1-5s intervals, 5 attempts max)
- WebSocket only (no polling)
- Enhanced logging with emojis

---

### **FILE 3: `src/hooks/useSocket.ts`**
**Path:** `c:\DEV\holidaysera\src\hooks\useSocket.ts`  
**Type:** React Hook  
**Purpose:** Join User to Socket.io Room

**What it does:**
- Takes userId and userType (owner/traveller)
- Joins `owner-{userId}` or `traveller-{userId}` room
- Prevents duplicate room joins
- Tracks connection state
- Resets room on disconnect

**Called by:**
- `src/app/providers.tsx` (SocketManager) - Initializes system
- `src/app/layout-client.tsx` - Extra safety layer
- `src/app/profile/owner-dashboard.tsx` - Owner-specific
- `src/app/booking/payment.tsx` - Traveller-specific

**Hook Signature:**
```typescript
useSocket(userId?: string, userType?: "owner" | "traveller")
  → { socket, isConnected }
```

**Key Features:**
- Uses `useRef` for room tracking (prevents re-joins)
- Resets on disconnect (allows rejoin after reconnect)
- Handles undefined userId gracefully
- Connection state available to components

---

### **FILE 4: `src/hooks/useNotificationCenter.ts`**
**Path:** `c:\DEV\holidaysera\src\hooks\useNotificationCenter.ts`  
**Type:** React Hook + Zustand Store  
**Purpose:** Notification Management + Socket.io Listeners

**What it does:**
- Part A: Zustand store for notifications
  - Stores notifications array
  - Tracks unreadCount
  - Provides add/remove/markAsRead/clearAll methods
  - Persists to localStorage
  
- Part B: Socket.io event listeners
  - Attaches 4 event listeners on mount
  - Converts Socket.io events to notifications
  - Prevents duplicate notifications (1-second window)
  - Cleans up listeners on unmount

**Used by:**
- `src/components/notification-dropdown.tsx` - Reads store for UI
- `src/app/providers.tsx` - Initializes listeners
- `src/app/layout-client.tsx` - Extra safety init
- Any component needing notifications

**Exports:**
```typescript
export const useNotificationCenter = create<NotificationStore>(...)
export function useNotificationSocketListener()
```

**Listeners Setup:**
```typescript
socket.on("booking-request-received", handleBookingRequest)
socket.on("booking-approved-notification", handleBookingApproved)
socket.on("booking-rejected-notification", handleBookingRejected)
socket.on("payment-received", handlePaymentReceived)
```

**Key Features:**
- Full TypeScript interfaces for all payloads
- Duplicate prevention (1-second window)
- useRef tracking prevents re-attachment
- Proper cleanup on unmount
- localStorage persistence

---

### **FILE 5: `src/server/socket.ts`**
**Path:** `c:\DEV\holidaysera\src\server\socket.ts`  
**Type:** Server Utility  
**Purpose:** Server-side Socket.io Emission Functions

**What it does:**
- Provides getSocketIO() to access global instance
- Provides emitToOwner() to broadcast to owner room
- Provides emitToTraveller() to broadcast to traveller room
- Counts recipients and logs emission details

**Used by:**
- `src/server/routers/booking.ts` - All 4 mutations call these functions

**Function Signatures:**
```typescript
getSocketIO(): Server | null
emitToOwner(ownerId: string, event: string, data: any): boolean
emitToTraveller(travellerId: string, event: string, data: any): boolean
```

**Key Code Flow:**
```typescript
// Called from booking.ts mutation:
emitToOwner(ownerId, "booking-request-received", {
  bookingId, propertyName, travelerName, ...
})

// Function emits to server.js:
const roomId = `owner-${ownerId}`;
io.to(roomId).emit(event, data);
```

**Key Features:**
- Recipient counting (logs how many users in room)
- Success return value (true/false)
- Error handling (returns false if Socket.io not init)
- Graceful degradation (mutation continues even if emit fails)

---

### **FILE 6: `src/server/routers/booking.ts`**
**Path:** `c:\DEV\holidaysera\src\server\routers\booking.ts`  
**Type:** TRPC Router with Socket Emission  
**Purpose:** Booking Mutations That Trigger Notifications

**Mutations with Notifications:**

1. **createBookingRequest()**
   ```
   Triggered by: Traveller
   When: User creates booking
   Emits: emitToOwner("booking-request-received", data)
   Received by: Owner
   ```

2. **approveBookingRequest()**
   ```
   Triggered by: Owner
   When: Owner clicks "Approve"
   Fetches: Property details for propertyName
   Emits: emitToTraveller("booking-approved-notification", data)
   Received by: Traveller
   ```

3. **rejectBookingRequest()**
   ```
   Triggered by: Owner
   When: Owner clicks "Reject"
   Fetches: Property details for propertyName
   Emits: emitToTraveller("booking-rejected-notification", data)
   Received by: Traveller
   ```

4. **completePayment()**
   ```
   Triggered by: Traveller
   When: Traveller completes payment
   Emits: emitToOwner("payment-received", data)
   Received by: Owner
   ```

**Called by:**
- Frontend via TRPC client (useQuery/useMutation hooks)

**Key Features:**
- Try-catch around emissions
- Logs emission success/failure
- Continues even if Socket.io fails
- Fetches related data before emission

---

### **FILE 7: `src/components/notification-dropdown.tsx`**
**Path:** `c:\DEV\holidaysera\src\components\notification-dropdown.tsx`  
**Type:** React Component  
**Purpose:** Visual Notification Display

**What it does:**
- Displays bell icon with unread badge
- Shows dropdown list of notifications
- Allows mark as read, remove, clear all
- Color-codes by notification type
- Animates transitions

**Used in:**
- `src/components/navbar.tsx` - Part of header (appears on all pages)

**Data from:**
```typescript
const { notifications, unreadCount, removeNotification, 
        markAsRead, clearAll } = useNotificationCenter();
```

**User Interactions:**
- Click bell → Toggle dropdown
- Click notification → Mark as read
- Click X button → Remove notification
- Click "Clear all" → Clear all notifications

**Key Features:**
- Emoji icons per type (🎉📝✅❌💰)
- Color-coded backgrounds
- Animated dropdown (framer-motion)
- Timestamp display
- Unread badge (shows 1-99+)

---

### **FILE 8: `src/app/providers.tsx`**
**Path:** `c:\DEV\holidaysera\src\app\providers.tsx`  
**Type:** Provider Component  
**Purpose:** Root-Level Initialization

**What it does:**
- Wraps entire app with providers
- SocketManager component:
  - Calls useSocket() to join room
  - Calls useNotificationSocketListener() to attach listeners
- Provides TRPC client
- Provides React Query
- Provides Sonner Toaster

**Used by:**
- `src/app/layout.tsx` - Wraps all routes

**Key Component:**
```typescript
function SocketManager({ children }) {
  const user = useUserStore((state) => state.user);
  useSocket(user?.id, user?.role);           // Join room
  useNotificationSocketListener();            // Attach listeners
  return <>{children}</>;
}
```

**Provider Stack:**
```
TRPC.Provider
  ↓
QueryClientProvider
  ↓
SocketManager (custom)
  ├─ useSocket()
  └─ useNotificationSocketListener()
    ↓
Children (all routes)
```

**Key Features:**
- Initializes full notification system
- Ensures Socket.io ready before routes load
- Provides context to all children

---

### **FILE 9: `src/app/profile/owner-dashboard.tsx`**
**Path:** `c:\DEV\holidaysera\src\app\profile\owner-dashboard.tsx`  
**Type:** Page Component  
**Purpose:** Owner Dashboard with Real-Time Updates

**What it does:**
- Shows list of pending bookings
- Joins `owner-{userId}` room
- Listens for `booking-request-received` events
- Updates UI when new bookings arrive
- Provides approve/reject buttons

**Uses:**
```typescript
const { socket } = useSocket(userId, "owner");
socket.on("booking-request-received", handleNewBooking);
```

**Custom Listener:**
- When traveller creates booking
- Owner receives event in real-time
- Pending booking added to UI instantly

**Key Features:**
- Real-time booking updates
- Approve/Reject dialogs
- Shows property name, guests, price
- Calls booking mutations

---

### **FILE 10: `src/app/booking/payment.tsx`**
**Path:** `c:\DEV\holidaysera\src\app/booking/payment.tsx`  
**Type:** Page Component  
**Purpose:** Payment Page with Approval/Rejection Handling

**What it does:**
- Shows booking payment form
- Joins `traveller-{userId}` room
- Listens for `booking-approved-notification`
- Listens for `booking-rejected-notification`
- Updates state based on owner's action

**Uses:**
```typescript
const { socket } = useSocket(userId, "traveller");
socket.on("booking-approved-notification", handleApproval);
socket.on("booking-rejected-notification", handleRejection);
```

**Custom Listeners:**
- If owner approves: Show payment form
- If owner rejects: Redirect to properties
- Approval: Traveller can now pay
- Rejection: Booking cancelled

**Key Features:**
- Real-time approval/rejection updates
- Payment form submission
- Status tracking
- User feedback on ownership status

---

## 🔗 File Connections Summary

```
server.js
  ↑
  └─ Creates global io

src/lib/socket.ts (imports nothing from system)
  ↑
  ├─ Imported by: useSocket.ts, useNotificationCenter.ts, pages
  └─ Provides: Global socket instance

src/hooks/useSocket.ts
  ├─ Imports: socket from lib/socket.ts
  ├─ Called by: providers.tsx, pages
  └─ Provides: Room joining + connection state

src/hooks/useNotificationCenter.ts
  ├─ Imports: socket from lib/socket.ts
  ├─ Called by: notification-dropdown.tsx, providers.tsx
  └─ Provides: Store + listeners

src/server/socket.ts
  ├─ Uses: (globalThis).io from server.js
  ├─ Called by: booking.ts
  └─ Provides: emitToOwner, emitToTraveller

src/server/routers/booking.ts
  ├─ Imports: socket.ts functions
  ├─ Called by: Frontend TRPC client
  └─ Triggers: 4 notification events

src/components/notification-dropdown.tsx
  ├─ Imports: useNotificationCenter
  ├─ Rendered: In navbar
  └─ Displays: Notifications from store

src/app/providers.tsx
  ├─ Imports: useSocket, useNotificationSocketListener
  ├─ Wraps: Entire app
  └─ Initializes: Notification system

src/app/profile/owner-dashboard.tsx
  ├─ Imports: useSocket
  ├─ Listens: booking-request-received
  └─ Updates: Pending bookings

src/app/booking/payment.tsx
  ├─ Imports: useSocket
  ├─ Listens: approval/rejection events
  └─ Updates: Payment state
```

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 10 |
| **Frontend Files** | 7 |
| **Backend Files** | 3 |
| **Core Hooks** | 2 |
| **Utility Functions** | 2 |
| **Components** | 2 |
| **Pages** | 2 |
| **Server Files** | 1 |
| **Event Types** | 4 |
| **Room Types** | 2 |
| **Documentation Files** | 4 |

---

**Complete File Map Created:** November 21, 2025  
**Status:** ✅ All 10 files identified and mapped  
**Documentation:** ✅ Complete with cross-references
