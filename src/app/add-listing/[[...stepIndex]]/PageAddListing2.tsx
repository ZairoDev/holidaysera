"use client";

import React, { FC, useEffect, useState } from "react";
import FormItem from "../FormItem";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlacesAutocomplete from "@/components/placesAutoComplete";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, CheckCircle2 } from "lucide-react";
import { useLoadScript } from "@react-google-maps/api";

// Dynamic import with no SSR
const LocationMap = dynamic(() => import("@/components/locationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
        <p className="text-gray-600 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface Page2State {
  country: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  center: { lat: number; lng: number };
}

const libraries: "places"[] = ["places"];

const PageAddListing2: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<string>("");
  const [country, setCountry] = useState<string>("Greece");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.9838,
    lng: 23.7275,
  });

  // Get API key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Load Google Maps script
  const { isLoaded: isMapsLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  // Debug: Check if API key is loaded (only log first few chars for security)
  useEffect(() => {
    if (googleMapsApiKey) {
      console.log("✅ Google Maps API Key loaded:", googleMapsApiKey.substring(0, 10) + "...");
    } else {
      console.error("❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in environment variables");
      console.error("Environment check:", {
        hasKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        keyLength: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0,
      });
    }
  }, [googleMapsApiKey]);

  // Debug: Log load errors
  useEffect(() => {
    if (loadError) {
      console.error("❌ Google Maps Load Error:", loadError);
      console.error("Error details:", {
        message: loadError.message,
        hasApiKey: !!googleMapsApiKey,
        apiKeyPrefix: googleMapsApiKey.substring(0, 10),
      });
    }
  }, [loadError, googleMapsApiKey]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedPage2 = localStorage.getItem("page2");
    if (savedPage2) {
      try {
        const parsed: Page2State = JSON.parse(savedPage2);
        setCountry(parsed.country || "Greece");
        setStreet(parsed.street || "");
        setCity(parsed.city || "");
        setState(parsed.state || "");
        setPostalCode(parsed.postalCode || "");
        setCenter(parsed.center || { lat: 37.9838, lng: 23.7275 });

        const addressParts = [
          parsed.street,
          parsed.city,
          parsed.state,
          parsed.postalCode,
          parsed.country,
        ].filter(Boolean);
        setAddress(addressParts.join(", "));
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever any field changes
  useEffect(() => {
    if (!isLoading) {
      const page2Data: Page2State = {
        country,
        street,
        city,
        state,
        postalCode,
        center,
      };
      localStorage.setItem("page2", JSON.stringify(page2Data));
    }
  }, [country, street, city, state, postalCode, center, isLoading]);

  const handlePlaceSelected = (place: any) => {
    console.log("Place selected:", place);
    setAddress(place.address);
    setCountry(place.country || country);
    setState(place.state || "");
    setCity(place.city || "");
    setStreet(place.street || "");
    setPostalCode(place.postalCode || "");
    setCenter({ lat: place.lat, lng: place.lng });
  };

  const isAddressComplete = street && city && postalCode && country;
  const hasCoordinates = center.lat !== 0 && center.lng !== 0;

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Google Maps API Key Missing</p>
          <p className="text-sm text-gray-500">
            The NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is not set.
            Please configure it in your production environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Failed to load Google Maps</p>
          <p className="text-sm text-gray-500">
            {loadError.message || "Please check your API key configuration"}
          </p>
          {loadError.message?.includes("API key") && (
            <p className="text-xs text-gray-400 mt-2">
              Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in your environment variables
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading || !isMapsLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 text-sky-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Where's your place located?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your address is only shared with guests after they've made a
              reservation
            </p>
          </div>
        </div>
      </div>

      {/* Country Selection */}
      <Card className="p-6 border-2 border-gray-200 hover:border-sky-300 transition-colors">
        <FormItem label="Country/Region">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="Greece">🇬🇷 Greece</SelectItem>
              <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
              <SelectItem value="Cyprus">🇨🇾 Cyprus</SelectItem>
              <SelectItem value="US">🇺🇸 United States</SelectItem>
              <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
              <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
              <SelectItem value="Hungary">🇭🇺 Hungary</SelectItem>
              <SelectItem value="Turkey">🇹🇷 Turkey</SelectItem>
              <SelectItem value="Bulgaria">🇧🇬 Bulgaria</SelectItem>
              <SelectItem value="Lithuania">🇱🇹 Lithuania</SelectItem>
              <SelectItem value="Malta">🇲🇹 Malta</SelectItem>
              <SelectItem value="Romania">🇷🇴 Romania</SelectItem>
              <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
              <SelectItem value="Croatia">🇭🇷 Croatia</SelectItem>
              <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
              <SelectItem value="Slovenia">🇸🇮 Slovenia</SelectItem>
              <SelectItem value="Slovakia">🇸🇰 Slovakia</SelectItem>
              <SelectItem value="Viet Nam">🇻🇳 Vietnam</SelectItem>
              <SelectItem value="Thailand">🇹🇭 Thailand</SelectItem>
              <SelectItem value="France">🇫🇷 France</SelectItem>
              <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
              <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
              <SelectItem value="Korea">🇰🇷 South Korea</SelectItem>
              <SelectItem value="India">🇮🇳 India</SelectItem>
              <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
              <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </Card>

      {/* Address Search */}
      <Card className="p-6 border-2 border-gray-200 hover:border-sky-300 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Search for your address
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Use the search below to quickly find and auto-fill your property
            address
          </p>
          {isMapsLoaded && (
            <div className="w-full">
              <PlacesAutocomplete
                onPlaceSelected={handlePlaceSelected}
                countryCode={country}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Manual Address Entry */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Address Details
            </h3>
            <p className="text-sm text-gray-500">
              Fill in or verify the address details below
            </p>
          </div>

          <FormItem label="Street Address">
            <Input
              placeholder="Enter street address (e.g., 123 Main Street)"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="h-12 text-base"
            />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormItem label="City">
              <Input
                placeholder="City name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 text-base"
              />
            </FormItem>
            <FormItem label="State/Province">
              <Input
                placeholder="State or province"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-12 text-base"
              />
            </FormItem>
            <FormItem label="Postal Code">
              <Input
                placeholder="ZIP/Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-12 text-base"
              />
            </FormItem>
          </div>
        </div>
      </Card>

      {/* Coordinates Display */}
      <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Property Coordinates
            </h3>
            {hasCoordinates && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Set
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Latitude
              </span>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {center.lat !== 0 ? center.lat.toFixed(6) : "—"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Longitude
              </span>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {center.lng !== 0 ? center.lng.toFixed(6) : "—"}
              </p>
            </div>
          </div>

          {!hasCoordinates && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              Coordinates will be set automatically when you select an address
            </p>
          )}
        </div>
      </Card>

      {/* Address Preview */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Address Preview
            </h3>
            {isAddressComplete && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[80px] flex items-center">
            {street || city || state || postalCode ? (
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                {street && <p className="text-base font-medium">{street}</p>}
                {(city || state || postalCode) && (
                  <p className="text-sm">
                    {[city, state, postalCode].filter(Boolean).join(", ")}
                  </p>
                )}
                {country && (
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {country}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">
                Your property address will appear here as you fill in the fields
                above
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Map Display */}
      <Card className="overflow-hidden border-2 border-gray-200">
        <div className="p-6 pb-4 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Location on Map
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Verify your property's exact location
          </p>
        </div>

        <div className="relative w-full h-[400px] bg-gray-100">
          {isMapsLoaded ? (
            <>
              <LocationMap 
                latitude={center.lat} 
                longitude={center.lng}
                draggable={hasCoordinates}
                onMarkerDrag={(lat, lng) => {
                  setCenter({ lat, lng });
                }}
              />

              {!hasCoordinates && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-3 p-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        No location set
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Search or enter an address to see it on the map
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hasCoordinates && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 z-10">
                  <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    Drag the marker to fine-tune location
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PageAddListing2;
