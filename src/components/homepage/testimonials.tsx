"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
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
      "The attention to detail was impressive. Everything we needed was provided. Highly recommend StayHaven!",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
];

export function Testimonials() {
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

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
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
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
