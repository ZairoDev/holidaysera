"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
}

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showValue = true, ...props }, ref) => {
  const value = Array.isArray(props.value)
    ? props.value[0]
    : props.defaultValue ?? 0;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className
      )}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-sky-400 dark:from-blue-400 dark:to-sky-300 shadow-sm" />
      </SliderPrimitive.Track>

      {/* Thumb */}
      <SliderPrimitive.Thumb asChild>
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="
            relative h-5 w-5 rounded-full 
            bg-white dark:bg-gray-900 border-2 
            border-blue-500 dark:border-blue-400
            shadow-lg cursor-pointer
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50 
            dark:focus-visible:ring-blue-500/40
          "
        >
          {/* Tooltip Value */}
          {showValue && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-800 text-white dark:bg-white dark:text-gray-900 shadow-md select-none">
              {value}
            </div>
          )}
        </motion.div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;
