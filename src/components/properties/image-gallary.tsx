"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImprovedImageGalleryProps {
  images: string[];
  propertyName?: string;
}

export function ImprovedImageGallery({
  images,
  propertyName,
}: ImprovedImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        {/* Main Image Display */}
        <div className="relative mb-4 h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${propertyName || "Property"} - Image ${
                currentImageIndex + 1
              }`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* View All Photos Button */}
            <Button
              onClick={() => openLightbox(currentImageIndex)}
              className="absolute bottom-6 right-6 bg-white/95 text-gray-900 hover:bg-white shadow-lg backdrop-blur-sm"
              size="sm"
            >
              <Grid3x3 className="mr-2 h-4 w-4" />
              View All {images.length} Photos
            </Button>

            {/* Image Counter */}
            <div className="absolute top-6 right-6 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-xl backdrop-blur-sm transition-all hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-xl backdrop-blur-sm transition-all hover:bg-white"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </motion.button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                    index === currentImageIndex
                      ? "ring-4 ring-sky-500 ring-offset-2"
                      : "ring-2 ring-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-sky-500/20" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Scroll Indicator */}
            {images.length > 5 && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronRight className="h-6 w-6" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute left-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Main Lightbox Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${propertyName || "Property"} - Image ${
                  lightboxIndex + 1
                }`}
                fill
                className="object-contain"
                sizes="(max-width: 1536px) 100vw, 1536px"
                priority
              />
            </motion.div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    previousLightboxImage();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </motion.button>
              </>
            )}

            {/* Thumbnail Strip at Bottom */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/50 p-3 backdrop-blur-sm max-w-[90vw]">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(index);
                  }}
                  className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                    index === lightboxIndex
                      ? "ring-4 ring-white"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Hide CSS */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
