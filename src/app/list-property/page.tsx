"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  Building,
  LogIn,
  Gem,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Rocket,
  Camera,
  CheckCircle2,
  UserCheck,
  Megaphone,
  Settings,
  Check,
  Info,
  Lock,
  Star,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  Zap,
  Shield,
  Clock,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Types
interface PropertyLimit {
  plan: string;
  properties: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Data
const propertyLimits: PropertyLimit[] = [
  {
    plan: "Action Plan",
    properties: "1 Property",
    icon: Home,
    color: "blue",
  },
  {
    plan: "Game Plan",
    properties: "Up to 3 Properties",
    icon: Building2,
    color: "indigo",
  },
  {
    plan: "Master Plan",
    properties: "Up to 5 Properties",
    icon: Building,
    color: "purple",
  },
];

const listingSteps: Step[] = [
  {
    number: 1,
    title: "Login as Owner",
    description:
      "Sign in to your owner account or create one if you're new to Holiday Sera",
    icon: LogIn,
  },
  {
    number: 2,
    title: "Choose Your Subscription",
    description:
      "Select a plan that matches your property portfolio and business goals",
    icon: Gem,
  },
  {
    number: 3,
    title: "Add Property Details",
    description:
      "Fill in property information, amenities, pricing, and availability",
    icon: FileText,
  },
  {
    number: 4,
    title: "Upload Photos & Videos",
    description:
      "Showcase your property with high-quality images and virtual tours",
    icon: ImageIcon,
  },
  {
    number: 5,
    title: "Set Your Rates",
    description: "Configure pricing, seasonal rates, and special offers",
    icon: DollarSign,
  },
  {
    number: 6,
    title: "Go Live",
    description: "Review and publish your listing to start receiving bookings",
    icon: Rocket,
  },
];

const benefits: Benefit[] = [
  {
    title: "Professional Photography",
    description:
      "Get stunning HD photos of your property included with your subscription",
    icon: Camera,
  },
  {
    title: "No Commission Fees",
    description:
      "Keep 100% of your earnings - we only charge the subscription fee",
    icon: CheckCircle2,
  },
  {
    title: "Guaranteed Bookings",
    description:
      "Receive guaranteed reservations based on your subscription plan",
    icon: CheckCircle2,
  },
  {
    title: "Account Manager",
    description: "Get dedicated support from your personal account manager",
    icon: UserCheck,
  },
  {
    title: "Marketing Support",
    description:
      "Benefit from our social media campaigns and promotional activities",
    icon: Megaphone,
  },
  {
    title: "Easy Management",
    description: "Manage multiple properties from one dashboard with ease",
    icon: Settings,
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Property Owner, Paris",
    image: "SJ",
    rating: 5,
    text: "Holiday Sera transformed my rental business. The professional photography and marketing support helped me increase bookings by 300%!",
  },
  {
    name: "Michael Chen",
    role: "Multi-Property Owner, Tokyo",
    image: "MC",
    rating: 5,
    text: "Managing 5 properties has never been easier. The dashboard is intuitive and the guaranteed bookings give me peace of mind.",
  },
  {
    name: "Emma Williams",
    role: "Villa Owner, Bali",
    image: "EW",
    rating: 5,
    text: "The account manager support is exceptional. They helped optimize my listing and I'm now getting premium guests consistently.",
  },
];

const stats = [
  { value: "5,500+", label: "Active Properties", icon: Building2 },
  { value: "95%", label: "Success Rate", icon: TrendingUp },
  { value: "1.2M+", label: "Happy Guests", icon: Users },
  { value: "25+", label: "Countries", icon: Award },
];

const faqs: FAQ[] = [
  {
    question: "How quickly can I list my property?",
    answer:
      "Once you create an owner account and choose a subscription plan, you can list your property within 24 hours. Our team will help with professional photography and listing optimization.",
  },
  {
    question: "What makes Holiday Sera different from other platforms?",
    answer:
      "We offer guaranteed bookings, no commission fees, professional photography, and dedicated account managers. You keep 100% of your earnings and only pay a fixed subscription fee.",
  },
  {
    question: "Can I manage multiple properties?",
    answer:
      "Yes! Depending on your subscription plan, you can manage 1-5 properties. The Master Plan allows up to 5 properties with premium features and priority support.",
  },
  {
    question: "What kind of support do I get?",
    answer:
      "All plans include 24/7 customer support, marketing assistance, and professional photography. Higher-tier plans include dedicated account managers and priority support.",
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
  const { user } = useUserStore();
  const isAuthenticated = !!user;
  const isOwner = user?.role === "Owner";
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleListPropertyClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!isOwner) {
      alert("Please log in with an Owner account to list properties");
      return;
    }

    router.push("/add-listing");
  };

