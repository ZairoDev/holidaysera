"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Subscription Plans Data for display
const subscriptionPlans: Record<string, { name: string; duration: string; color: string }> = {
  action: {
    name: "Action Plan",
    duration: "12 months",
    color: "blue",
  },
  game: {
    name: "Game Plan",
    duration: "18 months",
    color: "indigo",
  },
  master: {
    name: "Master Plan",
    duration: "24 months",
    color: "purple",
  },
};

const SuccessIcon: React.FC = () => (
  <svg
    className="w-24 h-24 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");
  const planId = searchParams?.get("plan");

  const plan = planId ? subscriptionPlans[planId] : null;

  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-700",
    indigo: "from-indigo-500 to-indigo-700",
    purple: "from-purple-500 to-purple-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-gray-100">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="w-24 h-24 rounded-full bg-green-200 opacity-50"></div>
              </div>
              <SuccessIcon />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your subscription. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Details
            </h2>
            <div className="space-y-3">
              {plan && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan</span>
                  <span
                    className={`px-3 py-1 bg-gradient-to-r ${colorClasses[plan.color]} text-white rounded-full text-sm font-semibold`}
                  >
                    {plan.name}
                  </span>
                </div>
              )}
              {plan && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {plan.duration}
                  </span>
                </div>
              )}
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-mono text-sm text-gray-900">
                    {paymentId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left border border-blue-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              What's Next?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>
                  Check your email for a confirmation receipt and subscription details.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>
                  Your dedicated account manager will contact you within 24 hours.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>
                  Start listing your property and enjoy premium features!
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-listing"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              🏠 List Your Property
            </Link>
            <Link
              href="/profile"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              👤 Go to Profile
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact our support team
              </Link>{" "}
              or call us at +1 (800) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
