"use client";
import React, { FC } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export interface PageAddListing6Props {}

interface Page6State {
  reviews: string[];
}

const PageAddListing6: FC<PageAddListing6Props> = () => {

  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }

  const [myArray, setMyArray] = useState<number[]>(Array(portions).fill(1));



  const [portionNames, setPortionNames] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (!savedPage) {
      return [];
    }
    const value = JSON.parse(savedPage)["portionName"];
    return value || [];
  });

  const [reviews, setReviews] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page6") || "";
    if (!savedPage) {
      return [];
    }
    const value = JSON.parse(savedPage)["reviews"];
    return value || [];
  });

  const [page6, setPage6] = useState<Page6State>({
    reviews: reviews
  });


  useEffect(() => {
    const newReviews: Page6State = {
      reviews: reviews
    }
    setPage6(newReviews);
    localStorage.setItem("page6", JSON.stringify(newReviews));
  }, [reviews])


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Describe your spaces
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Write compelling descriptions that highlight the best features of each space
        </p>
      </div>

      {/* Descriptions */}
      <div className="space-y-6">
        {myArray.map((item, index) => (
          <Card 
            key={index} 
            className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 transition-all"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900">
                      <FileText className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {portionNames[index] || `Space ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tell guests what makes this space special
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                  {reviews[index]?.length || 0} chars
                </Badge>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Write a great description:</strong> Mention best features, special amenities (Wi-Fi, parking), 
                  and what you like about the neighborhood. Guests are more likely to book well-described spaces.
                </p>
              </div>

              {/* Textarea */}
              <Textarea
                placeholder="Start typing your description... What makes your space special? What amenities do you offer? What should guests know about the area?"
                rows={10}
                value={reviews[index] || ""}
                onChange={(e) =>
                  setReviews((prev) => {
                    const newReviews = [...prev];
                    newReviews[index] = e.target.value;
                    return newReviews;
                  })
                }
                className="text-base resize-none"
              />

              {/* Word Count Indicator */}
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span>Recommended: 100-500 characters</span>
                <span className={reviews[index]?.length ? "text-sky-600 font-medium" : ""}>
                  {reviews[index]?.length || 0} / 500
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageAddListing6;
