'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Shield, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { PropertyCard } from '@/components/property-card';
import { Property } from '@/lib/type';
// import { supabase, Property } from '@/lib/supabase';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProperties() {
      // const { data, error } = await supabase
      //   .from('properties')
      //   .select('*')
      //   .eq('featured', true)
      //   .limit(6);

      // if (!error && data) {
      //   setFeaturedProperties(data);
      // }
      // setLoading(false);
    }

    fetchFeaturedProperties();
  }, []);

  const popularDestinations = [
    {
      name: 'Bali, Indonesia',
      properties: 234,
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg',
    },
    {
      name: 'Santorini, Greece',
      properties: 156,
      image: 'https://images.pexels.com/photos/2819284/pexels-photo-2819284.jpeg',
    },
    {
      name: 'Tulum, Mexico',
      properties: 189,
      image: 'https://images.pexels.com/photos/3155726/pexels-photo-3155726.jpeg',
    },
    {
      name: 'Aspen, USA',
      properties: 98,
      image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
    },
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your payment information is always protected',
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Find a lower price? We\'ll match it',
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'All reviews from real guests who stayed',
    },
    {
      icon: TrendingUp,
      title: '24/7 Support',
      description: 'Our team is here to help anytime',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      comment: 'Amazing experience! The property was exactly as described and the host was incredibly helpful. Will definitely book again!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      name: 'Marco Rossi',
      location: 'Rome, Italy',
      rating: 5,
      comment: 'Perfect vacation home with stunning views. The booking process was seamless and customer service was excellent.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    {
      name: 'Emily Chen',
      location: 'Singapore',
      rating: 5,
      comment: 'The attention to detail was impressive. Everything we needed was provided. Highly recommend StayHaven!',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
            alt="Hero background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl"
          >
            Find Your Perfect
            <span className="block text-sky-600">Holiday Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 text-xl text-gray-700 md:text-2xl"
          >
            Discover unique properties and unforgettable experiences worldwide
          </motion.p>

          <SearchBar variant="hero" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span>4.9/5 Average Rating</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">10,000+</span>
              <span>Properties</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">50,000+</span>
              <span>Happy Guests</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked selections for an extraordinary stay
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="group"
              >
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Explore the most sought-after locations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative h-80 cursor-pointer overflow-hidden rounded-xl"
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">{destination.name}</h3>
                  <p className="text-sm text-gray-200">
                    {destination.properties} properties
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why Choose StayHaven?
            </h2>
            <p className="text-lg text-gray-600">
              Your peace of mind is our priority
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <motion.div
                  key={indicator.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                    <Icon className="h-8 w-8 text-sky-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {indicator.title}
                  </h3>
                  <p className="text-gray-600">{indicator.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What Our Guests Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-gray-700">{testimonial.comment}</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-16 text-center text-white shadow-2xl md:px-16"
          >
            <h2 className="mb-4 text-4xl font-bold">
              Ready to Start Your Adventure?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of travelers who trust StayHaven
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-white text-sky-600 hover:bg-gray-100"
                >
                  Browse Properties
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
