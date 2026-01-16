import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// In-memory cache for place details
const detailsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes (place details change less frequently)

export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get("place_id");

    if (!placeId) {
      return NextResponse.json(
        { error: "place_id parameter is required" },
        { status: 400 }
      );
    }

    // Check cache
    const cached = detailsCache.get(placeId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Call Google Places Details API
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("key", GOOGLE_MAPS_API_KEY);
    url.searchParams.set("fields", [
      "name",
      "rating",
      "formatted_address",
      "formatted_phone_number",
      "website",
      "url",
      "types",
      "photos",
      "opening_hours",
      "geometry",
      "address_components",
    ].join(","));

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places Details API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "Failed to fetch place details" },
        { status: 500 }
      );
    }

    // Process and format the response
    const place = data.result;
    const formattedData = {
      name: place.name,
      rating: place.rating,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      mapUrl: place.url,
      types: place.types || [],
      openingHours: place.opening_hours?.weekday_text || [],
      isOpen: place.opening_hours?.open_now,
      photos: place.photos?.slice(0, 5).map((photo: any) => ({
        photoReference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
      })) || [],
      location: place.geometry?.location
        ? {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }
        : null,
      addressComponents: place.address_components || [],
    };

    // Cache the result
    detailsCache.set(placeId, {
      data: formattedData,
      timestamp: Date.now(),
    });

    // Clean old cache entries (keep only last 50)
    if (detailsCache.size > 50) {
      const entries = Array.from(detailsCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      detailsCache.clear();
      entries.slice(0, 50).forEach(([key, value]) => {
        detailsCache.set(key, value);
      });
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Place Details API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


