'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Users } from 'lucide-react';

import { useFavoritesStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/type';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [imageIndex, setImageIndex] = useState(0);
  const favorite = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
    }
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={property.images[imageIndex] || property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <button
              onClick={handleFavoriteClick}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>

            {property.featured && (
              <Badge className="absolute left-3 top-3 bg-sky-600 hover:bg-sky-700">
                Featured
              </Badge>
            )}

            <div className="absolute bottom-3 left-3 flex gap-1">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImageIndex(idx);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    idx === imageIndex ? 'w-6 bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              {property.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">
                    {property.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{property.city}, {property.country}</span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{property.max_guests} guests</span>
              </div>
              <span>•</span>
              <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-baseline justify-between border-t pt-3">
              <div>
                <span className="text-2xl font-bold text-sky-600">
                  ${property.price_per_night}
                </span>
                <span className="text-sm text-gray-600"> / night</span>
              </div>
              {property.review_count > 0 && (
                <span className="text-sm text-gray-500">
                  {property.review_count} reviews
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
