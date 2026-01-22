import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// In-memory cache for autocomplete results
const autocompleteCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get("input");

    if (!input || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input parameter is required" },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = input.toLowerCase().trim();
    const cached = autocompleteCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Call Google Places Autocomplete API
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", input);
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
    // Use (regions) to include countries, states, and cities - this helps prioritize countries
    url.searchParams.set("types", "(regions)");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch autocomplete results" },
        { status: 500 }
      );
    }

    // Filter and prioritize results: countries first, then cities
    if (data.predictions && data.predictions.length > 0) {
      const countryNames = [
        "Italy", "Greece", "Spain", "France", "Portugal", "Cyprus",
        "Netherlands", "United Kingdom", "UK", "Hungary", "Turkey",
        "Bulgaria", "Lithuania", "Malta", "Romania", "Croatia",
        "Slovenia", "Slovakia", "Vietnam", "Thailand", "Singapore",
        "Japan", "Korea", "South Korea", "India", "Canada",
        "Australia", "United States", "US", "Germany", "Switzerland",
        "Austria", "Belgium", "Poland", "Czech Republic", "Denmark",
        "Sweden", "Norway", "Finland", "Iceland", "Ireland"
      ];

      const inputLower = input.toLowerCase().trim();
      
      // Check if input matches a country name
      const isCountrySearch = countryNames.some(
        country => country.toLowerCase() === inputLower
      );

      if (isCountrySearch) {
        // Sort predictions: country-level results first
        data.predictions.sort((a: any, b: any) => {
          const aMainText = (a.structured_formatting?.main_text || "").toLowerCase();
          const bMainText = (b.structured_formatting?.main_text || "").toLowerCase();
          const aSecondaryText = (a.structured_formatting?.secondary_text || "").toLowerCase();
          const bSecondaryText = (b.structured_formatting?.secondary_text || "").toLowerCase();

          // Check if main text exactly matches the input (country name)
          const aIsExactCountry = aMainText === inputLower;
          const bIsExactCountry = bMainText === inputLower;

          if (aIsExactCountry && !bIsExactCountry) return -1;
          if (!aIsExactCountry && bIsExactCountry) return 1;

          // Prioritize results without US/Canada in secondary text
          const aHasUS = aSecondaryText.includes("usa") || aSecondaryText.includes("united states") || aSecondaryText.includes("canada");
          const bHasUS = bSecondaryText.includes("usa") || bSecondaryText.includes("united states") || bSecondaryText.includes("canada");

          if (!aHasUS && bHasUS) return -1;
          if (aHasUS && !bHasUS) return 1;

          return 0;
        });

        // Filter out results where main text matches country but secondary text is US/Canada
        // Keep only the actual country result
        const exactCountryMatch = data.predictions.find((pred: any) => {
          const mainText = (pred.structured_formatting?.main_text || "").toLowerCase();
          const secondaryText = (pred.structured_formatting?.secondary_text || "").toLowerCase();
          return mainText === inputLower && 
                 !secondaryText.includes("usa") && 
                 !secondaryText.includes("united states") &&
                 !secondaryText.includes("canada");
        });

        if (exactCountryMatch) {
          // Put exact country match first, then filter out US/Canada results with same name
          data.predictions = [
            exactCountryMatch,
            ...data.predictions.filter((pred: any) => {
              const mainText = (pred.structured_formatting?.main_text || "").toLowerCase();
              const secondaryText = (pred.structured_formatting?.secondary_text || "").toLowerCase();
              // Keep if it's not the exact country match and doesn't have US/Canada
              return pred.place_id !== exactCountryMatch.place_id &&
                     !(mainText === inputLower && (secondaryText.includes("usa") || secondaryText.includes("united states") || secondaryText.includes("canada")));
            })
          ];
        } else {
          // No exact match, filter out US/Canada results with country name
          data.predictions = data.predictions.filter((pred: any) => {
            const mainText = (pred.structured_formatting?.main_text || "").toLowerCase();
            const secondaryText = (pred.structured_formatting?.secondary_text || "").toLowerCase();
            // Remove if main text matches country name but secondary is US/Canada
            return !(mainText === inputLower && (secondaryText.includes("usa") || secondaryText.includes("united states") || secondaryText.includes("canada")));
          });
        }
      }
    }

    // Cache the result
    autocompleteCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Clean old cache entries (keep only last 100)
    if (autocompleteCache.size > 100) {
      const entries = Array.from(autocompleteCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      autocompleteCache.clear();
      entries.slice(0, 100).forEach(([key, value]) => {
        autocompleteCache.set(key, value);
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Autocomplete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


