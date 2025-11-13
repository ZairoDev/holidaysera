"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Destination {
  name: string;
  properties: number;
  image: string;
}

const destinations: Destination[] = [
  {
    name: "Bali, Indonesia",
    properties: 234,
    image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg",
  },
  {
    name: "Santorini, Greece",
    properties: 156,
    image: "https://images.pexels.com/photos/2819284/pexels-photo-2819284.jpeg",
  },
  {
    name: "Tulum, Mexico",
    properties: 189,
    image: "https://images.pexels.com/photos/3155726/pexels-photo-3155726.jpeg",
  },
  {
    name: "Aspen, USA",
    properties: 98,
    image: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg",
  },
];

export function PopularDestinations() {
  return (
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
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.name}
              destination={destination}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  destination,
  index,
}: {
  destination: Destination;
  index: number;
}) {
  return (
    <motion.div
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
  );
}
