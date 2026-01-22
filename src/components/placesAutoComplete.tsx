// components/placesAutoComplete.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PlacesAutocompleteProps {
  onPlaceSelected: (place: {
    address: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
  countryCode: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelected,
  countryCode,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || typeof window === "undefined" || !window.google)
      return;

    // Initialize autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: countryCode
          ? { country: getCountryCode(countryCode) }
          : undefined,
      }
    );

    // Add listener for place selection
    const listener = autocompleteRef.current.addListener(
      "place_changed",
      async () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry) {
          console.log("No place details available");
          return;
        }

        const addressComponents = place.address_components || [];

        let street = "";
        let city = "";
        let state = "";
        let postalCode = "";
        let country = "";

        // Extract address components
        addressComponents.forEach((component) => {
          const types = component.types;

          if (types.includes("street_number")) {
            street = component.long_name + " ";
          }
          if (types.includes("route")) {
            street += component.long_name;
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (types.includes("postal_code")) {
            postalCode = component.long_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
        });

        // Handle both cases: location as method or as object
        let lat = 0;
        let lng = 0;
        
        const location = place.geometry.location;
        if (location) {
          try {
            // Try calling as methods first (standard Google Maps API)
            if (typeof (location as any).lat === "function") {
              lat = (location as any).lat();
              lng = (location as any).lng();
            } else {
              // Location is an object with properties
              lat = (location as any).lat || 0;
              lng = (location as any).lng || 0;
            }
          } catch (error) {
            // Fallback: try accessing as properties
            lat = (location as any).lat || 0;
            lng = (location as any).lng || 0;
          }
        }
        
        // If coordinates are still 0, try to fetch from place details API
        if (lat === 0 && lng === 0 && place.place_id) {
          console.warn("Coordinates are 0, attempting to fetch place details...");
          try {
            const detailsResponse = await fetch(
              `/api/places/details?place_id=${encodeURIComponent(place.place_id)}`
            );
            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();
              if (detailsData.location) {
                lat = detailsData.location.lat;
                lng = detailsData.location.lng;
              }
            }
          } catch (error) {
            console.error("Error fetching place details:", error);
          }
        }

        onPlaceSelected({
          address: place.formatted_address || "",
          street: street.trim(),
          city,
          state,
          postalCode,
          country,
          lat,
          lng,
        });
      }
    );

    // Cleanup
    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [onPlaceSelected, countryCode]);

  // Update country restriction when countryCode changes
  useEffect(() => {
    if (autocompleteRef.current && countryCode) {
      autocompleteRef.current.setComponentRestrictions({
        country: getCountryCode(countryCode),
      });
    }
  }, [countryCode]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for an address..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-10 h-12 text-base"
      />
    </div>
  );
};

// Helper function to convert country names to ISO codes
function getCountryCode(countryName: string): string {
  const countryMap: { [key: string]: string } = {
    Greece: "gr",
    Italy: "it",
    Cyprus: "cy",
    US: "us",
    "United States": "us",
    Netherlands: "nl",
    UK: "gb",
    "United Kingdom": "gb",
    Hungary: "hu",
    Turkey: "tr",
    Bulgaria: "bg",
    Lithuania: "lt",
    Malta: "mt",
    Romania: "ro",
    Spain: "es",
    Croatia: "hr",
    Portugal: "pt",
    Slovenia: "si",
    Slovakia: "sk",
    "Viet Nam": "vn",
    Vietnam: "vn",
    Thailand: "th",
    France: "fr",
    Singapore: "sg",
    Japan: "jp",
    Korea: "kr",
    "South Korea": "kr",
    India: "in",
    Canada: "ca",
    Australia: "au",
  };

  return countryMap[countryName] || countryName.toLowerCase();
}

export default PlacesAutocomplete;
