import { z } from "zod";
import { protectedProcedure, publicProcedure, router, TRPCError } from "../trpc";
import Razorpay from "razorpay";
import crypto from "crypto";
import Coupon from "@/models/coupon";
import Subscription from "@/models/subscription";
import Users from "@/models/users";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

// Plan durations in months
const planDurations: Record<string, number> = {
  action: 12,
  game: 18,
  master: 24,
};

// Plan names
const planNames: Record<string, string> = {
  action: "Action Plan",
  game: "Game Plan",
  master: "Master Plan",
};

export const subscriptionRouter = router({
  // Validate coupon code
  validateCoupon: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Coupon code is required"),
        planId: z.string().optional(),
        amount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { code, planId, amount } = input;

      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid coupon code",
        });
      }

      // Validate coupon
      const validation = coupon.isValid(planId, amount);
      if (!validation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validation.message,
        });
      }

      // Calculate discount
      const discount = coupon.calculateDiscount(amount || 0);
      const finalAmount = (amount || 0) - discount;

      return {
        success: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount: discount,
          finalAmount: finalAmount,
        },
        message: "Coupon applied successfully",
      };
    }),

  // Create Razorpay order
  createOrder: protectedProcedure
    .input(
      z.object({
        planId: z.string().min(1, "Plan ID is required"),
        planName: z.string(),
        amount: z.number().positive("Amount must be positive"),
        couponCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { planId, planName, amount, couponCode } = input;
      const userId = ctx.user.id;
      const user = await Users.findById(userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      let finalAmount = amount;
      let appliedCoupon = null;

      // If coupon code is provided, validate and apply it
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (coupon) {
          const validation = coupon.isValid(planId, amount);
          if (validation.valid) {
            const discount = coupon.calculateDiscount(amount);
            finalAmount = amount - discount;
            appliedCoupon = {
              code: coupon.code,
              discount: discount,
            };
          }
        }
      }

      // Razorpay expects amount in paise (smallest currency unit)
      // Since we're using EUR, we'll convert to cents (multiply by 100)
      const amountInSmallestUnit = Math.round(finalAmount * 100);

      const options = {
        amount: amountInSmallestUnit,
        currency: "EUR",
        receipt: `receipt_${planId}_${Date.now()}`,
        notes: {
          planId: planId,
          planName: planName,
          userId: userId,
          userEmail: user.email,
          couponCode: couponCode || "",
          originalAmount: amount,
          finalAmount: finalAmount,
        },
      };

      try {
        const order = await razorpay.orders.create(options);

        return {
          success: true,
          order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
          },
          appliedCoupon,
          finalAmount,
        };
      } catch (error) {
        console.error("Razorpay order creation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment order",
        });
      }
    }),

  // Verify payment and create subscription
  verifyPayment: protectedProcedure
    .input(
      z.object({
        razorpay_order_id: z.string(),
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
        planId: z.string(),
        planName: z.string(),
        couponCode: z.string().optional(),
        originalAmount: z.number(),
        finalAmount: z.number(),
        discountAmount: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
        planName,
        couponCode,
        originalAmount,
        finalAmount,
        discountAmount,
      } = input;

      const userId = ctx.user.id;
      const user = await Users.findById(userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify the payment signature
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment verification failed - Invalid signature",
        });
      }

      // If a coupon was used, increment its usage count
      if (couponCode) {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      }

      // Calculate subscription dates
      const startDate = new Date();
      const durationMonths = planDurations[planId] || 12;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + durationMonths);

      // Create subscription record
      const subscription = await Subscription.create({
        userId,
        userEmail: user.email,
        planId,
        planName: planName || planNames[planId] || "Subscription Plan",
        duration: `${durationMonths} months`,
        originalAmount: originalAmount || finalAmount,
        discountAmount: discountAmount || 0,
        finalAmount,
        couponCode: couponCode || null,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "active",
        startDate,
        endDate,
      });

      // Update user's subscription status
      await Users.findByIdAndUpdate(userId, {
        subscription: {
          planId,
          planName: planName || planNames[planId] || "Subscription Plan",
          status: "active",
          startDate,
          endDate,
          subscriptionId: subscription._id,
        },
      });

      return {
        success: true,
        message: "Payment verified and subscription activated successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        subscription: {
          id: subscription._id,
          planId,
          planName: subscription.planName,
          startDate,
          endDate,
          status: "active",
        },
      };
    }),

  // Get user's subscription history
  getSubscriptionHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get all subscriptions for the user
    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "planId planName duration originalAmount discountAmount finalAmount couponCode status startDate endDate createdAt razorpayPaymentId"
      );

    // Get user's current subscription status
    const user = await Users.findById(userId).select("subscription");

    return {
      success: true,
      currentSubscription: user?.subscription || null,
      subscriptionHistory: subscriptions,
    };
  }),

  // Get current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const user = await Users.findById(userId).select("subscription");

    return {
      subscription: user?.subscription || { status: "none" },
    };
  }),
});
