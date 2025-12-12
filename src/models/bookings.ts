import mongoose, { Schema } from "mongoose";

const bookingsSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    travellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    // New fields for approval and payment
    ownerApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["awaiting", "paid", "failed", "refunded"],
      default: "awaiting",
    },
    // Service charge (12% of price)
    serviceCharge: {
      type: Number,
      default: function() {
        return (this.price as number) * 0.12;
      },
    },
    // Stripe/payment related fields
    paymentIntentId: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Bookings =
  mongoose.models.Bookings1 || mongoose.model("Bookings1", bookingsSchema);
