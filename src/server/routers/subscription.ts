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

/** Authoritative prices (major units) — must match checkout UI. Client-sent amounts are not trusted. */
const subscriptionPlanPrices: Record<string, number> = {
  action: 299,
  game: 399,
  master: 499,
};

type RazorpayOrderCurrency = "INR" | "EUR" | "USD";

function getSubscriptionPlanPrice(planId: string): number {
  const price = subscriptionPlanPrices[planId];
  if (price === undefined) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid subscription plan",
    });
  }
  return price;
}

/** Razorpay India accounts use INR + paise; set RAZORPAY_CURRENCY=EUR if international is enabled on your account. */
function getRazorpayOrderCurrency(): RazorpayOrderCurrency {
  const raw = (process.env.RAZORPAY_CURRENCY || "INR").toUpperCase();
  if (raw === "EUR" || raw === "USD" || raw === "INR") {
    return raw;
  }
  return "INR";
}

function minimumAmountInSmallestUnits(currency: RazorpayOrderCurrency): number {
  return currency === "INR" ? 100 : 0;
}

function formatRazorpayOrderFailureMessage(error: unknown): string {
  if (error && typeof error === "object" && "error" in error) {
    const err = (error as { error?: { description?: string } }).error;
    if (typeof err?.description === "string" && err.description.length > 0) {
      return err.description;
    }
  }
  return "Failed to create payment order";
}

async function incrementCouponUsage(couponCode: string | null | undefined) {
  if (!couponCode) return;
  await Coupon.findOneAndUpdate(
    { code: couponCode.toUpperCase() },
    { $inc: { usedCount: 1 } }
  );
}

async function activateSubscriptionForUser(params: {
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const startDate = new Date();
  const durationMonths = planDurations[params.planId] || 12;
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const resolvedPlanName =
    params.planName || planNames[params.planId] || "Subscription Plan";

  const subscription = await Subscription.create({
    userId: params.userId,
    userEmail: params.userEmail,
    planId: params.planId,
    planName: resolvedPlanName,
    duration: `${durationMonths} months`,
    originalAmount: params.originalAmount,
    discountAmount: params.discountAmount,
    finalAmount: params.finalAmount,
    couponCode: params.couponCode,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    razorpaySignature: params.razorpaySignature,
    status: "active",
    startDate,
    endDate,
  });

  await Users.findByIdAndUpdate(params.userId, {
    subscription: {
      planId: params.planId,
      planName: resolvedPlanName,
      status: "active",
      startDate,
      endDate,
      subscriptionId: subscription._id,
    },
  });

  return { subscription, startDate, endDate, durationMonths };
}

export const subscriptionRouter = router({
  // Validate coupon code
  validateCoupon: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Coupon code is required"),
        planId: z.string().min(1, "Plan ID is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { code, planId } = input;
      const amount = getSubscriptionPlanPrice(planId);

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
      const discount = coupon.calculateDiscount(amount);
      const finalAmount = amount - discount;

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
        couponCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { planId, planName, couponCode } = input;
      const amount = getSubscriptionPlanPrice(planId);
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

      // 100% (or over) discount: activate without Razorpay
      if (finalAmount <= 0) {
        if (!appliedCoupon) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid order total",
          });
        }

        const freePaymentId = `free_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;

        await incrementCouponUsage(appliedCoupon.code);

        const { subscription, startDate, endDate } =
          await activateSubscriptionForUser({
            userId: String(userId),
            userEmail: user.email ?? "",
            planId,
            planName,
            originalAmount: amount,
            discountAmount: appliedCoupon.discount,
            finalAmount: 0,
            couponCode: appliedCoupon.code,
            razorpayOrderId: "FREE_COUPON",
            razorpayPaymentId: freePaymentId,
            razorpaySignature: "FREE_COUPON_ACTIVATION",
          });

        return {
          success: true,
          isFreeActivation: true,
          order: null,
          freePaymentId,
          subscription: {
            id: subscription._id,
            planId,
            planName: subscription.planName,
            startDate,
            endDate,
            status: "active" as const,
          },
          appliedCoupon,
          finalAmount: 0,
        };
      }

      const currency = getRazorpayOrderCurrency();
      // INR: paise; EUR/USD: cents
      const amountInSmallestUnit = Math.round(finalAmount * 100);
      const minSmallest = minimumAmountInSmallestUnits(currency);

      if (amountInSmallestUnit < minSmallest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This order total is below the minimum charge allowed for this currency.",
        });
      }

      const options = {
        amount: amountInSmallestUnit,
        currency,
        receipt: `receipt_${planId}_${Date.now()}`,
        payment_capture: 1,
        notes: {
          planId,
          planName,
          userId: String(userId),
          userEmail: user.email ?? "",
          couponCode: couponCode || "",
          originalAmount: String(amount),
          finalAmount: String(finalAmount),
        },
      };

      try {
        const order = await razorpay.orders.create(options);

        return {
          success: true,
          isFreeActivation: false,
          order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
          },
          freePaymentId: null,
          subscription: null,
          appliedCoupon,
          finalAmount,
        };
      } catch (error: unknown) {
        console.error("Razorpay order creation error:", error);
        const message = formatRazorpayOrderFailureMessage(error);
        const statusCode =
          error && typeof error === "object" && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;
        throw new TRPCError({
          code: statusCode === 400 ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR",
          message,
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

      await incrementCouponUsage(couponCode);

      const { subscription, startDate, endDate } =
        await activateSubscriptionForUser({
          userId: String(userId),
          userEmail: user.email ?? "",
          planId,
          planName,
          originalAmount: originalAmount || finalAmount,
          discountAmount: discountAmount ?? 0,
          finalAmount,
          couponCode: couponCode || null,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
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
