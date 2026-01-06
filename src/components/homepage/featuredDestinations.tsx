"use client";

import { Property } from "@/lib/type";
import { PropertyCard } from "../property-card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  console.log("FeaturedProperties received:", properties);

  if (!properties || properties.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Properties
          </h2>
          <p className="text-center text-gray-500">
            No featured properties available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8  px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of exceptional properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <Link href="/properties" className="py-2 px-4 mt-8 border rounded-lg bg-blue-500 shadow-md text-white">
            <span className="flex items-center ">
            View More Properties
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
