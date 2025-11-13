"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import { useSearchStore } from "@/lib/store";
import { trpc } from "@/trpc/client";

export default function PropertiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { location } = useSearchStore();

  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    propertyTypes: [] as string[],
    minBedrooms: 0,
    minBathrooms: 0,
    minGuests: 0,
    minRating: 0,
    amenities: [] as string[],
    sortBy: "featured" as "featured" | "price-low" | "price-high" | "rating",
  });

  const propertyTypes = [
    "Villa",
    "Apartment",
    "House",
    "Cottage",
    "Bungalow",
    "Cabin",
    "Chalet",
    "Penthouse",
  ];
  const amenitiesList = [
    "WiFi",
    "Pool",
    "Air Conditioning",
    "Kitchen",
    "Parking",
    "Hot Tub",
    "Beach Access",
    "Gym Access",
    "Fireplace",
  ];

  // Fetch filtered properties from backend
  const { data: propertiesData, isLoading } =
    trpc.property.getFiltered.useQuery({
      location,
      priceRange: filters.priceRange,
      propertyTypes:
        filters.propertyTypes.length > 0 ? filters.propertyTypes : undefined,
      minBedrooms: filters.minBedrooms > 0 ? filters.minBedrooms : undefined,
      minBathrooms: filters.minBathrooms > 0 ? filters.minBathrooms : undefined,
      minGuests: filters.minGuests > 0 ? filters.minGuests : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      sortBy: filters.sortBy,
    });

  // Ensure we have an array
  const properties = Array.isArray(propertiesData) ? propertiesData : [];

  const handlePropertyTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      propertyTypes: [],
      minBedrooms: 0,
      minBathrooms: 0,
      minGuests: 0,
      minRating: 0,
      amenities: [],
      sortBy: "featured",
    });
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear All
        </Button>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Price Range</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: value as [number, number],
            }))
          }
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}+</span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Property Type</h4>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={type}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => handlePropertyTypeToggle(type)}
              />
              <label
                htmlFor={type}
                className="ml-2 cursor-pointer text-sm text-gray-700"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Rooms</h4>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              Min Bedrooms
            </label>
            <Input
              type="number"
              min="0"
              value={filters.minBedrooms}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minBedrooms: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              Min Bathrooms
            </label>
            <Input
              type="number"
              min="0"
              value={filters.minBathrooms}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minBathrooms: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Guests</h4>
        <Input
          type="number"
          min="0"
          value={filters.minGuests}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              minGuests: parseInt(e.target.value) || 0,
            }))
          }
        />
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Minimum Rating</h4>
        <Select
          value={filters.minRating.toString()}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, minRating: parseFloat(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Amenities</h4>
        <div className="space-y-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Checkbox
                id={amenity}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <label
                htmlFor={amenity}
                className="ml-2 cursor-pointer text-sm text-gray-700"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {location ? `Properties in ${location}` : "All Properties"}
          </h1>
          <p className="text-gray-600">
            {properties.length} properties available
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: value as typeof filters.sortBy,
              }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm">
              <FilterSection />
            </div>
          </aside>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowFilters(false)}
                    className="absolute right-4 top-4"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <FilterSection />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-xl bg-gray-200"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <Filter className="mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No properties found
                </h3>
                <p className="mb-4 text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={resetFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
