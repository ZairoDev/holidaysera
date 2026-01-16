'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Users, Loader2, X, Star, Phone, Globe, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchStore } from '@/lib/store';
import { DateRangePicker } from '@/components/date-range-picker';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
}

interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  name: string;
  rating?: number;
  address: string;
  phone?: string;
  website?: string;
  mapUrl?: string;
  types: string[];
  openingHours: string[];
  isOpen?: boolean;
  photos: Array<{
    photoReference: string;
    width: number;
    height: number;
    url: string;
  }>;
  location?: {
    lat: number;
    lng: number;
  };
  addressComponents: any[];
}

export function SearchBar({ variant = 'compact' }: SearchBarProps) {
  const router = useRouter();
  const { location, checkIn, checkOut, guests, setLocation, setCheckIn, setCheckOut, setGuests } = useSearchStore();
  
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced autocomplete search
  const searchAutocomplete = useCallback(async (input: string) => {
    if (!input || input.trim().length < 2) {
      setAutocompleteResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suggestions');
      }

      if (data.predictions) {
        setAutocompleteResults(data.predictions);
        setShowSuggestions(true);
      } else {
        setAutocompleteResults([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
      setAutocompleteResults([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback((value: string) => {
    setLocation(value);
    setError(null);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      searchAutocomplete(value);
    }, 300);
  }, [setLocation, searchAutocomplete]);

  // Fetch place details
  const fetchPlaceDetails = useCallback(async (placeId: string) => {
    setIsDetailsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await fetch(`/api/places/details?place_id=${encodeURIComponent(placeId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch place details');
      }

      setSelectedPlace(data);
      setShowDetailsModal(true);
      setLocation(data.name || data.address);
    } catch (err) {
      console.error('Place details error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load place details');
    } finally {
      setIsDetailsLoading(false);
    }
  }, [setLocation]);

  // Handle suggestion click
  const handleSuggestionClick = (prediction: AutocompletePrediction) => {
    fetchPlaceDetails(prediction.place_id);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearch = () => {
    router.push('/properties');
  };

  if (variant === 'hero') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl"
        >
          <div className="rounded-2xl bg-white p-6 shadow-2xl">
            <div className="grid gap-4 md:grid-cols-4 relative">
              <div className="md:col-span-1 relative">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Where to?"
                    value={location}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (autocompleteResults.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="pl-10"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}

                  {/* Autocomplete Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && autocompleteResults.length > 0 && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-64 overflow-y-auto"
                      >
                        {autocompleteResults.map((prediction) => (
                          <button
                            key={prediction.place_id}
                            onClick={() => handleSuggestionClick(prediction)}
                            className="w-full px-4 py-3 text-left hover:bg-sky-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                          >
                            <MapPin className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {prediction.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {prediction.structured_formatting.secondary_text}
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty State */}
                  {showSuggestions && !isLoading && autocompleteResults.length === 0 && location.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4 text-center text-gray-500"
                    >
                      No places found
                    </motion.div>
                  )}

                  {/* Error State */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 z-50"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-in & Check-out
                </label>
                <DateRangePicker
                  startDate={checkIn}
                  endDate={checkOut}
                  onDateChange={({ start, end }) => {
                    setCheckIn(start);
                    setCheckOut(end);
                  }}
                  fieldClassName="h-10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    max="16"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                <Button
                  onClick={handleSearch}
                  className="h-14 w-14 rounded-full bg-sky-600 shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-200"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        </>
      );
    }

  return (
    <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-md">
      <MapPin className="h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search destinations..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border-0 focus-visible:ring-0"
      />
      <Button
        onClick={handleSearch}
        size="sm"
        className="rounded-full bg-sky-600 hover:bg-sky-700"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
