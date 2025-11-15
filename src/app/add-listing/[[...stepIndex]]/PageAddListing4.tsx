"use client";
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface PageAddListing4Props {}

interface checkBoxState {
  [key: string]: any;
}

type InnerObject = {
  [key: string]: boolean;
};

type MainState = {
  generalAmenities: InnerObject;
  otherAmenities: InnerObject;
  safeAmenities: InnerObject;
};

const PageAddListing4: FC<PageAddListing4Props> = () => {
  const savedAmenities = JSON.parse(localStorage.getItem("page4") || "[]");

  const [amenitiesState, setAmenitiesState] = useState<MainState>(() => {
    const savedPage = localStorage.getItem("page4") || "";
    if (!savedPage) {
      return { key1: {}, key2: {}, key3: {} };
    }
    const value = JSON.parse(savedPage);
    return value || { key1: {}, key2: {}, key3: {} };
  });

	const generalAmenities = useMemo(
    () => ({
      // Wifi: amenitiesState[0]?.Wifi || false,
      "Wifi": amenitiesState?.generalAmenities?.Wifi || false,
			"Internet": amenitiesState?.generalAmenities?.Internet || false,
      "TV": amenitiesState?.generalAmenities?.TV || false,
      "Air conditioning": amenitiesState?.generalAmenities?.["Air conditioning"] || false,
      "Fan": amenitiesState?.generalAmenities?.Fan || false,
      "Private entrance": amenitiesState?.generalAmenities?.["Private entrance"] || false,
      "Dryer": amenitiesState?.generalAmenities?.Dryer || false,
      "Heater": amenitiesState?.generalAmenities?.Heater || false,
      "Washing machine": amenitiesState?.generalAmenities?.["Washing machine"] || false,
      "Detergent": amenitiesState?.generalAmenities?.Detergent || false,
      "Clothes dryer": amenitiesState?.generalAmenities?.["Clothes dryer"] || false,
      "Baby cot": amenitiesState?.generalAmenities?.["Baby cot"] || false,
      "Desk": amenitiesState?.generalAmenities?.Desk || false,
      "Fridge": amenitiesState?.generalAmenities?.Fridge || false,
      "Balcony View": amenitiesState?.generalAmenities?.["Balcony View"] || false,
      "Bathtub": amenitiesState?.generalAmenities?.["Bathtub "] || false,
      "Laundry": amenitiesState?.generalAmenities?.Laundry || false,
      "Puzzles": amenitiesState?.generalAmenities?.["Puzzles"] || false,
      "Cleaning Products": amenitiesState?.generalAmenities?.["Cleaning Products"] || false,
      "Dressing Room": amenitiesState?.generalAmenities?.["Dressing Room"] || false,
      "Drying Racks": amenitiesState?.generalAmenities?.["Drying Racks"] || false,
      "Soundproofing": amenitiesState?.generalAmenities?.["Soundproofing"] || false,
      "Smoking Area": amenitiesState?.generalAmenities?.["Smoking Area"] || false,
      "Smoking Alarm": amenitiesState?.generalAmenities?.["Smoking Alarm"] || false,
      "Living Area": amenitiesState?.generalAmenities?.["Living Area"] || false,
      "Clothes Stand": amenitiesState?.generalAmenities?.["Clothes Stand"] || false,
      "Bathrobe": amenitiesState?.generalAmenities?.["Bathrobe"] || false,
      "Mirror": amenitiesState?.generalAmenities?.["Mirror"] || false,
      "CCTV Common Area": amenitiesState?.generalAmenities?.["CCTV Common Area"] || false,
      "CCTV Outside Area": amenitiesState?.generalAmenities?.["CCTV Outside Area"] || false,
      "Housekeeping": amenitiesState?.generalAmenities?.["Housekeeping"] || false,
      "Electric Grill": amenitiesState?.generalAmenities?.["Electric grill"] || false,
      "Free Parking": amenitiesState?.generalAmenities?.["Free Parking"] || false,
      "Microwave": amenitiesState?.generalAmenities?.Microwave || false,
      "Mosquito net": amenitiesState?.generalAmenities?.["Mosquito net"] || false,
      "Oven": amenitiesState?.generalAmenities?.Oven || false,
      "Private Bathroom": amenitiesState?.generalAmenities?.["Private Bathroom"] || false,
      "Slippers": amenitiesState?.generalAmenities?.["Slippers"] || false,
      "Flat TV": amenitiesState?.generalAmenities?.["Flat TV"] || false,
      "Shower": amenitiesState?.generalAmenities?.Shower || false,
      "Lunch Area": amenitiesState?.generalAmenities?.["Lunch Area"] || false,
      "channels for Children":
        amenitiesState?.generalAmenities?.["TV channel for Children"] || false,
      "Cooling Fan": amenitiesState?.generalAmenities?.["Cooling Fan"] || false,
      "Verandah": amenitiesState?.generalAmenities?.Verandah || false,
      "Balcony": amenitiesState?.generalAmenities?.Balcony || false,
      "Mountain View": amenitiesState?.generalAmenities?.["Mountain View"] || false,
      "Landmark View": amenitiesState?.generalAmenities?.["Landmark View"] || false,
      "Iron": amenitiesState?.generalAmenities?.["Iron"] || false,
      "Inner Courtyard View": amenitiesState?.generalAmenities?.["Inner Courtyard View"] || false,
      "Coffee Machine": amenitiesState?.generalAmenities?.["Coffee Machine"] || false,
      "Hand Sanitizer": amenitiesState?.generalAmenities?.["Hand Sanitizer"] || false,
      "Satellite Channels": amenitiesState?.generalAmenities?.["Satellite Channels"] || false,
      "Hot Tub/ Jacuzzi": amenitiesState?.generalAmenities?.["Hot Tub/ Jacuzzi"] || false,
      "Sun Umbrellas": amenitiesState?.generalAmenities?.["Sun Umbrellas"] || false,
      "Beach Front": amenitiesState?.generalAmenities?.["Beach Front"] || false,
      "Hypoallergenic": amenitiesState?.generalAmenities?.["Hypoallergenic"] || false,
      "Lake View": amenitiesState?.generalAmenities?.["Lake View"] || false,
    }),
    [savedAmenities]
  );


	const otherAmenities = useMemo(
    () => ({
      // Wardrobe: savedAmenities[1]?.Wardrobe || false,
			"Wardrobe": amenitiesState?.otherAmenities?.Wardrobe || false,
      "Key Card Access": amenitiesState?.otherAmenities?.["Key Card Access"] || false,
      "Linen": amenitiesState?.otherAmenities?.Linen || false,
      "Room for non-smokers":
        amenitiesState?.otherAmenities?.["Room for non-smokers"] || false,
      "Cloth hook": amenitiesState?.otherAmenities?.["Cloth hook"] || false,
      "Extra cushion": amenitiesState?.otherAmenities?.["Extra cushion"] || false,
      "Gas stove": amenitiesState?.otherAmenities?.["Gas stove"] || false,
      "Toilet paper": amenitiesState?.otherAmenities?.["Toilet paper"] || false,
      "Free toiletries": amenitiesState?.otherAmenities?.["Free toiletries"] || false,
      "Makeup table": amenitiesState?.otherAmenities?.["Makeup table"] || false,
      "Hot pot": amenitiesState?.otherAmenities?.["Hot pot"] || false,
      "Bathroom heaters": amenitiesState?.otherAmenities?.["Bathroom heaters"] || false,
      "Kettle": amenitiesState?.otherAmenities?.Kettle || false,
      "Dishwasher": amenitiesState?.otherAmenities?.Dishwasher || false,
      "BBQ grill": amenitiesState?.otherAmenities?.["BBQ grill"] || false,
      "Toaster": amenitiesState?.otherAmenities?.Toaster || false,
      "Towel": amenitiesState?.otherAmenities?.Towel || false,
      "Beach Towel": amenitiesState?.otherAmenities?.["Beach Towel"] || false,
      "Dining table": amenitiesState?.otherAmenities?.["Dining table"] || false,
      "Airport": amenitiesState?.otherAmenities?.["Airport"] || false,
      "ATM": amenitiesState?.otherAmenities?.["ATM"] || false,
      "Beach": amenitiesState?.otherAmenities?.["Beach"] || false,
      "City view": amenitiesState?.otherAmenities?.["City view"] || false,
      "Terrace": amenitiesState?.otherAmenities?.["Terrace"] || false,
      "Tennis Court": amenitiesState?.otherAmenities?.["Tennis Court"] || false,
      "Game Console": amenitiesState?.otherAmenities?.["Game Console"] || false,
      "Garden View": amenitiesState?.otherAmenities?.["Garden view"] || false,
      "Gas Station": amenitiesState?.otherAmenities?.["Gas Station"] || false,
      "Gym": amenitiesState?.otherAmenities?.Gym || false,
      "Luggage Trolley": amenitiesState?.otherAmenities?.["Luggage Trolley"] || false,
      "Outdoor Furniture": amenitiesState?.otherAmenities?.["Outdoor Furniture"] || false,
      "Park": amenitiesState?.otherAmenities?.Park || false,
      "Play Ground": amenitiesState?.otherAmenities?.["Play Ground"] || false,
      "Pool": amenitiesState?.otherAmenities?.Pool || false,
      "Sauna": amenitiesState?.otherAmenities?.Sauna || false,
      "Room Service": amenitiesState?.otherAmenities?.["Room Service"] || false,
      "Railway Station": amenitiesState?.otherAmenities?.["Railway Station"] || false,
      "Seating Area": amenitiesState?.otherAmenities?.["Seating Area"] || false,
      "Bidet": amenitiesState?.otherAmenities?.Bidet || false,
      "Socket near the bed":
        amenitiesState?.otherAmenities?.["Socket near the bed"] || false,
      "Books": amenitiesState?.otherAmenities?.Books || false,
      "Smoke Detectors": amenitiesState?.otherAmenities?.["Smoke Detectors"] || false,
      "DVD for children": amenitiesState?.otherAmenities?.["DVD for children"] || false,
      "Cable Channels": amenitiesState?.otherAmenities?.["Cable Channels"] || false,
      "Music for children": amenitiesState?.otherAmenities?.["Music for children"] || false,
      "Fire Place": amenitiesState?.otherAmenities?.["Fire Place"] || false,
      "Sofa Bed": amenitiesState?.otherAmenities?.["Sofa Bed"] || false,
      "Latex Mattresses": amenitiesState?.otherAmenities?.["Latex Mattresses"] || false,
      "Claw Foot Tub": amenitiesState?.otherAmenities?.["Claw Foot Tub"] || false,
      "Hand Held Shower": amenitiesState?.otherAmenities?.["Hand Held Shower"] || false,
      "Chocolates": amenitiesState?.otherAmenities?.Chocolates || false,
      "Butler Pantry": amenitiesState?.otherAmenities?.["Butler Pantry"] || false,
      "Private Bathroom": amenitiesState?.otherAmenities?.["Private Bathroom"] || false,
      "Patio": amenitiesState?.otherAmenities?.Patio || false,
      "Computer": amenitiesState?.otherAmenities?.Computer || false,
      "Playground": amenitiesState?.otherAmenities?.Playground || false,
      "Outdoor Dinning Area":
        amenitiesState?.otherAmenities?.["Outdoor Dinning Area"] || false,
      "Mini Bar": amenitiesState?.otherAmenities?.["Mini Bar"] || false,
      "Outdoor Tub": amenitiesState?.otherAmenities?.["Outdoor Tub"] || false,
      "Garden": amenitiesState?.otherAmenities?.Garden || false,
      "Streaming Media": amenitiesState?.otherAmenities?.["Streaming Media"] || false,
      "Parasol": amenitiesState?.otherAmenities?.Parasol || false,
      "Sea View": amenitiesState?.otherAmenities?.["Sea View"] || false,
      "Tall Chairs": amenitiesState?.otherAmenities?.["Tall Chairs"] || false,
      "Cafeteria": amenitiesState?.otherAmenities?.Cafeteria || false,
      "Tobacco Detectors": amenitiesState?.otherAmenities?.["Tobacco Detectors"] || false,
      "Sunbed": amenitiesState?.otherAmenities?.Sunbed || false,
      "Beach Umbrella": amenitiesState?.otherAmenities?.["Beach Umbrella"] || false,
      "Private Pool": amenitiesState?.otherAmenities?.["Private Pool"] || false,
      "Indoor Pool": amenitiesState?.otherAmenities?.["Indoor Pool"] || false,
      "Outdoor Pool": amenitiesState?.otherAmenities?.["Outdoor Pool"] || false,
      "Small Pool": amenitiesState?.otherAmenities?.["Small Pool"] || false,
      "Beach Chair": amenitiesState?.otherAmenities?.["Beach Chair"] || false,
      "Kitchenette": amenitiesState?.otherAmenities?.Kitchenette || false,
      "Kitchenware": amenitiesState?.otherAmenities?.Kitchenware || false,
      "Entire Unit Wheel Chair": amenitiesState?.otherAmenities?.["Entire Unit Wheel Chair"] || false,
      "Bicycles": amenitiesState?.otherAmenities?.Bicycles || false,
      "Outdoor Shower": amenitiesState?.otherAmenities?.["Outdoor Shower"] || false,
      "Sun Lounger": amenitiesState?.otherAmenities?.["Sun Lounger"] || false,
      "Carbon Monoxide Detector": amenitiesState?.otherAmenities?.["Carbon Monoxide Detector"] || false,
      "Hearths": amenitiesState?.otherAmenities?.["Hearths"] || false,
    }),
    [savedAmenities]
  );

	
	const safeAmenities = useMemo(
    () => ({
      "Fire Siren": amenitiesState?.safeAmenities?.["Fire Siren"] || false,
      "Fire extinguisher": amenitiesState?.safeAmenities?.["Fire extinguisher"] || false,
      "Antitheft Key": amenitiesState?.safeAmenities?.["Antitheft Key"] || false,
      "Safe Vault": amenitiesState?.safeAmenities?.["Safe Vault"] || false,
    }),
    [savedAmenities]
  );

  const initialState: MainState = {
    generalAmenities,
    otherAmenities,
    safeAmenities,
  };

  // const [amenities, setAmenities] = useState<checkBoxState[]>([
  //   generalAmenities,
  //   otherAmenities,
  //   safeAmenities,
  // ]);

  const [amenities, setAmenities] = useState<MainState>(initialState);

  const handleCheckboxChange = (
    outerKey: keyof MainState,
    innerKey: string,
    checked: boolean
  ) => {
    setAmenities((prevState) => ({
      ...prevState,
      [outerKey]: {
        ...prevState[outerKey],
        [innerKey]: checked,
      },
    }));
  };

  // useEffect(() => {
  //   const AmenitiesToRetrieve = {
  //     generalAmenities,
  //     otherAmenities,
  //     safeAmenities,
  //   };
  //   localStorage.setItem("page4", JSON.stringify(amenities));
  //   localStorage.setItem(
  //     "AmenitiesToRetrieve",
  //     JSON.stringify(AmenitiesToRetrieve)
  //   );
  // }, [amenities, generalAmenities, otherAmenities, safeAmenities]);

  useEffect(() => {
    localStorage.setItem("page4", JSON.stringify(amenities));
  }, [amenities]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Amenities </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Many customers have searched for accommodation based on amenities
          criteria
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            General amenities
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* {Object.keys(amenities[0])
              .sort((a, b) => a.localeCompare(b)) // Sort the keys alphabetically
              .map((key) => (
                <Checkbox
                  className="cursor-pointer"
                  key={key}
                  label={key}
                  name={key}
                  onChange={(checked) => handleCheckboxChange(key, checked, 0)}
                  {...(amenities[0][key] && {
                    defaultChecked: true,
                  })}
                />
              ))} */}
            {Object.keys(amenities.generalAmenities)
              .sort((a, b) => a.localeCompare(b))
              .map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`general-${key}`}
                    checked={amenities.generalAmenities[key]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("generalAmenities", key, Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={`general-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {key}
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Other amenities
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* {Object.keys(amenities[0])
              .sort((a, b) => a.localeCompare(b)) // Sort the keys alphabetically
              .map((key) => (
                <Checkbox
                  className="cursor-pointer"
                  key={key}
                  label={key}
                  name={key}
                  onChange={(checked) => handleCheckboxChange(key, checked, 0)}
                  {...(amenities[0][key] && {
                    defaultChecked: true,
                  })}
                />
              ))} */}
            {Object.keys(amenities.otherAmenities)
              .sort((a, b) => a.localeCompare(b))
              .map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`other-${key}`}
                    checked={amenities.otherAmenities[key]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("otherAmenities", key, Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={`other-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {key}
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* ITEM */}
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Safe amenities
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* {Object.keys(amenities[2]).map((key) => (
              <Checkbox
                key={key}
                label={key}
                name={key}
                onChange={(checked) => handleCheckboxChange(key, checked, 2)}
                {...(amenities[2][key] && {
                  defaultChecked: true,
                })}
              />
            ))} */}
            {Object.keys(amenities.safeAmenities)
              .sort((a, b) => a.localeCompare(b))
              .map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`safe-${key}`}
                    checked={amenities.safeAmenities[key]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("safeAmenities", key, Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={`safe-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {key}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing4;
