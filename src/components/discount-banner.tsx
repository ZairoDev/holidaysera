"use client";

import { useState } from "react";
import { X, Tag, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function DiscountBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
  };

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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-[60] bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Tag className="h-5 w-5 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                    Get 10% discount with coupon code:
                  </span>
                  <button
                    onClick={handleCopyCoupon}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md font-bold text-sm sm:text-base border border-white/30 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>ZAIRO</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs sm:text-sm opacity-90 whitespace-nowrap">
                    when you rent a property now!
                  </span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

