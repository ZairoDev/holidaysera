"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { trpc } from "@/trpc/client";
import { Property } from "@/lib/type";
import { useUserStore } from "@/lib/store";

export default function FavoritesPage() {
  const { user } = useUserStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch IDs of favorite properties
  const { data: favoriteIds, isLoading: favLoading } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      enabled: !!user,
    });

  // 🔥 tRPC caller for fetching property by ID
  const utils = trpc.useUtils();

  useEffect(() => {
    async function loadFavoriteProperties() {
      if (!favoriteIds || favoriteIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch all properties in parallel
        const results = await Promise.all(
          favoriteIds.map((id: string) =>
            utils.property.getPropertyById.fetch({ _id: id })
          )
        );

        // Remove null values if any property not found
        const validProperties = results.filter(Boolean) as Property[];

        setProperties(validProperties);
      } catch (err) {
        console.error("Error loading favorite properties:", err);
      }

      setLoading(false);
    }

    if (!favLoading) {
      loadFavoriteProperties();
    }
  }, [favoriteIds, favLoading, utils]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              My Favorites
            </h1>
            <p className="text-gray-600">
              {properties.length} saved{" "}
              {properties.length === 1 ? "property" : "properties"}
            </p>
          </div>

          {loading ? (
            // 🌙 Loading skeleton
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-xl bg-gray-200"
                ></div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            // 🌟 Favorites Grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            // ❌ No Favorites
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[500px] flex-col items-center justify-center text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>

              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                No favorites yet
              </h2>

              <p className="mb-6 max-w-md text-gray-600">
                Start exploring amazing properties and save your favorites by
                clicking the heart icon.
              </p>

              <Link href="/properties">
                <Button className="bg-sky-600 hover:bg-sky-700">
                  Browse Properties
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
