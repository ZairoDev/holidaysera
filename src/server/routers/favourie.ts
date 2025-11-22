import { router, protectedProcedure, TRPCError } from "../trpc";
import { z } from "zod";
import Users from "@/models/users";

export const favoriteRouter = router({
  toggle: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id; // use _id since we selected it

      const user = await Users.findById(userId);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login required or user deleted",
        });
      }

      const propertyId = input.propertyId;
      const favorites = user.favouriteProperties || [];

      const exists = favorites.some((id: any) => id.toString() === propertyId);

      user.favouriteProperties = exists
        ? favorites.filter((id: any) => id.toString() !== propertyId)
        : [...favorites, propertyId];

      await user.save();
      return { status: exists ? "removed" : "added" };
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
