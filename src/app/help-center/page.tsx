"use client";

import React, { useState } from "react";
import Link from "next/link";

// Types
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  title: string;
  description: string;
  icon: string;
  articleCount: number;
  slug: string;
}

interface PopularArticle {
  title: string;
  category: string;
  views: string;
}

// Data
const helpCategories: HelpCategory[] = [
  {
    title: "Getting Started",
    description: "Learn the basics of using Holiday Sera",
    icon: "🚀",
    articleCount: 15,
    slug: "getting-started",
  },
  {
    title: "Booking & Reservations",
    description: "Everything about making and managing bookings",
    icon: "📅",
    articleCount: 24,
    slug: "booking",
  },
  {
    title: "Payments & Pricing",
    description: "Payment methods, refunds, and pricing info",
    icon: "💳",
    articleCount: 18,
    slug: "payments",
  },
  {
    title: "Account & Profile",
    description: "Manage your account settings and profile",
    icon: "👤",
    articleCount: 12,
    slug: "account",
  },
  {
    title: "Host Resources",
    description: "Tools and guides for property owners",
    icon: "🏠",
    articleCount: 32,
    slug: "hosting",
  },
  {
    title: "Safety & Trust",
    description: "Security features and safety guidelines",
    icon: "🛡️",
    articleCount: 20,
    slug: "safety",
  },
  {
    title: "Cancellations",
    description: "Cancellation policies and procedures",
    icon: "❌",
    articleCount: 10,
    slug: "cancellations",
  },
  {
    title: "Technical Support",
    description: "App and website troubleshooting",
    icon: "⚙️",
    articleCount: 16,
    slug: "technical",
  },
];

const faqData: FAQItem[] = [
  {
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up' button in the top right corner. You can register using your email, Google, or Facebook account. After verification, you'll have access to all features.",
    category: "Getting Started",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway.",
    category: "Payments",
  },
  {
    question: "How do I cancel a booking?",
    answer:
      "Go to 'My Trips', select the booking you want to cancel, and click 'Cancel Booking'. Refund eligibility depends on the cancellation policy of the property and how far in advance you cancel.",
    category: "Cancellations",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we use bank-level 256-bit SSL encryption to protect your data. We're GDPR and CCPA compliant, and we never share your personal information with third parties without your consent.",
    category: "Safety",
  },
  {
    question: "How do I become a host?",
    answer:
      "Click 'List Your Property' in the navigation menu. Complete the listing form with property details, photos, and pricing. Our team will review and approve your listing within 24-48 hours.",
    category: "Hosting",
  },
  {
    question: "What are the service fees?",
    answer:
      "Guests pay a service fee of 10-15% of the booking subtotal. Hosts pay no commission - you keep 100% of your nightly rate. The only cost for hosts is the annual subscription fee.",
    category: "Payments",
  },
  {
    question: "Can I modify my booking dates?",
    answer:
      "Yes, go to 'My Trips' and select 'Change Dates'. The host must approve date changes. Additional charges may apply if the new dates have different pricing.",
    category: "Booking",
  },
  {
    question: "How do reviews work?",
    answer:
      "Both guests and hosts can leave reviews within 14 days after checkout. Reviews are only visible once both parties submit theirs or after the 14-day window closes. This ensures honest, unbiased feedback.",
    category: "Account",
  },
  {
    question: "What if I have issues during my stay?",
    answer:
      "Contact your host first through our messaging system. If the issue isn't resolved, reach out to our 24/7 support team. We'll work to find a solution or help you relocate if necessary.",
    category: "Technical Support",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Click the 'Help' button in the bottom right corner for live chat, or email support@holidaysera.com. For urgent issues, call our 24/7 hotline at +1-800-HOLIDAY.",
    category: "Getting Started",
  },
];

const popularArticles: PopularArticle[] = [
  {
    title: "Complete Guide to Booking Your First Stay",
    category: "Getting Started",
    views: "125K",
  },
  {
    title: "Understanding Cancellation Policies",
    category: "Cancellations",
    views: "98K",
  },
  {
    title: "How to Set Competitive Pricing as a Host",
    category: "Host Resources",
    views: "87K",
  },
  {
    title: "Payment Security: What You Need to Know",
    category: "Safety & Trust",
    views: "76K",
  },
  {
    title: "Maximizing Your Property's Visibility",
    category: "Host Resources",
    views: "64K",
  },
  {
    title: "Guest Verification Process Explained",
    category: "Safety & Trust",
    views: "59K",
  },
];

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const searchedFAQs = searchQuery
    ? filteredFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFAQs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section with Search */}
        <div className="max-w-5xl mx-auto mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
            <span className="text-sm font-semibold text-blue-700">
              💡 Quick answers to your questions
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            How Can We{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-12">
            Search our knowledge base or browse categories below
          </p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for answers... (e.g., 'How do I cancel?')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-6 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-600 focus:outline-none shadow-lg"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
              🔍 Search
            </button>
          </div>

          <p className="text-gray-500 text-sm">
            Popular searches: cancellation, payment, booking, host guide, refund
          </p>
        </div>

        {/* Help Categories Grid */}
        <div className="max-w-7xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Browse by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Link
                key={index}
                href={`/help/${category.slug}`}
                className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-semibold text-sm">
                  {category.articleCount} articles
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="max-w-7xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Popular{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href="#"
                className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    👁️ {article.views}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
              }`}
            >
              All Questions
            </button>
            {Array.from(new Set(faqData.map((faq) => faq.category))).map(
              (category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {searchedFAQs.map((faq, index) => (
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
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3">
                      {faq.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
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
                    <div className="mt-6 flex gap-4">
                      <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2">
                        👍 Helpful
                      </button>
                      <button className="text-gray-600 font-semibold hover:text-gray-700 transition-colors flex items-center gap-2">
                        👎 Not Helpful
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchedFAQs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No results found
              </h3>
              <p className="text-gray-600 mb-8">
                Try different keywords or browse our categories above
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white space-y-6">
              <h2 className="text-4xl font-black mb-4">Still Need Help?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Our support team is available 24/7 to assist you
              </p>
              <div className="grid md:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
                <Link href="/contact" className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 block hover:bg-white/20 transition-colors">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="text-xl font-bold mb-2">Live Chat</div>
                  <p className="text-blue-100 text-sm mb-4">
                    Average wait: 2 min
                  </p>
                  <span className="block w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
                    Contact Us
                  </span>
                </Link>
                <Link href="/contact" className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 block hover:bg-white/20 transition-colors">
                  <div className="text-4xl mb-3">📧</div>
                  <div className="text-xl font-bold mb-2">Email Support</div>
                  <p className="text-blue-100 text-sm mb-4">Response in 24h</p>
                  <span className="block w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
                    Contact Us
                  </span>
                </Link>
                <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="text-4xl mb-3">📞</div>
                  <div className="text-xl font-bold mb-2">Phone Support</div>
                  <p className="text-blue-100 text-sm mb-4">Available 24/7</p>
                  <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/community" className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  👥
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Community Forum
                </h3>
                <p className="text-gray-600">
                  Connect with other users and share experiences
                </p>
              </Link>
              <Link href="/blog" className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  📝
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Blog & Updates
                </h3>
                <p className="text-gray-600">
                  Latest news, tips, and platform updates
                </p>
              </Link>
              <Link href="/video-tutorials" className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  🎥
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Video Tutorials
                </h3>
                <p className="text-gray-600">
                  Step-by-step guides to get you started
                </p>
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
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default HelpCenterPage;
