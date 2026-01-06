"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, User, Tag, Copy, Check } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

// Fallback testimonials if no reviews exist
const fallbackTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment:
      "Amazing experience! The property was exactly as described and the host was incredibly helpful. Will definitely book again!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    name: "Marco Rossi",
    location: "Rome, Italy",
    rating: 5,
    comment:
      "Perfect vacation home with stunning views. The booking process was seamless and customer service was excellent.",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
  },
  {
    name: "Emily Chen",
    location: "Singapore",
    rating: 5,
    comment:
      "The attention to detail was impressive. Everything we needed was provided. Highly recommend HolidaysEra!",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
];

export function Testimonials() {
  const { data: reviews = [], isLoading } = trpc.review.getFeatured.useQuery(
    { limit: 6 },
    { staleTime: 5 * 60 * 1000 }
  );

  // Use real reviews if available, otherwise use fallback
  const testimonials =
    reviews.length > 0
      ? reviews.map((review) => ({
          name: review.userName,
          location: review.location || "Unknown",
          rating: review.rating,
          comment: review.comment,
          avatar: review.userAvatar || "",
        }))
      : fallbackTestimonials;

  return (
    <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            What Our Guests Say
          </h2>
          <p className="text-lg text-gray-600">
            Real experiences from real travelers
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Permanent Discount Banner */}
        <DiscountBanner />
      </div>
    </section>
  );
}

function DiscountBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText("ZAIRO");
      setCopied(true);
      toast.success("Coupon code ZAIRO copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy coupon code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 p-8 text-white shadow-2xl"
    >
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="flex-shrink-0">
            <Tag className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">
              Get 10% Off Your Next Booking!
            </h3>
            <p className="text-sm opacity-90 md:text-base">
              Use coupon code <span className="font-bold">ZAIRO</span> when you rent a property now
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyCoupon}
          className="flex items-center gap-2 rounded-lg bg-white/20 px-6 py-3 font-bold text-lg transition-all hover:bg-white/30 hover:scale-105 border border-white/30 whitespace-nowrap"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              <span>Copy Code: ZAIRO</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mb-6 text-gray-700">{testimonial.comment}</p>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
