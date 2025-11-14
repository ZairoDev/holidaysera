import { Property, PropertyDocument } from "@/lib/type";
import { router, publicProcedure, TRPCError, protectedProcedure } from "../trpc";
import { Properties } from "@/models/property";
import z from "zod";

export function mapPropertyDocument(doc: any) {
  // Safety check: if doc is null/undefined, return null
  if (!doc) {
    return null;
  }

  // Safety check: if _id is missing, log error and return null
  if (!doc._id) {
    console.error("Document missing _id:", doc);
    return null;
  }

  return {
    _id: doc._id.toString(),
    VSID: doc.VSID || undefined,
    commonId: doc.commonId || undefined,
    email: doc.email || undefined,
    userId: doc.userId || undefined,

    rentalType: doc.rentalType || undefined,
    isInstantBooking: doc.isInstantBooking || false,
    propertyType: doc.propertyType || "House",
    rentalForm: doc.rentalForm || undefined,
    propertyName: doc.propertyName || "Untitled Property",
    placeName: doc.placeName || undefined,
    newPlaceName: doc.newPlaceName || undefined,

    street: doc.street || undefined,
    postalCode: doc.postalCode || undefined,
    city: doc.city || "Unknown",
    state: doc.state || undefined,
    country: doc.country || "Unknown",
    center: doc.center || undefined,

    size: doc.size || undefined,
    guests: doc.guests || 1,
    bedrooms: doc.bedrooms || 0,
    beds: doc.beds || undefined,
    bathroom: doc.bathroom || 0,
    kitchen: doc.kitchen || undefined,
    childrenAge: doc.childrenAge || undefined,

    basePrice: doc.basePrice || 0,
    weekendPrice: doc.weekendPrice || undefined,
    weeklyDiscount: doc.weeklyDiscount || undefined,
    pricePerDay: doc.pricePerDay || undefined,
    basePriceLongTerm: doc.basePriceLongTerm || undefined,
    monthlyDiscount: doc.monthlyDiscount || undefined,
    currency: doc.currency || "USD",

    icalLinks: doc.icalLinks || undefined,
    generalAmenities: doc.generalAmenities || {},
    otherAmenities: doc.otherAmenities || {},
    safeAmenities: doc.safeAmenities || {},

    smoking: doc.smoking || undefined,
    pet: doc.pet || undefined,
    party: doc.party || undefined,
    cooking: doc.cooking || undefined,
    additionalRules: doc.additionalRules || [],

    reviews: doc.reviews || [],
    newReviews: doc.newReviews || [],
    rating: doc.rating || undefined,

    propertyImages: doc.propertyImages || undefined,
    propertyCoverFileUrl: doc.propertyCoverFileUrl || undefined,
    propertyPictureUrls: doc.propertyPictureUrls || [],

    night: doc.night || undefined,
    time: doc.time || undefined,
    datesPerPortion: doc.datesPerPortion || undefined,

    area: doc.area || undefined,
    subarea: doc.subarea || undefined,
    neighbourhood: doc.neighbourhood || undefined,
    floor: doc.floor || undefined,
    isTopFloor: doc.isTopFloor || false,
    orientation: doc.orientation || undefined,
    levels: doc.levels || undefined,
    zones: doc.zones || undefined,
    propertyStyle: doc.propertyStyle || undefined,
    constructionYear: doc.constructionYear || undefined,
    isSuitableForStudents: doc.isSuitableForStudents || undefined,

    monthlyExpenses: doc.monthlyExpenses || undefined,
    heatingType: doc.heatingType || undefined,
    heatingMedium: doc.heatingMedium || undefined,
    energyClass: doc.energyClass || undefined,

    nearbyLocations: doc.nearbyLocations || [],

    hostedFrom: doc.hostedFrom || undefined,
    hostedBy: doc.hostedBy || undefined,

    listedOn: doc.listedOn || [],
    lastUpdatedBy: doc.lastUpdatedBy || undefined,
    lastUpdates: doc.lastUpdates || [],
    isLive: doc.isLive !== undefined ? doc.isLive : true,

    createdAt: doc.createdAt || undefined,
    updatedAt: doc.updatedAt || undefined,

    featured: doc.featured || false,
  };
}

