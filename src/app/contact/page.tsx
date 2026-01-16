"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  HelpCircle,
  Shield,
  Users,
  AlertCircle,
  Send,
  CheckCircle2,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Navigation,
} from "lucide-react";

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
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action: string;
}

// Data
const contactMethods: ContactMethod[] = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    action: "Average wait time: 2 minutes",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and get a response within 24 hours",
    action: "support@holidaysera.com",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us for immediate assistance",
    action: "+1-800-HOLIDAY (24/7)",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come meet us at our office",
    action: "117/N/70 3rd Floor, Kakadeo, Kanpur",
  },
];

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM IST" },
  { day: "Sunday", hours: "Closed (Emergency support available)" },
];

const quickLinks = [
  { title: "Help Center", href: "/help-center", icon: BookOpen },
  { title: "FAQs", href: "/faq", icon: HelpCircle },
  { title: "Safety & Trust", href: "/safety", icon: Shield },
  { title: "Community Forum", href: "/community", icon: Users },
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

  const sendMessageMutation = trpc.contact.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
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
    },
    onError: (error) => {
      console.error("Contact form error:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    sendMessageMutation.mutate(formData);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-sky-50">
      {/* Subtle Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-sky-100/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-sky-100/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full border border-sky-200 mb-6">
            <span className="w-2 h-2 bg-sky-600 rounded-full" />
            <span className="text-sm font-semibold text-sky-600">
              We're Here to Help 24/7
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Get in{" "}
            <span className="text-sky-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have a question or need assistance? Our support team is ready to
            help you with anything you need.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-24"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-sky-300 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="absolute inset-0 bg-sky-500 rounded-xl blur opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-100 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                    <p className="text-sm font-medium text-sky-600">
                      {method.action}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
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
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } focus:border-sky-600 focus:outline-none transition-colors`}
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
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } focus:border-sky-600 focus:outline-none transition-colors`}
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
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } focus:border-sky-600 focus:outline-none transition-colors`}
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sky-600 focus:outline-none transition-colors"
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.subject ? "border-red-500" : "border-gray-300"
                      } focus:border-sky-600 focus:outline-none transition-colors`}
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
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      } focus:border-sky-600 focus:outline-none transition-colors resize-none`}
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

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    whileHover={{ scale: isSubmitting || isSubmitted ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                    className={`w-full py-4 px-6 bg-sky-600 text-white rounded-lg font-semibold text-base shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting || isSubmitted
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Message Sent Successfully!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Office Hours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Office Hours
                  </h3>
                </div>
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
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Quick Links
                  </h3>
                </div>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={index}
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-50 transition-colors group"
                      >
                        <IconComponent className="w-5 h-5 text-sky-600" />
                        <span className="font-medium text-gray-900 group-hover:text-sky-600 transition-colors">
                          {link.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-red-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Emergency?</h3>
                </div>
                <p className="mb-4 text-sm text-red-50">
                  For urgent issues during your stay, call our 24/7 emergency
                  line:
                </p>
                <a
                  href="tel:+18004653929"
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-white text-red-600 rounded-lg font-semibold text-center hover:bg-red-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +1-800-HOLIDAY
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-24"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-sky-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Visit Our Office
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-700 text-sm">
                      117/N/70 3rd Floor
                      <br />
                      Kakadeo, Kanpur
                      <br />
                      Uttar Pradesh, India - 208025
                    </p>
                  </div>
                  <div className="p-6 bg-sky-50 rounded-xl border border-sky-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Directions</h4>
                    <p className="text-gray-700 text-sm">
                      Located in the heart of Kakadeo, easily accessible by
                      metro and bus. Parking available.
                    </p>
                  </div>
                  <button className="w-full py-3 px-6 bg-sky-600 text-white rounded-lg font-semibold shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </button>
                </div>
                <div className="h-96 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-sky-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Interactive Map
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      (Integrate Google Maps here)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ContactPage;
