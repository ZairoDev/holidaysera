import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { connectDb } from "./db";
import { verifyToken } from "./utils/jwt";

/**
 * ✅ Context creator for tRPC v11 (Next.js App Router)
 * Uses the native Web Fetch Request — not NextRequest.
 */
export async function createContext({ req }: { req: Request }) {
  // Ensure DB connection
  await connectDb();

  // Extract Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // Verify token (if provided)
  const user = token ? verifyToken(token) : null;

  return { user };
}

export { TRPCError };

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({ ctx: { user: ctx.user } });
});
