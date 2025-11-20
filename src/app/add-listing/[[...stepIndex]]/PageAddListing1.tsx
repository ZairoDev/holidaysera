"use client";
import React, { FC, useEffect } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormItem from "../FormItem";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Building2, Waves } from "lucide-react";

export interface PageAddListing1Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface Page1State {
  propertyType: string;
  placeName: string;
  rentalForm: string;
  numberOfPortions: number;
  showPortionsInput: boolean;
  rentalType: string;
}

import { trpc } from "@/trpc/client";
import propertyToPages from "@/lib/propertyToPages";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PageAddListing1: FC<PageAddListing1Props> = ({ searchParams }) => {
  // If opened with ?edit=<propertyId>, fetch property and prefill page1
  const editParam = searchParams?.edit;
  const editId = Array.isArray(editParam) ? editParam[0] : editParam;
  const getPropertyQuery = trpc.property.getPropertyById.useQuery(
    { _id: String(editId) },
    { enabled: !!editId }
  );

  useEffect(() => {
    if (getPropertyQuery.data) {
      // Only hydrate once per edit open
      if ((window as any).__editHydrated) return;
      (window as any).__editHydrated = true;
      const existing = [1,2,3,4,5,6,7,8,9].some((i) => {
        const v = localStorage.getItem(`page${i}`);
        return v && v !== "";
      });

      const prop = getPropertyQuery.data as any;
      const pages = propertyToPages(prop);

      if (existing) {
        // Show confirmation dialog before overwriting
        // We'll set a tiny prompt in the DOM via window since this is client-only
        // Use native confirm as a fallback for simplicity
        const confirmOverwrite = window.confirm(
          "A draft already exists in your browser. Do you want to overwrite it with the saved property data?"
        );
        if (!confirmOverwrite) return;
      }

      // Persist all pages to localStorage
      for (const key of Object.keys(pages)) {
        try {
          localStorage.setItem(key, JSON.stringify(pages[key]));
        } catch (e) {
          console.error("Failed to write page to localStorage", key, e);
        }
      }

      // Also persist images if present
      if (pages.page7?.propertyCoverFileUrl) {
        localStorage.setItem("propertyCoverFileUrl", pages.page7.propertyCoverFileUrl);
      }
      if (pages.page7?.propertyPictureUrls) {
        localStorage.setItem("propertyPictureUrls", JSON.stringify(pages.page7.propertyPictureUrls));
      }

  // Update local UI state from page1 mapping
  const prefill = pages.page1;
      // Save to localStorage so the wizard reads it
      localStorage.setItem("page1", JSON.stringify(prefill));
      // Update local state values
      setPropertyType(prefill.propertyType);
      setPlaceName(prefill.placeName);
      setRentalForm(prefill.rentalForm);
      setNumberOfPortions(prefill.numberOfPortions);
      setShowPortionsInput(prefill.showPortionsInput);
      setRentalType(prefill.rentalType);
    }
  }, [getPropertyQuery.data]);
  const [propertyType, setPropertyType] = useState<string>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return "Hotel";
    }
    const value = JSON.parse(savedPage)["propertyType"];
    return value || "Hotel";
  });

  const [placeName, setPlaceName] = useState<string>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return "";
    }
    const value = JSON.parse(savedPage)["placeName"];
    return value || "";
  });

  const [rentalForm, setRentalForm] = useState<string>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return "Private Room";
    }
    const value = JSON.parse(savedPage)["rentalForm"];
    return value || "Private Room";
  });

  const [numberOfPortions, setNumberOfPortions] = useState<number>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return 1;
    }
    const value = JSON.parse(savedPage)["numberOfPortions"];
    return value ? parseInt(value, 10) : 1;
  });

  const [showPortionsInput, setShowPortionsInput] = useState<boolean>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return false;
    }
    const value = JSON.parse(savedPage)["showPortionsInput"];
    return value ? JSON.parse(value) : false;
  });

  const [rentalType, setRentalType] = useState<string>(() => {
    const savedRentalType = localStorage.getItem("page1") || "";
    if (!savedRentalType){
      return "Short Term";
    }
    const value = JSON.parse(savedRentalType)["rentalType"];
    return value || "Short Term";
  })

  const [page1, setPage1] = useState<Page1State>({
    propertyType: propertyType,
    placeName: placeName,
    rentalForm: rentalForm,
    numberOfPortions: numberOfPortions,
    showPortionsInput: showPortionsInput,
    rentalType: rentalType
  });

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
  };

  const handlePlaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pName = e.target.value.trim();
    setPlaceName(pName);
  };

  const handleRentalFormChange = (value: string) => {
    const selectedValue = value;
    const val = 1;
    if (selectedValue === "Private Area") {
      setNumberOfPortions(val);
    }
    // Example logic to handle when to show portions input
    if (selectedValue === "Private Area by portion") {
      setNumberOfPortions(2);
      setShowPortionsInput(true);
    } else {
      setNumberOfPortions(1);
      setShowPortionsInput(false);
    }
    setRentalForm(value);
  };

  const handleRentalTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id);
    setRentalType(e.target.id);
  }

  const handlePortionsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10); // Ensure input value is parsed to an integer
    setNumberOfPortions(value);
  };

  useEffect(() => {
    // localStorage.setItem("numberOfPartition", numberOfPortions.toString());
    setPage1((prev) => {
      const newObj = { ...prev };
      newObj.numberOfPortions = numberOfPortions;
      return newObj;
    });
  }, [numberOfPortions]);

  useEffect(() => {
    setPage1((prev) => {
      const newObj = { ...prev };
      newObj.propertyType = propertyType;
      return newObj;
    });
    // localStorage.setItem("propertyType", propertyType);
  }, [propertyType]);

  useEffect(() => {
    // localStorage.setItem("placeName", placeName);
    setPage1((prev) => {
      const newObj = { ...prev };
      newObj.placeName = placeName;
      return newObj;
    });
  }, [placeName]);

  useEffect(() => {
    // localStorage.setItem("rentalForm", rentalForm);
    setPage1((prev) => {
      const newObj = { ...prev };
      newObj.rentalForm = rentalForm;
      return newObj;
    });
  }, [rentalForm]);

  useEffect(() => {
    setPage1((prev) => {
      const newObj = { ...prev };
      newObj.rentalType = rentalType;
      return newObj;
    });
  }, [rentalType]);

  useEffect(() => {
    const newPage1: Page1State = {
      propertyType: propertyType,
      placeName: placeName,
      rentalForm: rentalForm,
      numberOfPortions: numberOfPortions,
      showPortionsInput: showPortionsInput,
      rentalType: rentalType,
    };
    setPage1(newPage1);
    localStorage.setItem("page1", JSON.stringify(newPage1));
  }, [
    propertyType,
    placeName,
    rentalForm,
    numberOfPortions,
    showPortionsInput,
    rentalType
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Let's start with the basics
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Tell us about your property and how you'd like to rent it out
        </p>
      </div>

      {/* Rental Type Selection */}
      <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              What type of rental are you offering?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose the rental periods you want to offer
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Short Term", "Long Term", "Both"].map((type) => (
              <label
                key={type}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  rentalType === type
                    ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-300"
                }`}
              >
                <input
                  type="radio"
                  name="rentalType"
                  id={type}
                  checked={rentalType === type}
                  onChange={handleRentalTypeChange}
                  className="w-5 h-5 cursor-pointer accent-sky-600"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Form */}
      <div className="space-y-6">
        {/* Property Type */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <FormItem
            label="What type of property is it?"
            desc="Choose the property type that best describes your listing"
          >
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="Cottage">🏡 Cottage</SelectItem>
                <SelectItem value="Villa">🏠 Villa</SelectItem>
                <SelectItem value="Cabin">🌲 Cabin</SelectItem>
                <SelectItem value="Farm stay">🚜 Farm stay</SelectItem>
                <SelectItem value="Houseboat">⛵ Houseboat</SelectItem>
                <SelectItem value="Lighthouse">🔴 Lighthouse</SelectItem>
                <SelectItem value="Studio">🎨 Studio</SelectItem>
                <SelectItem value="Apartment">🏢 Apartment</SelectItem>
                <SelectItem value="Penthouse">🌃 Penthouse</SelectItem>
                <SelectItem value="Detached House">🏘️ Detached House</SelectItem>
                <SelectItem value="Loft">🪟 Loft</SelectItem>
                <SelectItem value="Maisonette">🏛️ Maisonette</SelectItem>
                <SelectItem value="Farmhouse">🌾 Farmhouse</SelectItem>
                <SelectItem value="Holiday Homes">🏖️ Holiday Homes</SelectItem>
                <SelectItem value="Farmstay">👨‍🌾 Farmstay</SelectItem>
                <SelectItem value="Resort">🌴 Resort</SelectItem>
                <SelectItem value="Lodge">🏔️ Lodge</SelectItem>
                <SelectItem value="Apart Hotel">🏨 Apart Hotel</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </Card>

        {/* Place Name */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <FormItem
            label="Give your property a catchy name"
            desc="Include: House name + Room name + Featured property + Tourist destination. Examples: 'Sunny Beach Villa' or 'Mountain View Cabin'"
          >
            <Input
              placeholder="e.g., Sunset Ocean Villa with Private Pool"
              onChange={handlePlaceName}
              value={placeName}
              className="h-12 text-base"
            />
          </FormItem>
        </Card>

        {/* Rental Form */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <FormItem
            label="What are guests renting?"
            desc="Choose how guests will rent your property"
          >
            <Select value={rentalForm} onValueChange={handleRentalFormChange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Private Area">
                  🏠 Entire Private Area
                </SelectItem>
                <SelectItem value="Private Area by portion">
                  📦 Multiple Private Portions
                </SelectItem>
                <SelectItem value="Shared Room">👥 Shared Room</SelectItem>
                <SelectItem value="Hotel Room">🛏️ Hotel Room</SelectItem>
              </SelectContent>
            </Select>
            {showPortionsInput && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of portions/rooms
                </label>
                <Input
                  type="number"
                  value={numberOfPortions}
                  onChange={handlePortionsInputChange}
                  placeholder="Minimum 2"
                  min={2}
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This allows you to rent different parts of your property separately
                </p>
              </div>
            )}
          </FormItem>
        </Card>

        {/* Summary Badge */}
        {propertyType && placeName && rentalForm && (
          <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 border-2 border-sky-200 dark:border-sky-800">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Your Property Summary
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-sky-600 text-white">
                  {propertyType}
                </Badge>
                <Badge variant="outline" className="text-gray-900 dark:text-white">
                  {rentalForm}
                </Badge>
                <Badge variant="outline" className="text-gray-900 dark:text-white">
                  {rentalType}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export const useClient = true;

export default PageAddListing1;
