import z from "zod";
import { protectedProcedure, router, TRPCError } from "../trpc";
import Users from "@/models/users";

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
})