"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Home,
  Calendar,
  Wifi,
  Waves,
  Wind,
  Utensils,
  Car,
  Droplets,
  Dumbbell,
  Flame,
  Share2,
  Copy,
  Check,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { trpc } from "@/trpc/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginContent } from "@/components/auth/login-form";
import { useUserStore } from "@/lib/store";

interface PropertyContentProps {
  property: any;
  similarProperties: any[];
}

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

export function PropertyContent({
  property,
  similarProperties,
}: PropertyContentProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginIntent, setLoginIntent] = useState<"favorite" | "booking" | null>(
    null
  );

  // Fetch user favorites - same pattern as property-card
  const { data: favorites = [], refetch } =
    trpc.favorite.getMyFavorites.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
      enabled: !!user,
    });

  // Toggle favorite mutation - same pattern as property-card
  const toggleMutation = trpc.favorite.toggle.useMutation({
    onSuccess: () => refetch(),
    onError: (error) => {
      toast.error("Failed to update favorites. Please try again.");
    },
  });

  // Check if current property is favorited
  const favorite = favorites.includes(property._id);

  // TRPC mutation for creating booking request
  const createBookingMutation = trpc.booking.createBookingRequest.useMutation({
    onSuccess: (result) => {
      toast.success("Booking Request Sent! ✨", {
        description:
          "The owner will review your request. You'll be notified once they respond.",
        duration: 5000,
      });
      router.push(`/booking/payment?id=${result.bookingId}`);
    },
    onError: (error) => {
      toast.error("Booking Failed", {
        description: error.message || "Failed to create booking request",
      });
    },
  });

  const locationString = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(", ");

  const amenitiesList = property.generalAmenities
    ? Object.entries(property.generalAmenities)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
    : [];

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = differenceInDays(new Date(checkOut), new Date(checkIn));
    return days > 0 ? days * property.basePrice : 0;
  };

  const handleBooking = async () => {
    if (!user) {
      setLoginIntent("booking");
      setShowLoginDialog(true);
      return;
    }

    const total = calculateTotal();
    if (total <= 0) return;

    setIsBookingLoading(true);
    try {
      await createBookingMutation.mutateAsync({
        propertyId: String(property._id),
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
        guests,
        price: total,
      });
    } catch (e) {
      // Error handled by mutation
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    // Check if user is logged in
    if (!user) {
      setLoginIntent("favorite");
      setShowLoginDialog(true);
      return;
    }

    // User is logged in, proceed with toggle
    toggleMutation.mutate({ propertyId: property._id });
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    if (loginIntent === "favorite") {
      // After login, toggle the favorite
      toggleMutation.mutate({ propertyId: property._id });
    }
    setLoginIntent(null);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = property.propertyName || "Check out this property";
    const shareText = `${shareTitle} - ${locationString}`;

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setIsShareOpen(false);
      } catch (err) {
        // User cancelled or share failed, show popover
        if ((err as Error).name !== "AbortError") {
          setIsShareOpen(true);
        }
      }
    } else {
      // Desktop - show popover with options
      setIsShareOpen(true);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => {
        setIsCopied(false);
        setIsShareOpen(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = property.propertyName || "Check out this property";
    
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "instagram":
        // Instagram doesn't support web sharing, so copy link and notify user
        handleCopyLink();
        toast.info("Link copied! Open Instagram app to share", {
          description: "Paste the link in your Instagram story or post",
        });
        return;
    }
    
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
      setIsShareOpen(false);
    }
  };

  return (
    <>
      {/* Property Header */}
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
        <div className="flex items-center gap-3">
          {property.featured && <Badge className="bg-sky-600">Featured</Badge>}
          
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="gap-2 hover:bg-white/80"
          >
            <Heart
              className={`h-4 w-4 ${
                favorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600"
              }`}
            />
            <span className="hidden sm:inline">
              {favorite ? "Liked" : "Like"}
            </span>
          </Button>
          
          {/* Share Button */}
          <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2 hover:bg-white/80"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Share this property
                </p>
                
                <button
                  onClick={() => shareOnSocialMedia("whatsapp")}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia("facebook")}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">Facebook</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia("instagram")}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700">Instagram</span>
                </button>

                <div className="my-2 border-t" />

                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                    {isCopied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <span className="text-gray-700">
                    {isCopied ? "Copied!" : "Copy link"}
                  </span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2">
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Property Details</h2>
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

            <div className="space-y-4">
              {property.size && (
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-600" />
                  <span>{property.size} sq ft</span>
                </div>
              )}

              {property.propertyStyle && (
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Style</h3>
                  <p className="text-gray-700">{property.propertyStyle}</p>
                </div>
              )}

              {property.constructionYear && (
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Built</h3>
                  <p className="text-gray-700">{property.constructionYear}</p>
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
                      property.smoking === "allowed" ? "default" : "secondary"
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
                      property.cooking === "allowed" ? "default" : "secondary"
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
                      {property.additionalRules.map(
                        (rule: string, idx: number) => (
                          <li key={idx}>{rule}</li>
                        )
                      )}
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
                    <p className="text-sm text-gray-600">{property.street}</p>
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
                €{property.basePrice}
                </span>
                <span className="text-gray-600">/ night</span>
              </div>
              {property.weekendPrice &&
                property.weekendPrice !== property.basePrice && (
                  <p className="mt-1 text-sm text-gray-600">
                    Weekend: €{property.weekendPrice}/night
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
              <div className="my-6 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">
                  €{property.basePrice} x{" "}
                    {differenceInDays(new Date(checkOut), new Date(checkIn))}{" "}
                    night
                    {differenceInDays(new Date(checkOut), new Date(checkIn)) !==
                    1
                      ? "s"
                      : ""}
                  </span>
                  <span className="font-medium">€{calculateTotal()}</span>
                </div>
                {property.weeklyDiscount &&
                  differenceInDays(new Date(checkOut), new Date(checkIn)) >=
                    7 && (
                    <div className="mb-2 flex justify-between text-sm text-green-600">
                      <span>Weekly discount ({property.weeklyDiscount}%)</span>
                      <span>
                        -€
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
                  €
                    {property.weeklyDiscount &&
                    differenceInDays(new Date(checkOut), new Date(checkIn)) >= 7
                      ? (
                          calculateTotal() *
                          (1 - property.weeklyDiscount / 100)
                        ).toFixed(0)
                      : calculateTotal()}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={!checkIn || !checkOut || calculateTotal() <= 0}
              className="w-full bg-sky-600 hover:bg-sky-700"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {property.isInstantBooking ? "Book Instantly" : "Request to Book"}
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

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Similar Properties in {property.city}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similarProperties.map((prop: any) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onOpenChange={(open) => {
          setShowLoginDialog(open);
          if (!open) setLoginIntent(null);
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <LoginContent
            isModal={true}
            onSuccess={handleLoginSuccess}
            redirectUrl={typeof window !== "undefined" ? window.location.pathname : ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
