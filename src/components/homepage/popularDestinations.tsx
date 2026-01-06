"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/lib/store";

interface Destination {
  name: string;
  properties: number;
  image: string;
}

const destinations: Destination[] = [
  {
    name: "Greece",
    properties: 985,
    image: "https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
  },
  {
    name: "Italy",
    properties: 668,
    image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
  },
{
    name: "Spain",
    properties: 92,
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
  },
  {
    name: "Croatia",
    properties: 51,
    image: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
  },
];

export function PopularDestinations() {
  return (
    <section className="bg-gray-50 py-10">
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
  const router = useRouter();
  const { setLocation } = useSearchStore();

  const handleClick = () => {
    setLocation(destination.name);
    router.push("/properties");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={handleClick}
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
