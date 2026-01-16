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
    url.searchParams.set("types", "(cities)"); // Focus on cities for vacation rentals

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch autocomplete results" },
        { status: 500 }
      );
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


