"use client";

import React, { useState } from "react";
import Link from "next/link";

// Types
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  action: string;
  color: string;
}

// Data
const contactMethods: ContactMethod[] = [
  {
    icon: "💬",
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Average wait time: 2 minutes",
    color: "blue",
  },
  {
    icon: "📧",
    title: "Email Support",
    description: "Send us an email and get a response within 24 hours",
    action: "support@holidaysera.com",
    color: "indigo",
  },
  {
    icon: "📞",
    title: "Phone Support",
    description: "Call us for immediate assistance",
    action: "+1-800-HOLIDAY (24/7)",
    color: "purple",
  },
  {
    icon: "📍",
    title: "Visit Us",
    description: "Come meet us at our office",
    action: "117/N/70 3rd Floor, Kakadeo, Kanpur",
    color: "pink",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM IST" },
  { day: "Sunday", hours: "Closed (Emergency support available)" },
];

const quickLinks = [
  { title: "Help Center", href: "/help", icon: "📚" },
  { title: "FAQs", href: "/faq", icon: "❓" },
  { title: "Safety & Trust", href: "/safety", icon: "🛡️" },
  { title: "Community Forum", href: "/community", icon: "👥" },
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.phone && !formData.phone.match(/^\+?[\d\s-()]+$/)) {
      newErrors.phone = "Valid phone number format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim() || formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form submitted:", formData);

    // Here you would typically send to your API
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "general",
        message: "",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-700",
      indigo: "from-indigo-500 to-indigo-700",
      purple: "from-purple-500 to-purple-700",
      pink: "from-pink-500 to-pink-700",
    };
    return colors[color as keyof typeof colors];
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
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-700">
              We're Here to Help 24/7
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Have a question or need assistance? Our support team is ready to
            help you with anything you need.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${getColorClasses(
                    method.color
                  )} rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                >
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-sm font-semibold text-blue-600">
                  {method.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
                <h2 className="text-3xl font-black text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } focus:border-blue-600 focus:outline-none transition-colors`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } focus:border-blue-600 focus:outline-none transition-colors`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } focus:border-blue-600 focus:outline-none transition-colors`}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="technical">Technical Issue</option>
                        <option value="hosting">Host Support</option>
                        <option value="payment">Payment Question</option>
                        <option value="cancellation">Cancellation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.subject ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-600 focus:outline-none transition-colors`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Message * (minimum 20 characters)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-600 focus:outline-none transition-colors resize-none`}
                      placeholder="Please describe your question or issue in detail..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {formData.message.length} / 20 characters minimum
                      </span>
                      {errors.message && (
                        <p className="text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${
                      isSubmitting || isSubmitted
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center gap-2">
                        ✓ Message Sent Successfully!
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🕐 Office Hours
                </h3>
                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0"
                    >
                      <span className="font-semibold text-gray-900">
                        {schedule.day}
                      </span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🔗 Quick Links
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">🚨 Emergency?</h3>
                <p className="mb-4">
                  For urgent issues during your stay, call our 24/7 emergency
                  line:
                </p>
                <a
                  href="tel:+18004653929"
                  className="block py-3 px-6 bg-white text-red-600 rounded-xl font-bold text-center hover:bg-red-50 transition-colors"
                >
                  📞 +1-800-HOLIDAY
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
            <div className="p-8">
              <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
                📍 Visit Our Office
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-blue-50 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-700">
                      117/N/70 3rd Floor
                      <br />
                      Kakadeo, Kanpur
                      <br />
                      Uttar Pradesh, India - 208025
                    </p>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Directions</h4>
                    <p className="text-gray-700">
                      Located in the heart of Kakadeo, easily accessible by
                      metro and bus. Parking available.
                    </p>
                  </div>
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                    🗺️ Get Directions
                  </button>
                </div>
                <div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-gray-600 font-semibold">
                      Interactive Map
                    </p>
                    <p className="text-sm text-gray-500">
                      (Integrate Google Maps here)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="max-w-7xl mx-auto">
          <div className="relative p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl font-black mb-4">
                Connect With Us on Social Media
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Follow us for updates, travel tips, and exclusive offers
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  {
                    name: "Facebook",
                    icon: "📘",
                    href: "https://facebook.com/holidaysera",
                  },
                  {
                    name: "Instagram",
                    icon: "📸",
                    href: "https://instagram.com/holidaysera",
                  },
                  {
                    name: "Twitter",
                    icon: "🐦",
                    href: "https://twitter.com/holidaysera",
                  },
                  {
                    name: "LinkedIn",
                    icon: "💼",
                    href: "https://linkedin.com/company/holidaysera",
                  },
                  {
                    name: "YouTube",
                    icon: "📹",
                    href: "https://youtube.com/holidaysera",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 flex items-center gap-3"
                  >
                    <span className="text-2xl">{social.icon}</span>
                    {social.name}
                  </a>
                ))}
              </div>
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-white\\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
