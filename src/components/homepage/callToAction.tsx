"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

export function CallToAction() {
  const { user } = useUserStore();

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
            Join thousands of travellers who trust HolidaysEra
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
            <Link href={"/about" }>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/5 hover:bg-white/10"
              >
                 "Explore More" 
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
