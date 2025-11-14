import { router } from "../trpc";
import { propertyRouter } from "./property";
import { authRouter } from "./auth";
import { favoriteRouter } from "./favourie";

export const appRouter = router({
  property: propertyRouter,
  auth: authRouter,
  favorite: favoriteRouter
})

export type AppRouter = typeof appRouter;