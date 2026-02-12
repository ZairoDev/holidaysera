"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, SlidersHorizontal, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useInView } from "react-intersection-observer";
import { Property } from "@/lib/type";

export default function PropertiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { location } = useSearchStore();
  
  // Local state for input values (to prevent filtering while typing)
  const [bedroomsInput, setBedroomsInput] = useState<string>("");
  const [bathroomsInput, setBathroomsInput] = useState<string>("");
  const [guestsInput, setGuestsInput] = useState<string>("");
  
  // Debounce timers
  const bedroomsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bathroomsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const guestsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const priceRangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepperDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Local state for stepper display (updates immediately); filters commit after debounce
  const [stepperBedrooms, setStepperBedrooms] = useState(0);
  const [stepperBathrooms, setStepperBathrooms] = useState(0);
  const [stepperGuests, setStepperGuests] = useState(0);
  const stepperBedroomsRef = useRef(0);
  const stepperBathroomsRef = useRef(0);
  const stepperGuestsRef = useRef(0);
  
  // Local state for slider value (for immediate UI feedback)
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 1000]);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    propertyTypes: [] as string[],
    minBedrooms: 0,
    minBathrooms: 0,
    minGuests: 0,
    amenities: [] as string[],
    sortBy: "rating" as  "price-low" | "price-high" | "rating",
  });
  
  // Helper function to update filter with debounce
  const updateBedroomsFilter = (value: string) => {
    if (bedroomsTimerRef.current) {
      clearTimeout(bedroomsTimerRef.current);
    }
    
    bedroomsTimerRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      if (trimmedValue === "") {
        setFilters((prev) => ({ ...prev, minBedrooms: 0 }));
        setBedroomsInput("");
      } else {
        const num = parseInt(trimmedValue);
        if (!isNaN(num) && num >= 0) {
          setFilters((prev) => ({ ...prev, minBedrooms: num }));
        } else {
          setBedroomsInput(filters.minBedrooms === 0 ? "" : filters.minBedrooms.toString());
        }
      }
    }, 800); // 800ms delay
  };
  
  const updateBathroomsFilter = (value: string) => {
    if (bathroomsTimerRef.current) {
      clearTimeout(bathroomsTimerRef.current);
    }
    
    bathroomsTimerRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      if (trimmedValue === "") {
        setFilters((prev) => ({ ...prev, minBathrooms: 0 }));
        setBathroomsInput("");
      } else {
        const num = parseInt(trimmedValue);
        if (!isNaN(num) && num >= 0) {
          setFilters((prev) => ({ ...prev, minBathrooms: num }));
        } else {
          setBathroomsInput(filters.minBathrooms === 0 ? "" : filters.minBathrooms.toString());
        }
      }
    }, 800); // 800ms delay
  };
  
  const updateGuestsFilter = (value: string) => {
    if (guestsTimerRef.current) {
      clearTimeout(guestsTimerRef.current);
    }
    
    guestsTimerRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      if (trimmedValue === "") {
        setFilters((prev) => ({ ...prev, minGuests: 0 }));
        setGuestsInput("");
      } else {
        const num = parseInt(trimmedValue);
        if (!isNaN(num) && num >= 0) {
          setFilters((prev) => ({ ...prev, minGuests: num }));
        } else {
          setGuestsInput(filters.minGuests === 0 ? "" : filters.minGuests.toString());
        }
      }
    }, 800); // 800ms delay
  };
  
  // Helper function to update price range filter with debounce
  const updatePriceRangeFilter = (value: [number, number]) => {
    // Update local state immediately for smooth UI - no delay
    setSliderValue(value);
    
    // Debounce the actual filter update (triggers API call)
    if (priceRangeTimerRef.current) {
      clearTimeout(priceRangeTimerRef.current);
    }
    
    priceRangeTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        priceRange: value,
      }));
    }, 300); // Reduced to 300ms for faster response
  };
  
  // Commit stepper values to filters after debounce (reduces API calls)
  const commitStepperFilters = () => {
    setFilters((prev) => ({
      ...prev,
      minBedrooms: stepperBedroomsRef.current,
      minBathrooms: stepperBathroomsRef.current,
      minGuests: stepperGuestsRef.current,
    }));
  };
  
  const scheduleStepperCommit = () => {
    if (stepperDebounceRef.current) clearTimeout(stepperDebounceRef.current);
    stepperDebounceRef.current = setTimeout(commitStepperFilters, 500);
  };
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (bedroomsTimerRef.current) clearTimeout(bedroomsTimerRef.current);
      if (bathroomsTimerRef.current) clearTimeout(bathroomsTimerRef.current);
      if (guestsTimerRef.current) clearTimeout(guestsTimerRef.current);
      if (priceRangeTimerRef.current) clearTimeout(priceRangeTimerRef.current);
      if (stepperDebounceRef.current) clearTimeout(stepperDebounceRef.current);
    };
  }, []);
  
  // Sync stepper display and refs when filters change externally (e.g., reset)
  useEffect(() => {
    setStepperBedrooms(filters.minBedrooms);
    setStepperBathrooms(filters.minBathrooms);
    setStepperGuests(filters.minGuests);
    stepperBedroomsRef.current = filters.minBedrooms;
    stepperBathroomsRef.current = filters.minBathrooms;
    stepperGuestsRef.current = filters.minGuests;
  }, [filters.minBedrooms, filters.minBathrooms, filters.minGuests]);
  
  // Sync slider value with filters when filters change externally (e.g., reset)
  useEffect(() => {
    setSliderValue(filters.priceRange);
  }, [filters.priceRange]);

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

  // Infinite scroll query
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.property.getFiltered.useInfiniteQuery(
      {
        location,
        priceRange: filters.priceRange,
        propertyTypes:
          filters.propertyTypes.length > 0 ? filters.propertyTypes : undefined,
        minBedrooms: filters.minBedrooms > 0 ? filters.minBedrooms : undefined,
        minBathrooms:
          filters.minBathrooms > 0 ? filters.minBathrooms : undefined,
        minGuests: filters.minGuests > 0 ? filters.minGuests : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        sortBy: filters.sortBy,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Auto-fetch when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array
  const properties = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      location ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 1000 ||
      filters.propertyTypes.length > 0 ||
      filters.minBedrooms > 0 ||
      filters.minBathrooms > 0 ||
      filters.minGuests > 0 ||
      filters.amenities.length > 0
    );
  };

  // Check if filters are active
  const isFiltered = hasActiveFilters();

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
      amenities: [],
      sortBy: "rating",
    });
    setBedroomsInput("");
    setBathroomsInput("");
    setGuestsInput("");
  };

  // Sync input values with filter values when filters change externally
  useEffect(() => {
    if (filters.minBedrooms === 0) {
      setBedroomsInput("");
    } else {
      setBedroomsInput(filters.minBedrooms.toString());
    }
  }, [filters.minBedrooms]);

  useEffect(() => {
    if (filters.minBathrooms === 0) {
      setBathroomsInput("");
    } else {
      setBathroomsInput(filters.minBathrooms.toString());
    }
  }, [filters.minBathrooms]);

  useEffect(() => {
    if (filters.minGuests === 0) {
      setGuestsInput("");
    } else {
      setGuestsInput(filters.minGuests.toString());
    }
  }, [filters.minGuests]);

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear All
        </Button>
      </div>

      <div>
        <h4 className="mb-6 font-medium text-gray-900">Price Range</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={sliderValue}
          onValueChange={(value) => updatePriceRangeFilter(value as [number, number])}
          className="mb-2"
        />
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
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-700">
              Min Bedrooms
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => {
                  const next = Math.max(0, stepperBedrooms - 1);
                  setStepperBedrooms(next);
                  stepperBedroomsRef.current = next;
                  setBedroomsInput(next === 0 ? "" : next.toString());
                  scheduleStepperCommit();
                }}
                disabled={stepperBedrooms === 0}
                aria-label="Decrease bedrooms"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                {stepperBedrooms === 0 ? "Any" : stepperBedrooms}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => {
                  const next = Math.min(20, stepperBedrooms + 1);
                  setStepperBedrooms(next);
                  stepperBedroomsRef.current = next;
                  setBedroomsInput(next.toString());
                  scheduleStepperCommit();
                }}
                disabled={stepperBedrooms >= 20}
                aria-label="Increase bedrooms"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-700">
              Min Bathrooms
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => {
                  const next = Math.max(0, stepperBathrooms - 1);
                  setStepperBathrooms(next);
                  stepperBathroomsRef.current = next;
                  setBathroomsInput(next === 0 ? "" : next.toString());
                  scheduleStepperCommit();
                }}
                disabled={stepperBathrooms === 0}
                aria-label="Decrease bathrooms"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                {stepperBathrooms === 0 ? "Any" : stepperBathrooms}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => {
                  const next = Math.min(20, stepperBathrooms + 1);
                  setStepperBathrooms(next);
                  stepperBathroomsRef.current = next;
                  setBathroomsInput(next.toString());
                  scheduleStepperCommit();
                }}
                disabled={stepperBathrooms >= 20}
                aria-label="Increase bathrooms"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Guests</h4>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={() => {
              const next = Math.max(0, stepperGuests - 1);
              setStepperGuests(next);
              stepperGuestsRef.current = next;
              setGuestsInput(next === 0 ? "" : next.toString());
              scheduleStepperCommit();
            }}
            disabled={stepperGuests === 0}
            aria-label="Decrease guests"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
            {stepperGuests === 0 ? "Any" : stepperGuests}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={() => {
              const next = Math.min(50, stepperGuests + 1);
              setStepperGuests(next);
              stepperGuestsRef.current = next;
              setGuestsInput(next.toString());
              scheduleStepperCommit();
            }}
            disabled={stepperGuests >= 50}
            aria-label="Increase guests"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
          {!isFiltered && (
            <p className="text-gray-600">
              {(() => {
                const baseCount = !location ? 4000 : 1000;
                const totalDisplayCount = baseCount + totalCount;
                return `${totalDisplayCount}+ ${totalDisplayCount === 1 ? "property" : "properties"} found`;
              })()}
            </p>
          )}
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                {/* <Select
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
                   
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
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
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property?._id}
                      property={property as Property}
                    />
                  ))}
                </div>

                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading more properties...</span>
                    </div>
                  )}
                  {!hasNextPage && properties.length > 0 && (
                    <p className="text-gray-600">
                      You've reached the end of the list
                    </p>
                  )}
                </div>
              </>
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
