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

const validSubscriptionPlans = ["action", "game", "master"] as const;
type SubscriptionPlanId = (typeof validSubscriptionPlans)[number];

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

function normalizePlanId(planId: string): SubscriptionPlanId {
  const normalizedPlanId = planId.trim().toLowerCase();
  if (
    normalizedPlanId !== "action" &&
    normalizedPlanId !== "game" &&
    normalizedPlanId !== "master"
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid subscription plan",
    });
  }
  return normalizedPlanId;
}

function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
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

type CouponSnapshot = {
  propertiesAllowedSnapshot: number;
  pricePerPropertySnapshot: number;
  discountSnapshot?: {
    type: "PER_PROPERTY" | "TOTAL";
    unit: "FIXED" | "PERCENT";
    value: number;
  };
};

type OfferPricingMetadata = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  pricePerProperty: number;
  propertiesAllowed: number;
  offerDiscountScope: "PER_PROPERTY" | "TOTAL";
  perPropertyEffectivePrice: number;
};

function buildOfferPricingMetadata(params: {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  snapshot: CouponSnapshot;
}): OfferPricingMetadata {
  const propertiesAllowed = Math.max(1, params.snapshot.propertiesAllowedSnapshot ?? 1);
  const pricePerProperty = Math.max(0, params.snapshot.pricePerPropertySnapshot ?? 0);
  const offerDiscountScope = params.snapshot.discountSnapshot?.type ?? "TOTAL";
  const perPropertyEffectivePrice =
    propertiesAllowed > 0 ? Number((params.finalAmount / propertiesAllowed).toFixed(2)) : 0;

  return {
    originalAmount: params.originalAmount,
    discountAmount: params.discountAmount,
    finalAmount: params.finalAmount,
    pricePerProperty,
    propertiesAllowed,
    offerDiscountScope,
    perPropertyEffectivePrice,
  };
}

async function getValidatedCouponForPlan(params: {
  rawCouponCode: string;
  planId: SubscriptionPlanId;
  amount: number;
}) {
  const normalizedCouponCode = normalizeCouponCode(params.rawCouponCode);
  if (!normalizedCouponCode) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid or inapplicable coupon",
    });
  }

  const coupon = await Coupon.findOne({ code: normalizedCouponCode });
  if (!coupon) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid or inapplicable coupon",
    });
  }

  const validation = coupon.isValid(params.planId, params.amount);
  if (!validation.valid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid or inapplicable coupon",
    });
  }

  return { coupon, normalizedCouponCode };
}

function getSubscriptionDates(planId: string): { startDate: Date; endDate: Date; durationMonths: number } {
  const startDate = new Date();
  const durationMonths = planDurations[planId] || 12;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return { startDate, endDate, durationMonths };
}

