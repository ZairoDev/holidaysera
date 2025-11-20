# TRPC Listing Management Functions

## Overview
Complete TRPC integration for property listing management in the add-listing flow.

## Available Functions

### 1. **addListing** - Create New Property Listing
**Type:** `protectedProcedure` (requires authentication)

**Location:** `/src/server/routers/property.ts`

**Input Parameters:**
```typescript
{
  // Basic Info (Page 1)
  propertyType: string,           // e.g., "House", "Apartment", "Villa"
  propertyName: string,           // e.g., "Cozy Beach House"
  placeName: string,              // e.g., "Barcelona"
  rentalType: "Short Term" | "Long Term" | "Both",
  rentalForm?: string,
  numberOfPortions: number,       // Number of separate units

  // Location (Page 2)
  street?: string,
  postalCode?: string,
  city: string,
  state?: string,
  country: string,
  center?: { lat: number; lng: number },

  // Spaces (Page 3)
  guests: number,
  bedrooms?: number[],            // Array for multiple portions
  beds?: number[],
  bathroom?: number[],
  kitchen?: number[],
  size?: number,

  // Amenities (Page 4)
  generalAmenities?: Record<string, boolean>,
  otherAmenities?: Record<string, boolean>,
  safeAmenities?: Record<string, boolean>,

  // House Rules (Page 5)
  smoking?: string,               // e.g., "allowed", "not_allowed"
  pet?: string,                   // e.g., "allowed", "not_allowed"
  party?: string,
  cooking?: string,
  additionalRules?: string[],

  // Description (Page 6)
  reviews?: string[],             // Description for each portion

  // Images (Page 7)
  propertyCoverFileUrl?: string,
  propertyPictureUrls?: string[],
  portionCoverFileUrls?: string[],
  portionPictureUrls?: string[][],

  // Pricing (Page 8)
  basePrice: number,              // Required, must be > 0
  weekendPrice?: number[],
  weeklyDiscount?: number[],
  basePriceLongTerm?: number[],
  monthlyDiscount?: number[],
  currency?: string,              // Default: "USD"

  // Availability (Page 9)
  night?: number[],               // Min/max night stays
  time?: number[],                // Check-in/check-out times
  datesPerPortion?: string[],
  icalLinks?: Record<string, string>,

  // Additional
  isInstantBooking?: boolean,
  isLive?: boolean,               // Default: true
  hostedBy?: string,
}
```

**Returns:**
```typescript
{
  success: true,
  property: {
    _id: string,
    VSID: string,
    propertyName: string,
    // ... all property fields
  },
  message: "Property listing created successfully"
}
```

**Error Codes:**
- `BAD_REQUEST` - Missing required fields or validation failed
- `INTERNAL_SERVER_ERROR` - Server error during creation

**Usage Example:**
```typescript
const addListingMutation = trpc.property.addListing.useMutation({
  onSuccess: (data) => {
    console.log("Property created:", data.property._id);
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

await addListingMutation.mutateAsync({
  propertyType: "House",
  propertyName: "Beach Villa",
  placeName: "Bali",
  rentalType: "Short Term",
  city: "Ubud",
  country: "Indonesia",
  guests: 4,
  basePrice: 150,
  numberOfPortions: 1,
});
```

---

### 2. **updateListing** - Update Existing Property Listing
**Type:** `protectedProcedure` (requires authentication)

**Input Parameters:**
```typescript
{
  propertyId: string,             // MongoDB property ID (required)
  updates: Record<string, any>,   // Any property fields to update
}
```

**Returns:**
```typescript
{
  success: true,
  property: { /* updated property object */ },
  message: "Property listing updated successfully"
}
```

**Features:**
- Automatically tracks update history in `lastUpdatedBy` and `lastUpdates` fields
- Verifies ownership before allowing updates
- Only property owner can update their listings

**Error Codes:**
- `NOT_FOUND` - Property doesn't exist
- `FORBIDDEN` - User doesn't own this property
- `INTERNAL_SERVER_ERROR` - Server error

**Usage Example:**
```typescript
const updateListingMutation = trpc.property.updateListing.useMutation();

await updateListingMutation.mutateAsync({
  propertyId: "507f1f77bcf86cd799439011",
  updates: {
    basePrice: 200,
    isLive: false,
  },
});
```

---

### 3. **deleteProperty** - Delete Property Listing
**Type:** `protectedProcedure` (requires authentication)

**Input Parameters:**
```typescript
{
  propertyId: string,  // MongoDB property ID
}
```

**Returns:**
```typescript
{
  success: true
}
```

**Features:**
- Only property owner can delete
- Soft delete recommended (set `isLive: false`) instead

---

## Integration in PageAddListing10

The `handleGoLive` function in PageAddListing10 now:

1. **Collects data** from all 10 pages stored in localStorage
2. **Formats data** into the addListing input schema
3. **Calls TRPC mutation** with all property details
4. **Handles success** by clearing localStorage and redirecting
5. **Handles errors** with user-friendly toast notifications

**Data Flow:**
```
PageAddListing10 (step 10)
    ↓
localStorage (pages 1-10)
    ↓
handleGoLive() function
    ↓
trpc.property.addListing.mutateAsync()
    ↓
Backend validation & MongoDB insert
    ↓
Success/Error callback
    ↓
Redirect to /profile
```

## Security Features

✅ **Authentication Required** - Only logged-in users can create/update listings
✅ **Ownership Verification** - Users can only modify their own properties
✅ **Validation** - All inputs validated with Zod schemas
✅ **Error Handling** - Comprehensive error messages
✅ **Update Tracking** - Automatic audit trail of changes

## Database Schema

Properties collection stores:
- All listing details from the 10-step form
- User ownership information (`userId`, `email`)
- Auto-generated VSID (Vacation Saga ID)
- Timestamps (createdAt, updatedAt)
- Status flags (isLive, featured)
- Update history (lastUpdatedBy, lastUpdates)

## Next Steps

1. Test the complete add-listing flow
2. Verify data persistence in MongoDB
3. Add property image deletion when property is deleted
4. Implement partial listing saves (save draft)
5. Add listing analytics and booking management
