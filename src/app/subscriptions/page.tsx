"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { CreditCard, Wallet, RefreshCw, Building2, Users, Globe } from "lucide-react";

// Types
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

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
}

// Icon Components
const AssistanceIcon = () => (
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

const CostEffectiveIcon = () => (
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
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SecurityIcon = () => (
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

const BookingIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const MarketingIcon = () => (
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const PaymentIcon = () => (
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
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const GrowthIcon = () => (
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
      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
    />
  </svg>
);

const WebsiteIcon = () => (
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
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

// Data
const leftFeatures: Feature[] = [
  {
    title: "24/7 Assistance",
    description:
      "We are available on every step when you need us with dedicated support team",
    icon: <AssistanceIcon />,
  },
  {
    title: "Cost Effective",
    description:
      "We serve quality services in less investment with maximum ROI",
    icon: <CostEffectiveIcon />,
  },
  {
    title: "Secure Investment",
    description:
      "You will get guaranteed bookings or your invested amount back",
    icon: <SecurityIcon />,
  },
  {
    title: "Guaranteed Bookings",
    description:
      "Host get assured reservations according to their subscription tier",
    icon: <BookingIcon />,
  },
];

const rightFeatures: Feature[] = [
  {
    title: "Best Marketing Strategies",
    description:
      "Proven methods to skyrocket your rental business with data-driven insights",
    icon: <MarketingIcon />,
  },
  {
    title: "Secure Payment Methods",
    description:
      "We ensure safe transactions through secure online payment portals",
    icon: <PaymentIcon />,
  },
  {
    title: "Rental Growth",
    description:
      "Get maximum number of quality renters for your rental property",
    icon: <GrowthIcon />,
  },
  {
    title: "Professional Website",
    description:
      "For long-term success we provide an attractive professional website",
    icon: <WebsiteIcon />,
  },
];

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "action",
    name: "Action Plan",
    price: 299,
    duration: "12 months",
    color: "blue",
    savings: "€25/month",
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
    color: "sky",
    savings: "€22/month - Best Value!",
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
    color: "sky-dark",
    savings: "€21/month",
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

const howItWorks = [
  {
    title: "No Commission",
    description:
      "Zero hidden charges or commissions. Keep 100% of your earnings",
    icon: CreditCard,
  },
  {
    title: "Direct Payment",
    description: "Get paid directly from guests to your bank account instantly",
    icon: Wallet,
  },
  {
    title: "Stay Connected",
    description: "Easy renewal process with exclusive loyalty discounts",
    icon: RefreshCw,
  },
];

const stats = [
  {
    value: "4,500+",
    label: "Properties",
    description: "Active listings across Europe, Asia, and United States",
    icon: Building2,
  },
  {
    value: "2M+",
    label: "Happy Guests",
    description: "Satisfied customers and growing community",
    icon: Users,
  },
  {
    value: "50+",
    label: "Countries",
    description: "Flexible rental options worldwide",
    icon: Globe,
  },
];

// Components
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

const FeatureCard: React.FC<Feature> = ({ title, description, icon }) => (
  <div className="group h-full p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-300">
    <div className="flex items-start gap-4 h-full">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const PlanCard: React.FC<SubscriptionPlan> = ({
  id,
  name,
  price,
  duration,
  isPopular,
  features,
  color,
  savings,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  const colorClasses = {
    blue: "from-sky-400 to-sky-600",
    sky: "from-sky-500 to-sky-600",
    "sky-dark": "from-sky-600 to-sky-800",
  }[color];

  const handlePlanSelect = () => {
    if (!user) {
      // Redirect to login with return URL to checkout
      router.push(`/login?redirect=/subscriptions/checkout?plan=${id}`);
    } else {
      // User is logged in, go directly to checkout
      router.push(`/subscriptions/checkout?plan=${id}`);
    }
  };

  return (
    <div
      className={`h-full relative px-8 py-10 rounded-3xl border-2 flex flex-col overflow-hidden bg-white transition-all duration-500 ${
        isPopular
          ? "border-sky-500 shadow-2xl scale-105"
          : "border-gray-200 hover:border-sky-400 shadow-lg hover:shadow-2xl"
      } hover:-translate-y-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <>
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-1.5 tracking-widest text-xs absolute right-4 top-4 rounded-full z-10 font-bold shadow-lg animate-pulse">
            ⭐ MOST POPULAR
          </span>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-sky-100/50 -z-10 rounded-3xl" />
        </>
      )}

      <div className="mb-8">
        <h3 className="block text-sm uppercase tracking-widest text-gray-500 mb-3 font-bold">
          {name}
        </h3>
        <div className="flex items-end gap-2 mb-3">
          <h2 className="text-5xl font-black text-gray-900">€{price}</h2>
          <span className="text-lg font-medium text-gray-500 mb-2">
            /{duration}
          </span>
        </div>
        {savings && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${colorClasses} rounded-full`}
          >
            <span className="text-white text-sm font-semibold">
              💡 {savings}
            </span>
          </div>
        )}
      </div>

      <nav className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start group/item"
            style={{
              animation: isHovered
                ? `slideIn 0.3s ease-out ${index * 0.05}s both`
                : "none",
            }}
          >
            <span className="mr-3 inline-flex flex-shrink-0 text-sky-600 mt-0.5 group-hover/item:scale-125 transition-transform">
              <CheckIcon />
            </span>
            <span className="text-gray-700 text-sm leading-relaxed font-medium">
              {feature.text}
            </span>
          </li>
        ))}
      </nav>

      <div className="flex flex-col mt-auto space-y-3">
        <button
          onClick={handlePlanSelect}
          className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center ${
            isPopular
              ? `bg-gradient-to-r ${colorClasses} text-white hover:scale-105`
              : "border-2 border-sky-600 bg-white text-sky-600 hover:bg-sky-600 hover:text-white"
          }`}
        >
          {isPopular ? "🚀 Get Started Now" : "Choose This Plan"}
        </button>
        <p className="text-center text-xs text-gray-500">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
};

const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({
  end,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const EnhancedSubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-sky-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-sky-100/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-sky-100/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col justify-center items-center space-y-24">
          {/* Hero Section */}
          <div className="flex flex-col mt-5 md:flex-row md:gap-16 items-center w-full max-w-7xl">
            <div className="md:w-1/2 p-4 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full border border-sky-200">
                <span className="w-2 h-2 bg-sky-600 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-sky-600">
                  Join 4,500+ Successful Hosts
                </span>
              </div>

              <h1 className="text-5xl font-black text-gray-900 md:text-6xl xl:text-7xl leading-tight">
                Become A{" "}
                <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent animate-gradient">
                  Host
                </span>
              </h1>

              <p className="text-lg text-gray-600 xl:text-xl leading-relaxed">
                Transform your property into a thriving vacation rental
                business. We provide everything you need - from professional
                photography to guaranteed bookings. Join the leading platform
                for short-term holiday rentals across Europe, Asia, and United
                States.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/list-property" className="px-8 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-block text-center">
                  Start Listing Now
                </Link>
                
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white flex items-center justify-center text-white font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-bold">4.7/5</span> from 2,000+ reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center items-center">
              <div className="relative w-full h-[500px] group">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-sky-300 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/90 to-sky-600/90 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-56 h-56 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                        <svg
                          className="w-32 h-32 text-sky-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                    
                      <p className="text-sky-100 text-lg">
                        Start earning in 3 simple steps
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Features Section */}
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-900 md:text-6xl mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                  Us?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive services to help you succeed in the
                vacation rental market
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...leftFeatures, ...rightFeatures].map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Banner Section */}
          <div className="w-full max-w-7xl">
            <div className="relative p-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
              <div className="relative z-10 text-center text-white space-y-6">
                <h2 className="text-4xl md:text-5xl font-black">
                  Create a Professional
                  <br />
                  Listing for Your Rental Space
                </h2>
                <p className="text-xl text-sky-100 max-w-3xl mx-auto">
                  Our expert team will transform your property into an
                  irresistible listing that attracts premium guests
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                    <div className="text-3xl font-bold">4K</div>
                    <div className="text-sm text-sky-100">Photo Quality</div>
                  </div>
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-sky-100">Support</div>
                  </div>
                  <div className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm text-sky-100">Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                3 Easy{" "}
                <span className="text-sky-600">Steps</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our simple process gets you started in minutes
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {howItWorks.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-xl p-8 hover:border-sky-300 hover:shadow-sm transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="mb-6 flex items-center justify-start">
                        <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors duration-200">
                          <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscription Plans Section */}
          <div className="w-full max-w-7xl">
            <header className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full border border-sky-200 mb-6">
                <span className="text-sm font-semibold text-sky-600">
                  💎 Save up to 30% with annual plans
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Flexible pricing that scales with your property portfolio
              </p>
            </header>
            <section className="overflow-visible">
              <div className="grid lg:grid-cols-3 gap-8">
                {subscriptionPlans.map((plan) => (
                  <PlanCard key={plan.id} {...plan} />
                ))}
              </div>
              <div className="text-center mt-12 p-8 bg-gradient-to-r from-sky-50 to-sky-100 rounded-2xl border-2 border-sky-200">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  🎉 Special Offer: Get 2 months free with annual plans!
                </p>
                <p className="text-gray-600">
                  Need a custom plan?{" "}
                  <Link
                    href="#"
                    className="text-sky-600 hover:text-sky-600 font-bold underline"
                  >
                    Contact our sales team
                  </Link>
                </p>
              </div>
            </section>
          </div>

          {/* Stats Section */}
          <div className="w-full max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted by{" "}
                <span className="text-sky-600">Thousands</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a thriving community of successful property owners worldwide
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-xl p-8 hover:border-sky-200 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors duration-200">
                          <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 border-t border-gray-100"></div>
                      </div>
                      <div className="mb-3">
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <h3 className="text-base font-medium text-gray-500 uppercase tracking-wide">
                          {stat.label}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-7xl">
            <div className="relative p-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
              <div className="relative z-10 text-center text-white space-y-8">
                <h2 className="text-4xl md:text-5xl font-black">
                  Ready to Start Earning?
                </h2>
                <p className="text-xl text-sky-100 max-w-2xl mx-auto">
                  Join thousands of successful hosts and transform your property
                  into a profitable business today
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-10 py-5 bg-white text-sky-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                    🚀 Get Started Now
                  </button>
                  <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-sky-600 transition-all duration-300">
                    📞 Talk to Sales
                  </button>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

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

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default EnhancedSubscriptionPage;
