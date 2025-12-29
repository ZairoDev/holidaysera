"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SearchBar } from "../search-bar";


export function HeroSection() {
  const stats = [
    { label: "Average Rating", value: "4.9/5", icon: true },
    { label: "Properties", value: "4,000+" },
    { label: "Happy Guests", value: "50,000+" },
  ];

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-hero-from to-hero-to overflow-hidden flex items-center">
      <div className="container relative mx-auto px-4 py-12 lg:py-20">
        {/* Main Content Grid */}
        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left z-10">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl"
            >
              Find Your Perfect
              <div className="relative inline-block w-full">
                <span className="block text-primary mt-2">Holiday Home</span>
                <svg
                  className="absolute left-1/3 lg:left-0 -bottom-3 lg:-bottom-4 w-full max-w-[300px] lg:max-w-[600px] mx-auto lg:mx-0"
                  height="18"
                  viewBox="0 0 600 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 10, 200 0, 400 0"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 text-lg text-foreground/70 md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 mt-8 lg:mt-6"
            >
              Discover unique properties and unforgettable experiences worldwide
            </motion.p>

            {/* Stats - Hidden on mobile, shown on larger screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex flex-wrap items-center justify-start gap-4 md:gap-6 text-sm md:text-base"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-muted-foreground mr-2">•</span>
                  )}
                  {stat.icon && (
                    <Star className="h-5 w-5 fill-accent text-accent" />
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-foreground text-base md:text-lg">
                      {stat.value}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative h-[350px] md:h-[450px] lg:h-[700px] rounded-2xl overflow-visible shadow-elegant"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
                alt="Luxury hotel pool"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Decorative stones - only shown on large screens */}
            <div className="hidden lg:block absolute bottom-4 right-0">
              <div className="relative w-40 h-40">
                {/* Stone A */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-0 left-0"
                >
                  <path d="M11 2 19 6 17 15 9 20 3 12 Z" />
                </svg>

                {/* Stone B */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[20px] left-[35px]"
                >
                  <path d="M9 1 15 4 14 11 8 16 3 12 4 5 Z" />
                </svg>

                {/* Stone C */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[55px] left-[10px]"
                >
                  <path d="M10 1 16 5 15 10 11 16 5 14 4 8 Z" />
                </svg>

                {/* Stone D */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[75px] left-[48px]"
                >
                  <path d="M7 1 11 3 10 8 6 12 3 7 4 4 Z" />
                </svg>

                {/* Stone E */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[15px] left-[70px]"
                >
                  <path d="M12 2 20 6 19 13 13 21 5 17 4 9 Z" />
                </svg>

                {/* Stone F */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[60px] left-[95px]"
                >
                  <path d="M8 1 13 3 12 10 6 14 3 9 4 5 Z" />
                </svg>

                {/* Stone G */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[100px] left-[20px]"
                >
                  <path d="M11 1 18 5 18 12 11 20 4 16 3 9 Z" />
                </svg>

                {/* Stone H */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[90px] left-[85px]"
                >
                  <path d="M10 2 17 5 16 11 10 17 4 12 5 6 Z" />
                </svg>

                {/* Stone I */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[90px] right-[4px]"
                >
                  <path d="M10 2 17 5 16 11 10 17 4 12 5 6 Z" />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[30px] -right-[4px]"
                >
                  <path d="M10 2 17 5 16 11 10 17 4 12 5 6 Z" />
                </svg>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 20 20"
                  fill="hsl(var(--accent))"
                  className="absolute bottom-[10px] right-[20px]"
                >
                  <path d="M 5 8 L 4 6 L 6 5 L 7 5 L 9 6 L 11 8 L 12 10 L 11 11 L 9 10 L 6 9 L 5 8  Z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Search Bar - Positioned as overlay */}
          <div className="absolute lg:left-0 -bottom-40 md:-bottom-32 lg:bottom-4 flex justify-center lg:justify-start z-20 px-4 lg:px-0 w-full lg:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-auto"
            >
              <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-elegant p-2 lg:p-3">
                <SearchBar variant="hero" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats for mobile - shown below the image on small screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex lg:hidden flex-wrap items-center justify-center gap-4 mt-48 md:mt-40 text-sm"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-muted-foreground mr-2">•</span>
              )}
              {stat.icon && (
                <Star className="h-4 w-4 fill-accent text-accent" />
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-foreground text-sm">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-xs">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 bg-primary/20 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 bg-primary/10 opacity-30 blur-3xl" />
      </div>
    </section>
  );
}
