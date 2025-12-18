"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Users, Bath, Bed, Crown } from "lucide-react";
import { trpc } from "@/trpc/client";
import { Property } from "@/lib/type";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useUserStore();
  const { data: favorites = [], refetch } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
      enabled: !!user,
    });

  const toggleMutation = trpc.favorite.toggle.useMutation({
    onSuccess: () => refetch(),
    onError:(error) => {
      // console.error("Error toggling favorite:", error);
      if (error.data?.code === 'UNAUTHORIZED') {
        toast.error("Please log in to manage favorites.");
      } else
      toast.error("Failed to update favorites. Please try again.");
    }
  });

  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const favorite = favorites.includes(property._id);

  const pictureUrls =
    property.propertyPictureUrls
      ?.filter(Boolean)
      .filter((url) => url.trim() !== "") || [];
  const fallbackImages = property.propertyImages || [];
  const allImages = pictureUrls.length ? pictureUrls : fallbackImages;
  const activeImage =
    !imageError && allImages.length
      ? allImages[imageIndex]
      : "/placeholder.jpg";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate({ propertyId: property._id });
  };

  return (
    <Link href={`/properties/${property._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group cursor-pointer"
      >
        <div
          className="
          relative overflow-hidden rounded-2xl border 
          bg-white dark:bg-gray-900 shadow-md 
          transition-all duration-300 hover:shadow-2xl
        "
        >
          {/* IMAGE */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={property.propertyName || "Property"}
                fill
                unoptimized
                onError={() => setImageError(true)}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <MapPin className="h-10 w-10" />
                <p>No Image</p>
              </div>
            )}

            {/* GLASS FAVORITE */}
            <button
              onClick={handleFavoriteClick}
              className="
                absolute right-3 top-3 z-10 rounded-full p-2
                bg-white/60 dark:bg-black/60 backdrop-blur-md 
                transition-transform hover:scale-110 shadow-md
              "
            >
              <Heart
                className={`h-5 w-5 ${
                  favorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              />
            </button>

            {/* Mini Hover Gallery */}
            {allImages.length > 1 && (
              <div
                className="
                absolute bottom-3 left-1/2 -translate-x-1/2 
                hidden group-hover:flex gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm
              "
              >
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageIndex(idx);
                      setImageError(false);
                    }}
                    className={`h-2 w-2 rounded-full ${
                      idx === imageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                {property.propertyName || "Untitled Property"}
              </h3>

              {/* Rating or Superhost */}
              <div className="flex items-center gap-1 text-sm">
                {property.reviews ? (
                  <>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">5.0</span>
                  </>
                ) : (
                  <div className="flex items-center gap-1 bg-purple-500 text-white px-2 py-[1px] rounded-md text-xs shadow">
                    <Crown className="h-3 w-3" /> Superhost
                  </div>
                )}
              </div>
            </div>

            {/* Location Tag */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {property.city}, {property.country}
              </span>
            </div>

            {/* DETAILS */}
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {property.guests} guests
              </span>
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {property.bedrooms} beds
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" /> {property.bathroom} bath
              </span>
            </div>

            {/* PRICE */}
            <div className="pt-3 border-t flex justify-between items-baseline dark:border-gray-700">
              <motion.p
                whileHover={{ scale: 1.08 }}
                className="text-2xl font-bold text-sky-600 dark:text-sky-400"
              >
                ${property.basePrice}
              </motion.p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                / night
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
