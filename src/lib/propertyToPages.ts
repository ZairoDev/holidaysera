import { Property } from "@/lib/type";

/**
 * Convert a Property (server-mapped) into the localStorage shapes
 * used by the multi-step add-listing wizard (page1..page9).
 */
export function propertyToPages(prop: Property) {
  const pages: Record<string, any> = {};

  // PAGE 1
  const numberOfPortions =
    (prop.datesPerPortion && prop.datesPerPortion.length) || 1;
  pages.page1 = {
    propertyType: prop.propertyType || "House",
    placeName: prop.propertyName || prop.placeName || "",
    rentalForm: prop.rentalForm || "",
    numberOfPortions: numberOfPortions,
    showPortionsInput: numberOfPortions > 1,
    rentalType: prop.rentalType || "Short Term",
  };

  // PAGE 2 - Location
  pages.page2 = {
    country: prop.country || "",
    street: prop.street || "",
    roomNumber: "",
    city: prop.city || "",
    state: prop.state || "",
    postalCode: prop.postalCode || "",
    center: prop.center || { lat: 0, lng: 0 },
  };

  // PAGE 3 - Portions / spaces: wizard expects arrays per portion
  const makeArray = (val: any, size: number) => Array(size).fill(val ?? "");
  pages.page3 = {
    portionName: makeArray(prop.propertyName || "Room", numberOfPortions),
    portionSize: makeArray(prop.size || 0, numberOfPortions),
    guests: makeArray(prop.guests ?? 1, numberOfPortions),
    bedrooms: makeArray(prop.bedrooms ?? 0, numberOfPortions),
    beds: makeArray(prop.beds ?? 0, numberOfPortions),
    bathroom: makeArray(prop.bathroom ?? 0, numberOfPortions),
    kitchen: makeArray(prop.kitchen ?? 0, numberOfPortions),
    childrenAge: makeArray(prop.childrenAge ?? 0, numberOfPortions),
  };

  // PAGE 4 - Amenities
  pages.page4 = {
    generalAmenities: prop.generalAmenities || {},
    otherAmenities: prop.otherAmenities || {},
    safeAmenities: prop.safeAmenities || {},
  };

  // PAGE 5 - Rules
  pages.page5 = {
    smoking: prop.smoking || "",
    pet: prop.pet || "",
    party: prop.party || "",
    cooking: prop.cooking || "",
    additionalRules: prop.additionalRules || [],
  };

  // PAGE 6 - Description / reviews (client stores as array of strings)
  const reviewsArray = (prop.reviews || "")
    .split(/\n\n|\r\n\r\n/) // split paragraphs
    .map((s) => s.trim())
    .filter(Boolean);
  pages.page6 = {
    reviews: reviewsArray.length ? reviewsArray : [""],
  };

  // PAGE 7 - Images
  pages.page7 = {
    propertyCoverFileUrl: prop.propertyCoverFileUrl || "",
    propertyPictureUrls: prop.propertyPictureUrls || Array(5).fill(""),
    portionCoverFileUrls: makeArray("", numberOfPortions),
    portionPictureUrls: Array.from({ length: numberOfPortions }, () => Array(5).fill("")),
  };

  // If the server stored portion images or propertyImages put them in the first slots
  if (prop.propertyPictureUrls && prop.propertyPictureUrls.length) {
    const arr = Array(5).fill("");
    prop.propertyPictureUrls.slice(0, 5).forEach((u, i) => (arr[i] = u));
    pages.page7.propertyPictureUrls = arr;
  }

  if (prop.propertyCoverFileUrl) {
    pages.page7.propertyCoverFileUrl = prop.propertyCoverFileUrl;
  }

  // PAGE 8 - Pricing
  pages.page8 = {
    basePrice: [prop.basePrice ?? 0],
    weekendPrice: [prop.weekendPrice ?? 0],
    weeklyDiscount: [prop.weeklyDiscount ?? 0],
    basePriceLongTerm: [prop.basePriceLongTerm ?? 0],
    monthlyDiscount: [prop.monthlyDiscount ?? 0],
    currency: prop.currency || "USD",
  };

  // PAGE 9 - Availability
  // Client expects datesPerPortion as number[][]; server stores strings in some cases
  const datesPerPortion =
    (prop.datesPerPortion || []).map((d) => {
      if (Array.isArray(d)) return d.map((n: any) => Number(n));
      if (typeof d === "string") return [Number(d) || 0];
      return [];
    }) || Array.from({ length: numberOfPortions }, () => []);

  // Ensure correct length
  if (datesPerPortion.length !== numberOfPortions) {
    while (datesPerPortion.length < numberOfPortions) datesPerPortion.push([]);
    if (datesPerPortion.length > numberOfPortions) datesPerPortion.length = numberOfPortions;
  }

  pages.page9 = {
    night: prop.night || [1, 21],
    month: [1, 12],
    time: prop.time || [0, 24],
    datesPerPortion,
  };

  return pages;
}

export default propertyToPages;
