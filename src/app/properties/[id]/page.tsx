"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

import { ImprovedImageGallery } from "@/components/properties/image-gallary";
import { PropertyContent } from "@/components/properties/property-content";


export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Fetch property by ID
  const {
    data: property,
    isLoading,
    error,
  } = trpc.property.getPropertyById.useQuery(
    { _id: params?.id as string },
    { enabled: !!params?.id }
  );

  // Fetch similar properties
  const { data: similarPropertiesData } = trpc.property.getFiltered.useQuery(
    {
      location: property?.city || "",
      sortBy: "featured",
      limit: 3,
    },
    {
      enabled: !!property?.city,
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-sky-50/30 pt-8">
        <div className="container mx-auto px-4">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200 mb-6" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
            </div>
            <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Property not found
          </h1>
          <p className="mb-8 text-gray-600">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/properties")}
            className="bg-sky-600 hover:bg-sky-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </motion.div>
      </div>
    );
  }

  // Get property images
  const propertyImages =
    property.propertyImages && property.propertyImages.length > 0
      ? property.propertyImages
      : property.propertyCoverFileUrl
      ? [property.propertyCoverFileUrl]
      : ["/placeholder-property.jpg"];

  // Filter similar properties
  const similarProperties = Array.isArray(similarPropertiesData)
    ? similarPropertiesData
    : similarPropertiesData?.items || [];

  const filteredSimilarProperties = similarProperties
    .filter((prop: any) => prop._id !== property._id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-sky-50/30">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/80"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Image Gallery - Only Component 1 */}
          <ImprovedImageGallery 
            images={propertyImages}
            propertyName={property.propertyName}
          />

          {/* All Property Content - Only Component 2 */}
          <PropertyContent
            property={property}
            similarProperties={filteredSimilarProperties}
          />
        </motion.div>
      </div>
    </div>
  );
}
