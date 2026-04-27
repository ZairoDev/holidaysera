"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqData } from "@/components/homepage/faqSecion";

export default function OwnersFaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-sky-50 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-4xl text-center"
        >
          <span className="mb-4 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-700">
            Owner Support
          </span>
          <h1 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
            Owner&apos;s FAQ
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Everything property owners need to know about listing, promotions,
            pricing, and managing guests on HolidaysEra.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-3 shadow-xl md:p-5"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            {faqData.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`owner-faq-${index}`}
                className="border-gray-100 px-4 md:px-6 data-[state=open]:bg-sky-50/40"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-gray-900 transition-colors hover:text-sky-700 hover:no-underline md:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
