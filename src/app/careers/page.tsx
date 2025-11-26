"use client";

import React, { useState } from "react";
import Link from "next/link";

// Types
interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Department {
  name: string;
  icon: string;
  openings: number;
  description: string;
}

// Icon Components
const HealthIcon = () => (
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
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const VacationIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const FlexibleIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const EquityIcon = () => (
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

const LearningIcon = () => (
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
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

// Data
const benefits: Benefit[] = [
  {
    title: "Health & Wellness",
    description:
      "Comprehensive medical, dental, and vision coverage for you and your family",
    icon: <HealthIcon />,
  },
  {
    title: "Unlimited PTO",
    description:
      "Take time off when you need it with our flexible vacation policy",
    icon: <VacationIcon />,
  },
  {
    title: "Career Growth",
    description: "Professional development budget and mentorship programs",
    icon: <GrowthIcon />,
  },
  {
    title: "Flexible Work",
    description:
      "Remote-first culture with flexible hours and work-from-anywhere options",
    icon: <FlexibleIcon />,
  },
  {
    title: "Competitive Salary",
    description: "Industry-leading compensation packages with equity options",
    icon: <EquityIcon />,
  },
  {
    title: "Learning Budget",
    description:
      "Annual stipend for courses, conferences, and skill development",
    icon: <LearningIcon />,
  },
];

const departments: Department[] = [
  {
    name: "Engineering",
    icon: "💻",
    openings: 8,
    description: "Build innovative solutions",
  },
  {
    name: "Product",
    icon: "🎨",
    openings: 4,
    description: "Shape user experiences",
  },
  { name: "Marketing", icon: "📢", openings: 5, description: "Tell our story" },
  { name: "Sales", icon: "💼", openings: 6, description: "Drive growth" },
  {
    name: "Customer Success",
    icon: "💬",
    openings: 7,
    description: "Delight customers",
  },
  {
    name: "Operations",
    icon: "⚙️",
    openings: 3,
    description: "Power our business",
  },
];

const jobPositions: JobPosition[] = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    experience: "5+ years",
    description:
      "Join our engineering team to build scalable solutions for millions of users. Work with React, Node.js, and modern cloud infrastructure.",
    requirements: [
      "5+ years of full-stack development experience",
      "Expert knowledge of React, TypeScript, and Node.js",
      "Experience with cloud platforms (AWS/GCP)",
      "Strong problem-solving and communication skills",
      "Previous experience in high-growth startups preferred",
    ],
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Product",
    location: "Remote / New York",
    type: "Full-time",
    experience: "3+ years",
    description:
      "Design beautiful, intuitive experiences for our platform. Own the design process from research to execution.",
    requirements: [
      "3+ years of product design experience",
      "Strong portfolio demonstrating UI/UX skills",
      "Proficiency in Figma and design systems",
      "Experience with user research and testing",
      "Excellent communication and collaboration skills",
    ],
  },
  {
    id: "3",
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote / London",
    type: "Full-time",
    experience: "4+ years",
    description:
      "Create compelling content that engages our audience and drives growth. Lead our content strategy across all channels.",
    requirements: [
      "4+ years in content marketing or similar role",
      "Excellent writing and storytelling skills",
      "Experience with SEO and content analytics",
      "Knowledge of travel/hospitality industry preferred",
      "Strong project management abilities",
    ],
  },
  {
    id: "4",
    title: "Customer Success Specialist",
    department: "Customer Success",
    location: "Remote / Multiple Locations",
    type: "Full-time",
    experience: "2+ years",
    description:
      "Be the voice of our customers. Help hosts and guests succeed on our platform with exceptional support.",
    requirements: [
      "2+ years in customer success or support",
      "Excellent communication and empathy skills",
      "Experience with CRM tools (Zendesk, Salesforce)",
      "Multilingual abilities a plus",
      "Problem-solving mindset with positive attitude",
    ],
  },
  {
    id: "5",
    title: "Data Scientist",
    department: "Engineering",
    location: "Remote / Boston",
    type: "Full-time",
    experience: "4+ years",
    description:
      "Drive data-driven decision making across the company. Build ML models to optimize pricing, matching, and user experience.",
    requirements: [
      "4+ years in data science or analytics",
      "Strong Python and SQL skills",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Statistical modeling and A/B testing expertise",
      "PhD or Master's degree preferred",
    ],
  },
  {
    id: "6",
    title: "Sales Development Representative",
    department: "Sales",
    location: "Remote / Chicago",
    type: "Full-time",
    experience: "1+ years",
    description:
      "Generate new business opportunities and build relationships with property owners. First step to a sales career.",
    requirements: [
      "1+ years in sales or business development",
      "Excellent communication and presentation skills",
      "Self-motivated and target-driven",
      "CRM experience preferred",
      "Bachelor's degree required",
    ],
  },
];

const CareersPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filteredJobs =
    selectedDepartment === "All"
      ? jobPositions
      : jobPositions.filter((job) => job.department === selectedDepartment);

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
              We're Hiring! Join Our Growing Team
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Build Your Career at{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Holiday Sera
            </span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Join a passionate team revolutionizing vacation rentals. We're
            looking for talented individuals who want to make a real impact.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              🚀 View Open Positions
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
              📖 Our Culture
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">150+</div>
              <div className="text-gray-600 font-semibold">Team Members</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-indigo-100">
              <div className="text-4xl font-black text-indigo-600 mb-2">
                30+
              </div>
              <div className="text-gray-600 font-semibold">Open Positions</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-purple-100">
              <div className="text-4xl font-black text-purple-600 mb-2">25</div>
              <div className="text-gray-600 font-semibold">Countries</div>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
              <div className="text-4xl font-black text-blue-600 mb-2">4.8★</div>
              <div className="text-gray-600 font-semibold">
                Glassdoor Rating
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Why Work{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                With Us?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We invest in our people with competitive benefits and a culture
              that values growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Explore{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Departments
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect role across our diverse teams
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <button
                key={index}
                onClick={() => setSelectedDepartment(dept.name)}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedDepartment === dept.name
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-600 text-white shadow-xl scale-105"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <div className="text-5xl mb-4">{dept.icon}</div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    selectedDepartment === dept.name
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {dept.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    selectedDepartment === dept.name
                      ? "text-blue-100"
                      : "text-gray-600"
                  }`}
                >
                  {dept.description}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                    selectedDepartment === dept.name
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {dept.openings} Open Positions
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-black text-gray-900">
              Open{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Positions
              </span>
            </h2>
            <button
              onClick={() => setSelectedDepartment("All")}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all duration-300"
            >
              Show All ({jobPositions.length})
            </button>
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {job.department}
                        </span>
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          📍 {job.location}
                        </span>
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          ⏰ {job.type}
                        </span>
                        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          💼 {job.experience}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedJobId(
                          selectedJobId === job.id ? null : job.id
                        )
                      }
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      {selectedJobId === job.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>

                  <p className="text-gray-600 text-lg mb-6">
                    {job.description}
                  </p>

                  {selectedJobId === job.id && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-xl animate-fadeIn">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        Requirements:
                      </h4>
                      <ul className="space-y-3">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                              ✓
                            </span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex gap-4">
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                          Apply Now
                        </button>
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-gray-300 hover:border-blue-600 transition-all duration-300">
                          Share Job
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-5xl font-black mb-4">Our Culture</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                We believe in creating an environment where everyone can do
                their best work and grow professionally while maintaining
                work-life balance.
              </p>
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-2">Mission Driven</h3>
                  <p className="text-blue-100">Work with purpose and impact</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-2xl font-bold mb-2">Collaborative</h3>
                  <p className="text-blue-100">Great things happen together</p>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold mb-2">Fast-Paced</h3>
                  <p className="text-blue-100">
                    Move fast and make things happen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              We're always looking for talented people. Send us your resume and
              let us know how you'd like to contribute to Holiday Sera.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                📧 Send General Application
              </button>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                💬 Talk to Recruiting
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              We're an equal opportunity employer committed to diversity and
              inclusion
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default CareersPage;
