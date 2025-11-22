"use client";

import {
  Plus,
  Building2,
  MapPin,
  User,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PropertiesTabProps {
  isOwner: boolean;
}

export function PropertiesTab({ isOwner }: PropertiesTabProps) {
  const {
    data: ownerProperties,
    isLoading: propertiesLoading,
    refetch: refetchProperties,
  } = trpc.property.getOwnerProperties.useQuery(undefined, {
    enabled: isOwner,
  });

  const deletePropertyMutation = trpc.property.deleteProperty.useMutation({
    onSuccess: () => {
      toast.success("Property deleted successfully");
      refetchProperties();
    },
    onError: (error) => {
      toast.error("Failed to delete property");
      console.error(error);
    },
  });

  const handleDeleteProperty = async (propertyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    )
      return;

    try {
      await deletePropertyMutation.mutateAsync({ propertyId });
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (!isOwner) return null;

  return (
    <TabsContent value="properties">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                My Properties
              </h2>
              <p className="text-gray-600">
                Manage and monitor your property listings
              </p>
            </div>
            <Link href="/add-listing/1" className="w-full sm:w-auto">
              <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all h-12 w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Add New Property
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {propertiesLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-sky-600" />
              <p className="mt-4 text-gray-600 font-medium">
                Loading your properties...
              </p>
            </div>
          ) : ownerProperties && ownerProperties.length > 0 ? (
            /* Properties List */
            <div className="space-y-4">
              {ownerProperties.map((property: any, index: number) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-100 bg-white hover:border-sky-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                    {/* Property Image */}
                    <div className="relative h-56 sm:h-40 w-full sm:w-64 flex-shrink-0 overflow-hidden rounded-lg">
                      {property.propertyCoverFileUrl ? (
                        <Image
                          src={property.propertyCoverFileUrl}
                          alt={property.propertyName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Building2 className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      {!property.isLive && (
                        <div className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                          Unlisted
                        </div>
                      )}
                      {property.isLive && (
                        <div className="absolute top-3 left-3 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                          Live
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div>
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
                            {property.propertyName || "Untitled Property"}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-700 w-fit">
                            {property.VSID}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-sky-600" />
                          <span className="line-clamp-1">
                            {property.city}, {property.country}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                          <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            {property.guests} guests
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                            {property.bedrooms} bed
                            {property.bedrooms !== 1 ? "s" : ""}
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                            {property.bathroom} bath
                            {property.bathroom !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            {property.currency} {property.basePrice}
                            <span className="text-base font-normal text-gray-600">
                              /night
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          <Link
                            href={`/properties/${property._id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-10 border-2 hover:bg-sky-50 hover:border-sky-300"
                            >
                              <Eye className="mr-1.5 h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Link
                            href={`/add-listing/1?edit=${property._id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-10 border-2 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="mr-1.5 h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border-2 h-10"
                          >
                            {deletePropertyMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                No properties yet
              </h3>
              <p className="mb-8 text-gray-600 max-w-md mx-auto">
                Start listing your properties to reach travelers worldwide and
                grow your rental business
              </p>
              <Link href="/add-listing/1">
                <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all h-12">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Property
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </motion.div>
    </TabsContent>
  );
}
