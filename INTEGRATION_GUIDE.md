# Integration Guide: Real-Time Booking System

## Quick Start - Adding Booking Features to Your App

### 1. Add Owner Dashboard to Profile Page

**Location**: `src/app/profile/page.tsx`

```tsx
"use client";

import OwnerDashboard from "./owner-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<"owner" | "traveller" | null>(null);
  
  useEffect(() => {
    // Get user role from session/auth context
    const userRole = localStorage.getItem("userRole") as "owner" | "traveller";
    setUserRole(userRole);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {/* Show dashboard only for owners */}
      {userRole === "owner" && <OwnerDashboard />}
      
      {/* Other profile sections */}
      {userRole === "traveller" && (
        <div>
          {/* Traveller profile content */}
        </div>
      )}
    </div>
  );
}
```

---

### 2. Add Booking Request Button to Property Details

**Location**: `src/app/properties/[id]/page.tsx` (or your property details page)

```tsx
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyDetails() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  
  const createBookingMutation = trpc.booking.createBookingRequest.useMutation();

  const handleRequestBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    try {
      const result = await createBookingMutation.mutateAsync({
        propertyId: propertyId,
        startDate,
        endDate,
        guests,
        price: propertyPrice, // Get from property details
      });

      // Navigate to payment page
      router.push(`/booking/payment?id=${result.bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking request");
    }
  };

  return (
    <div>
      {/* Property details UI */}
      
      {/* Booking form */}
      <div className="p-6 bg-white rounded-lg border">
        <h3 className="text-xl font-bold mb-4">Reserve This Property</h3>
        
        {/* Date picker for startDate */}
        {/* Date picker for endDate */}
        {/* Guest counter */}
        
        <Button 
          onClick={handleRequestBooking}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
          disabled={createBookingMutation.isPending}
        >
          {createBookingMutation.isPending 
            ? "Creating Request..." 
            : "Request to Book"
          }
        </Button>
      </div>
    </div>
  );
}
```

---

### 3. Create Navigation Link to Owner Dashboard

**Location**: `src/components/navbar.tsx`

```tsx
import Link from "next/link";

export function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <nav>
      {/* Other nav items */}
      
      {userRole === "owner" && (
        <Link href="/profile?tab=dashboard" className="nav-link">
          📊 Dashboard
        </Link>
      )}
      
      <Link href="/profile" className="nav-link">
        👤 Profile
      </Link>
    </nav>
  );
}
```

---

### 4. Add Payment Page Route

**Location**: Create `src/app/booking/page.tsx` or update existing

```tsx
import BookingPaymentPage from "./payment";

export default function BookingPage() {
  return <BookingPaymentPage />;
}
```

---

## Using TRPC Booking Procedures

### Create Booking Request
```tsx
const createBooking = trpc.booking.createBookingRequest.useMutation({
  onSuccess: (result) => {
    console.log("Booking created:", result.bookingId);
  },
  onError: (error) => {
    console.error("Error:", error.message);
  }
});

// Usage
await createBooking.mutateAsync({
  propertyId: "123",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-07"),
  guests: 2,
  price: 50000,
});
```

### Approve Booking
```tsx
const approveBooking = trpc.booking.approveBookingRequest.useMutation();

await approveBooking.mutateAsync({
  bookingId: "booking-123"
});
```

### Reject Booking
```tsx
const rejectBooking = trpc.booking.rejectBookingRequest.useMutation();

await rejectBooking.mutateAsync({
  bookingId: "booking-123",
  reason: "Dates not available"
});
```

### Complete Payment
```tsx
const completePayment = trpc.booking.completePayment.useMutation();

await completePayment.mutateAsync({
  bookingId: "booking-123",
  transactionId: "txn-abc123",
  paymentIntentId: "intent_xyz789"
});
```

### Get Pending Bookings
```tsx
const { data: pendingBookings } = trpc.booking.getOwnerPendingBookings.useQuery();
```

---

## Socket.io Event Listeners

### Listen for New Booking Requests (Owner)
```tsx
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";

export function BookingNotifications() {
  const { socket } = useSocket(userId, "owner");

  useEffect(() => {
    if (!socket) return;

    socket.on("booking-request-received", (data) => {
      console.log("New booking from", data.travelerName);
      // Show toast notification
      // Refresh dashboard
    });

    return () => socket.off("booking-request-received");
  }, [socket]);

  return null;
}
```

### Listen for Approval (Traveller)
```tsx
export function PaymentListener() {
  const { socket } = useSocket(userId, "traveller");

  useEffect(() => {
    if (!socket) return;

    socket.on("booking-approved-notification", (data) => {
      console.log("Booking approved! Service charge:", data.serviceCharge);
      // Show payment form
      // Update UI
    });

    return () => socket.off("booking-approved-notification");
  }, [socket]);

  return null;
}
```

---

## Database Schema Updates

Run these migrations in MongoDB:

```javascript
// Add new fields to bookings collection
db.bookings.updateMany({}, {
  $set: {
    ownerApprovalStatus: "pending",
    paymentStatus: "awaiting",
    serviceCharge: 0,
    paymentIntentId: null,
    transactionId: null
  }
})

// Calculate service charge for existing bookings
db.bookings.find().forEach(function(booking) {
  db.bookings.updateOne(
    { _id: booking._id },
    { $set: { serviceCharge: booking.price * 0.12 } }
  )
})
```

---

## Error Handling

### Common Errors and Solutions

**Error: "Socket connection failed"**
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check if Socket.io server is initialized
- Look at browser console for CORS errors

**Error: "Only property owner can approve"**
- Verify authenticated user is the property owner
- Check user ID matches booking.ownerId

**Error: "Booking not found"**
- Verify bookingId is correct and exists in database
- Check user has permission to access booking

**Error: "Property not found"**
- Verify propertyId exists
- Check property ownership

---

## Testing Checklist

- [ ] Create booking request as traveller
- [ ] Verify booking appears instantly on owner dashboard
- [ ] Owner approves booking
- [ ] Traveller receives approval notification
- [ ] Payment page displays 12% service charge
- [ ] Complete payment
- [ ] Owner receives payment notification
- [ ] Test rejection flow
- [ ] Test multiple simultaneous bookings
- [ ] Test real-time updates

---

## Performance Tips

1. **Use React Query Caching**: Data is cached by TRPC/React Query
2. **Memoize Components**: Use `React.memo()` for notification components
3. **Optimize Socket Events**: Batch updates if receiving many events
4. **Index Database**: Add indexes on `ownerId`, `travellerId`, `ownerApprovalStatus`

```javascript
db.bookings.createIndex({ ownerId: 1, ownerApprovalStatus: 1 })
db.bookings.createIndex({ travellerId: 1 })
db.bookings.createIndex({ propertyId: 1 })
```

---

## Troubleshooting

### Socket.io Not Connecting

1. Check browser console for errors
2. Verify `/api/socket` endpoint is accessible
3. Check CORS configuration in `src/server/socket.ts`
4. Ensure Socket.io packages are installed: `npm list socket.io`

### TRPC Mutation Errors

1. Check browser Network tab for failed requests
2. Verify authentication token is present
3. Check server logs for detailed error messages
4. Validate input data matches Zod schema

### Real-time Updates Not Working

1. Verify user IDs are consistent
2. Check room names match pattern: `owner-${id}` or `traveller-${id}`
3. Monitor Socket.io connection status
4. Check for JavaScript errors in console

---

## Next Steps

1. Integrate payment gateway (Stripe/Razorpay)
2. Add email notifications
3. Implement booking cancellation
4. Add review system
5. Create analytics dashboard
