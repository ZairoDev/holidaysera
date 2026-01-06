import z from "zod";
import { protectedProcedure, router, TRPCError } from "../trpc";
import Users from "@/models/users";
import bcrypt from "bcrypt";

export const userRouter = router({
  getuserDetails:protectedProcedure
  .query(async({ctx})=>{
    const user  = await Users.findById(ctx.user.id);
    if(!user) {
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"user not found"
      })
    }
    return {
      name:user.name,
      email:user.email,
      phone:user.phone,
      role:user.role,
      subscription: user.subscription || { status: "none" },
    }
  }),
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await Users.findById(ctx.user.id);
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if user has a password (OAuth users might not have one)
        if (!user.password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password change not available for OAuth accounts",
          });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
          input.currentPassword,
          user.password
        );

        if (!isCurrentPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Current password is incorrect",
          });
        }

        // Check if new password is different from current password
        const isSamePassword = await bcrypt.compare(
          input.newPassword,
          user.password
        );

        if (isSamePassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "New password must be different from current password",
          });
        }

        // Hash and update password
        const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return {
          success: true,
          message: "Password changed successfully",
        };
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to change password",
        });
      }
    }),
})