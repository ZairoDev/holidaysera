import mongoose from "mongoose";

const travellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "PLease Enter your name"],
    },
    email: {
      type: String,
      required: [true, "PLease Enter  your email"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    spokenLanguage: {
      type: String,
      default: "English",
    },
    bankDetails: {
      type: Object,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    myRequests: {
      type: [String],
      require: false,
    },
    myUpcommingRequests: {
      type: [String],
      require: false,
    },
    declinedRequests: {
      type: [String],
      require: false,
    },
    address: {
      type: String,
      default: "",
    },
    myBookings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Bookings",
      required: true,
    },

    password: {
      type: String,
      required: [true, "Password is required "],
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "Traveller", // Optional: you can set a default role if needed
    },

    Payment: Object,

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);
const Travellers =
  mongoose.models?.travellers || mongoose.model("travellers", travellerSchema);
export default Travellers;
