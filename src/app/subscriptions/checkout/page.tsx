"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useUserStore } from "@/lib/store";
import { trpc } from "@/trpc/client";

// Types
interface PlanFeature {
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  isPopular?: boolean;
  features: PlanFeature[];
  color: string;
  savings?: string;
  description: string;
}

interface AppliedCoupon {
  code: string;
  discountType: string;
  discountValue: number;
  discount: number;
}

// Subscription Plans Data
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "action",
    name: "Action Plan",
    price: 299,
    duration: "12 months",
    color: "blue",
    savings: "€25/month",
    description:
      "Perfect for property owners starting their vacation rental journey. Get professional listing and guaranteed bookings.",
    features: [
      { text: "12 Months Premium Listing" },
      { text: "Personal Account Manager" },
      { text: "34 Professional HD Photographs" },
      { text: "Unlimited Property Description" },
      { text: "Upload Property Video (1080p)" },
      { text: "Social Media Marketing Campaign" },
      { text: "2 Detailed Promotion Reports" },
      { text: "10 Qualified Booking Inquiries" },
      { text: "2 Guaranteed Reservations (1-3 Weeks Each)" },
    ],
  },
  {
    id: "game",
    name: "Game Plan",
    price: 399,
    duration: "18 months",
    isPopular: true,
    color: "indigo",
    savings: "€22/month - Best Value!",
    description:
      "Our most popular plan for serious hosts. Extended duration with premium features and priority support.",
    features: [
      { text: "18 Months Premium Listing" },
      { text: "Priority Account Manager" },
      { text: "Unlimited Professional HD Photographs" },
      { text: "Unlimited Property Description" },
      { text: "Upload Property Video (4K Quality)" },
      { text: "Advanced Social Media Marketing" },
      { text: "3 Comprehensive Promotion Reports" },
      { text: "15 Qualified Booking Inquiries" },
      { text: "3 Guaranteed Reservations (1-3 Weeks Each)" },
    ],
  },
  {
    id: "master",
    name: "Master Plan",
    price: 499,
    duration: "24 months",
    color: "purple",
    savings: "€21/month",
    description:
      "The ultimate package for professional property managers. Maximum exposure, dedicated support, and premium marketing.",
    features: [
      { text: "24 Months Premium Listing" },
      { text: "Dedicated Account Manager (24/7)" },
      { text: "Unlimited Professional HD Photographs" },
      { text: "Unlimited Property Description" },
      { text: "Upload Property Video (4K + Drone)" },
      { text: "Premium Social Media Marketing" },
      { text: "4 In-Depth Promotion Reports" },
      { text: "20 Qualified Booking Inquiries" },
      { text: "4 Guaranteed Reservations (1-3 Weeks Each)" },
    ],
  },
];

// Icon Components
const CheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
      clipRule="evenodd"
    />
  </svg>
);

const TagIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ArrowLeftIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams?.get("plan");
  const { user } = useUserStore();

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // tRPC mutations
  const validateCouponMutation = trpc.subscription.validateCoupon.useMutation();
  const createOrderMutation = trpc.subscription.createOrder.useMutation();
  const verifyPaymentMutation = trpc.subscription.verifyPayment.useMutation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && planId) {
      router.push(`/login?redirect=/subscriptions/checkout?plan=${planId}`);
      return;
    }
    
    if (planId) {
      const selectedPlan = subscriptionPlans.find((p) => p.id === planId);
      if (selectedPlan) {
        setPlan(selectedPlan);
      } else {
        router.push("/subscriptions");
      }
    } else {
      router.push("/subscriptions");
    }
  }, [planId, router, user]);

  const calculateFinalAmount = () => {
    if (!plan) return 0;
    if (appliedCoupon) {
      return plan.price - appliedCoupon.discount;
    }
    return plan.price;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const data = await validateCouponMutation.mutateAsync({
        code: couponCode,
        planId: plan?.id,
        amount: plan?.price,
      });

      setAppliedCoupon(data.coupon);
      setCouponError("");
    } catch (error: any) {
      setCouponError(error.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePayment = async () => {
    // Double-check authentication (should already be redirected, but just in case)
    if (!user) {
      router.push(`/login?redirect=/subscriptions/checkout?plan=${plan?.id}`);
      return;
    }

    if (!plan || !isRazorpayLoaded) return;

    setPaymentLoading(true);

    try {
      // Create order using tRPC
      const orderData = await createOrderMutation.mutateAsync({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price,
        couponCode: appliedCoupon?.code,
      });

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "HolidaysEra",
        description: `${plan.name} - ${plan.duration}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment using tRPC
            const verifyData = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              planName: plan.name,
              couponCode: appliedCoupon?.code,
              originalAmount: plan.price,
              finalAmount: orderData.finalAmount,
              discountAmount: appliedCoupon?.discount || 0,
            });

            if (verifyData.success) {
              // Redirect to success page
              router.push(
                `/subscriptions/checkout/success?payment_id=${response.razorpay_payment_id}&plan=${plan.id}`
              );
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.email || "",
          contact: "",
        },
        notes: {
          planId: plan.id,
          planName: plan.name,
          userId: user.id,
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-700",
    indigo: "from-indigo-500 to-indigo-700",
    purple: "from-purple-500 to-purple-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 py-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeftIcon />
          <span className="group-hover:underline">Back to Plans</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Details - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${colorClasses[plan.color]} text-white rounded-full text-sm font-semibold mb-3`}
                  >
                    {plan.isPopular && <span>⭐</span>}
                    {plan.name}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Complete Your Subscription
                  </h1>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
              </div>

              {/* Plan Duration & Price */}
              <div className="flex items-end gap-3 mb-8 pb-6 border-b border-gray-200">
                <span className="text-5xl font-black text-gray-900">
                  €{plan.price}
                </span>
                <span className="text-xl text-gray-500 mb-1">
                  / {plan.duration}
                </span>
                {plan.savings && (
                  <span
                    className={`ml-auto px-4 py-2 bg-gradient-to-r ${colorClasses[plan.color]} text-white rounded-full text-sm font-semibold`}
                  >
                    💡 {plan.savings}
                  </span>
                )}
              </div>

              {/* Features List */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  What's Included:
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${colorClasses[plan.color]} flex items-center justify-center text-white`}
                      >
                        <CheckIcon />
                      </span>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Why Choose This Plan?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Guaranteed Results
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get confirmed bookings or your money back
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Zero Commission
                  </h4>
                  <p className="text-sm text-gray-600">
                    Keep 100% of your rental earnings
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-gray-600">
                    Protected by Razorpay encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a coupon code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">
                        <TagIcon />
                      </span>
                      <div>
                        <span className="font-semibold text-green-800">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.discountType === "percentage"
                            ? `${appliedCoupon.discountValue}% off`
                            : `€${appliedCoupon.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>{plan.name}</span>
                  <span>€{plan.price.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-€{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  {appliedCoupon && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      €{plan.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-2xl font-black text-gray-900">
                    €{calculateFinalAmount().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Info Display */}
              {user && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Logged in as {user.fullName || user.email}</span>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={paymentLoading || !isRazorpayLoaded}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r ${colorClasses[plan.color]} text-white`}
              >
                {paymentLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>🔐 Pay €{calculateFinalAmount().toFixed(2)}</span>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <ShieldIcon />
                <span>Secured by Razorpay</span>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
