import { router, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";
import { Bookings } from "@/models/bookings";
import { Properties } from "@/models/property";
import Users from "@/models/users";
import { TRPCError } from "@trpc/server";
import { emitToOwner, emitToTraveller, getSocketIO } from "../socket";

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

        // Emit real-time notification to owner
        try {
          const ioInstance = getSocketIO();
          console.log(`createBookingRequest: ownerId=${String(property.userId)}, travellerId=${ctx.user.id}, ioInitialized=${!!ioInstance}`);
        } catch (err) {
          console.warn("createBookingRequest: failed to check socket instance", err);
        }

        emitToOwner(String(property.userId), "booking-request-received", {
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
        });

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

        // Update booking status
        booking.ownerApprovalStatus = "approved";
        booking.bookingStatus = "approved";
        await booking.save();

        const updatedBooking = booking.toObject();

        // Emit notification to traveller that payment is now required
        emitToTraveller(String(booking.travellerId), "booking-approved-notification", {
          bookingId: updatedBooking._id.toString(),
          propertyId: String(booking.propertyId),
          serviceCharge: updatedBooking.serviceCharge,
          totalPrice: booking.price,
          message: "Your booking has been approved! Please complete payment to confirm.",
          timestamp: new Date(),
        });

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

        // Update booking status
        booking.ownerApprovalStatus = "rejected";
        booking.bookingStatus = "rejected";
        await booking.save();

        // Emit notification to traveller
        emitToTraveller(
          String(booking.travellerId),
          "booking-rejected-notification",
          {
            bookingId: String(booking._id),
            reason: input.reason || "The property owner has declined your booking request",
            timestamp: new Date(),
          }
        );

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

  // Mark payment as completed (called from payment gateway webhook)
  completePayment: protectedProcedure
    .input(
      z.object({
        bookingId: z.string().min(1),
        transactionId: z.string().min(1),
        paymentIntentId: z.string().optional(),
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

        // Update payment status
        booking.paymentStatus = "paid";
        booking.bookingStatus = "completed";
        booking.transactionId = input.transactionId;
        if (input.paymentIntentId) {
          booking.paymentIntentId = input.paymentIntentId;
        }
        await booking.save();

        const updatedBooking = booking.toObject();

        // Notify owner of payment
        emitToOwner(String(booking.ownerId), "payment-received", {
          bookingId: updatedBooking._id.toString(),
          propertyId: String(booking.propertyId),
          travellerId: String(booking.travellerId),
          amount: updatedBooking.serviceCharge,
          transactionId: input.transactionId,
          timestamp: new Date(),
        });

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