  const handleLogin = (role: string) => {
    router.push(`/login?role=${role}&redirect=/add-listing`);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Premium Background with Grid Pattern */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-50" />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Gradient Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-sky-200/30 to-sky-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/30 to-sky-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto mb-32 text-center relative"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200/50 rounded-full mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-semibold text-sky-600">
              Trusted by 5,500+ Property Owners Worldwide
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Turn Your Property Into
            <br />
            <span className="text-sky-600">
              Passive Income
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Join the leading platform for vacation rentals. Get professional support,
            guaranteed bookings, and keep 100% of your earnings.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleListPropertyClick}
              className="group relative px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Listing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-sky-700"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/subscriptions"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-sky-600 transition-all duration-300 inline-flex items-center gap-2 hover:shadow-xl"
              >
                View Plans
                <Gem className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No Commission Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Professional Photography</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Guaranteed Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Auth Notice - Only show if not logged in or not an Owner */}
        {(!isAuthenticated || !isOwner) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-24"
          >
            <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-grid-amber opacity-5" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Owner Account Required
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm">
                    {!isAuthenticated
                      ? "To list properties, you must be logged in with an Owner account. Please sign in or create a new Owner account."
                      : "You are currently logged in as a Traveller. To list properties, please log out and sign in as an Owner, or create a new Owner account."}
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLogin("Owner")}
                      className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-medium text-sm hover:bg-sky-700 transition-colors"
                    >
                      Login as Owner
                    </motion.button>
                    <Link
                      href="/signup?role=Owner"
                      className="px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm border border-gray-300 hover:border-sky-600 transition-colors"
                    >
                      Create Owner Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 group-hover:border-sky-300 transition-all duration-300">
                    <IconComponent className="w-10 h-10 text-sky-600 mb-4" />
                    <div className="text-4xl font-bold text-sky-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-600">Why Choose Us</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              Everything You{" "}
              <span className="text-sky-600">
                Need
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Premium features included with every subscription
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:border-sky-300 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* How It Works - Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-6"
            >
              <Rocket className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-600">Simple Process</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              How to{" "}
              <span className="text-sky-600">
                Get Started
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Follow these simple steps to list your property
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {listingSteps.map((step, index) => {
              const IconComponent = step.icon;
              const row = Math.floor(index / 3);
              const col = index % 3;
              const isSkyBackground = (row + col) % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                    isSkyBackground
                      ? "bg-sky-600 text-white"
                      : "bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-start">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSkyBackground
                            ? "bg-white/20 text-white"
                            : "bg-sky-50 text-sky-600"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 leading-tight ${
                          isSkyBackground ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          isSkyBackground ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Property Limits */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              Choose Your{" "}
              <span className="text-sky-600">
                Plan
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Different subscription plans allow you to list multiple properties
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {propertyLimits.map((limit, index) => {
              const IconComponent = limit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 group-hover:border-sky-300 transition-all duration-300 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-10 h-10 text-sky-600" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {limit.plan}
                    </h3>
                    <div className="inline-flex items-center px-4 py-2 bg-sky-50 rounded-lg mb-4">
                      <span className="text-xl font-bold text-sky-600">
                        {limit.properties}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Perfect for{" "}
                      {index === 0 ? "single" : index === 1 ? "small" : "large"}{" "}
                      property portfolios
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 text-sky-600 font-medium text-base hover:text-sky-700 transition-colors group"
            >
              Compare all subscription features
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-6"
            >
              <HeartHandshake className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-600">Testimonials</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              Loved by{" "}
              <span className="text-sky-600">
                Thousands
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              See what our property owners say about their experience
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                  <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl group-hover:border-sky-300 transition-all duration-300">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Requirements */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-32"
        >
          <div className="relative p-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-sky-50/50" />
            <div className="relative max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 mb-8 text-center"
              >
                What You'll Need
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-sky-600" strokeWidth={2.5} />
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">{req}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              Frequently Asked{" "}
              <span className="text-sky-600">
                Questions
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600"
            >
              Everything you need to know about listing your property
            </motion.p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-sky-50/50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                      openFaqIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaqIndex === index ? "auto" : 0,
                    opacity: openFaqIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-20"
        >
          <div className="relative p-16 bg-sky-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <div className="relative z-10 text-center text-white space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-bold mb-4"
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                {isOwner
                  ? "Start adding your properties and reach millions of travelers worldwide"
                  : "Login as an owner to start adding your properties and reach millions of travelers worldwide"}
              </motion.p>
              {(!isAuthenticated || !isOwner) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap justify-center gap-4 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLogin("Owner")}
                    className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors shadow-xl"
                  >
                    Login as Owner
                  </motion.button>
                  <Link
                    href="/signup?role=Owner"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white hover:text-sky-600 transition-colors"
                  >
                    Create Owner Account
                  </Link>
                </motion.div>
              )}
              {isOwner && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap justify-center gap-4 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleListPropertyClick}
                    className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors shadow-xl"
                  >
                    List Your Property Now
                  </motion.button>
                  <Link
                    href="/subscriptions"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white hover:text-sky-600 transition-colors"
                  >
                    View Subscription Plans
                  </Link>
                </motion.div>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sm text-white/80 pt-4"
              >
                Have questions?{" "}
                <Link href="/contact" className="underline hover:text-white">
                  Contact our team
                </Link>{" "}
                for assistance
              </motion.p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-sky-600" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600 text-sm">
                Please log in with an Owner account to list properties
              </p>
            </div>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLogin("Owner")}
                className="w-full py-3 px-6 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 hover:shadow-lg transition-all"
              >
                Login as Owner
              </motion.button>
              <Link
                href="/signup?role=Owner"
                className="block w-full py-3 px-6 bg-white text-gray-900 rounded-xl font-semibold border border-gray-300 hover:border-sky-600 transition-colors text-center"
              >
                Create Owner Account
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ListPropertyPage;
