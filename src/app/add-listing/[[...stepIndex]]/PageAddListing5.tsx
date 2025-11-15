"use client";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Wind, Heart, Music, ChefHat } from "lucide-react";

export interface PageAddListing5Props {}

interface Page5State {
  smoking: string;
  pet: string;
  party: string;
  cooking: string;
  additionalRules: string[];
}

const PageAddListing5: FC<PageAddListing5Props> = () => {
  const handleRadioChange = (name: string, value: string) => {
    setPage5((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleRulesAdd = () => {
    if (rulesInput) {
      setAdditionalRules((prev) => [...prev, rulesInput]);
      setRulesInput("");
    }
    setPage5((prev) => {
      return {
        ...prev,
        additionalRules: [...prev.additionalRules, rulesInput],
      }
    })
  };

  const [additionalRules, setAdditionalRules] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page5") || "";
    if (!savedPage) {
      return ["No smoking in common areas", "Do not wear shoes/shoes in the house", "No cooking in the bedroom"];
    }
    const value = JSON.parse(savedPage)["additionalRules"];
    return (
      value || [
        "No smoking in common areas",
        "Do not wear shoes/shoes in the house",
        "No cooking in the bedroom",
      ]
    );
  });

  const [rulesInput, setRulesInput] = useState<string>("");

  const [page5, setPage5] = useState<Page5State>(() => {
    const savedPage = localStorage.getItem("page5");
    return savedPage
      ? JSON.parse(savedPage)
      : {
          smoking: "Do not allow",
          pet: "Allow",
          party: "Allow",
          cooking: "Allow",
          additionalRules: additionalRules
        };
  });

  useEffect(() => {
    const newPage5 : Page5State = {
      smoking: page5.smoking,
      pet: page5.pet,
      party: page5.party,
      cooking: page5.cooking,
      additionalRules: additionalRules
    }
    // setPage5(newPage5);
    localStorage.setItem("page5", JSON.stringify(newPage5));
  }, [page5, additionalRules]);

  const renderRadio = (
    name: keyof Page5State,
    value: string,
    label: string,
    defaultChecked?: boolean
  ) => {
    return (
      <div className="flex items-center">
        <input
          // defaultChecked={defaultChecked}
          id={`${name}-${value}`}
          name={name}
          type="radio"
          className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
          checked={page5[name] === value}
          onChange={() => handleRadioChange(name, value)}
        />
        <label
          htmlFor={`${name}-${value}`}
          className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Set your house rules
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Guests must agree to these rules before booking your property
        </p>
      </div>

      {/* House Policies */}
      <div className="space-y-6">
        {/* Smoking */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                <Wind className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Smoking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your smoking policy
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {["Do not allow", "Allow", "Charge"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    page5.smoking === option
                      ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="smoking"
                    checked={page5.smoking === option}
                    onChange={() => handleRadioChange("smoking", option)}
                    className="w-4 h-4 accent-sky-600"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Pets */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pets
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are pets allowed?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {["Do not allow", "Allow", "Charge"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    page5.pet === option
                      ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="pet"
                    checked={page5.pet === option}
                    onChange={() => handleRadioChange("pet", option)}
                    className="w-4 h-4 accent-sky-600"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Parties */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                <Music className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Party Organizing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Can guests organize parties?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {["Do not allow", "Allow", "Charge"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    page5.party === option
                      ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="party"
                    checked={page5.party === option}
                    onChange={() => handleRadioChange("party", option)}
                    className="w-4 h-4 accent-sky-600"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Cooking */}
        <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                <ChefHat className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cooking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Can guests cook in the property?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {["Do not allow", "Allow", "Charge"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    page5.cooking === option
                      ? "border-sky-600 bg-sky-50 dark:bg-sky-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cooking"
                    checked={page5.cooking === option}
                    onChange={() => handleRadioChange("cooking", option)}
                    className="w-4 h-4 accent-sky-600"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Rules */}
      <Card className="p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Additional house rules
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add any custom rules your guests should know about
          </p>

          {/* Rules List */}
          {additionalRules.length > 0 && (
            <div className="space-y-2">
              {additionalRules.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300 flex-1">
                    {item}
                  </span>
                  <button
                    onClick={() => {
                      setAdditionalRules((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Rule Form */}
          <div className="flex gap-3 mt-4">
            <Input
              placeholder="e.g., No shoes inside the house"
              value={rulesInput}
              onChange={(e) => setRulesInput(e.target.value.trim())}
              className="h-11 text-base"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRulesAdd();
              }}
            />
            <Button
              onClick={handleRulesAdd}
              disabled={!rulesInput.trim()}
              className="bg-sky-600 hover:bg-sky-700 px-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PageAddListing5;
