"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface PropertyLimit {
  plan: string;
  properties: string;
  icon: string;
  color: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

// Data
const propertyLimits: PropertyLimit[] = [
  {
    plan: "Action Plan",
    properties: "1 Property",
    icon: "🏠",
    color: "blue",
  },
  {
    plan: "Game Plan",
    properties: "Up to 3 Properties",
    icon: "🏘️",
    color: "indigo",
  },
  {
    plan: "Master Plan",
    properties: "Up to 5 Properties",
    icon: "🌆",
    color: "purple",
  },
];

const listingSteps: Step[] = [
  {
    number: 1,
    title: "Login as Owner",
    description:
      "Sign in to your owner account or create one if you're new to Holiday Sera",
    icon: "🔐",
  },
  {
    number: 2,
    title: "Choose Your Subscription",
    description:
      "Select a plan that matches your property portfolio and business goals",
    icon: "💎",
  },
  {
    number: 3,
    title: "Add Property Details",
    description:
      "Fill in property information, amenities, pricing, and availability",
    icon: "📝",
  },
  {
    number: 4,
    title: "Upload Photos & Videos",
    description:
      "Showcase your property with high-quality images and virtual tours",
    icon: "📸",
  },
  {
    number: 5,
    title: "Set Your Rates",
    description: "Configure pricing, seasonal rates, and special offers",
    icon: "💰",
  },
  {
    number: 6,
    title: "Go Live!",
    description: "Review and publish your listing to start receiving bookings",
    icon: "🚀",
  },
];

const benefits: Benefit[] = [
  {
    title: "Professional Photography",
    description:
      "Get stunning HD photos of your property included with your subscription",
    icon: "📷",
  },
  {
    title: "No Commission Fees",
    description:
      "Keep 100% of your earnings - we only charge the subscription fee",
    icon: "💯",
  },
  {
    title: "Guaranteed Bookings",
    description:
      "Receive guaranteed reservations based on your subscription plan",
    icon: "✅",
  },
  {
    title: "Account Manager",
    description: "Get dedicated support from your personal account manager",
    icon: "👨‍💼",
  },
  {
    title: "Marketing Support",
    description:
      "Benefit from our social media campaigns and promotional activities",
    icon: "📢",
  },
  {
    title: "Easy Management",
    description: "Manage multiple properties from one dashboard with ease",
    icon: "🎛️",
  },
];

const requirements = [
  "Property ownership or authorized management rights",
  "Valid government-issued ID for verification",
  "Property address and basic details",
  "High-quality photos (or we can arrange photoshoot)",
  "Bank account for receiving payments",
  "Active phone number and email address",
];

const ListPropertyPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // This would come from your auth system
  const [userRole, setUserRole] = useState<string | null>(null); // "Owner" or "Traveller"
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleListPropertyClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check if user is an owner
    if (userRole !== "Owner") {
      alert("Please log in with an Owner account to list properties");
      return;
    }

    // Redirect to property listing form
    router.push("/add-property");
  };

  const handleLogin = (role: string) => {
    // This would normally call your authentication API
    // For demo purposes, we'll just simulate a login
    console.log(`Logging in as ${role}`);
    router.push(`/login?role=${role}&redirect=/add-property`);
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
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-blue-700">
                Join 4,500+ Successful Property Owners
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              List Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Property
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform your property into a profitable vacation rental. Sign in
              as an owner to add multiple properties based on your subscription
              plan.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleListPropertyClick}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                🏠 List Your Property Now
              </button>
              <Link
                href="/subscriptions"
                className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
              >
                💎 View Subscription Plans
              </Link>
            </div>
          </div>

          {/* Auth Required Notice */}
          <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl">
                ℹ️
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Owner Account Required
                </h3>
                <p className="text-gray-700 mb-4">
                  To list properties, you must be logged in with an{" "}
                  <strong>Owner account</strong>. If you have a Traveller
                  account, please log out and sign in as an Owner, or create a
                  new Owner account.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleLogin("Owner")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Login as Owner
                  </button>
                  <Link
                    href="/signup?role=Owner"
                    className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-300 hover:border-blue-600 transition-colors"
                  >
                    Create Owner Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Limits by Subscription */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Properties by{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Subscription
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different subscription plans allow you to list multiple properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {propertyLimits.map((limit, index) => (
              <div
                key={index}
                className="group p-10 bg-white rounded-3xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {limit.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {limit.plan}
                </h3>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                  <span className="text-3xl font-black text-blue-600">
                    {limit.properties}
                  </span>
                </div>
                <p className="text-gray-600 mt-4">
                  Perfect for{" "}
                  {index === 0 ? "single" : index === 1 ? "small" : "large"}{" "}
                  property portfolios
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors"
            >
              Compare all subscription features →
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              How to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Get Started
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to list your property
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listingSteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < listingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-blue-300 to-transparent -z-10" />
                )}

                <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {step.number}
                    </div>
                    <div className="text-5xl">{step.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              What You{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Get
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium features included with every subscription
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-gray-200">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">
                📋 What You'll Need
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-5xl font-black mb-4">
                Ready to List Your Property?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Login as an owner to start adding your properties and reach
                millions of travelers worldwide
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleLogin("Owner")}
                  className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  🔐 Login as Owner
                </button>
                <Link
                  href="/signup?role=Owner"
                  className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  📝 Create Owner Account
                </Link>
              </div>
              <p className="text-sm text-blue-100">
                Have questions?{" "}
                <Link href="/contact" className="underline hover:text-white">
                  Contact our team
                </Link>{" "}
                for assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                🔐
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600">
                Please log in with an Owner account to list properties
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleLogin("Owner")}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login as Owner
              </button>
              <Link
                href="/signup?role=Owner"
                className="block w-full py-4 px-6 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 transition-all duration-300 text-center"
              >
                Create Owner Account
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
          }
          to {
            opacity: 1;
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

export default ListPropertyPage;
