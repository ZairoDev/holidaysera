import { Property, PropertyDocument } from "@/lib/type";
import { router, publicProcedure, TRPCError, protectedProcedure } from "../trpc";
import { Properties } from "@/models/property";
import Review from "@/models/review";
import mongoose from "mongoose";
import z from "zod";
import axios from "axios";

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
        .limit(12);

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

        // Amenities - check all three amenity maps (generalAmenities, otherAmenities, safeAmenities)
        if (input.amenities?.length) {
          const amenityFilters: any[] = [];
          
          // Map frontend amenity names to possible database keys
          const amenityKeyMap: Record<string, string[]> = {
            "WiFi": ["Wifi", "WiFi", "wifi", "Internet"],
            "Pool": ["Pool", "pool", "Private Pool", "Indoor Pool", "Outdoor Pool", "Small Pool"],
            "Air Conditioning": ["Air conditioning", "Air Conditioning", "air conditioning"],
            "Kitchen": ["Kitchen", "kitchen"],
            "Parking": ["Free Parking", "Parking", "parking", "Free parking"],
            "Hot Tub": ["Hot Tub/ Jacuzzi", "Hot Tub", "hot tub", "Jacuzzi"],
            "Beach Access": ["Beach Front", "Beach", "beach", "Beach Access", "Beach Towel"],
            "Gym Access": ["Gym", "gym", "Gym Access"],
            "Fireplace": ["Fire Place", "Fireplace", "fireplace"],
          };
          
          for (const amenity of input.amenities) {
            // Get possible keys for this amenity
            const possibleKeys = amenityKeyMap[amenity] || [
              amenity,
              amenity.toLowerCase(),
              amenity.charAt(0).toUpperCase() + amenity.slice(1).toLowerCase(),
            ];
            
            const amenityConditions: any[] = [];
            
            for (const key of possibleKeys) {
              // Check generalAmenities
              amenityConditions.push({ [`generalAmenities.${key}`]: true });
              // Check otherAmenities
              amenityConditions.push({ [`otherAmenities.${key}`]: true });
              // Check safeAmenities
              amenityConditions.push({ [`safeAmenities.${key}`]: true });
            }
            
            // At least one of the variations must be true in any of the amenity maps
            amenityFilters.push({ $or: amenityConditions });
          }
          
          // All selected amenities must be present (AND condition)
          if (amenityFilters.length > 0) {
            filter.$and = filter.$and || [];
            filter.$and.push(...amenityFilters);
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

        // If rating filter is applied, we need to use aggregation to calculate average ratings
        if (input.minRating && input.minRating > 0) {
          // Remove cursor from filter for aggregation (we'll handle it after)
          const baseFilter = { ...filter };
          delete baseFilter._id;

          // Use aggregation pipeline to calculate average ratings from reviews
          const pipeline: any[] = [
            // Match properties with base filters (excluding cursor)
            { $match: baseFilter },
            // Lookup reviews for each property
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "propertyId",
                as: "reviews",
              },
            },
            // Calculate average rating
            {
              $addFields: {
                avgRating: {
                  $cond: {
                    if: { $gt: [{ $size: "$reviews" }, 0] },
                    then: { $avg: "$reviews.rating" },
                    else: 0,
                  },
                },
              },
            },
            // Filter by minimum rating
            {
              $match: {
                avgRating: { $gte: input.minRating },
              },
            },
          ];

          // Apply cursor filter if exists (after rating calculation, before sort)
          if (cursor) {
            try {
              const cursorObjectId = new mongoose.Types.ObjectId(cursor);
              pipeline.push({
                $match: {
                  _id: { $lt: cursorObjectId },
                },
              });
            } catch (error) {
              console.error("Invalid cursor format:", error);
            }
          }

          // Sort and limit
          pipeline.push({ $sort: sort });
          pipeline.push({ $limit: limit + 1 });

          const docs = await Properties.aggregate(pipeline);

          const mapped = docs
            .slice(0, limit)
            .map((doc: any) => {
              // Convert aggregation result back to property document format
              const { reviews, avgRating, ...propertyDoc } = doc;
              return mapPropertyDocument(propertyDoc);
            })
            .filter(Boolean);

          // Get total count with rating filter
          const countPipeline: any[] = [
            { $match: baseFilter },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "propertyId",
                as: "reviews",
              },
            },
            {
              $addFields: {
                avgRating: {
                  $cond: {
                    if: { $gt: [{ $size: "$reviews" }, 0] },
                    then: { $avg: "$reviews.rating" },
                    else: 0,
                  },
                },
              },
            },
            {
              $match: {
                avgRating: { $gte: input.minRating },
              },
            },
            { $count: "total" },
          ];

          const countResult = await Properties.aggregate(countPipeline);
          const totalCount = countResult[0]?.total || 0;

          // next cursor
          const nextCursor =
            docs[limit] && docs[limit]._id ? docs[limit]._id.toString() : null;

          return {
            items: mapped,
            totalCount,
            nextCursor,
          };
        } else {
          // No rating filter, use regular query
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
        }
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
    getOwnerProperties: protectedProcedure.query(async ({ ctx }) => {
      const properties = await Properties.find({
        userId: ctx.user.id,
      }).sort({ createdAt: -1 });

      return properties;
    }),

    deleteProperty: protectedProcedure
      .input(z.object({ propertyId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const property = await Properties.findById(input.propertyId);

        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        // Verify ownership
        if (property.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this property",
          });
        }

        await Properties.findByIdAndDelete(input.propertyId);

        return { success: true };
      }),

    // ========================================
    // ADD LISTING (CREATE PROPERTY)
    // ========================================
    addListing: protectedProcedure
    .input(
      z.object({
        // Basic Info (Page 1)
        propertyType: z.string().min(1, "Property type is required"),
        propertyName: z.string().min(1, "Property name is required"),
        placeName: z.string().min(1, "Place name is required"),
        rentalType: z.enum(["Short Term", "Long Term", "Both"]),
        rentalForm: z.string().optional(),
  
        // Location (Page 2)
        street: z.string().optional(),
        postalCode: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().optional(),
        country: z.string().min(1, "Country is required"),
        center: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
  
        // Spaces (Page 3) - CHANGED TO NUMBERS
        guests: z.number().int().nonnegative(),
        bedrooms: z.number().int().nonnegative().optional(),
        beds: z.number().int().nonnegative().optional(),
        bathroom: z.number().int().nonnegative().optional(),
        kitchen: z.number().int().nonnegative().optional(),
        size: z.number().optional(),
  
        // Amenities (Page 4)
        generalAmenities: z.record(z.string(), z.boolean()).optional(),
        otherAmenities: z.record(z.string(), z.boolean()).optional(),
        safeAmenities: z.record(z.string(), z.boolean()).optional(),
  
        // House Rules (Page 5)
        smoking: z.string().optional(),
        pet: z.string().optional(),
        party: z.string().optional(),
        cooking: z.string().optional(),
        additionalRules: z.array(z.string()).optional(),
  
        // Description (Page 6) - CHANGED TO STRING
        reviews: z.string().optional(),
  
        // Images (Page 7)
        propertyCoverFileUrl: z.string().optional(),
        propertyPictureUrls: z.array(z.string()).optional(),
  
        // Pricing (Page 8) - CHANGED TO NUMBERS
        basePrice: z.number().positive("Base price must be greater than 0"),
        weekendPrice: z.number().optional(),
        weeklyDiscount: z.number().optional(),
        basePriceLongTerm: z.number().optional(),
        monthlyDiscount: z.number().optional(),
        currency: z.string().default("USD"),
  
        // Availability (Page 9) - CHANGED datesPerPortion
        night: z.array(z.number()).optional(),
        time: z.array(z.number()).optional(),
        datesPerPortion: z.array(z.string()).optional(),
        icalLinks: z.record(z.string(), z.string()).optional(),
  
        // Additional fields
        isInstantBooking: z.boolean().optional(),
        isLive: z.boolean().default(true),
        hostedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate required fields
        if (!input.propertyType || !input.propertyName || !input.placeName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing required property information",
          });
        }
  
        if (input.basePrice <= 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Base price must be greater than 0",
          });
        }
  
        // Create new property document
        const newProperty = await Properties.create({
          userId: ctx.user.id,
          email: ctx.user.email,
  
          // Basic Info
          propertyType: input.propertyType,
          propertyName: input.propertyName,
          placeName: input.placeName,
          rentalType: input.rentalType,
          rentalForm: input.rentalForm,
  
          // Location
          street: input.street,
          postalCode: input.postalCode,
          city: input.city,
          state: input.state,
          country: input.country,
          center: input.center,
  
          // Spaces - NOW STORING AS NUMBERS
          guests: input.guests,
          bedrooms: input.bedrooms,
          beds: input.beds,
          bathroom: input.bathroom,
          kitchen: input.kitchen,
          size: input.size,
  
          // Amenities
          generalAmenities: input.generalAmenities || {},
          otherAmenities: input.otherAmenities || {},
          safeAmenities: input.safeAmenities || {},
  
          // House Rules
          smoking: input.smoking,
          pet: input.pet,
          party: input.party,
          cooking: input.cooking,
          additionalRules: input.additionalRules || [],
  
          // Descriptions - NOW STRING
          reviews: input.reviews || "",
  
          // Images
          propertyCoverFileUrl: input.propertyCoverFileUrl,
          propertyPictureUrls: input.propertyPictureUrls || [],
  
          // Pricing - NOW NUMBERS
          basePrice: input.basePrice,
          weekendPrice: input.weekendPrice,
          weeklyDiscount: input.weeklyDiscount,
          basePriceLongTerm: input.basePriceLongTerm,
          monthlyDiscount: input.monthlyDiscount,
          currency: input.currency,
  
          // Availability
          night: input.night,
          time: input.time,
          datesPerPortion: input.datesPerPortion,
          icalLinks: input.icalLinks,
  
          // Additional
          isInstantBooking: input.isInstantBooking || false,
          isLive: input.isLive,
          hostedBy: input.hostedBy || ctx.user.email,
          hostedFrom: new Date().toISOString(),
          listedOn: ["VacationSaga"],
          lastUpdatedBy: [ctx.user.email],
          lastUpdates: [[new Date().toISOString()]],
          origin: "holidaysera",
        });
  
        // Map the response
        const mappedProperty = mapPropertyDocument(newProperty.toObject());
  
        if (!mappedProperty) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process property data",
          });
        }
  
        console.log("Property created successfully:", mappedProperty._id);
  
        return {
          success: true,
          property: mappedProperty,
          message: "Property listing created successfully",
        };
      } catch (error) {
        // Re-throw TRPCErrors as-is
        if (error instanceof TRPCError) {
          throw error;
        }
  
        console.error("Error creating listing:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create property listing",
        });
      }
    }),

    // ========================================
    // UPDATE LISTING
    // ========================================
    updateListing: protectedProcedure
      .input(
        z.object({
          propertyId: z.string().min(1, "Property ID is required"),
          updates: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Find the property first
          const property = await Properties.findById(input.propertyId);

          if (!property) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Property not found",
            });
          }

          // Verify ownership
          if (property.userId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to update this property",
            });
          }

          // Use shared upload helper to delete by URL (if present)
          // Import dynamically to avoid circular import issues
          const { deleteBunnyImageByUrl } = await Promise.resolve(require("./upload"));

          // If updates include image arrays, detect removed images and delete them from Bunny
          const updates = input.updates || {};
          try {
            // PROPERTY PICTURE URLS
            if (updates.propertyPictureUrls && Array.isArray(updates.propertyPictureUrls)) {
              const newPics: string[] = updates.propertyPictureUrls;
              const existingPics: string[] = property.propertyPictureUrls || [];
              const removed = existingPics.filter((p) => p && !newPics.includes(p));
              for (const url of removed) {
                await deleteBunnyImageByUrl(url);
              }
            }

            // PROPERTY COVER
            if (Object.prototype.hasOwnProperty.call(updates, 'propertyCoverFileUrl')) {
              const newCover: string | undefined = updates.propertyCoverFileUrl;
              const existingCover: string | undefined = property.propertyCoverFileUrl;
              if (existingCover && existingCover !== newCover) {
                await deleteBunnyImageByUrl(existingCover);
              }
            }

            // PORTION PICTURE URLS (nested arrays)
            if (updates.portionPictureUrls && Array.isArray(updates.portionPictureUrls)) {
              const newPortionPics: string[][] = updates.portionPictureUrls;
              const existingPortionPics: string[][] = property.portionPictureUrls || [];
              // flatten and compare per slot
              const existingFlat = existingPortionPics.flat().filter(Boolean);
              const newFlat = newPortionPics.flat().filter(Boolean);
              const removed = existingFlat.filter((p) => p && !newFlat.includes(p));
              for (const url of removed) {
                await deleteBunnyImageByUrl(url);
              }
            }

            // PORTION COVERS
            if (updates.portionCoverFileUrls && Array.isArray(updates.portionCoverFileUrls)) {
              const newCovers: string[] = updates.portionCoverFileUrls;
              const existingCovers: string[] = property.portionCoverFileUrls || [];
              const removed = existingCovers.filter((p) => p && !newCovers.includes(p));
              for (const url of removed) {
                await deleteBunnyImageByUrl(url);
              }
            }
          } catch (e) {
            // Log and continue - don't fail the whole update if deletion fails
            console.error('Error removing old images during updateListing:', e);
          }
          // Update the property
          const updatedProperty = await Properties.findByIdAndUpdate(
            input.propertyId,
            {
              ...input.updates,
              lastUpdatedBy: [
                ...(property.lastUpdatedBy || []),
                ctx.user.email,
              ],
              lastUpdates: [
                ...(property.lastUpdates || []),
                [new Date().toISOString()],
              ],
            },
            { new: true }
          ).lean();

          const mappedProperty = mapPropertyDocument(updatedProperty);

          if (!mappedProperty) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to process updated property data",
            });
          }

          console.log("Property updated successfully:", mappedProperty._id);

          return {
            success: true,
            property: mappedProperty,
            message: "Property listing updated successfully",
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }

          console.error("Error updating listing:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update property listing",
          });
        }
      }),
  getTopLocations: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const { limit } = input;

        // Aggregate properties by city and country to get top locations
        const topLocations = await Properties.aggregate([
          {
            $match: {
              isLive: true,
              rentalType: "Short Term",
              city: { $exists: true, $ne: "" },
              country: { $exists: true, $ne: "" },
            },
          },
          {
            $group: {
              _id: {
                city: { $trim: { input: "$city" } },
                country: { $trim: { input: "$country" } },
              },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 0,
              city: "$_id.city",
              country: "$_id.country",
              propertyCount: "$count",
            },
          },
        ]);

        return topLocations;
      } catch (error) {
        console.error("Error fetching top locations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch top locations",
        });
      }
    }),
});
