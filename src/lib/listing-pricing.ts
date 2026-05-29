export type RentalType = "Short Term" | "Long Term" | "Both";

export function normalizeRentalType(value: unknown): RentalType {
  if (value === "Short Term" || value === "Long Term" || value === "Both") {
    return value;
  }
  if (typeof value !== "string") {
    return "Short Term";
  }
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (normalized === "long term") return "Long Term";
  if (normalized === "both") return "Both";
  if (normalized === "short term") return "Short Term";
  return "Short Term";
}

export function parsePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/** First positive price in an array, or first entry if all zero. */
export function firstPositivePrice(value: unknown): number {
  if (!Array.isArray(value)) {
    return parsePrice(value);
  }
  for (const item of value) {
    const price = parsePrice(item);
    if (price > 0) return price;
  }
  return parsePrice(value[0]);
}

export function parsePriceInput(raw: string): number {
  return parsePrice(raw);
}

export function resolveListingPrices(input: {
  rentalType: RentalType;
  basePrice: number;
  basePriceLongTerm?: number;
}): { basePrice: number; basePriceLongTerm?: number } {
  const shortRaw = input.basePrice ?? 0;
  const longRaw = input.basePriceLongTerm ?? 0;

  if (input.rentalType === "Long Term") {
    const price = longRaw > 0 ? longRaw : shortRaw;
    return { basePrice: price, basePriceLongTerm: price };
  }

  if (input.rentalType === "Short Term") {
    const price = shortRaw > 0 ? shortRaw : longRaw;
    return {
      basePrice: price,
      basePriceLongTerm: longRaw > 0 ? longRaw : undefined,
    };
  }

  return {
    basePrice: shortRaw,
    basePriceLongTerm: longRaw > 0 ? longRaw : undefined,
  };
}