async function createPendingSubscription(params: {
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  razorpayOrderId: string;
  snapshot: CouponSnapshot;
}) {
  const { startDate, endDate, durationMonths } = getSubscriptionDates(params.planId);
  const resolvedPlanName = params.planName || planNames[params.planId] || "Subscription Plan";

  await Subscription.findOneAndUpdate(
    { razorpayOrderId: params.razorpayOrderId },
    {
      $setOnInsert: {
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
        razorpayPaymentId: "PENDING",
        razorpaySignature: "PENDING",
        status: "pending",
        startDate,
        endDate,
        propertiesAllowedSnapshot: params.snapshot.propertiesAllowedSnapshot,
        pricePerPropertySnapshot: params.snapshot.pricePerPropertySnapshot,
        discountSnapshot: params.snapshot.discountSnapshot,
        entitlementGranted: false,
      },
    },
    { upsert: true, new: true },
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
  snapshot: CouponSnapshot;
}) {
  const { startDate, endDate, durationMonths } = getSubscriptionDates(params.planId);

  const resolvedPlanName =
    params.planName || planNames[params.planId] || "Subscription Plan";
  const subscription = await Subscription.findOneAndUpdate(
    { razorpayOrderId: params.razorpayOrderId },
    {
      $set: {
        userId: params.userId,
        userEmail: params.userEmail,
        planId: params.planId,
        planName: resolvedPlanName,
        duration: `${durationMonths} months`,
        originalAmount: params.originalAmount,
        discountAmount: params.discountAmount,
        finalAmount: params.finalAmount,
        couponCode: params.couponCode,
        razorpayPaymentId: params.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature,
        status: "active",
        startDate,
        endDate,
        propertiesAllowedSnapshot: params.snapshot.propertiesAllowedSnapshot,
        pricePerPropertySnapshot: params.snapshot.pricePerPropertySnapshot,
        discountSnapshot: params.snapshot.discountSnapshot,
      },
      $setOnInsert: {
        entitlementGranted: false,
      },
    },
    { new: true, upsert: true },
  );

  const claim = await Subscription.updateOne(
    { _id: subscription._id, entitlementGranted: { $ne: true } },
    { $set: { entitlementGranted: true } },
  );
  if (claim.modifiedCount === 0) {
    return { subscription, startDate, endDate, durationMonths, granted: false };
  }

  const propertiesToGrant = Math.max(1, params.snapshot.propertiesAllowedSnapshot ?? 1);
  await Users.findByIdAndUpdate(params.userId, {
    $inc: { allowedProperties: propertiesToGrant },
    $set: {
      subscription: {
        planId: params.planId,
        planName: resolvedPlanName,
        status: "active",
        startDate,
        endDate,
        subscriptionId: subscription._id,
      },
    },
  });

  return { subscription, startDate, endDate, durationMonths, granted: true };
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
      const normalizedPlanId = normalizePlanId(input.planId);
      const amount = getSubscriptionPlanPrice(normalizedPlanId);
      const { coupon } = await getValidatedCouponForPlan({
        rawCouponCode: input.code,
        planId: normalizedPlanId,
        amount,
      });

      const discount = coupon.calculateDiscount(amount);
      const finalAmount = amount - discount;
      const snapshot: CouponSnapshot = {
        propertiesAllowedSnapshot: Math.max(1, coupon.propertiesAllowed ?? 1),
        pricePerPropertySnapshot: Math.max(0, coupon.pricePerProperty ?? amount),
        discountSnapshot: {
          type: coupon.offerDiscountScope ?? "TOTAL",
          unit: coupon.discountType === "percentage" ? "PERCENT" : "FIXED",
          value: Math.max(0, coupon.discountValue),
        },
      };
      const offerPricing = buildOfferPricingMetadata({
        originalAmount: amount,
        discountAmount: discount,
        finalAmount,
        snapshot,
      });

      return {
        success: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount: discount,
          originalAmount: offerPricing.originalAmount,
          discountAmount: offerPricing.discountAmount,
          finalAmount: offerPricing.finalAmount,
          pricePerProperty: offerPricing.pricePerProperty,
          propertiesAllowed: offerPricing.propertiesAllowed,
          offerDiscountScope: offerPricing.offerDiscountScope,
          perPropertyEffectivePrice: offerPricing.perPropertyEffectivePrice,
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
      const normalizedPlanId = normalizePlanId(input.planId);
      const { planName } = input;
      const amount = getSubscriptionPlanPrice(normalizedPlanId);
      const userId = ctx.user.id;
      const user = await Users.findById(userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      let finalAmount = amount;
      let appliedCoupon:
        | {
            code: string;
            discount: number;
            snapshot: CouponSnapshot;
          }
        | null = null;
      let snapshot: CouponSnapshot = {
        propertiesAllowedSnapshot: 1,
        pricePerPropertySnapshot: amount,
      };

      // If coupon code is provided, validate and apply it
      const normalizedCouponCode = input.couponCode ? normalizeCouponCode(input.couponCode) : "";
      if (normalizedCouponCode) {
        const { coupon } = await getValidatedCouponForPlan({
          rawCouponCode: normalizedCouponCode,
          planId: normalizedPlanId,
          amount,
        });
        const discount = coupon.calculateDiscount(amount);
        finalAmount = amount - discount;
        appliedCoupon = {
          code: coupon.code,
          discount: discount,
          snapshot: {
            propertiesAllowedSnapshot: Math.max(1, coupon.propertiesAllowed ?? 1),
            pricePerPropertySnapshot: Math.max(0, coupon.pricePerProperty ?? amount),
            discountSnapshot: {
              type: coupon.offerDiscountScope ?? "TOTAL",
              unit: coupon.discountType === "percentage" ? "PERCENT" : "FIXED",
              value: Math.max(0, coupon.discountValue),
            },
          },
        };
        snapshot = appliedCoupon.snapshot;
      }

      const offerPricing = buildOfferPricingMetadata({
        originalAmount: amount,
        discountAmount: appliedCoupon?.discount ?? 0,
        finalAmount,
        snapshot,
      });

      // 100% (or over) discount: activate without Razorpay
      if (finalAmount <= 0) {
        if (!appliedCoupon) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid order total",
          });
        }

        const freePaymentId = `free_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;

        const freeOrderId = `FREE_COUPON_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
        await createPendingSubscription({
          userId: String(userId),
          userEmail: user.email ?? "",
          planId: normalizedPlanId,
          planName,
          originalAmount: amount,
          discountAmount: appliedCoupon.discount,
          finalAmount: 0,
          couponCode: appliedCoupon.code,
          razorpayOrderId: freeOrderId,
          snapshot,
        });
        console.info("[Holidaysera Payment] pending.created.free", {
          userId: String(userId),
          propertiesAllowedSnapshot: snapshot.propertiesAllowedSnapshot,
        });

        const { subscription, startDate, endDate, granted } =
          await activateSubscriptionForUser({
            userId: String(userId),
            userEmail: user.email ?? "",
            planId: normalizedPlanId,
            planName,
            originalAmount: amount,
            discountAmount: appliedCoupon.discount,
            finalAmount: 0,
            couponCode: appliedCoupon.code,
            razorpayOrderId: freeOrderId,
            razorpayPaymentId: freePaymentId,
            razorpaySignature: "FREE_COUPON_ACTIVATION",
            snapshot,
          });
        if (granted) {
          await incrementCouponUsage(appliedCoupon.code);
          console.info("[Holidaysera Payment] entitlement.granted.free", {
            userId: String(userId),
            propertiesAllowedSnapshot: snapshot.propertiesAllowedSnapshot,
          });
        }

        return {
          success: true,
          isFreeActivation: true,
          order: null,
          freePaymentId,
          originalAmount: offerPricing.originalAmount,
          discountAmount: offerPricing.discountAmount,
          finalAmount: offerPricing.finalAmount,
          pricePerProperty: offerPricing.pricePerProperty,
          propertiesAllowed: offerPricing.propertiesAllowed,
          offerDiscountScope: offerPricing.offerDiscountScope,
          perPropertyEffectivePrice: offerPricing.perPropertyEffectivePrice,
          subscription: {
            id: subscription._id,
            planId: normalizedPlanId,
            planName: subscription.planName,
            startDate,
            endDate,
            status: "active" as const,
          },
          appliedCoupon,
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
        receipt: `receipt_${normalizedPlanId}_${Date.now()}`,
        payment_capture: 1,
        notes: {
          planId: normalizedPlanId,
          planName,
          userId: String(userId),
          userEmail: user.email ?? "",
          couponCode: normalizedCouponCode || "",
          originalAmount: String(amount),
          finalAmount: String(finalAmount),
        },
      };

      try {
        const order = await razorpay.orders.create(options);
        await createPendingSubscription({
          userId: String(userId),
          userEmail: user.email ?? "",
          planId: normalizedPlanId,
          planName,
          originalAmount: amount,
          discountAmount: appliedCoupon?.discount ?? 0,
          finalAmount,
          couponCode: appliedCoupon?.code ?? null,
          razorpayOrderId: order.id,
          snapshot,
        });
        console.info("[Holidaysera Payment] pending.created", {
          userId: String(userId),
          orderId: order.id,
          propertiesAllowedSnapshot: snapshot.propertiesAllowedSnapshot,
        });

        return {
          success: true,
          isFreeActivation: false,
          originalAmount: offerPricing.originalAmount,
          discountAmount: offerPricing.discountAmount,
          finalAmount: offerPricing.finalAmount,
          pricePerProperty: offerPricing.pricePerProperty,
          propertiesAllowed: offerPricing.propertiesAllowed,
          offerDiscountScope: offerPricing.offerDiscountScope,
          perPropertyEffectivePrice: offerPricing.perPropertyEffectivePrice,
          order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
          },
          freePaymentId: null,
          subscription: null,
          appliedCoupon,
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
      const normalizedPlanId = normalizePlanId(planId);
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
      const pendingSubscription = await Subscription.findOne({
        razorpayOrderId: razorpay_order_id,
      }).lean<{
        originalAmount?: number;
        discountAmount?: number;
        finalAmount?: number;
        propertiesAllowedSnapshot?: number;
        pricePerPropertySnapshot?: number;
        discountSnapshot?: {
          type: "PER_PROPERTY" | "TOTAL";
          unit: "FIXED" | "PERCENT";
          value: number;
        };
        couponCode?: string | null;
      } | null>();
      if (!pendingSubscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      const authoritativeOriginalAmount = getSubscriptionPlanPrice(normalizedPlanId);
      const snapshot: CouponSnapshot = {
        propertiesAllowedSnapshot: Math.max(
          1,
          pendingSubscription?.propertiesAllowedSnapshot ?? 1,
        ),
        pricePerPropertySnapshot: Math.max(
          0,
          pendingSubscription?.pricePerPropertySnapshot ?? originalAmount,
        ),
        discountSnapshot: pendingSubscription?.discountSnapshot,
      };
      const normalizedCouponCode = pendingSubscription?.couponCode ?? couponCode ?? null;
      const snapshotOriginalAmount = pendingSubscription.originalAmount ?? authoritativeOriginalAmount;
      const snapshotDiscountAmount = pendingSubscription.discountAmount ?? discountAmount ?? 0;
      const snapshotFinalAmount = pendingSubscription.finalAmount ?? finalAmount;

      const { subscription, startDate, endDate, granted } =
        await activateSubscriptionForUser({
          userId: String(userId),
          userEmail: user.email ?? "",
          planId: normalizedPlanId,
          planName,
          originalAmount: snapshotOriginalAmount,
          discountAmount: snapshotDiscountAmount,
          finalAmount: snapshotFinalAmount,
          couponCode: normalizedCouponCode,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          snapshot,
        });
      if (granted) {
        await incrementCouponUsage(normalizedCouponCode);
        console.info("[Holidaysera Payment] entitlement.granted.verify", {
          userId: String(userId),
          orderId: razorpay_order_id,
          propertiesAllowedSnapshot: snapshot.propertiesAllowedSnapshot,
        });
      }

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
