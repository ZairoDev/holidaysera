"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
  icon: string;
}

interface Achievement {
  number: string;
  label: string;
  description: string;
  icon: string;
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
      "Holiday Sera was born from a passion to revolutionize vacation rentals and create unforgettable travel experiences.",
    icon: "🚀",
  },
  {
    year: "2019",
    title: "1,000 Properties",
    description:
      "Reached our first major milestone with 1,000 premium properties across Europe and Asia.",
    icon: "🏘️",
  },
  {
    year: "2020",
    title: "Global Expansion",
    description:
      "Expanded to United States and introduced 24/7 multilingual customer support.",
    icon: "🌍",
  },
  {
    year: "2021",
    title: "Award Recognition",
    description:
      "Received 'Best Vacation Rental Platform' award and achieved 4.9/5 customer satisfaction.",
    icon: "🏆",
  },
  {
    year: "2022",
    title: "Technology Innovation",
    description:
      "Launched AI-powered matching system and mobile app with instant booking capabilities.",
    icon: "💡",
  },
  {
    year: "2023",
    title: "4,500+ Properties",
    description:
      "Reached 4,500+ properties and 2 million happy guests with sustainable tourism initiatives.",
    icon: "🎯",
  },
  {
    year: "2024",
    title: "Future Forward",
    description:
      "Expanding to new markets with enhanced features and commitment to exceptional experiences.",
    icon: "✨",
  },
];

const achievements: Achievement[] = [
  {
    number: "4,500+",
    label: "Premium Properties",
    description: "Carefully curated vacation rentals",
    icon: "🏠",
  },
  {
    number: "2M+",
    label: "Happy Guests",
    description: "Satisfied travelers worldwide",
    icon: "😊",
  },
  {
    number: "50+",
    label: "Countries",
    description: "Global presence and growing",
    icon: "🌎",
  },
  {
    number: "4.9/5",
    label: "Rating",
    description: "From verified guest reviews",
    icon: "⭐",
  },
  {
    number: "24/7",
    label: "Support",
    description: "Always here to help you",
    icon: "💬",
  },
  {
    number: "98%",
    label: "Satisfaction",
    description: "Guest satisfaction rate",
    icon: "💯",
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
  <div className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const MilestoneCard: React.FC<Milestone & { index: number }> = ({
  year,
  title,
  description,
  icon,
  index,
}) => (
  <div
    className={`flex gap-8 items-start ${
      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
    }`}
  >
    <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
      <div className="inline-block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="text-sm font-bold text-blue-600 mb-2">{year}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
    <div className="relative flex flex-col items-center">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-xl z-10 hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      {index < milestones.length - 1 && (
        <div className="absolute top-20 w-1 h-32 bg-gradient-to-b from-blue-400 to-indigo-400" />
      )}
    </div>
    <div className="flex-1" />
  </div>
);

const AchievementCard: React.FC<Achievement> = ({
  number,
  label,
  description,
  icon,
}) => (
  <div className="group p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="text-5xl font-black text-gray-900 mb-2">{number}</div>
    <div className="text-xl font-bold text-blue-600 mb-2">{label}</div>
    <p className="text-gray-600">{description}</p>
  </div>
);



const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-blue-700">
                Established 2018 • Trusted by Millions
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Holiday Sera
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Transforming the way people experience vacation rentals through
              innovation, trust, and exceptional service since 2018.
            </p>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            </div>
            <div className="relative h-full flex items-center justify-center text-white p-12">
              <div className="text-center space-y-8">
                <div className="flex justify-center gap-4">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    🏖️
                  </div>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 animation-delay-100">
                    🏡
                  </div>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animation-delay-200">
                    ✈️
                  </div>
                </div>
                <h2 className="text-5xl font-black mb-4">
                  Your Dream Vacation Starts Here
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  We connect travelers with extraordinary properties and create
                  unforgettable memories around the world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("mission")}
                className={`flex-1 py-6 px-8 text-xl font-bold transition-all duration-300 ${
                  activeTab === "mission"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                🎯 Our Mission
              </button>
              <button
                onClick={() => setActiveTab("vision")}
                className={`flex-1 py-6 px-8 text-xl font-bold transition-all duration-300 ${
                  activeTab === "vision"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                🔮 Our Vision
              </button>
            </div>
            <div className="p-12">
              {activeTab === "mission" ? (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-4xl font-black text-gray-900 mb-4">
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
                    <div className="p-6 bg-blue-50 rounded-2xl">
                      <div className="text-4xl mb-3">🎨</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Quality First
                      </h4>
                      <p className="text-gray-600">
                        Premium properties vetted for excellence
                      </p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl">
                      <div className="text-4xl mb-3">🤝</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Trust & Safety
                      </h4>
                      <p className="text-gray-600">
                        Secure bookings with verified hosts
                      </p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl">
                      <div className="text-4xl mb-3">💫</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Exceptional Service
                      </h4>
                      <p className="text-gray-600">
                        24/7 support for peace of mind
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-4xl font-black text-gray-900 mb-4">
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
                    <div className="p-6 bg-blue-50 rounded-2xl">
                      <div className="text-4xl mb-3">🌍</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Global Reach
                      </h4>
                      <p className="text-gray-600">
                        Expanding to 100+ countries by 2025
                      </p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl">
                      <div className="text-4xl mb-3">🚀</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Innovation
                      </h4>
                      <p className="text-gray-600">
                        AI-powered matching & smart booking
                      </p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl">
                      <div className="text-4xl mb-3">🌱</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Sustainability
                      </h4>
                      <p className="text-gray-600">
                        Carbon-neutral operations by 2026
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Values Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Our Core{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Values
              </span>
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
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Journey
              </span>
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
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              By the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Numbers
              </span>
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
        <div className="max-w-7xl mx-auto mb-24">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-5xl font-black mb-4">
                Why Choose Holiday Sera?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                We're not just a booking platform – we're your partner in
                creating unforgettable vacation experiences with personalized
                service, verified properties, and unwavering commitment to your
                satisfaction.
              </p>
              <div className="grid md:grid-cols-4 gap-6 pt-8">
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">🏆</div>
                  <div className="text-2xl font-bold mb-2">Award Winning</div>
                  <p className="text-blue-100 text-sm">Recognized excellence</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">🔒</div>
                  <div className="text-2xl font-bold mb-2">Secure Platform</div>
                  <p className="text-blue-100 text-sm">Your data protected</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">💰</div>
                  <div className="text-2xl font-bold mb-2">Best Value</div>
                  <p className="text-blue-100 text-sm">No hidden fees</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">🌟</div>
                  <div className="text-2xl font-bold mb-2">Top Rated</div>
                  <p className="text-blue-100 text-sm">4.9/5 rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Ready to Join Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Community?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Whether you're looking to list your property or find your perfect
              vacation rental, we're here to help you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                🏠 List Your Property
              </button>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                🔍 Browse Properties
              </button>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                📞 Contact Us
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              Join 4,500+ property owners and 2 million happy guests worldwide
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          animation: fadeIn 0.5s ease-out;
        }

        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
