import { router } from "../trpc";
import { propertyRouter } from "./property";
import { authRouter } from "./auth";
import { favoriteRouter } from "./favourie";
import { uploadRouter } from "./upload";
import { userRouter } from "./user";
import { bookingRouter } from "./booking";
import { notificationsRouter } from "./notifications";
import { subscriptionRouter } from "./subscription";
import { contactRouter } from "./contact";

export const appRouter = router({
  property: propertyRouter,
  auth: authRouter,
  favorite: favoriteRouter,
  upload: uploadRouter,
  user: userRouter,
  booking: bookingRouter,
  notifications: notificationsRouter,
  subscription: subscriptionRouter,
  contact: contactRouter,
})

export type AppRouter = typeof appRouter;