export const propertyRouter = router({
  getFeatured: publicProcedure.query(async () => {
    try {
      // Fetch only necessary fields for PropertyCard
      const featured = await Properties.find(
        { rentalType: "Short Term", isLive: true },
        {
          VSID: 1,
          propertyName: 1,
          city: 1,
          country: 1,
          propertyPictureUrls: 1,
          propertyImages: 1,
          basePrice: 1,
          guests: 1,
          bedrooms: 1,
          bathroom: 1,
          reviews: 1,
        }
      )
        .sort({ _id: -1 })
        .lean()
        .limit(10);

      console.log("Raw featured from DB:", featured.length, "properties");

      // 🔥 CRITICAL: Convert ObjectId to string for Client Components
      // This is what fixes the "Objects with toJSON methods" error
      const serializedProperties = featured.map((doc: any) => ({
        _id: doc._id.toString(), // ✅ Convert ObjectId to string
        VSID: doc.VSID ?? "",
        propertyName: doc.propertyName ?? "Untitled Property",
        city: doc.city ?? "",
        country: doc.country ?? "",
        propertyImages: doc.propertyImages ?? [],
        propertyPictureUrls: doc.propertyPictureUrls ?? [],
        basePrice: doc.basePrice ?? 0,
        guests: doc.guests ?? 0,
        bedrooms: doc.bedrooms ?? 0,
        bathroom: doc.bathroom ?? 0,
        reviews: doc.reviews ?? null,
      }));

      console.log("Serialized properties:", serializedProperties.length);

      return serializedProperties;
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch featured properties",
      });
    }
  }),
  getFiltered: publicProcedure
  .input(
    z.object({
      location: z.string().optional(),
      priceRange: z.tuple([z.number(), z.number()]).optional(),
      propertyTypes: z.array(z.string()).optional(),
      minBedrooms: z.number().optional(),
      minBathrooms: z.number().optional(),
      minGuests: z.number().optional(),
      minRating: z.number().optional(),
      amenities: z.array(z.string()).optional(),
      sortBy: z
        .enum(["featured", "price-low", "price-high", "rating"])
        .default("featured"),

      // 👇 NEW FOR INFINITE SCROLL
      cursor: z.string().nullish(),
      limit: z.number().default(12),
    })
  )
  .query(async ({ input }) => {
    try {
      const { cursor, limit } = input;

      const filter: Record<string, any> = { isLive: true };

      // Location search
      if (input.location) {
        const regex = new RegExp(input.location, "i");
        filter.$or = [
          { city: regex },
          { country: regex },
          { placeName: regex },
          { propertyName: regex },
        ];
      }

      // Price range
      if (input.priceRange) {
        filter.basePrice = {
          $gte: input.priceRange[0],
          $lte: input.priceRange[1],
        };
      }

      filter.rentalType = "Short Term";

      // Property type
      if (input.propertyTypes?.length) {
        filter.propertyType = { $in: input.propertyTypes };
      }

      // Bedrooms / bathrooms / guests
      if (input.minBedrooms) filter.bedrooms = { $gte: input.minBedrooms };
      if (input.minBathrooms) filter.bathroom = { $gte: input.minBathrooms };
      if (input.minGuests) filter.guests = { $gte: input.minGuests };

      // Rating
      if (input.minRating) filter.rating = { $gte: input.minRating };

      // Amenities
      if (input.amenities?.length) {
        for (const amenity of input.amenities) {
          filter[`generalAmenities.${amenity}`] = true;
        }
      }

      // Sorting
      let sort: any = {};
      switch (input.sortBy) {
        case "price-low":
          sort = { basePrice: 1, _id: -1 };
          break;
        case "price-high":
          sort = { basePrice: -1, _id: -1 };
          break;
        case "rating":
          sort = { rating: -1, _id: -1 };
          break;
        default:
        case "featured":
          sort = { featured: -1, _id: -1 };
          break;
      }

      // Cursor pagination
      if (cursor) {
        filter._id = { $lt: cursor }; // Fetch next batch older than cursor
      }

      const docs = await Properties.find(filter)
        .sort(sort)
        .limit(limit + 1) // fetch 1 extra to detect next page
        .lean();

      const mapped = docs
        .slice(0, limit)
        .map(mapPropertyDocument)
        .filter(Boolean);

      // next cursor
      const nextCursor =
        docs[limit] && docs[limit]._id ? docs[limit]._id.toString() : null;
      
      const totalCount = await Properties.countDocuments(filter);

      return {
        items: mapped,
        totalCount,
        nextCursor,
      };
    } catch (e) {
      console.error("Error in getFiltered:", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch filtered properties",
      });
    }
  }),


  // ========================================
  // GET PROPERTY BY ID
  // ========================================
  getPropertyById: publicProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Validate ObjectId format (if using MongoDB ObjectId)
        if (!input._id || input._id.length < 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid property ID",
          });
        }

        const doc = await Properties.findOne({ _id: input._id }).lean();

        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        const mappedProperty = mapPropertyDocument(doc);

        if (!mappedProperty) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process property data",
          });
        }

        return mappedProperty;
      } catch (e) {
        // Re-throw TRPCErrors as-is
        if (e instanceof TRPCError) {
          throw e;
        }

        console.error("Error in getPropertyById:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",


          
          message: "Failed to fetch property",
        });
      }
    }),
});
