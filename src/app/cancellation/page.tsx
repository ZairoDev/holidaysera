"use client";

import React, { useState } from "react";
import Link from "next/link";

// Types
interface CancellationPolicy {
  id: string;
  name: string;
  icon: string;
  color: string;
  refundPercentage: string;
  timeline: string;
  description: string;
  details: string[];
  bestFor: string[];
}

interface CancellationCalculator {
  bookingAmount: number;
  policyType: string;
  daysBeforeCheckIn: number;
}

// Data
const cancellationPolicies: CancellationPolicy[] = [
  {
    id: "flexible",
    name: "Flexible",
    icon: "🟢",
    color: "green",
    refundPercentage: "100%",
    timeline: "24 hours before check-in",
    description: "Full refund if cancelled at least 24 hours before check-in",
    details: [
      "Cancel up to 24 hours before check-in for a full refund",
      "Service fees are fully refundable",
      "Cleaning fees are fully refundable",
      "No penalty for early cancellation",
      "Instant refund processing",
    ],
    bestFor: [
      "Guests with uncertain travel plans",
      "Last-minute bookings",
      "Business travelers",
    ],
  },
  {
    id: "moderate",
    name: "Moderate",
    icon: "🟡",
    color: "yellow",
    refundPercentage: "50%",
    timeline: "5 days before check-in",
    description: "Full refund if cancelled at least 5 days before check-in",
    details: [
      "Cancel up to 5 days before check-in for a full refund",
      "Cancel within 5 days: 50% refund",
      "Service fees are 50% refundable within 5 days",
      "First night is non-refundable if cancelled within 48 hours",
      "Refund processed within 5-7 business days",
    ],
    bestFor: [
      "Most bookings (balanced protection)",
      "Vacation planners",
      "Family trips",
    ],
  },
  {
    id: "strict",
    name: "Strict",
    icon: "🔴",
    color: "red",
    refundPercentage: "50%",
    timeline: "14 days before check-in",
    description: "50% refund if cancelled at least 14 days before check-in",
    details: [
      "Cancel 14+ days before check-in: 50% refund",
      "Cancel within 14 days: No refund",
      "Service fees are non-refundable",
      "Cleaning fees are non-refundable",
      "First night is always non-refundable",
    ],
    bestFor: [
      "High-demand properties",
      "Peak season bookings",
      "Special events/holidays",
    ],
  },
  {
    id: "non-refundable",
    name: "Non-Refundable",
    icon: "⛔",
    color: "gray",
    refundPercentage: "0%",
    timeline: "No refunds",
    description: "No refunds for any cancellations (usually discounted rate)",
    details: [
      "No refunds for any reason",
      "Lowest available price",
      "All fees are non-refundable",
      "Cannot be modified or cancelled",
      "Best value for committed travelers",
    ],
    bestFor: [
      "Confirmed travel plans only",
      "Budget-conscious travelers",
      "Flexible date arrangements",
    ],
  },
];

const faqs = [
  {
    question: "How do I cancel my booking?",
    answer:
      "Log into your account, go to 'My Trips', select the booking you want to cancel, and click 'Cancel Booking'. You'll see your refund amount before confirming the cancellation.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "Refunds are typically processed within 5-10 business days, depending on your payment method. Credit card refunds may take an additional 5-7 days to appear on your statement.",
  },
  {
    question: "Can I get a refund for extenuating circumstances?",
    answer:
      "Yes, we have a special policy for extenuating circumstances like natural disasters, serious illness, or travel restrictions. Contact our support team with documentation for review.",
  },
  {
    question: "What if the host cancels my booking?",
    answer:
      "If a host cancels your confirmed booking, you'll receive a full refund including all fees. We'll also help you find alternative accommodation and may provide a travel credit.",
  },
  {
    question: "Can I modify my booking instead of cancelling?",
    answer:
      "Yes! You can request to change your dates through 'My Trips'. The host must approve changes, and price differences may apply. This is often better than cancelling and rebooking.",
  },
  {
    question: "Are service fees refundable?",
    answer:
      "Service fee refunds depend on the cancellation policy and timing. With Flexible policy, service fees are fully refundable. Other policies may have partial or no refunds for service fees.",
  },
];

