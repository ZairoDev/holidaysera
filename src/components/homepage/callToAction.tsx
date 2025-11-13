"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-16 text-center text-white shadow-2xl md:px-16"
        >
          <h2 className="mb-4 text-4xl font-bold">
            Ready to Start Your Adventure?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of travelers who trust StayHaven
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-gray-100"
              >
                Browse Properties
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
