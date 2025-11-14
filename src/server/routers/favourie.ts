import { router, protectedProcedure, TRPCError } from "../trpc";
import { z } from "zod";
import Users from "@/models/users";

export const favoriteRouter = router({
  toggle: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const user = await Users.findById(userId);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Convert to string for comparison if stored as ObjectId
      const propertyIdStr = input.propertyId;
      const favourites = user.favouriteProperties || [];

      const alreadyFavorited = favourites.some(
        (id: any) => id.toString() === propertyIdStr
      );

      if (alreadyFavorited) {
        // REMOVE
        user.favouriteProperties = favourites.filter(
          (id: any) => id.toString() !== propertyIdStr
        );
      } else {
        // ADD
        user.favouriteProperties = [...favourites, input.propertyId];
      }

      await user.save();
      return { status: alreadyFavorited ? "removed" : "added" };
    }),

  getMyFavorites: protectedProcedure.query(async ({ ctx }) => {
    const user = await Users.findById(ctx.user.id)
      .select("favouriteProperties")
      .lean();

    if (!user) {
      return [];
    }

    return (user as any).favouriteProperties || [];
  }),
});
