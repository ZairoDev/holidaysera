'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchStore } from '@/lib/store';
import { format } from 'date-fns';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
}

export function SearchBar({ variant = 'compact' }: SearchBarProps) {
  const router = useRouter();
  const { location, checkIn, checkOut, guests, setLocation, setCheckIn, setCheckOut, setGuests } = useSearchStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = () => {
    router.push('/properties');
  };

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-4xl"
      >
        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Where to?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                  className="pl-10"
                />
              </div>
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
          </div>

          <Button
            onClick={handleSearch}
            size="lg"
            className="mt-6 w-full bg-sky-600 text-lg hover:bg-sky-700"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Properties
          </Button>
        </div>
      </motion.div>
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
