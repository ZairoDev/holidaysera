"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Users } from "lucide-react";

import { useFavoritesStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/lib/type";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const favorite = isFavorite(property._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFavorite(property._id) : addFavorite(property._id);
  };

  // Get all available images with better fallback handling
  // Filter out empty strings from propertyPictureUrls
  const pictureUrls = property.propertyPictureUrls?.filter(url => url && url.trim() !== '') || [];
  const propertyImages = property.propertyImages || [];
  
  const allImages = pictureUrls.length > 0 ? pictureUrls : propertyImages;

  const activeImage = allImages[imageIndex] || "/placeholder.jpg";

  console.log("Property:", property.propertyName);
  console.log("All images:", allImages);
  console.log("Active image:", activeImage);

  return (
    <Link href={`/properties/${property._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <div className="relative h-64 w-full overflow-hidden bg-gray-200">
            {!imageError && activeImage !== "/placeholder.jpg" ? (
              <Image
                src={activeImage}
                alt={property.propertyName || "Property Image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  console.error("Image failed to load:", activeImage);
                  setImageError(true);
                }}
                unoptimized // Temporarily add this to bypass Next.js image optimization
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No image available
                  </p>
                </div>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  favorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>

            {/* Image Pagination Dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-3 flex gap-1">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageIndex(idx);
                      setImageError(false);
                    }}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      idx === imageIndex ? "w-6 bg-white" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title and Rating */}
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {property.propertyName || "Untitled Property"}
              </h3>
              {property.reviews && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">5.0</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {property.city || "Unknown"}, {property.country || "Unknown"}
              </span>
            </div>

            {/* Details */}
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
              {property.guests && property.guests > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{property.guests} guests</span>
                  </div>
                  <span>•</span>
                </>
              )}
              {property.bedrooms !== undefined && property.bedrooms > 0 && (
                <>
                  <span>
                    {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                </>
              )}
              {property.bathroom !== undefined && property.bathroom > 0 && (
                <span>
                  {property.bathroom} bath{property.bathroom > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-between border-t pt-3">
              <div>
                <span className="text-2xl font-bold text-sky-600">
                  ${property.basePrice ?? 0}
                </span>
                <span className="text-sm text-gray-600"> / night</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}