const CancellationPage: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string>("moderate");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator state
  const [calculatorData, setCalculatorData] = useState<CancellationCalculator>({
    bookingAmount: 1000,
    policyType: "moderate",
    daysBeforeCheckIn: 10,
  });
  const [calculatedRefund, setCalculatedRefund] = useState<number | null>(null);

  const calculateRefund = () => {
    const { bookingAmount, policyType, daysBeforeCheckIn } = calculatorData;
    let refundAmount = 0;

    switch (policyType) {
      case "flexible":
        refundAmount = daysBeforeCheckIn >= 1 ? bookingAmount : 0;
        break;
      case "moderate":
        if (daysBeforeCheckIn >= 5) {
          refundAmount = bookingAmount;
        } else if (daysBeforeCheckIn >= 2) {
          refundAmount = bookingAmount * 0.5;
        } else {
          refundAmount = 0;
        }
        break;
      case "strict":
        refundAmount = daysBeforeCheckIn >= 14 ? bookingAmount * 0.5 : 0;
        break;
      case "non-refundable":
        refundAmount = 0;
        break;
    }

    setCalculatedRefund(refundAmount);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: "from-green-500 to-emerald-600",
        border: "border-green-500",
        text: "text-green-600",
        lightBg: "bg-green-50",
      },
      yellow: {
        bg: "from-yellow-500 to-orange-600",
        border: "border-yellow-500",
        text: "text-yellow-600",
        lightBg: "bg-yellow-50",
      },
      red: {
        bg: "from-red-500 to-rose-600",
        border: "border-red-500",
        text: "text-red-600",
        lightBg: "bg-red-50",
      },
      gray: {
        bg: "from-gray-500 to-gray-600",
        border: "border-gray-500",
        text: "text-gray-600",
        lightBg: "bg-gray-50",
      },
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
            <span className="text-sm font-semibold text-blue-700">
              📋 Clear and Fair Policies
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Cancellation{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Policies
            </span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Understand our flexible cancellation options and find the policy
            that works best for your travel plans
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              🧮 Refund Calculator
            </button>
            <Link
              href="#faq"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              💬 FAQs
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              📞 Contact Support
            </Link>
          </div>
        </div>

        {/* Refund Calculator */}
        {showCalculator && (
          <div className="max-w-4xl mx-auto mb-24 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
              <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
                💰 Refund Calculator
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Booking Amount (€)
                  </label>
                  <input
                    type="number"
                    value={calculatorData.bookingAmount}
                    onChange={(e) =>
                      setCalculatorData({
                        ...calculatorData,
                        bookingAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Cancellation Policy
                  </label>
                  <select
                    value={calculatorData.policyType}
                    onChange={(e) =>
                      setCalculatorData({
                        ...calculatorData,
                        policyType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="moderate">Moderate</option>
                    <option value="strict">Strict</option>
                    <option value="non-refundable">Non-Refundable</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Days Before Check-In: {calculatorData.daysBeforeCheckIn}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={calculatorData.daysBeforeCheckIn}
                    onChange={(e) =>
                      setCalculatorData({
                        ...calculatorData,
                        daysBeforeCheckIn: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <button
                onClick={calculateRefund}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Calculate Refund
              </button>
              {calculatedRefund !== null && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 animate-fadeIn">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Your Estimated Refund</p>
                    <p className="text-5xl font-black text-blue-600 mb-2">
                      €{calculatedRefund.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(
                        (calculatedRefund / calculatorData.bookingAmount) *
                        100
                      ).toFixed(0)}
                      % of booking amount
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Policy Cards */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Policies
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the cancellation policy that best fits your travel needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {cancellationPolicies.map((policy) => {
              const colors = getColorClasses(policy.color);
              return (
                <div
                  key={policy.id}
                  className={`group bg-white rounded-3xl border-2 ${
                    selectedPolicy === policy.id
                      ? colors.border
                      : "border-gray-200 hover:border-blue-400"
                  } shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
                  onClick={() => setSelectedPolicy(policy.id)}
                >
                  <div className={`p-8 bg-gradient-to-r ${colors.bg}`}>
                    <div className="flex items-center justify-between text-white mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl">{policy.icon}</span>
                        <div>
                          <h3 className="text-3xl font-black">{policy.name}</h3>
                          <p className="text-white/80">{policy.timeline}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black">
                          {policy.refundPercentage}
                        </div>
                        <div className="text-sm text-white/80">Refund</div>
                      </div>
                    </div>
                    <p className="text-white/90 text-lg">
                      {policy.description}
                    </p>
                  </div>

                  <div className="p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Policy Details:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {policy.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 w-6 h-6 ${colors.text} font-bold mt-0.5`}
                          >
                            •
                          </span>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`p-4 ${colors.lightBg} rounded-xl`}>
                      <h5 className="font-bold text-gray-900 mb-2">
                        Best For:
                      </h5>
                      <ul className="space-y-1">
                        {policy.bestFor.map((item, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">
                            ✓ {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Information */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="relative p-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-white">
              <h2 className="text-4xl font-black mb-6 text-center">
                ⚠️ Important Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold mb-3">
                    Extenuating Circumstances
                  </h3>
                  <p className="text-blue-100">
                    Unexpected events like natural disasters, serious illness,
                    or government travel bans may qualify for exceptions to our
                    standard cancellation policies. Contact support with
                    documentation.
                  </p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Host Cancellations</h3>
                  <p className="text-blue-100">
                    If a host cancels your booking, you receive a full refund
                    plus assistance finding alternative accommodation. Hosts
                    face penalties for cancellations.
                  </p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Processing Time</h3>
                  <p className="text-blue-100">
                    Refunds typically process within 5-10 business days. The
                    time it takes to receive funds depends on your payment
                    method and financial institution.
                  </p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold mb-3">Modify vs Cancel</h3>
                  <p className="text-blue-100">
                    Consider modifying your booking dates instead of cancelling.
                    Many hosts approve changes, and you may avoid cancellation
                    fees while keeping your reservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common cancellation questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? null : index)
                  }
                  className="w-full p-6 text-left flex justify-between items-center gap-4"
                >
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      expandedFAQ === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 animate-fadeIn">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Need Help with a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cancellation?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our support team is available 24/7 to assist you with
              cancellations, refunds, or any questions about our policies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                💬 Contact Support
              </Link>
              <Link
                href="/my-trips"
                className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                📅 My Trips
              </Link>
              <Link
                href="/help"
                className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                📖 Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .bg-grid-white\\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default CancellationPage;
