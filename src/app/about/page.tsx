"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Building2,
  Globe,
  Award,
  Lightbulb,
  Target,
  Home,
  Users,
  Star,
  MessageCircle,
  CheckCircle2,
  Shield,
  DollarSign,
  Sparkles,
  Palette,
  Handshake,
  Zap,
  Plane,
  Waves,
  TrendingUp,
  Leaf,
  Eye,
  HeartHandshake,
  ArrowRight,
  Phone,
  Search,
} from "lucide-react";

// Types
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Achievement {
  number: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

// Icon Components
const TrustIcon = () => (
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

const InnovationIcon = () => (
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
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const ExcellenceIcon = () => (
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
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const CommunityIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const SustainabilityIcon = () => (
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
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TransparencyIcon = () => (
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
const companyValues: Value[] = [
  {
    title: "Trust & Reliability",
    description:
      "We build lasting relationships through consistent, dependable service and transparent communication with every guest and host.",
    icon: <TrustIcon />,
  },
  {
    title: "Innovation",
    description:
      "We continuously evolve our platform with cutting-edge technology to provide the best vacation rental experience.",
    icon: <InnovationIcon />,
  },
  {
    title: "Excellence",
    description:
      "We maintain the highest standards in property quality, customer service, and overall guest satisfaction.",
    icon: <ExcellenceIcon />,
  },
  {
    title: "Community First",
    description:
      "We foster a vibrant community of hosts and travelers, creating meaningful connections worldwide.",
    icon: <CommunityIcon />,
  },
  {
    title: "Sustainability",
    description:
      "We're committed to responsible tourism and eco-friendly practices that protect our beautiful destinations.",
    icon: <SustainabilityIcon />,
  },
  {
    title: "Transparency",
    description:
      "We believe in honest, clear communication with no hidden fees or surprises throughout your journey.",
    icon: <TransparencyIcon />,
  },
];

const milestones: Milestone[] = [
  {
    year: "2018",
    title: "Founded with a Vision",
    description:
      "HolidaysEra was born from a passion to revolutionize vacation rentals and create unforgettable travel experiences.",
    icon: Rocket,
  },
  {
    year: "2019",
    title: "1,000 Properties",
    description:
      "Reached our first major milestone with 1,000 premium properties across Europe and Asia.",
    icon: Building2,
  },
  {
    year: "2020",
    title: "Global Expansion",
    description:
      "Expanded to United States and introduced 24/7 multilingual customer support.",
    icon: Globe,
  },
  {
    year: "2021",
    title: "Award Recognition",
    description:
      "Received 'Best Vacation Rental Platform' award and achieved 4.7/5 customer satisfaction.",
    icon: Award,
  },
  {
    year: "2022",
    title: "Technology Innovation",
    description:
      "Launched AI-powered matching system and mobile app with instant booking capabilities.",
    icon: Lightbulb,
  },
  {
    year: "2023",
    title: "5,500+ Properties",
    description:
      "Reached 5,500+ properties and 1.2 million happy guests with sustainable tourism initiatives.",
    icon: Target,
  },
  {
    year: "2024",
    title: "Future Forward",
    description:
      "Expanding to new markets with enhanced features and commitment to exceptional experiences.",
    icon: Sparkles,
  },
];

const achievements: Achievement[] = [
  {
    number: "5,500+",
    label: "Premium Properties",
    description: "Carefully curated vacation rentals",
    icon: Home,
  },
  {
    number: "1.2M+",
    label: "Happy Guests",
    description: "Satisfied travelers worldwide",
    icon: Users,
  },
  {
    number: "25+",
    label: "Countries",
    description: "Global presence and growing",
    icon: Globe,
  },
  {
    number: "4.7/5",
    label: "Rating",
    description: "From verified guest reviews",
    icon: Star,
  },
  {
    number: "24/7",
    label: "Support",
    description: "Always here to help you",
    icon: MessageCircle,
  },
  {
    number: "95%",
    label: "Satisfaction",
    description: "Guest satisfaction rate",
    icon: CheckCircle2,
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "Chief Executive Officer",
    bio: "Visionary leader with 15+ years in hospitality and technology innovation.",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    bio: "Tech expert passionate about creating seamless digital experiences.",
  },
  {
    name: "Emma Williams",
    role: "Head of Operations",
    bio: "Operations specialist ensuring excellence in every guest interaction.",
  },
  {
    name: "David Martinez",
    role: "Customer Experience Director",
    bio: "Dedicated to creating memorable moments for every traveler.",
  },
  {
    name: "Lisa Anderson",
    role: "Head of Marketing",
    bio: "Creative strategist connecting amazing properties with dream vacations.",
  },
  {
    name: "James Brown",
    role: "Property Relations Manager",
    bio: "Building strong partnerships with hosts across the globe.",
  },
];

// Components
const ValueCard: React.FC<Value> = ({ title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-sky-300 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    <div className="relative">
      <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-100 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-sky-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  </motion.div>
);

const MilestoneCard: React.FC<Milestone & { index: number }> = ({
  year,
  title,
  description,
  icon: IconComponent,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`flex gap-8 items-start ${
      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
    }`}
  >
    <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
      <div className="inline-block p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300">
        <div className="text-sm font-semibold text-sky-600 mb-2">{year}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <div className="relative flex flex-col items-center">
      <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-lg z-10 hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-8 h-8" strokeWidth={1.5} />
      </div>
      {index < milestones.length - 1 && (
        <div className="absolute top-16 w-0.5 h-24 bg-sky-200" />
      )}
    </div>
    <div className="flex-1" />
  </motion.div>
);

const AchievementCard: React.FC<Achievement> = ({
  number,
  label,
  description,
  icon: IconComponent,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-sky-300 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="absolute inset-0 bg-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    <div className="relative">
      <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-4 group-hover:bg-sky-100 group-hover:scale-110 transition-all duration-300">
        <IconComponent className="w-7 h-7" strokeWidth={1.5} />
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{number}</div>
      <div className="text-lg font-semibold text-sky-600 mb-2">{label}</div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);



const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-sky-50">
      {/* Subtle Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-sky-100/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-sky-100/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full border border-sky-200 mb-6"
            >
              <span className="w-2 h-2 bg-sky-600 rounded-full" />
              <span className="text-sm font-semibold text-sky-600">
                Established 2018 • Trusted by Millions
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              About{" "}
              <span className="text-sky-600">HolidaysEra</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Transforming the way people experience vacation rentals through
              innovation, trust, and exceptional service since 2018.
            </motion.p>
          </div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-700">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            </div>
            <div className="relative h-full flex items-center justify-center text-white p-12">
              <div className="text-center space-y-8">
                <div className="flex justify-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center"
                  >
                    <Waves className="w-10 h-10" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -12 }}
                    transition={{ delay: 0.1 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center"
                  >
                    <Home className="w-10 h-10" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center"
                  >
                    <Plane className="w-10 h-10" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Your Dream Vacation Starts Here
                </h2>
                <p className="text-lg text-sky-100 max-w-2xl mx-auto">
                  We connect travelers with extraordinary properties and create
                  unforgettable memories around the world.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("mission")}
                className={`flex-1 py-6 px-8 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "mission"
                    ? "bg-sky-600 text-white"
                    : "text-gray-600 hover:text-sky-600 hover:bg-gray-50"
                }`}
              >
                <Target className="w-5 h-5" />
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab("vision")}
                className={`flex-1 py-6 px-8 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "vision"
                    ? "bg-sky-600 text-white"
                    : "text-gray-600 hover:text-sky-600 hover:bg-gray-50"
                }`}
              >
                <Eye className="w-5 h-5" />
                Our Vision
              </button>
            </div>
            <div className="p-12">
              {activeTab === "mission" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Empowering Memorable Journeys
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Our mission is to revolutionize the vacation rental industry
                    by providing a seamless, trustworthy platform that connects
                    property owners with travelers seeking authentic,
                    comfortable, and memorable experiences.
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We strive to make every vacation special by offering premium
                    properties, exceptional customer service, and innovative
                    technology that simplifies the booking process while
                    maintaining the highest standards of quality and safety.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 pt-8">
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Palette className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Quality First
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Premium properties vetted for excellence
                      </p>
                    </div>
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Handshake className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Trust & Safety
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Secure bookings with verified hosts
                      </p>
                    </div>
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Exceptional Service
                      </h4>
                      <p className="text-gray-600 text-sm">
                        24/7 support for peace of mind
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Building the Future of Travel
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We envision a world where every traveler finds their perfect
                    home away from home, and every property owner maximizes
                    their rental potential through our innovative platform and
                    supportive community.
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Our vision extends beyond transactions – we're creating a
                    global community of hosts and guests who share meaningful
                    experiences, respect local cultures, and contribute to
                    sustainable tourism practices worldwide.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 pt-8">
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Global Reach
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Expanding to 100+ countries by 2025
                      </p>
                    </div>
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Rocket className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Innovation
                      </h4>
                      <p className="text-gray-600 text-sm">
                        AI-powered matching & smart booking
                      </p>
                    </div>
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-3">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Sustainability
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Carbon-neutral operations by 2026
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Company Values Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core{" "}
              <span className="text-sky-600">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and define who we are as a
              company
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* Our Journey Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our{" "}
              <span className="text-sky-600">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to a global platform - here's how we've grown
            </p>
          </div>
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} {...milestone} index={index} />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              By the{" "}
              <span className="text-sky-600">Numbers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our achievements reflect our commitment to excellence and growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </div>
        </div>



        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-24"
        >
          <div className="relative p-12 bg-sky-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose HolidaysEra?
              </h2>
              <p className="text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
                We're not just a booking platform – we're your partner in
                creating unforgettable vacation experiences with personalized
                service, verified properties, and unwavering commitment to your
                satisfaction.
              </p>
              <div className="grid md:grid-cols-4 gap-6 pt-8">
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-xl font-semibold mb-2">Award Winning</div>
                  <p className="text-sky-100 text-sm">Recognized excellence</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-xl font-semibold mb-2">Secure Platform</div>
                  <p className="text-sky-100 text-sm">Your data protected</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="text-xl font-semibold mb-2">Best Value</div>
                  <p className="text-sky-100 text-sm">No hidden fees</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <Star className="w-6 h-6 fill-white" />
                  </div>
                  <div className="text-xl font-semibold mb-2">Top Rated</div>
                  <p className="text-sky-100 text-sm">4.7/5 rating</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border border-gray-200">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Join Our{" "}
              <span className="text-sky-600">Community?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Whether you're looking to list your property or find your perfect
              vacation rental, we're here to help you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold text-base shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                List Your Property
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-base border border-gray-300 hover:border-sky-600 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Search className="w-5 h-5" />
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-base border border-gray-300 hover:border-sky-600 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              Join 5,500+ property owners and 1.2 million happy guests worldwide
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AboutPage;
