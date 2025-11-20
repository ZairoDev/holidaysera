"use client";
import React, { useEffect } from "react";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export interface CommonLayoutProps {
  children: React.ReactNode;
  params: {
    stepIndex: string;
  };
}

const stepTitles = [
  "Basics",
  "Location",
  "Spaces",
  "Amenities",
  "House Rules",
  "Description",
  "Photos",
  "Pricing",
  "Availability",
  "Review",
];

const CommonLayout: FC<CommonLayoutProps> = ({ children, params }) => {
  const searchParams = useSearchParams();
  const index = Number(params.stepIndex) || 1;
  
  // Build query string from searchParams (preserve ?edit=<id>)
  const editParam = searchParams?.get("edit");
  const queryString = editParam ? `?edit=${editParam}` : "";
  
  const nextHref = index < 10 ? `/add-listing/${index + 1}${queryString}` : `/add-listing/${1}${queryString}`;
  const backHref = index > 1 ? `/add-listing/${index - 1}${queryString}` : `/add-listing/${1}${queryString}`;
  const nextBtnText = index > 9 ? "Publish listing" : "Continue";
  const progressPercentage = (index / 10) * 100;

  useEffect(() => {
    if (index === 9 && nextBtnText === "Publish listing") {
      // Get data from local storage
      const data = localStorage.getItem("yourStorageKey");
      if (data) {
        // Convert data to JSON format
        const jsonData = JSON.parse(data);

        // Create a new Blob object containing the JSON data
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
          type: "application/json",
        });

        // Create a link element to download the JSON file
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "yourData.json";
        document.body.appendChild(a);
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    }
  }, [index, nextBtnText]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Progress Bar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Progress percentage */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Step {index} of 10
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stepTitles[index - 1]}
                </h3>
              </div>
              <span className="text-2xl font-bold text-sky-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-sky-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-12 sm:py-16 lg:pb-32">
          <div className="space-y-12">
            <div className="listingSection__wrap" style={{ border: "none" }}>
              {children}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link href={backHref} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium"
                  disabled={index === 1}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
              </Link>
              <Link href={nextHref} className="flex-1">
                <Button 
                  className="w-full h-12 text-base font-medium bg-sky-600 hover:bg-sky-700"
                >
                  {nextBtnText || "Continue"}
                  {index < 10 && <ChevronRight className="w-5 h-5 ml-2" />}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonLayout;
