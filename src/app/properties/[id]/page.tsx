"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Utensils,
  Car,
  Waves,
  Dumbbell,
  Flame,
  Wind,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { differenceInDays, format } from "date-fns";
import { trpc } from "@/trpc/client";
import { Toast } from "@/components/ui/toast";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Fetch property by ID
  const {
    data: property,
    isLoading,
    error,
  } = trpc.property.getPropertyById.useQuery(
    { _id: params?.id as string },
    { enabled: !!params?.id }
  );

  // TRPC mutation for creating booking request
  const createBookingMutation = trpc.booking.createBookingRequest.useMutation({
    onSuccess: (result) => {
      toast.success("Booking Request Sent! ✨", {
        description:
          "The owner will review your request. You'll be notified once they respond.",
        duration: 5000,
      });
      // Navigate to payment page where user will wait for approval
      router.push(`/booking/payment?id=${result.bookingId}`);
    },
    onError: (error) => {
      toast.error("Booking Failed", {
        description: error.message || "Failed to create booking request",
      });
    },
  });

  // Fetch similar properties based on city
  const { data: similarPropertiesData } = trpc.property.getFiltered.useQuery(
    {
      location: property?.city || "",
      sortBy: "featured",
    },
    {
      enabled: !!property?.city,
    }
  );

  // Ensure we have an array and filter out current property
  const similarProperties = Array.isArray(similarPropertiesData)
    ? similarPropertiesData
    : [];
  const filteredSimilarProperties = similarProperties
    .filter((prop) => prop._id !== property?._id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
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

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Property not found</h1>
          <Button onClick={() => router.push("/properties")}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  // Get property images
  const propertyImages1 =
    property.propertyImages && property.propertyImages.length > 0
      ? property.propertyImages
      : property.propertyCoverFileUrl
      ? [property.propertyCoverFileUrl]
      : ["/placeholder-property.jpg"];

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = differenceInDays(new Date(checkOut), new Date(checkIn));
    return days > 0 ? days * property.basePrice : 0;
  };

  const handleBooking = async () => {
    const total = calculateTotal();
    if (total <= 0) return;

    if (!property) {
      Toast( { title: "Property not found"});
      return;
    }

    setIsBookingLoading(true);
    try {
      await createBookingMutation.mutateAsync({
        propertyId: String(property._id),
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
        guests,
        price: total,
      });
      // onSuccess of mutation will handle toast and navigation
    } catch (e) {
      // onError of mutation shows toast
    } finally {
      setIsBookingLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyImages1.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages1.length - 1 : prev - 1
    );
  };

  // Amenity icons mapping
  const amenityIcons: { [key: string]: any } = {
    WiFi: Wifi,
    Wifi: Wifi,
    Pool: Waves,
    "Air Conditioning": Wind,
    Kitchen: Utensils,
    Parking: Car,
    "Hot Tub": Droplets,
    "Beach Access": Waves,
    "Gym Access": Dumbbell,
    Fireplace: Flame,
  };

  // Get all amenities from generalAmenities object
  const amenitiesList = property.generalAmenities
    ? Object.entries(property.generalAmenities)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
    : [];

  // Format location string
  const locationString = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                {property.propertyName ||
                  property.placeName ||
                  "Beautiful Property"}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{locationString}</span>
                </div>
                {property.rating && property.rating > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">
                        {property.rating.toFixed(1)}
                      </span>
                      <span>({property.reviews?.length || 0} reviews)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {property.featured && (
              <Badge className="bg-sky-600">Featured</Badge>
            )}
          </div>

          {/* Image Gallery */}
          <div className="relative mb-8 h-[500px] overflow-hidden rounded-2xl">
            <Image
              src={propertyImages1[currentImageIndex]}
              alt={property.propertyName || "Property"}
              fill
              className="object-cover"
              priority
            />
            {propertyImages1.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {propertyImages1.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "w-8 bg-white"
                          : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-2xl font-semibold">
                  Property Details
                </h2>
                <div className="mb-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span>{property.guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <span>
                      {property.bedrooms} bedroom
                      {property.bedrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <span>
                      {property.bathroom} bathroom
                      {property.bathroom !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {property.beds && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-600" />
                      <span>
                        {property.beds} bed{property.beds !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  <Badge variant="outline">{property.propertyType}</Badge>
                  {property.rentalForm && (
                    <Badge variant="outline">{property.rentalForm}</Badge>
                  )}
                </div>
                <Separator className="my-6" />

                {/* Property Info */}
                <div className="space-y-4">
                  {property.size && (
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-gray-600" />
                      <span>{property.size} sq ft</span>
                    </div>
                  )}

                  {property.propertyStyle && (
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-900">
                        Style
                      </h3>
                      <p className="text-gray-700">{property.propertyStyle}</p>
                    </div>
                  )}

                  {property.constructionYear && (
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-900">
                        Built
                      </h3>
                      <p className="text-gray-700">
                        {property.constructionYear}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Amenities */}
              {amenitiesList.length > 0 && (
                <Card className="mb-6 p-6">
                  <h2 className="mb-4 text-2xl font-semibold">Amenities</h2>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {amenitiesList.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div key={amenity} className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                            <Icon className="h-5 w-5 text-sky-600" />
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* House Rules */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-2xl font-semibold">House Rules</h2>
                <div className="space-y-3">
                  {property.smoking && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Smoking</span>
                      <Badge
                        variant={
                          property.smoking === "allowed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {property.smoking}
                      </Badge>
                    </div>
                  )}
                  {property.pet && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Pets</span>
                      <Badge
                        variant={
                          property.pet === "allowed" ? "default" : "secondary"
                        }
                      >
                        {property.pet}
                      </Badge>
                    </div>
                  )}
                  {property.party && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Parties/Events</span>
                      <Badge
                        variant={
                          property.party === "allowed" ? "default" : "secondary"
                        }
                      >
                        {property.party}
                      </Badge>
                    </div>
                  )}
                  {property.cooking && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cooking</span>
                      <Badge
                        variant={
                          property.cooking === "allowed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {property.cooking}
                      </Badge>
                    </div>
                  )}
                </div>
                {property.additionalRules &&
                  property.additionalRules.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-900">
                          Additional Rules
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {property.additionalRules.map((rule: string, idx: number) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
              </Card>

              {/* Location */}
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Location</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{locationString}</p>
                      {property.street && (
                        <p className="text-sm text-gray-600">
                          {property.street}
                        </p>
                      )}
                      {property.postalCode && (
                        <p className="text-sm text-gray-600">
                          {property.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {property.neighbourhood && (
                    <div className="mt-3">
                      <h3 className="mb-1 font-semibold text-gray-900">
                        Neighbourhood
                      </h3>
                      <p className="text-gray-700">{property.neighbourhood}</p>
                    </div>
                  )}

                  {property.nearbyLocations &&
                    property.nearbyLocations.length > 0 && (
                      <div className="mt-3">
                        <h3 className="mb-2 font-semibold text-gray-900">
                          Nearby Locations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {property.nearbyLocations.map(
                            (location: any, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {typeof location === "string"
                                  ? location
                                  : location.name}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-sky-600">
                      ${property.basePrice}
                    </span>
                    <span className="text-gray-600">/ night</span>
                  </div>
                  {property.weekendPrice &&
                    property.weekendPrice !== property.basePrice && (
                      <p className="mt-1 text-sm text-gray-600">
                        Weekend: ${property.weekendPrice}/night
                      </p>
                    )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Guests
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={property.guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      Maximum {property.guests} guests
                    </p>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="my-6 rounded-lg bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        ${property.basePrice} x{" "}
                        {differenceInDays(
                          new Date(checkOut),
                          new Date(checkIn)
                        )}{" "}
                        night
                        {differenceInDays(
                          new Date(checkOut),
                          new Date(checkIn)
                        ) !== 1
                          ? "s"
                          : ""}
                      </span>
                      <span className="font-medium">${calculateTotal()}</span>
                    </div>
                    {property.weeklyDiscount &&
                      differenceInDays(new Date(checkOut), new Date(checkIn)) >=
                        7 && (
                        <div className="mb-2 flex justify-between text-sm text-green-600">
                          <span>
                            Weekly discount ({property.weeklyDiscount}%)
                          </span>
                          <span>
                            -$
                            {(
                              (calculateTotal() * property.weeklyDiscount) /
                              100
                            ).toFixed(0)}
                          </span>
                        </div>
                      )}
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-sky-600">
                        $
                        {property.weeklyDiscount &&
                        differenceInDays(
                          new Date(checkOut),
                          new Date(checkIn)
                        ) >= 7
                          ? (
                              calculateTotal() *
                              (1 - property.weeklyDiscount / 100)
                            ).toFixed(0)
                          : calculateTotal()}
                      </span>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || calculateTotal() <= 0}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {property.isInstantBooking
                    ? "Book Instantly"
                    : "Request to Book"}
                </Button>

                <p className="mt-4 text-center text-xs text-gray-600">
                  You won't be charged yet
                </p>

                {property.isInstantBooking && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
                    <span className="font-semibold">✓</span>
                    <span>Instant booking available</span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {filteredSimilarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Similar Properties in {property.city}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSimilarProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
