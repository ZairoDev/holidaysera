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
      () => {
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

        const lat = place.geometry.location?.lat() || 0;
        const lng = place.geometry.location?.lng() || 0;

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
