import { router, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";
import { Bookings } from "@/models/bookings";
import { Properties } from "@/models/property";
import Users from "@/models/users";
import { TRPCError } from "@trpc/server";
import { emitToOwner, emitToTraveller, getSocketIO } from "../socket";
import Notifications from "@/models/notification";
import crypto from "crypto";

// Lazy require Razorpay to avoid startup errors when package isn't installed
let Razorpay: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Razorpay = require("razorpay");
} catch (err) {
  Razorpay = null;
}

function getRazorpayInstance() {
  if (!Razorpay) throw new Error("Razorpay package not installed. Run 'npm install razorpay'");
  const key_id = process.env.RAZORPAY_API_KEY;
  const key_secret = process.env.RAZORPAY_API_SECRET;
  if (!key_id || !key_secret) throw new Error("Razorpay API keys not configured in environment variables");
  return new Razorpay({ key_id, key_secret });
}

export const bookingRouter = router({
  // Create a booking request (traveller initiates)
  createBookingRequest: protectedProcedure
    .input(
      z.object({
        propertyId: z.string().min(1, "Property ID required"),
        startDate: z.date(),
        endDate: z.date(),
        guests: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate property exists
        const property = await Properties.findById(input.propertyId).lean() as any;
        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        // Create booking with pending status
        const booking = await Bookings.create({
          propertyId: input.propertyId,
          ownerId: property.userId,
          travellerId: ctx.user.id,
          startDate: input.startDate,
          endDate: input.endDate,
          guests: input.guests,
          price: input.price,
          bookingStatus: "pending",
          ownerApprovalStatus: "pending",
          paymentStatus: "awaiting",
          serviceCharge: input.price * 0.12, // 12% service charge
        });

        const bookingDoc = booking.toObject();

        // Persist notification for owner and emit
        try {
          const notification = await Notifications.create({
            recipientId: String(property.userId),
            recipientRole: "Owner",
            type: "booking-request",
            bookingId: (bookingDoc._id as any).toString(),
            data: {
              propertyId: input.propertyId,
              propertyName: property.propertyName,
              travellerId: ctx.user.id,
              travelerName: ctx.user.email,
              startDate: input.startDate,
              endDate: input.endDate,
              guests: input.guests,
              price: input.price,
              serviceCharge: bookingDoc.serviceCharge,
            },
          });

          const emitPayload = {
            notificationId: String(notification._id),
            bookingId: (bookingDoc._id as any).toString(),
            propertyId: input.propertyId,
            propertyName: property.propertyName,
            travellerId: ctx.user.id,
            travelerName: ctx.user.email,
            startDate: input.startDate,
            endDate: input.endDate,
            guests: input.guests,
            price: input.price,
            serviceCharge: bookingDoc.serviceCharge,
            timestamp: new Date(),
          };

          const emitSuccess = emitToOwner(String(property.userId), "booking-request-received", emitPayload);
          console.log(`[Booking] Notification created ${notification._id} and emitted to owner ${property.userId}: ${emitSuccess}`);
        } catch (err) {
          console.warn("[Booking] Failed to persist/emit notification to owner", err);
        }

        return {
          success: true,
          bookingId: (bookingDoc._id as any).toString(),
          message: "Booking request sent to property owner",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error creating booking request:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create booking request",
        });
      }
    }),

  // Owner approves booking request
  approveBookingRequest: protectedProcedure
    .input(
      z.object({
        bookingId: z.string().min(1, "Booking ID required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const booking = await Bookings.findById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        // Verify owner
        if (String(booking.ownerId) !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the property owner can approve this booking",
          });
        }

        // Fetch property details
        const property = await Properties.findById(booking.propertyId).lean() as any;
        const propertyName = property?.propertyName || "Your property";

        // Update booking status
        booking.ownerApprovalStatus = "approved";
        booking.bookingStatus = "approved";
        await booking.save();

        const updatedBooking = booking.toObject();

        // Persist notification for traveller and emit
        try {
          const notification = await Notifications.create({
            recipientId: String(booking.travellerId),
            recipientRole: "Traveller",
            type: "booking-approved",
            bookingId: updatedBooking._id.toString(),
            data: {
              propertyId: String(booking.propertyId),
              propertyName,
              serviceCharge: updatedBooking.serviceCharge,
              totalPrice: booking.price,
              message: "Your booking has been approved! Please complete payment to confirm.",
            },
          });

          const emitPayload = {
            notificationId: String(notification._id),
            bookingId: updatedBooking._id.toString(),
            propertyId: String(booking.propertyId),
            propertyName,
            serviceCharge: updatedBooking.serviceCharge,
            totalPrice: booking.price,
            message: "Your booking has been approved! Please complete payment to confirm.",
            timestamp: new Date(),
          };

          const emitSuccess = emitToTraveller(String(booking.travellerId), "booking-approved-notification", emitPayload);
          console.log(`[Booking] Approval notification created ${notification._id} and emitted to traveller ${booking.travellerId}: ${emitSuccess}`);
        } catch (err) {
          console.warn("[Booking] Failed to persist/emit approval notification", err);
        }

        return {
          success: true,
          message: "Booking approved successfully",
          serviceCharge: updatedBooking.serviceCharge,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error approving booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve booking",
        });
      }
    }),

  // Owner rejects booking request
  rejectBookingRequest: protectedProcedure
    .input(
      z.object({
        bookingId: z.string().min(1, "Booking ID required"),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const booking = await Bookings.findById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        // Verify owner
        if (String(booking.ownerId) !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the property owner can reject this booking",
          });
        }

        // Fetch property details
        const property = await Properties.findById(booking.propertyId).lean() as any;
        const propertyName = property?.propertyName || "The property";

        // Update booking status
        booking.ownerApprovalStatus = "rejected";
        booking.bookingStatus = "rejected";
        await booking.save();

        // Persist notification for traveller and emit
        try {
          const notification = await Notifications.create({
            recipientId: String(booking.travellerId),
            recipientRole: "Traveller",
            type: "booking-rejected",
            bookingId: String(booking._id),
            data: {
              propertyName: propertyName,
              reason: input.reason || "The property owner has declined your booking request",
            },
          });

          const emitPayload = {
            notificationId: String(notification._id),
            bookingId: String(booking._id),
            propertyName: propertyName,
            reason: input.reason || "The property owner has declined your booking request",
            timestamp: new Date(),
          };

          const emitSuccess = emitToTraveller(String(booking.travellerId), "booking-rejected-notification", emitPayload);
          console.log(`[Booking] Rejection notification created ${notification._id} and emitted to traveller ${booking.travellerId}: ${emitSuccess}`);
        } catch (err) {
          console.warn("[Booking] Failed to persist/emit rejection notification", err);
        }

        return {
          success: true,
          message: "Booking rejected successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error rejecting booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject booking",
        });
      }
    }),

  // Get booking by ID
  getBookingById: publicProcedure
    .input(z.object({ bookingId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const booking = await Bookings.findById(input.bookingId).lean() as any;

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        return {
          _id: booking._id.toString(),
          propertyId: String(booking.propertyId),
          ownerId: String(booking.ownerId),
          travellerId: String(booking.travellerId),
          startDate: booking.startDate,
          endDate: booking.endDate,
          guests: booking.guests,
          price: booking.price,
          serviceCharge: booking.serviceCharge,
          bookingStatus: booking.bookingStatus,
          ownerApprovalStatus: booking.ownerApprovalStatus,
          paymentStatus: booking.paymentStatus,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error fetching booking:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch booking",
        });
      }
    }),

  // Owner's pending bookings
  getOwnerPendingBookings: protectedProcedure.query(async ({ ctx }) => {
    try {
      const bookings = await Bookings.find({
        ownerId: ctx.user.id,
        ownerApprovalStatus: "pending",
      })
        .populate("propertyId", "propertyName basePrice")
        .lean();

      // Fetch traveller emails separately to avoid schema issues
      const bookingsWithTravellers = await Promise.all(
        (bookings as any).map(async (b: any) => {
          const traveller = await Users.findById(b.travellerId, "email").lean() as any;
          return {
            _id: b._id.toString(),
            propertyId: b.propertyId._id.toString(),
            propertyName: b.propertyId.propertyName,
            travellerId: b.travellerId.toString(),
            travelerEmail: traveller?.email || "Unknown",
            startDate: b.startDate,
            endDate: b.endDate,
            guests: b.guests,
            price: b.price,
            serviceCharge: b.serviceCharge,
            bookingStatus: b.bookingStatus,
          };
        })
      );

      return bookingsWithTravellers;
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch bookings",
      });
    }
  }),

  // Create a Razorpay order for a booking (traveller initiates checkout)
  createPaymentOrder: protectedProcedure
    .input(z.object({ bookingId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const booking = await Bookings.findById(input.bookingId).lean() as any;
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        if (String(booking.travellerId) !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

        // Only allow creating order if owner approved and payment awaiting
        if (booking.ownerApprovalStatus !== "approved" || booking.paymentStatus !== "awaiting") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Payment not required for this booking" });
        }

        const razorpay = getRazorpayInstance();
        // Amount in smallest currency unit (cents for EUR)
        const amount = Math.round((booking.serviceCharge || 0) * 100);

        const order = await razorpay.orders.create({
          amount,
          currency: "EUR",
          receipt: String(booking._id),
          payment_capture: 1,
        });

        return {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_API_KEY,
        };
      } catch (err) {
        console.error("[Payments] createPaymentOrder error", err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create payment order" });
      }
    }),

  // Traveller's bookings
  getTravellerBookings: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      try {
        const limit = input?.limit ?? 50;
        const query: any = { travellerId: ctx.user.id };
        if (input?.cursor) query._id = { $lt: input.cursor };

        const list = await Bookings.find(query)
          .sort({ createdAt: -1 })
          .limit(limit + 1)
          .populate("propertyId", "propertyName propertyCoverFileUrl basePrice currency")
          .lean();

        const hasMore = list.length > limit;
        const items = (hasMore ? list.slice(0, -1) : list).map((b: any) => ({
          id: b._id.toString(),
          bookingId: b._id.toString(),
          propertyId: String(b.propertyId._id),
          propertyName: b.propertyId?.propertyName || "",
          propertyCoverFileUrl: b.propertyId?.propertyCoverFileUrl || null,
          price: b.price,
          serviceCharge: b.serviceCharge,
          ownerApprovalStatus: b.ownerApprovalStatus,
          paymentStatus: b.paymentStatus,
          startDate: b.startDate,
          endDate: b.endDate,
          bookingStatus: b.bookingStatus,
          createdAt: b.createdAt,
        }));

        return {
          items,
          nextCursor: hasMore ? String(list[list.length - 1]._id) : undefined,
        };
      } catch (err) {
        console.error("Error fetching traveller bookings:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch bookings" });
      }
    }),

  // Mark payment as completed (called from payment gateway webhook)
  completePayment: protectedProcedure
    .input(
      z.object({
        bookingId: z.string().min(1),
        transactionId: z.string().min(1),
        paymentIntentId: z.string().optional(),
        razorpayOrderId: z.string().optional(),
        razorpaySignature: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const booking = await Bookings.findById(input.bookingId);

        if (!booking) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Booking not found",
          });
        }

        // Verify traveller
        if (String(booking.travellerId) !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the traveller can complete payment",
          });
        }

        // If this is a Razorpay flow, verify the signature
        if (input.razorpaySignature && input.razorpayOrderId) {
          const secret = process.env.RAZORPAY_API_SECRET;
          if (!secret) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Razorpay secret not configured" });
          }
          const expected = crypto.createHmac("sha256", secret).update(`${input.razorpayOrderId}|${input.transactionId}`).digest("hex");
          if (expected !== input.razorpaySignature) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Invalid payment signature" });
          }
          booking.transactionId = input.transactionId;
          booking.paymentIntentId = input.razorpayOrderId;
        } else {
          // Update payment status (non-Razorpay fallback)
          booking.transactionId = input.transactionId;
          if (input.paymentIntentId) {
            booking.paymentIntentId = input.paymentIntentId;
          }
        }

        booking.paymentStatus = "paid";
        booking.bookingStatus = "completed";
        await booking.save();

        const updatedBooking = booking.toObject();

        // Persist notification for owner and emit
        try {
          const notification = await Notifications.create({
            recipientId: String(booking.ownerId),
            recipientRole: "Owner",
            type: "payment-received",
            bookingId: updatedBooking._id.toString(),
            data: {
              propertyId: String(booking.propertyId),
              travellerId: String(booking.travellerId),
              amount: updatedBooking.serviceCharge,
              transactionId: input.transactionId,
            },
          });

          const emitPayload = {
            notificationId: String(notification._id),
            bookingId: updatedBooking._id.toString(),
            propertyId: String(booking.propertyId),
            travellerId: String(booking.travellerId),
            amount: updatedBooking.serviceCharge,
            transactionId: input.transactionId,
            timestamp: new Date(),
          };

          const emitSuccess = emitToOwner(String(booking.ownerId), "payment-received", emitPayload);
          console.log(`[Booking] Payment notification created ${notification._id} and emitted to owner ${booking.ownerId}: ${emitSuccess}`);
        } catch (err) {
          console.warn("[Booking] Failed to persist/emit payment notification", err);
        }

        return {
          success: true,
          message: "Payment completed successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error completing payment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete payment",
        });
      }
    }),
});
