# 🧪 Testing Socket.io Notifications - Quick Guide

**Server Status**: 🟢 Running on http://localhost:3001

## How to Test

### Test 1: Owner Receives Booking Request
1. Open **Browser 1** - Login as **Owner**
2. Open **Browser 2** - Login as **Traveller**
3. **Browser 2**: Go to property details → Click "Book"
4. **Browser 1**: Should see **1 notification** (not 0, not 6)
5. ✅ Notification should show: "{Traveller Name} requested {Property Name}"

### Test 2: Traveller Receives Approval (Single Notification)
1. **Browser 1** (Owner): Click "Approve" on the booking request
2. **Browser 2** (Traveller): Should get **1 notification** (was getting 6 before)
3. ✅ Notification: "Booking Approved - Your booking is approved!"
4. ✅ Payment page should now be available

### Test 3: Traveller Receives Rejection (Single Notification)
1. **Browser 1** (Owner): Create a new booking request, then "Reject" it
2. **Browser 2** (Traveller): Should get **1 notification**
3. ✅ Notification: "Booking Rejected - [Your rejection reason]"

---

## Browser DevTools Monitoring

### Network Tab - WebSocket
1. Open DevTools → Network
2. Filter for "WS" or "websocket"
3. Should see: `ws://localhost:3001/api/socket` - Status 101 ✅

### Console
Look for these logs (signs it's working):
```
[Socket] User connected: ABC123...
[Socket] Traveller joined room: traveller-...
[Notifications] Booking request received: {...}
[Socket] Emitting "booking-approved-notification" to room "traveller-..."
```

**No red error messages** ✅

### Application Tab - Storage
1. Open DevTools → Application → Local Storage
2. Look for `notification-center-storage`
3. Should see accumulated notifications with correct messages ✅

---

## Server Console

Check terminal output for:
```
✅ [Socket] Emitting "booking-request-received" to room "owner-..."
✅ [Socket] Emitting "booking-approved-notification" to room "traveller-..."
✅ [Socket] Emitting "booking-rejected-notification" to room "traveller-..."
```

**One emit per event** (not multiple) ✅

---

## Known Good Behavior

✅ **Owner side**:
- Sees incoming booking requests in real-time
- Can approve/reject bookings
- Notifications appear in notification center

✅ **Traveller side**:
- Gets approval notification (once, not 6 times)
- Gets rejection notification (once)
- Payment page appears after approval
- Property details show in notifications

✅ **Socket**:
- Connects on app load
- Joins correct rooms (owner/traveller)
- Events deliver within <50ms
- No duplicate listeners

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Owner not getting notifications | Check: Owner logged in? Room joined? (see console) |
| Traveller getting 6 notifications | Fixed! Should now get 1. Refresh if still seeing duplicates. |
| No property name in notification | Fixed! Property is now fetched on approval/rejection. |
| Notifications not appearing | Check: Is socket connected? (Network → WS tab) |
| Error in console | Check server logs for issues, restart with `npm run dev` |

---

## Files to Check if Issues Arise

1. **useNotificationCenter.ts** - Socket event listeners
   - Should have socket.off() before socket.on()
   
2. **useSocket.ts** - Room joining logic
   - Should use joinedRooms Set to prevent duplicates
   
3. **booking.ts router** - Event emissions
   - approveBookingRequest should emit with propertyName
   - rejectBookingRequest should emit with propertyName

4. **server.js** - Socket.io server
   - Should have (globalThis).io = io for global access

---

**Ready to test!** Start with Test 1 and verify each notification appears exactly once. 🚀
