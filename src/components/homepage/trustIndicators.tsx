"use client";

import { motion } from "framer-motion";
import { Shield, Award, Star, TrendingUp, LucideIcon, Percent } from "lucide-react";

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
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Why Choose HolidaysEra?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              Your peace of mind is our priority
            </p>
          </motion.div>
        </div>

        <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator, index) => (
            <TrustIndicatorCard
              key={indicator.title}
              indicator={indicator}
              index={index}
            />
          ))}
        </div>

        {/* Savings Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-12 text-center text-white shadow-2xl md:px-12 md:py-14"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Percent className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold md:text-3xl">
                Book directly with the owner
              </h3>
              <p className="text-lg opacity-90 md:text-xl">
                and save up to <span className="font-bold">50%</span> on your next stay
              </p>
            </div>
          </div>
        </motion.div>
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
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 transition-all duration-300 group-hover:bg-sky-200 group-hover:scale-110">
        <Icon className="h-8 w-8 text-sky-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {indicator.title}
      </h3>
      <p className="text-gray-600">{indicator.description}</p>
    </motion.div>
  );
}
