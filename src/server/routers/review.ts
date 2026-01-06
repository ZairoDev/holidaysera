import { z } from "zod";
import { router, publicProcedure, protectedProcedure, TRPCError } from "../trpc";
import Review from "@/models/review";
import Users from "@/models/users";

export const reviewRouter = router({
  // Get reviews for a property
  getByPropertyId: publicProcedure
    .input(
      z.object({
        propertyId: z.string().min(1, "Property ID is required"),
      })
    )
    .query(async ({ input }) => {
      try {
        const reviews = await Review.find({
          propertyId: input.propertyId,
        })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        return reviews.map((review: any) => ({
          id: review._id.toString(),
          propertyId: review.propertyId.toString(),
          userId: review.userId.toString(),
          userName: review.userName,
          userEmail: review.userEmail,
          userAvatar: review.userAvatar || "",
          rating: review.rating,
          comment: review.comment,
          location: review.location || "",
          createdAt: review.createdAt,
        }));
      } catch (error: any) {
        console.error("Error fetching reviews:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch reviews",
        });
      }
    }),

  // Get featured reviews for testimonials (latest reviews from all properties)
  getFeatured: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(6),
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const limit = input?.limit || 6;
        const reviews = await Review.find({})
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

        return reviews.map((review: any) => ({
          id: review._id.toString(),
          propertyId: review.propertyId.toString(),
          userId: review.userId.toString(),
          userName: review.userName,
          userEmail: review.userEmail,
          userAvatar: review.userAvatar || "",
          rating: review.rating,
          comment: review.comment,
          location: review.location || "",
          createdAt: review.createdAt,
        }));
      } catch (error: any) {
        console.error("Error fetching featured reviews:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch featured reviews",
        });
      }
    }),

  // Add a review (protected - user must be logged in)
  create: protectedProcedure
    .input(
      z.object({
        propertyId: z.string().min(1, "Property ID is required"),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10, "Comment must be at least 10 characters"),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already reviewed this property
        const existingReview = await Review.findOne({
          propertyId: input.propertyId,
          userId: ctx.user.id,
        });

        if (existingReview) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already reviewed this property",
          });
        }

        // Get user details
        const user = await Users.findById(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Create review
        const review = await Review.create({
          propertyId: input.propertyId,
          userId: ctx.user.id,
          userName: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name || "Anonymous",
          userEmail: user.email,
          userAvatar: user.profilePic || "",
          rating: input.rating,
          comment: input.comment,
          location: input.location || "",
        });

        return {
          id: review._id.toString(),
          propertyId: review.propertyId.toString(),
          userId: review.userId.toString(),
          userName: review.userName,
          userEmail: review.userEmail,
          userAvatar: review.userAvatar || "",
          rating: review.rating,
          comment: review.comment,
          location: review.location || "",
          createdAt: review.createdAt,
        };
      } catch (error: any) {
        console.error("Error creating review:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create review",
        });
      }
    }),
});

