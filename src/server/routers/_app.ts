import { router } from "../trpc";
import { propertyRouter } from "./property";
import { authRouter } from "./auth";

export const appRouter = router({
  property: propertyRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter;