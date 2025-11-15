"use client";
import { Loader2, Edit, Home, Check, Building2, MapPin, Users, DollarSign } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export interface PageAddListing10Props {}

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

const PageAddListing10: FC<PageAddListing10Props> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyCoverFileUrl, setPropertyCoverFileUrl] = useState<string>("");
  const [page3, setPage3] = useState<Page3State | null>(null);
  const [page2, setPage2] = useState<Page2State | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [beds, setBeds] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);

  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      try {
        const page3Data = localStorage.getItem("page3");
        const page2Data = localStorage.getItem("page2");
        const page8Data = localStorage.getItem("page8");
        const propertyCoverUrl = localStorage.getItem("propertyCoverFileUrl") || "";

        if (page3Data) {
          const parsedPage3 = JSON.parse(page3Data);
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
          setPage2(JSON.parse(page2Data));
        }

        if (propertyCoverUrl) {
          setPropertyCoverFileUrl(propertyCoverUrl);
        }
        
        if (page8Data) {
          const page8 = JSON.parse(page8Data);
          if (page8.basePrice && page8.basePrice[0]) {
            setBasePrice(parseInt(page8.basePrice[0]));
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
      const allData: any = {};
      for (let i = 1; i <= 10; i++) {
        const data = localStorage.getItem(`page${i}`);
        if (data) {
          Object.assign(allData, JSON.parse(data));
        }
      }

      // TODO: Send listing data to backend using tRPC or API
      console.log("Publishing property:", allData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Clear localStorage after successful submission
      for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`page${i}`);
      }
      localStorage.removeItem("propertyCoverFileUrl");
      localStorage.removeItem("propertyPictureUrls");
      localStorage.removeItem("portionCoverFileUrls");
      localStorage.removeItem("portionPictureUrls");
      
    } catch (error) {
      console.error("Error publishing property:", error);
    } finally {
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
