'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { PropertyCard } from '@/components/property-card';
import { differenceInDays, format } from 'date-fns';
import { Property } from '@/lib/type';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    // async function fetchProperty() {
    //   const { data, error } = await supabase
    //     .from('properties')
    //     .select('*')
    //     .eq('id', params.id)
    //     .maybeSingle();

    //   if (!error && data) {
    //     setProperty(data);

    //     const { data: similar } = await supabase
    //       .from('properties')
    //       .select('*')
    //       .eq('city', data.city)
    //       .neq('id', data.id)
    //       .limit(3);

    //     if (similar) {
    //       setSimilarProperties(similar);
    //     }
    //   }
    //   setLoading(false);
    // }

    // fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Property not found</h1>
          <Button onClick={() => router.push('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = differenceInDays(new Date(checkOut), new Date(checkIn));
    return days > 0 ? days * property.price_per_night : 0;
  };

  const handleBooking = () => {
    const total = calculateTotal();
    if (total > 0) {
      router.push(
        `/booking/confirm?propertyId=${property.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&total=${total}`
      );
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const amenityIcons: { [key: string]: any } = {
    WiFi: Wifi,
    Wifi: Wifi,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{property.location}</span>
                </div>
                {property.rating > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{property.rating.toFixed(1)}</span>
                      <span>({property.review_count} reviews)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {property.featured && (
              <Badge className="bg-sky-600">Featured</Badge>
            )}
          </div>

          <div className="relative mb-8 h-[500px] overflow-hidden rounded-2xl">
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-8 bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-2xl font-semibold">Property Details</h2>
                <div className="mb-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span>{property.max_guests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                  <Badge variant="outline">{property.property_type}</Badge>
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="mb-3 font-semibold">Description</h3>
                  <p className="leading-relaxed text-gray-700">
                    {property.description}
                  </p>
                </div>
              </Card>

              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-2xl font-semibold">Amenities</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                          <Icon className="h-5 w-5 text-sky-600" />
                        </div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Location</h2>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{property.location}</p>
                    <p className="text-sm text-gray-600">
                      {property.city}, {property.country}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-sky-600">
                      ${property.price_per_night}
                    </span>
                    <span className="text-gray-600">/ night</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Guests
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={property.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {checkIn && checkOut && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="my-6 rounded-lg bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        ${property.price_per_night} x{' '}
                        {differenceInDays(new Date(checkOut), new Date(checkIn))}{' '}
                        nights
                      </span>
                      <span className="font-medium">${calculateTotal()}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-sky-600">${calculateTotal()}</span>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || calculateTotal() <= 0}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <p className="mt-4 text-center text-xs text-gray-600">
                  You won't be charged yet
                </p>
              </Card>
            </div>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Similar Properties
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
