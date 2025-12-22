"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { Property } from "@/lib/type";
import { useUserStore } from "@/lib/store";

export default function FavoritesPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 🔥 Check authentication on mount
  useEffect(() => {
    if (!user) {
      setShowLoginDialog(true);
      setLoading(false);
    }
  }, [user]);

  // 🔥 Fetch IDs of favorite properties
  const { data: favoriteIds, isLoading: favLoading } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      enabled: !!user,
    });

  // 🔥 tRPC caller for fetching property by ID
  const utils = trpc.useUtils();

  useEffect(() => {
    async function loadFavoriteProperties() {
      if (!user) {
        setLoading(false);
        return;
      }

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
  }, [favoriteIds, favLoading, utils, user]);

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push("/login?redirect=/favorites");
  };

  const handleSignupRedirect = () => {
    router.push("/signup?redirect=/favorites");
  };

  return (
    <>
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
                {user
                  ? `${properties.length} saved ${
                      properties.length === 1 ? "property" : "properties"
                    }`
                  : "Please log in to view your favorites"}
              </p>
            </div>

            {!user ? (
              // 🔐 Not logged in - show message
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[500px] flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sky-100">
                  <Heart className="h-12 w-12 text-sky-600" />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                  Login Required
                </h2>

                <p className="mb-6 max-w-md text-gray-600">
                  Please log in to view and manage your favorite properties.
                </p>
              </motion.div>
            ) : loading ? (
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

      {/* 🔐 Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100">
              <Heart className="h-8 w-8 text-sky-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-center">
              Please log in to view and manage your favorite properties. Save
              properties you love and access them anytime!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <Button
              onClick={handleLoginRedirect}
              className="w-full bg-sky-600 hover:bg-sky-700"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Log In
            </Button>

            <Button
              onClick={handleSignupRedirect}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
