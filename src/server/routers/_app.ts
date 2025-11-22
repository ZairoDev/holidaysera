import { router } from "../trpc";
import { propertyRouter } from "./property";
import { authRouter } from "./auth";
import { favoriteRouter } from "./favourie";
import { uploadRouter } from "./upload";
import { userRouter } from "./user";
import { bookingRouter } from "./booking";
import { notificationsRouter } from "./notifications";

export const appRouter = router({
  property: propertyRouter,
  auth: authRouter,
  favorite: favoriteRouter,
  upload: uploadRouter,
  user: userRouter,
  booking: bookingRouter,
  notifications: notificationsRouter,
})

export type AppRouter = typeof appRouter;