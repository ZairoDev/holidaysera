import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["Owner", "Traveller"],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.models?.notifications || mongoose.model("notifications", notificationSchema);
export default Notifications;
