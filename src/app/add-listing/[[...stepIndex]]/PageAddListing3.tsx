"use client";
import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormItem from "../FormItem";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Bed, Bath, ChefHat, Baby } from "lucide-react";

export interface PageAddListing3Props {}

interface Page3State {
  portionName: string[];
  portionSize: number[];
  guests: number[];
  bedrooms: number[];
  beds: number[];
  bathroom: number[];
  kitchen: number[];
  childrenAge: number[];
}

const PageAddListing3: FC<PageAddListing3Props> = () => {
  // TODO: declaring the type of object which is used as the value in array of input fields
  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }
  const emptyStringArrayGenerator = (size: number) => {
    const emptyStringArray = Array.from({ length: size }, () => "");
    return emptyStringArray;
  };
  const emptyNumberArrayGenerator = (size: number) => {
    const emptyNumberArray = Array.from({ length: size }, () => 0);
    return emptyNumberArray;
  };

  const [myArray, setMyArray] = useState<number[]>([]);
  const [portionName, setPortionName] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyStringArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["portionName"];
    return value || emptyStringArrayGenerator(portions);
  });

  const [portionSize, setPortionSize] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["portionSize"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [guests, setGuests] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["guests"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [bedrooms, setBedrooms] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["bedrooms"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [beds, setBeds] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["beds"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [bathroom, setBathroom] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["bathroom"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [kitchen, setKitchen] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["kitchen"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [childrenAge, setChildrenAge] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["childrenAge"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [page3, setPage3] = useState<Page3State>({
    portionName: portionName,
    portionSize: portionSize,
    guests: guests,
    bedrooms: bedrooms,
    beds: beds,
    bathroom: bathroom,
    kitchen: kitchen,
    childrenAge: childrenAge,
  });

  useEffect(() => {
    const newArray = Array(portions).fill(1);
    setMyArray(newArray);
  }, [portions]);

  useEffect(() => {
    const newPage3: Page3State = {
      portionName: portionName,
      portionSize: portionSize,
      guests: guests,
      bedrooms: bedrooms,
      beds: beds,
      bathroom: bathroom,
      kitchen: kitchen,
      childrenAge: childrenAge,
    };
    setPage3(newPage3);
    localStorage.setItem("page3", JSON.stringify(newPage3));
  }, [portionName, portionSize, guests, bedrooms, beds, bathroom, kitchen, childrenAge]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tell us about your spaces
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Add details about each {myArray.length > 1 ? "portion" : "space"} you're renting out
        </p>
      </div>

      {/* Portions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myArray.map((item, index) => (
          <Card 
            key={index} 
            className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-all hover:shadow-lg"
          >
            {/* Portion Header */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <Badge className="bg-sky-600 text-white mb-3">
                {myArray.length > 1 ? `Portion ${index + 1}` : "Your Space"}
              </Badge>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name this space
              </label>
              <Input
                placeholder={`e.g., ${index === 0 ? "Master Bedroom" : "Guest Room"}`}
                value={portionName[index]}
                onChange={(e) =>
                  setPortionName((prev) => {
                    const newArray = [...prev];
                    newArray[index] = e.target.value.trim();
                    return newArray;
                  })
                }
                className="h-10 text-base"
              />
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size (m²)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={portionSize[index] || ""}
                onChange={(e) =>
                  setPortionSize((prev) => {
                    const newArray = [...prev];
                    newArray[index] = parseInt(e.target.value) || 0;
                    return newArray;
                  })
                }
                className="h-10 text-base"
                min={0}
              />
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Guests */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  Guests
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={guests[index] || ""}
                  onChange={(e) =>
                    setGuests((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bed className="w-4 h-4 text-sky-600" />
                  Bedrooms
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={bedrooms[index] || ""}
                  onChange={(e) =>
                    setBedrooms((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>

              {/* Beds */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bed className="w-4 h-4 text-emerald-600" />
                  Beds
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={beds[index] || ""}
                  onChange={(e) =>
                    setBeds((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Bath className="w-4 h-4 text-blue-600" />
                  Bathrooms
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={bathroom[index] || ""}
                  onChange={(e) =>
                    setBathroom((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>

              {/* Kitchens */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                  Kitchens
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={kitchen[index] || ""}
                  onChange={(e) =>
                    setKitchen((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>

              {/* Children Age */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Baby className="w-4 h-4 text-pink-600" />
                  Max Child Age
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={childrenAge[index] || ""}
                  onChange={(e) =>
                    setChildrenAge((prev) => {
                      const newArray = [...prev];
                      newArray[index] = parseInt(e.target.value) || 0;
                      return newArray;
                    })
                  }
                  className="h-10 text-base"
                  min={0}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageAddListing3;
