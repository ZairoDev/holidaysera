"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showValue = true, ...props }, ref) => {
  const values = Array.isArray(props.value)
    ? props.value
    : [props.value ?? props.defaultValue ?? 0];

  return (
    <div className="relative w-full pb-8">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-visible rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
        </SliderPrimitive.Track>
        {values.map((value, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block h-6 w-6 rounded-full border-2 border-primary bg-background ring-offset-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          >
            {showValue && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground whitespace-nowrap pointer-events-none z-10">
                €{typeof value === "number" ? value : 0}
              </div>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
