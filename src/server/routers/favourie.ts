import { router, protectedProcedure, TRPCError } from "../trpc";
import { z } from "zod";
import Users from "@/models/users";
import { Properties } from "@/models/property";

export const favoriteRouter = router({
  toggle: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id; // use _id since we selected it

      const user = await Users.findById(userId).select("favouriteProperties").lean() as { favouriteProperties?: string[] } | null;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login required or user deleted",
        });
      }

      const propertyId = input.propertyId;
      const favorites = user.favouriteProperties || [];

      const exists = favorites.some((id: any) => id.toString() === propertyId);

      // Use updateOne to avoid triggering full document validation
      if (exists) {
        await Users.updateOne(
          { _id: userId },
          { $pull: { favouriteProperties: propertyId } }
        );
      } else {
        await Users.updateOne(
          { _id: userId },
          { $addToSet: { favouriteProperties: propertyId } }
        );
      }

      return { status: exists ? "removed" : "added" };
    }),

    getMyFavorites: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user.id || ctx.user.id;
    
      const user = (await Users.findById(userId)
        .select("favouriteProperties")
        .lean()) as { favouriteProperties: string[] } | null;

    
      if (!user || !user.favouriteProperties) return [];
    
      // Convert to string array
      let favouriteIds = user.favouriteProperties.map((id: any) => id.toString());
    
      // Check which exist in the Property collection
      const existingProperties = await Properties.find({ _id: { $in: favouriteIds } })
        .select("_id")
        .lean();
    
      const validIds = existingProperties.map((p: any) => p._id.toString());
    
      // Clean up invalid ones automatically
      if (validIds.length !== favouriteIds.length) {
        await Users.updateOne(
          { _id: userId },
          { $set: { favouriteProperties: validIds } }
        );
      }
    
      return validIds;
    })
    ,
});
