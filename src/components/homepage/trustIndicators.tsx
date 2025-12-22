"use client";

import { motion } from "framer-motion";
import { Shield, Award, Star, TrendingUp, LucideIcon } from "lucide-react";

interface TrustIndicator {
  icon: LucideIcon;
  title: string;
  description: string;
}

const indicators: TrustIndicator[] = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your payment information is always protected",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Find a lower price? We'll match it",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "All reviews from real guests who stayed",
  },
  {
    icon: TrendingUp,
    title: "24/7 Support",
    description: "Our team is here to help anytime",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Why Choose HolidaysEra?
          </h2>
          <p className="text-lg text-gray-600">
            Your peace of mind is our priority
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator, index) => (
            <TrustIndicatorCard
              key={indicator.title}
              indicator={indicator}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustIndicatorCard({
  indicator,
  index,
}: {
  indicator: TrustIndicator;
  index: number;
}) {
  const Icon = indicator.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
        <Icon className="h-8 w-8 text-sky-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {indicator.title}
      </h3>
      <p className="text-gray-600">{indicator.description}</p>
    </motion.div>
  );
}
