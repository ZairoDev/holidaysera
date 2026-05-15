"use client";
import { Loader2, Edit, Home, Check, Building2, MapPin, Users, DollarSign } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface PageAddListing10Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface Page3State {
  portionName: string[];
  portionSize: number[];
  guests: number[];
  bedrooms: number[];
  beds: number[];
  bathroom: number[];
  kitchen: number[];
}

interface Page2State {
  country: string;
  street: string;
  roomNumber: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CombinedData {
  userId?: string;

  propertyType?: string;
  placeName?: string;
  rentalForm?: string;
  numberOfPortions?: number;

  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  center?: object;

  portionName?: string[];
  portionSize?: number[];
  guests?: number[];
  bedrooms?: number[];
  beds?: number[];
  bathroom?: number[];
  kitchen?: number[];
  childrenAge?: number[];

  basePrice?: number[];
  weekendPrice?: number[];
  weeklyDiscount?: number[];
  currency?: string;

  generalAmenities?: object;
  otherAmenities?: object;
  safeAmenities?: object;

  smoking?: string;
  pet?: string;
  party?: string;
  cooking?: string;
  additionalRules?: string[];

  reviews?: string[];

  propertyCoverFileUrl?: string;
  propertyPictureUrls?: string[];
  portionCoverFileUrls?: string[];
  portionPictureUrls?: string[][];

  night: number[];
  time: number[];
  datesPerPortion: number[][];

  rentalType?: string;
  basePriceLongTerm?: number[];
  monthlyDiscount?: number[];
  longTermMonths?: string[];

  isLive?: boolean;
}

const PageAddListing10: FC<PageAddListing10Props> = ({ searchParams }) => {
  const router = useRouter();
  const parseStorageValue = <T,>(key: string, fallback: T): T => {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };
  const getString = (value: unknown, fallback = ""): string =>
    typeof value === "string" ? value : fallback;
  const getNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
  };
  const getNumberArray = (value: unknown): number[] =>
    Array.isArray(value) ? value.map((item) => getNumber(item, 0)) : [];
  const getStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((item) => getString(item, "")) : [];
  const getRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const getBooleanRecord = (value: unknown): Record<string, boolean> => {
    const record = getRecord(value);
    return Object.entries(record).reduce<Record<string, boolean>>((acc, [key, val]) => {
      if (typeof val === "boolean") {
        acc[key] = val;
      }
      return acc;
    }, {});
  };
  const getStringRecord = (value: unknown): Record<string, string> => {
    const record = getRecord(value);
    return Object.entries(record).reduce<Record<string, string>>((acc, [key, val]) => {
      if (typeof val === "string") {
        acc[key] = val;
      }
      return acc;
    }, {});
  };
  const getRentalType = (
    value: unknown
  ): "Short Term" | "Long Term" | "Both" => {
    if (value === "Short Term" || value === "Long Term" || value === "Both") {
      return value;
    }
    return "Short Term";
  };
  const getDatesPerPortion = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.flatMap((dates) =>
      Array.isArray(dates) ? dates.map((item) => String(item)) : []
    );
  };
  const getCenter = (value: unknown): { lat: number; lng: number } | undefined => {
    const record = getRecord(value);
    const lat = getNumber(record.lat, Number.NaN);
    const lng = getNumber(record.lng, Number.NaN);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return undefined;
    }
    return { lat, lng };
  };
  const [isLoading, setIsLoading] = useState(false);
  const [propertyCoverFileUrl, setPropertyCoverFileUrl] = useState<string>("");
  const [page3, setPage3] = useState<Page3State | null>(null);
  const [page2, setPage2] = useState<Page2State | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [beds, setBeds] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  // TRPC mutation for adding listing
  const addListingMutation = trpc.property.addListing.useMutation({
    onSuccess: (data) => {
      toast.success("Success! 🎉", {
        description:
          data?.message ||
          "Your property has been submitted and is pending admin approval.",
      });
      
      // Clear localStorage
      for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`page${i}`);
      }
      localStorage.removeItem("propertyCoverFileUrl");
      localStorage.removeItem("propertyPictureUrls");
      localStorage.removeItem("portionCoverFileUrls");
      localStorage.removeItem("portionPictureUrls");
      localStorage.removeItem("isImages");
      localStorage.removeItem("isPropertyPictures");
      localStorage.removeItem("isPortionPictures");
      
      // Redirect to properties page
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to publish property. Please try again.",
      });
      setIsLoading(false);
    },
  });

  // TRPC mutation for updating listing (edit flow)
  const updateListingMutation = trpc.property.updateListing.useMutation({
    onSuccess: (data) => {
      toast.success("Updated! 🎉", {
        description: "Your property listing has been updated successfully!",
      });

      // Clear localStorage (same cleanup)
      for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`page${i}`);
      }
      localStorage.removeItem("propertyCoverFileUrl");
      localStorage.removeItem("propertyPictureUrls");
      localStorage.removeItem("portionCoverFileUrls");
      localStorage.removeItem("portionPictureUrls");
      localStorage.removeItem("isImages");
      localStorage.removeItem("isPropertyPictures");
      localStorage.removeItem("isPortionPictures");

      // Redirect to the property page
      setTimeout(() => {
        if (data?.property?._id) {
          router.push(`/properties/${data.property._id}`);
        } else {
          router.push("/profile");
        }
      }, 600);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to update property. Please try again.",
      });
      setIsLoading(false);
    },
  });


  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      try {
        const page3Data = localStorage.getItem("page3");
        const page2Data = localStorage.getItem("page2");
        const page8Data = localStorage.getItem("page8");
        const propertyCoverUrl = localStorage.getItem("propertyCoverFileUrl") || "";

        if (page3Data) {
          const parsedPage3 = parseStorageValue<Page3State>("page3", {
            portionName: [],
            portionSize: [],
            guests: [],
            bedrooms: [],
            beds: [],
            bathroom: [],
            kitchen: [],
          });
          setPage3(parsedPage3);
          // Extract beds and bathrooms
          if (parsedPage3.beds && parsedPage3.beds[0]) {
            setBeds(parsedPage3.beds[0]);
          }
          if (parsedPage3.bathroom && parsedPage3.bathroom[0]) {
            setBathrooms(parsedPage3.bathroom[0]);
          }
        }

        if (page2Data) {
          setPage2(parseStorageValue<Page2State | null>("page2", null));
        }

        if (propertyCoverUrl) {
          setPropertyCoverFileUrl(propertyCoverUrl);
        }
        
        if (page8Data) {
          const page8 = parseStorageValue<{ basePrice?: Array<number | string> }>(
            "page8",
            {}
          );
          const firstBasePrice = page8.basePrice?.[0];
          if (typeof firstBasePrice === "number") {
            setBasePrice(firstBasePrice);
          } else if (typeof firstBasePrice === "string") {
            const parsedBasePrice = parseInt(firstBasePrice, 10);
            if (!Number.isNaN(parsedBasePrice)) {
              setBasePrice(parsedBasePrice);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data from localStorage:", error);
      }
    };

    fetchDataFromLocalStorage();
  }, []);

  const handleGoLive = async () => {
    setIsLoading(true);
    try {
      // Collect all data from localStorage
      const page1 = parseStorageValue<Record<string, unknown>>("page1", {});
      const page2Data = parseStorageValue<Record<string, unknown>>("page2", {});
      const page3Data = parseStorageValue<Record<string, unknown>>("page3", {});
      const page4 = parseStorageValue<Record<string, unknown>>("page4", {});
      const page5 = parseStorageValue<Record<string, unknown>>("page5", {});
      const page6 = parseStorageValue<Record<string, unknown>>("page6", {});
      const page7 = parseStorageValue<Record<string, unknown>>("page7", {});
      const page8 = parseStorageValue<Record<string, unknown>>("page8", {});
      const page9 = parseStorageValue<Record<string, unknown>>("page9", {});

      // Image data is stored separately in localStorage by step 7
      const storedPropertyPictureUrls: string[] = parseStorageValue<string[]>(
        "propertyPictureUrls",
        []
      );

      // Build listing object with all necessary fields
      // Update the handleGoLive function to send correct data types
      const listingData = {
        // Basic Info (Page 1)
        propertyType: getString(page1.propertyType, "House"),
        propertyName: getString(page1.placeName, "Untitled Property"),
        placeName: getString(page1.placeName, ""),
        rentalType: getRentalType(page1.rentalType),
        rentalForm: getString(page1.rentalForm, ""),

        // Location (Page 2)
        street: getString(page2Data.street, ""),
        postalCode: getString(page2Data.postalCode, ""),
        city: getString(page2Data.city, ""),
        state: getString(page2Data.state, ""),
        country: getString(page2Data.country, ""),
        center: getCenter(page2Data.center),

        // Spaces (Page 3) - EXTRACT FIRST VALUE FROM ARRAYS
        guests: getNumberArray(page3Data.guests)[0] || 1,
        bedrooms: getNumberArray(page3Data.bedrooms)[0] || 0,
        beds: getNumberArray(page3Data.beds)[0] || 0,
        bathroom: getNumberArray(page3Data.bathroom)[0] || 0,
        kitchen: getNumberArray(page3Data.kitchen)[0] || 0,
        size: getNumberArray(page3Data.portionSize)[0] || 0,

        // Amenities (Page 4)
        generalAmenities: getBooleanRecord(page4.generalAmenities),
        otherAmenities: getBooleanRecord(page4.otherAmenities),
        safeAmenities: getBooleanRecord(page4.safeAmenities),

        // House Rules (Page 5)
        smoking: getString(page5.smoking, ""),
        pet: getString(page5.pet, ""),
        party: getString(page5.party, ""),
        cooking: getString(page5.cooking, ""),
        additionalRules: getStringArray(page5.additionalRules),

        // Description (Page 6) - JOIN ARRAY TO STRING
        reviews: getStringArray(page6.reviews).join("\n\n"),

        // Images (Page 7)
        propertyCoverFileUrl:
          localStorage.getItem("propertyCoverFileUrl") ||
          getString(page7.propertyCoverFileUrl, "") ||
          "",
        propertyPictureUrls:
          storedPropertyPictureUrls.length > 0
            ? storedPropertyPictureUrls
            : getStringArray(page7.propertyPictureUrls),

        // Pricing (Page 8) - EXTRACT FIRST VALUES
        basePrice: getNumberArray(page8.basePrice)[0] || 0,
        weekendPrice: getNumberArray(page8.weekendPrice)[0],
        weeklyDiscount: getNumberArray(page8.weeklyDiscount)[0],
        basePriceLongTerm: getNumberArray(page8.basePriceLongTerm)[0],
        monthlyDiscount: getNumberArray(page8.monthlyDiscount)[0],
        currency: getString(page8.currency, "USD"),

        // Availability (Page 9) - CONVERT datesPerPortion TO STRINGS
        night: getNumberArray(page9.night),
        time: getNumberArray(page9.time),
        datesPerPortion: getDatesPerPortion(page9.datesPerPortion),
        icalLinks: getStringRecord(page9.icalLinks),

        // Additional
        isInstantBooking: false,
        isLive: true,
      };

      console.log("Publishing property with data:", listingData);

      // Check searchParams for edit mode (wrapper forwards searchParams to all steps)
      const editParam = searchParams?.edit;
      const editId = Array.isArray(editParam) ? editParam[0] : editParam;

      if (editId) {
        // Update existing property
        await updateListingMutation.mutateAsync({ propertyId: String(editId), updates: listingData });
      } else {
        // Create new property
        await addListingMutation.mutateAsync(listingData);
      }
    } catch (error) {
      console.error("Error publishing property:", error);
      toast.error("Error", {
        description: "Failed to publish property. Please check all fields and try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-blue-950 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Almost done! 🎉
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your listing is ready to go live. Review all the details below to ensure everything is perfect, then publish your property.
        </p>
      </div>

      {/* Property Preview Card */}
      <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Image Section */}
          <div className="md:col-span-1 h-80 md:h-auto flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            {propertyCoverFileUrl ? (
              <img
                src={propertyCoverFileUrl}
                alt="Property cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-2">
                <Home className="w-16 h-16 text-gray-400 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400">No cover image</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {page3?.portionName?.[0] || "Your Property"}
                </h3>
                <Badge className="bg-sky-600 text-white">
                  <Building2 className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
              
              {page2 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {page2.city && page2.country
                      ? `${page2.city}, ${page2.country}`
                      : "Location pending"}
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 rounded-lg p-4 border border-sky-200 dark:border-sky-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-sky-600">
                  {basePrice > 0 ? `€${basePrice}` : "—"}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  per night
                </span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <p className="text-xs font-medium uppercase">Guests</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {page3?.guests?.[0] || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-gray-600 dark:text-gray-400">Bedrooms</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {page3?.bedrooms?.[0] || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-gray-600 dark:text-gray-400">Beds</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {beds || page3?.beds?.[0] || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-gray-600 dark:text-gray-400">Bathrooms</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {bathrooms || page3?.bathroom?.[0] || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {page3?.portionName?.length || "—"}
            </p>
          </div>
        </Card>

        <Card className="p-4 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {page3?.portionSize?.reduce((a, b) => a + b, 0) || "—"}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">m²</span>
            </p>
          </div>
        </Card>

        <Card className="p-4 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 w-fit">
              Ready to Publish
            </Badge>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/add-listing/1" className="flex-1">
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-medium"
          >
            <Edit className="w-5 h-5 mr-2" />
            Go Back to Edit
          </Button>
        </Link>

        <Button
          onClick={handleGoLive}
          disabled={isLoading}
          className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Publish Listing
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PageAddListing10;
