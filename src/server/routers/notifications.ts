import { router, protectedProcedure } from "../trpc";
import z from "zod";
import Notifications from "@/models/notification";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  // Get current user's notifications (paginated)
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const limit = input.limit ?? 50;
        const query: any = { recipientId: ctx.user.id };
        if (input.cursor) {
          query._id = { $lt: input.cursor };
        }

        const list = await Notifications.find(query)
          .sort({ createdAt: -1 })
          .limit(limit + 1)
          .lean();

        const hasMore = list.length > limit;
        const items = (hasMore ? list.slice(0, -1) : list).map((n: any) => ({
          id: String(n._id),
          type: n.type,
          bookingId: n.bookingId,
          data: n.data,
          read: !!n.read,
          createdAt: n.createdAt,
        }));

        return {
          items,
          nextCursor: hasMore ? String(list[list.length - 1]._id) : undefined,
        };
      } catch (err) {
        console.error("[Notifications] getNotifications error", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to load notifications" });
      }
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const n = await Notifications.findById(String(input.id));
        if (!n) throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found" });
        if (n.recipientId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        if (!n.read) {
          n.read = true as any;
          await n.save();
        }
        return { success: true };
      } catch (err) {
        console.error("[Notifications] markAsRead error", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to mark as read" });
      }
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        await Notifications.updateMany({ recipientId: ctx.user.id, read: false }, { $set: { read: true } });
        return { success: true };
      } catch (err) {
        console.error("[Notifications] markAllAsRead error", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to mark all as read" });
      }
    }),

  removeNotification: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const n = await Notifications.findById(String(input.id));
        if (!n) throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found" });
        if (n.recipientId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await Notifications.deleteOne({ _id: String(input.id) });
        return { success: true };
      } catch (err) {
        console.error("[Notifications] removeNotification error", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to remove notification" });
      }
    }),
});
