"use client";
import { useEffect, useState } from "react";
import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormItem from "../FormItem";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Calendar } from "lucide-react";

export interface PageAddListing8Props {}

interface Page8State {
  currency: string;
  isPortion: Boolean;
  basePrice: number[];
  basePriceLongTerm: number[];
  weekendPrice: number[];
  weeklyDiscount: number[];
  monthlyDiscount: number[];
  longTermMonths: string[];
  monthState: boolean[];
}
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PageAddListing8: FC<PageAddListing8Props> = () => {
  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }

  const [rentalType, setRentalType] = useState<string>(() => {
    const savedRentalType = localStorage.getItem("page1");
    if (!savedRentalType) {
      return "Short Term";
    }
    const type = JSON.parse(savedRentalType)["rentalType"];
    return type || "Short Term";
  });

  const emptyStringArrayGenerator = (size: number) => {
    const emptyStringArray = Array.from({ length: size }, () => "");
    return emptyStringArray;
  };
  const emptyNumberArrayGenerator = (size: number) => {
    const emptyNumberArray = Array.from({ length: size }, () => 0);
    return emptyNumberArray;
  };

  const [myArray, setMyArray] = useState<number[]>(Array(portions).fill(1));
  const [isPortion, setIsPortion] = useState<Boolean>(() => {
    return portions > 1 ? true : false;
  });

  const [currency, setCurrency] = useState<string>("EURO");

  const [longTermMonths, setLongTermMonths] = useState<string[]>(() => {

    if (rentalType === "Short Term") {
      return [];
    }else if (rentalType === "Long Term") {
      return MONTHS;
    }

    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return [];
    }
    const value = JSON.parse(savedPage)["longTermMonths"];
    return value || [];
  });

  const [basePrice, setBasePrice] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["basePrice"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [basePriceLongTerm, setBasePriceLongTerm] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["basePriceLongTerm"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [weekendPrice, setWeekendPrice] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["weekendPrice"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [weeklyDiscount, setWeeklyDiscount] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8");
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["weeklyDiscount"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [monthlyDiscount, setMonthlyDiscount] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8");
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["monthlyDiscount"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [page8, setPage8] = useState<Page8State>(() => {
    const savedPage = localStorage.getItem("page8");
    return savedPage
      ? JSON.parse(savedPage)
      : {
          currency: "EURO",
          isPortion: false,
          basePrice: emptyNumberArrayGenerator(portions),
          basePriceLongTerm: emptyNumberArrayGenerator(portions),
          weekendPrice: emptyNumberArrayGenerator(portions),
          weeklyDiscount: emptyNumberArrayGenerator(portions),
          monthlyDiscount: emptyNumberArrayGenerator(portions),
          longTermMonths: emptyStringArrayGenerator(portions),
          monthState: Array.from({ length: 12 }, () => false),
        };
  });

  const [monthState, setMonthState] = useState<boolean[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return Array.from({ length: 12 }, () => false);
    }
    const value = JSON.parse(savedPage)["monthState"];
    return value || Array.from({ length: 12 }, () => false);
  });

  useEffect(() => {
    const newPage = {
      currency: currency,
      isPortion: isPortion,
      basePrice: basePrice,
      basePriceLongTerm: basePriceLongTerm,
      weekendPrice: weekendPrice,
      weeklyDiscount: weeklyDiscount,
      monthlyDiscount: monthlyDiscount,
      longTermMonths: longTermMonths,
      monthState: monthState,
    };
    setPage8(newPage);
    localStorage.setItem("page8", JSON.stringify(newPage));
  }, [
    isPortion,
    basePrice,
    basePriceLongTerm,
    weekendPrice,
    weeklyDiscount,
    monthlyDiscount,
    currency,
    longTermMonths,
    monthState,
  ]);

  const handleSelectedMonths = (e: any, index: number) => {
    const newMonthState = [...monthState];
    newMonthState[index] = !newMonthState[index];
    setMonthState(newMonthState);

    if (longTermMonths.includes(e.target.innerText)) {
      const newLongTermMonths = longTermMonths.filter(
        (month) => month !== e.target.innerText
      );
      setLongTermMonths(newLongTermMonths);
    } else {
      setLongTermMonths([...longTermMonths, e.target.innerText]);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Set your pricing
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your revenue depends on setting competitive rates
        </p>
      </div>

      {/* Month Selection for Both */}
      {rentalType && rentalType == "Both" && (
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select months for long-term pricing
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose which months you want to offer for long-term rentals
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {MONTHS.map((month, index) => (
                <button
                  key={index}
                  onClick={(e) => handleSelectedMonths(e, index)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    monthState[index]
                      ? "bg-sky-600 text-white border-2 border-sky-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300"
                  }`}
                >
                  {month}
                  {monthState[index] && <X className="w-4 h-4 inline ml-1" />}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Short Term Pricing */}
      {rentalType && (rentalType == "Short Term" || rentalType == "Both") && (
        <div className="space-y-6">
          <Card className="p-6 border-2 border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-sky-900 dark:text-sky-100">
                Short Term Pricing
              </h3>
              <p className="text-sm text-sky-800 dark:text-sky-200">
                Available in: {MONTHS.filter((m, i) => !longTermMonths.includes(m)).join(", ")}
              </p>
            </div>
          </Card>

          {myArray.map((item, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 transition-colors"
            >
              <div className="space-y-6">
                {/* Portion Header */}
                <div>
                  <Badge className="bg-sky-600 text-white mb-3">
                    {isPortion ? `Portion ${index + 1}` : "Your Property"}
                  </Badge>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Set pricing
                  </h4>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Weekday Base Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      Mon - Thu
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">€</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={basePrice[index] || ""}
                        onChange={(e) =>
                          setBasePrice((prev) => {
                            const newArray = [...prev];
                            newArray[index] = parseInt(e.target.value) || 0;
                            return newArray;
                          })
                        }
                        className="pl-7 h-11"
                      />
                    </div>
                  </div>

                  {/* Weekend Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-rose-600" />
                      Fri - Sun
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">€</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={weekendPrice[index] || ""}
                        onChange={(e) =>
                          setWeekendPrice((prev) => {
                            const newArray = [...prev];
                            newArray[index] = parseInt(e.target.value) || 0;
                            return newArray;
                          })
                        }
                        className="pl-7 h-11"
                      />
                    </div>
                  </div>

                  {/* Weekly Discount */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      Weekly Discount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">%</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={weeklyDiscount[index] || ""}
                        onChange={(e) =>
                          setWeeklyDiscount((prev) => {
                            const newArray = [...prev];
                            newArray[index] = parseInt(e.target.value) || 0;
                            return newArray;
                          })
                        }
                        className="pl-7 h-11"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Long Term Pricing */}
      {rentalType && (rentalType == "Long Term" || rentalType == "Both") && (
        <div className="space-y-6">
          <Card className="p-6 border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                Long Term Pricing
              </h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Available in: {MONTHS.filter((m, i) => longTermMonths.includes(m)).join(", ")}
              </p>
            </div>
          </Card>

          {myArray.map((item, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-6">
                {/* Portion Header */}
                <div>
                  <Badge className="bg-emerald-600 text-white mb-3">
                    {isPortion ? `Portion ${index + 1}` : "Your Property"}
                  </Badge>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly pricing
                  </h4>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monthly Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Monthly Rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">€</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={basePriceLongTerm[index] || ""}
                        onChange={(e) =>
                          setBasePriceLongTerm((prev) => {
                            const newArray = [...prev];
                            newArray[index] = parseInt(e.target.value) || 0;
                            return newArray;
                          })
                        }
                        className="pl-7 h-11"
                      />
                    </div>
                  </div>

                  {/* Monthly Discount */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      Monthly Discount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400">%</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={monthlyDiscount[index] || ""}
                        onChange={(e) =>
                          setMonthlyDiscount((prev) => {
                            const newArray = [...prev];
                            newArray[index] = parseInt(e.target.value) || 0;
                            return newArray;
                          })
                        }
                        className="pl-7 h-11"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageAddListing8;
