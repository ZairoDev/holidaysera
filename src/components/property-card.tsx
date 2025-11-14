"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Users } from "lucide-react";
;
import { Badge } from "@/components/ui/badge";
import { Property } from "@/lib/type";
import { trpc } from "@/trpc/client";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  /** 👉 Fetch user's favorite list */
  const { data: favorites = [], refetch } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
    });

  /** 👉 Mutation for toggle */
  const toggleMutation = trpc.favorite.toggle.useMutation({
    onSuccess: () => refetch(), // Refresh favorites after toggling
  });

  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  /** Determine if THIS property is in favorites */
  const favorite = favorites.includes(property._id);

  /** Handle favorite toggle */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleMutation.mutate({ propertyId: property._id });
  };

  /** Build image list safely */
  const pictureUrls =
    property.propertyPictureUrls?.filter((url) => url && url.trim() !== "") ||
    [];

  const fallbackImages = property.propertyImages || [];
  const allImages = pictureUrls.length > 0 ? pictureUrls : fallbackImages;

  const activeImage =
    !imageError && allImages.length > 0
      ? allImages[imageIndex]
      : "/placeholder.jpg";

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
          {/* IMAGE */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-200">
            {activeImage !== "/placeholder.jpg" ? (
              <Image
                src={activeImage}
                alt={property.propertyName || "Property"}
                fill
                unoptimized
                onError={() => setImageError(true)}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
                <MapPin className="h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No Image Available</p>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              // disabled={toggleMutation.isLoading}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 backdrop-blur-md hover:bg-white hover:scale-110 transition-all"
            >
              <Heart
                className={`h-5 w-5 ${
                  favorite ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
              />
            </button>

            {/* Pagination Dots */}
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
                      idx === imageIndex ? "w-6 bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4">
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

            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {property.city || "Unknown"}, {property.country || "Unknown"}
              </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
              {property.guests && (
                <>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{property.guests} guests</span>
                  </div>
                  <span>•</span>
                </>
              )}

              {property.bedrooms && (
                <>
                  <span>
                    {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                </>
              )}

              {property.bathroom && (
                <span>
                  {property.bathroom} bath{property.bathroom > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between border-t pt-3">
              <div>
                <span className="text-2xl font-bold text-sky-600">
                  ${property.basePrice || 0}
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
