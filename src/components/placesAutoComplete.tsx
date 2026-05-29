// components/placesAutoComplete.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { countries } from "country-data-list";

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

    const isoCountry = getCountryCode(countryCode);

    // Initialize autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: isoCountry
          ? { country: isoCountry }
          : undefined,
      }
    );

    // Add listener for place selection
    const listener = autocompleteRef.current.addListener(
      "place_changed",
      async () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry) {
          // console.log("No place details available");
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

        let lat = 0;
        let lng = 0;

        const location = place.geometry?.location;
        if (location) {
          // google.maps.places.PlaceResult.geometry.location is a google.maps.LatLng
          lat = location.lat();
          lng = location.lng();
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
      const isoCountry = getCountryCode(countryCode);
      autocompleteRef.current.setComponentRestrictions(
        isoCountry ? { country: isoCountry } : null
      );
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

function normalizeCountryName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Converts a country input (alpha-2 code, alpha-3 code, or country name)
 * into a valid ISO 3166-1 alpha-2 code for Google Places.
 *
 * Google expects a 2-letter code like "ad" or "mv".
 */
function getCountryCode(countryInput: string): string | undefined {
  const trimmed = countryInput.trim();
  if (!trimmed) return undefined;

  // If it's already a valid alpha-2 code, use it.
  if (/^[a-zA-Z]{2}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  // If it's an alpha-3 code, map it to alpha-2.
  if (/^[a-zA-Z]{3}$/.test(trimmed)) {
    const upperAlpha3 = trimmed.toUpperCase();
    const matchByAlpha3 = countries.all.find(
      (c) => c.alpha3.toUpperCase() === upperAlpha3
    );
    return matchByAlpha3?.alpha2.toLowerCase();
  }

  // Otherwise treat it as a country name and match (case-insensitive).
  const normalized = normalizeCountryName(trimmed);
  const matchByName = countries.all.find(
    (c) => normalizeCountryName(c.name) === normalized
  );

  return matchByName?.alpha2.toLowerCase();
}

export default PlacesAutocomplete;
