"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, Users, Bath, Bed, Crown } from "lucide-react";
import { trpc } from "@/trpc/client";
import { Property } from "@/lib/type";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginContent } from "@/components/auth/login-form";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useUserStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { data: favorites = [], refetch } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
      enabled: !!user,
    });

  const toggleMutation = trpc.favorite.toggle.useMutation({
    onSuccess: () => refetch(),
    onError:(error) => {
      // console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  });

  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const favorite = favorites.includes(property._id);

  // Calculate rating: use actual review if exists and is numeric, otherwise generate consistent random value between 4.5-5.0
  const rating = useMemo(() => {
    // Helper function to generate consistent random rating based on property ID
    const generateRandomRating = () => {
      const hash = property._id.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0);
      const random = Math.abs(Math.sin(hash)) * 0.5; // 0 to 0.5
      return 4.5 + random; // 4.5 to 5.0
    };

    if (property.reviews && property.reviews.trim() !== "") {
      // If reviews exist, try to parse a numeric rating from the reviews string
      // Check if reviews is a number string (e.g., "4.8")
      const parsedRating = parseFloat(property.reviews);
      if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
        return parsedRating;
      }
      // If reviews exists but isn't a number, generate random rating
      return generateRandomRating();
    }
    // No reviews exist, generate random rating
    return generateRandomRating();
  }, [property.reviews, property._id]);

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
    
    // Check if user is logged in
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    // User is logged in, proceed with toggle
    toggleMutation.mutate({ propertyId: property._id });
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    // After login, toggle the favorite
    toggleMutation.mutate({ propertyId: property._id });
  };

  return (
    <>
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

              {/* Rating */}
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
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
                € {property.basePrice}<span className="text-sm text-gray-600 dark:text-gray-400"> / night</span>
              </motion.p>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                / night
              </p> */}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>

    {/* Login Dialog */}
    <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <LoginContent 
          isModal={true}
          onSuccess={handleLoginSuccess}
          redirectUrl={`/properties/${property._id}`}
        />
      </DialogContent>
    </Dialog>
  </>
  );
}
