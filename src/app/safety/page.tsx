"use client";

import React, { useState } from "react";
import Link from "next/link";

// Types
interface SafetyFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface TrustPillar {
  title: string;
  description: string;
  icon: string;
}

interface SafetyTip {
  category: string;
  tips: string[];
  icon: string;
}

// Icon Components
const VerificationIcon = () => (
  <svg
    className="w-8 h-8"
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

const SecurePaymentIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const Support24Icon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const InsuranceIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const ReviewsIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const PrivacyIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// Data
const safetyFeatures: SafetyFeature[] = [
  {
    title: "Identity Verification",
    description:
      "All users undergo rigorous verification to ensure authenticity and safety",
    icon: <VerificationIcon />,
    details: [
      "Government-issued ID verification",
      "Phone number confirmation",
      "Email verification required",
      "Social media profile linking",
      "Background checks for hosts",
    ],
  },
  {
    title: "Secure Payments",
    description: "Bank-level encryption protects all financial transactions",
    icon: <SecurePaymentIcon />,
    details: [
      "PCI-DSS compliant payment processing",
      "256-bit SSL encryption",
      "Secure payment gateway integration",
      "Fraud detection systems",
      "Payment protection guarantee",
    ],
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support for any safety concerns",
    icon: <Support24Icon />,
    details: [
      "Live chat support available anytime",
      "Multilingual support team",
      "Emergency hotline access",
      "Rapid response to safety issues",
      "Dedicated trust & safety team",
    ],
  },
  {
    title: "Host Guarantee",
    description: "Comprehensive protection for property owners",
    icon: <InsuranceIcon />,
    details: [
      "Up to $1M property damage protection",
      "Liability insurance coverage",
      "24/7 claims support",
      "No-cost coverage for hosts",
      "Fast claims processing",
    ],
  },
  {
    title: "Verified Reviews",
    description: "Authentic reviews from real guests and hosts",
    icon: <ReviewsIcon />,
    details: [
      "Only verified bookings can leave reviews",
      "Two-way review system",
      "Review authenticity checks",
      "Moderation for inappropriate content",
      "Transparent rating system",
    ],
  },
  {
    title: "Data Privacy",
    description: "Your personal information is protected and never shared",
    icon: <PrivacyIcon />,
    details: [
      "GDPR & CCPA compliant",
      "End-to-end data encryption",
      "No data selling to third parties",
      "Secure data storage",
      "Privacy controls in your hands",
    ],
  },
];

const trustPillars: TrustPillar[] = [
  {
    title: "Verified Properties",
    description: "Every property is inspected and verified before listing",
    icon: "🏠",
  },
  {
    title: "Secure Messaging",
    description: "Encrypted communication between hosts and guests",
    icon: "💬",
  },
  {
    title: "Safe Check-in",
    description: "Contactless and secure check-in options available",
    icon: "🔐",
  },
  {
    title: "Quality Standards",
    description:
      "All properties meet our high cleanliness and safety standards",
    icon: "✨",
  },
];

const safetyTips: SafetyTip[] = [
  {
    category: "For Guests",
    icon: "👥",
    tips: [
      "Always book and pay through the platform",
      "Read reviews carefully before booking",
      "Verify property details and photos",
      "Use secure messaging for communication",
      "Report any suspicious activity immediately",
      "Keep your personal information private",
      "Document the property condition on arrival",
    ],
  },
  {
    category: "For Hosts",
    icon: "🏡",
    tips: [
      "Screen guests through our verification system",
      "Set clear house rules and expectations",
      "Use our secure payment system only",
      "Install security cameras in common areas (disclosed)",
      "Keep emergency contact information updated",
      "Document property condition before/after stays",
      "Report policy violations promptly",
    ],
  },
  {
    category: "Property Safety",
    icon: "🔒",
    tips: [
      "Install smoke and carbon monoxide detectors",
      "Provide fire extinguishers and first aid kits",
      "Ensure all locks function properly",
      "Maintain adequate outdoor lighting",
      "Provide emergency exit information",
      "Keep emergency numbers visible",
      "Regular safety equipment checks",
    ],
  },
];

const SafetyPage: React.FC = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Guests");

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
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-700">
              Your Safety is Our Priority
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Trust &{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Safety
            </span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            We're committed to making Holiday Sera the safest platform for
            vacation rentals with industry-leading security measures and
            support.
          </p>

          {/* Hero Visual */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            </div>
            <div className="relative h-full flex items-center justify-center text-white">
              <div className="text-center space-y-6">
                <div className="flex justify-center gap-4">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl animate-bounce">
                    🛡️
                  </div>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl animate-bounce animation-delay-100">
                    🔒
                  </div>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl animate-bounce animation-delay-200">
                    ✅
                  </div>
                </div>
                <h2 className="text-4xl font-black">
                  Protected Every Step of the Way
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Pillars */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-4 gap-6">
            {trustPillars.map((pillar, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="text-6xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-gray-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Features */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Our Safety{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive protection measures to ensure your peace of mind
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <button
                    onClick={() =>
                      setExpandedFeature(
                        expandedFeature === index ? null : index
                      )
                    }
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
                  >
                    {expandedFeature === index ? "Show Less" : "Learn More"}
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
                        d={
                          expandedFeature === index
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  </button>
                </div>
                {expandedFeature === index && (
                  <div className="px-8 pb-8 animate-fadeIn">
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4">
                        Includes:
                      </h4>
                      <ul className="space-y-3">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              ✓
                            </span>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Safety{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Guidelines
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Best practices to ensure a safe and secure experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {safetyTips.map((tipGroup, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
              >
                <div className="text-6xl mb-6 text-center">{tipGroup.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {tipGroup.category}
                </h3>
                <ul className="space-y-4">
                  {tipGroup.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-5xl font-black mb-4">
                Our Commitment to You
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                We continuously invest in safety technology, team training, and
                community education to maintain the highest standards of trust
                and security.
              </p>
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">🎓</div>
                  <div className="text-2xl font-bold mb-2">
                    Safety Education
                  </div>
                  <p className="text-blue-100">
                    Regular training and resources
                  </p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">🔬</div>
                  <div className="text-2xl font-bold mb-2">Innovation</div>
                  <p className="text-blue-100">Advanced safety technology</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">👨‍⚖️</div>
                  <div className="text-2xl font-bold mb-2">Compliance</div>
                  <p className="text-blue-100">Meeting all regulations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Need Help or Want to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Report an Issue?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our dedicated trust and safety team is available 24/7 to assist
              you with any concerns or questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                🚨 Report a Safety Issue
              </button>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                💬 Contact Support
              </button>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                📖 Safety Resources
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              Available 24/7 in multiple languages • Average response time:
              Under 5 minutes
            </p>
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
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default SafetyPage;
