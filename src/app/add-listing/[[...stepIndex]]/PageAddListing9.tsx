"use client";

import React, { FC, useEffect, useState } from "react";
import { MONTHS } from "../[[...stepIndex]]/PageAddListing8";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Calendar, Bed } from "lucide-react";

export interface PageAddListing9Props {}

interface Page9State {
  night: number[];
  month: number[];
  time: number[];
  datesPerPortion: number[][];
}

const PageAddListing9: FC<PageAddListing9Props> = () => {
  const [portions, setPortions] = useState<number>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return 0;
    }
    const savedPortions = JSON.parse(savedPage)["numberOfPortions"];
    return savedPortions || 0;
  });

  const [myArray, setMyArray] = useState<number[]>(Array(portions).fill(1));

  const [night, setNight] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [3, 21];
    }
    const value = JSON.parse(savedPage)["night"];
    return value || [3, 21];
  });

  const [month, setMonth] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [1, 12];
    }
    const value = JSON.parse(savedPage)["month"];
    return value || [1, 12];
  });

  const [time, setTime] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [0, 24];
    }
    const value = JSON.parse(savedPage)["time"];
    return value || [0, 24];
  });

  const [datesPerPortion, setDatesPerPortion] = useState<number[][]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return Array.from({ length: portions }, () => []);
    }
    const value = JSON.parse(savedPage)["datesPerPortion"];
    if (value?.length !== portions) {
      return Array.from({ length: portions }, () => []);
    }
    return value || Array.from({ length: portions }, () => []);
  });

  const [page9, setPage9] = useState<Page9State>({
    night,
    month,
    time,
    datesPerPortion,
  });

  useEffect(() => {
    setMyArray(Array(portions).fill(1));
  }, [portions]);

  useEffect(() => {
    const newPage9: Page9State = {
      night,
      month,
      time,
      datesPerPortion,
    };
    setPage9(newPage9);
    localStorage.setItem("page9", JSON.stringify(newPage9));
  }, [night, month, time, datesPerPortion]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Set your availability
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Configure minimum stays, seasonal availability, and check-in/out times
        </p>
      </div>

      {/* Settings */}
      <div className="space-y-6">
        {/* Minimum Stay */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900">
                <Bed className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Minimum Stay Requirements
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shorter stays often mean more bookings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum nights
                </label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={night[0]}
                  onChange={(e) =>
                    setNight([parseInt(e.target.value) || 1, night[1]])
                  }
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Minimum: 1 night
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum nights
                </label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={night[1]}
                  onChange={(e) =>
                    setNight([night[0], parseInt(e.target.value) || 21])
                  }
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Maximum: 365 nights
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Seasonal Availability */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Seasonal Availability
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When is your property available?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available from
                </label>
                <Select
                  value={month[0].toString()}
                  onValueChange={(val) =>
                    setMonth([parseInt(val) || 1, month[1]])
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available until
                </label>
                <Select
                  value={month[1].toString()}
                  onValueChange={(val) =>
                    setMonth([month[0], parseInt(val) || 12])
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Month Range Display */}
            <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-950 rounded-lg border border-sky-200 dark:border-sky-800">
              <p className="text-sm text-sky-900 dark:text-sky-100">
                <strong>Available:</strong> {MONTHS[month[0] - 1]} to {MONTHS[month[1] - 1]}
              </p>
            </div>
          </div>
        </Card>

        {/* Check-in/Check-out Times */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Check-in & Check-out Times
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set flexible times for guest arrivals and departures
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Earliest check-in
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={time[0]}
                    onChange={(e) =>
                      setTime([parseInt(e.target.value) || 0, time[1]])
                    }
                    className="h-11"
                  />
                  <span className="text-gray-600 dark:text-gray-400">:00</span>
                </div>
                <p className="text-xs text-gray-500">
                  When guests can start arriving
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Latest check-out
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={time[1]}
                    onChange={(e) =>
                      setTime([time[0], parseInt(e.target.value) || 24])
                    }
                    className="h-11"
                  />
                  <span className="text-gray-600 dark:text-gray-400">:00</span>
                </div>
                <p className="text-xs text-gray-500">
                  When guests must leave by
                </p>
              </div>
            </div>

            {/* Time Display */}
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-900 dark:text-orange-100">
                <strong>Check-in/out window:</strong> {String(time[0]).padStart(2, "0")}:00 - {String(time[1]).padStart(2, "0")}:00
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PageAddListing9;
