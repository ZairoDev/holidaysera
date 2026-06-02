"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { trpc } from "@/trpc/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type:
    | "booking-request"
    | "booking-approved"
    | "booking-rejected"
    | "payment-received";
  message: string;
  description: string;
  timestamp: string;
  read: boolean;
  bookingId?: string;
  propertyName?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Partial<Notification> & { type: Notification["type"] }
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  setNotifications: (notes: Notification[]) => void;
}

interface BookingRequestPayload {
  bookingId: string;
  propertyName: string;
  travelerName: string;
  notificationId?: string;
}

interface BookingApprovedPayload {
  bookingId: string;
  propertyName: string;
  notificationId?: string;
}

interface BookingRejectedPayload {
  bookingId: string;
  propertyName?: string;
  reason: string;
  notificationId?: string;
}

interface PaymentReceivedPayload {
  bookingId: string;
  amount: number;
  notificationId?: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNotificationCenter = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const id = notification.id ?? `${Date.now()}-${Math.random()}`;
        const timestamp = notification.timestamp ?? new Date().toISOString();
        const read = notification.read ?? false;

        const newNotification: Notification = {
          id,
          type: notification.type,
          message: notification.message ?? "",
          description: notification.description ?? "",
          timestamp,
          read,
          bookingId: notification.bookingId,
          propertyName: notification.propertyName,
        };

        set((state) => {
          if (state.notifications.some((n) => n.id === newNotification.id)) {
            return state;
          }

          const isSimilar = state.notifications.some(
            (n) =>
              n.bookingId === newNotification.bookingId &&
              n.type === newNotification.type &&
              Date.now() - new Date(n.timestamp).getTime() < 1000
          );
          if (isSimilar) return state;

          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: read ? state.unreadCount : state.unreadCount + 1,
          };
        });
      },

      setNotifications: (notes) => {
        set((state) => {
          const existingById = new Map(state.notifications.map((n) => [n.id, n]));
          for (const n of notes) {
            if (!existingById.has(n.id)) existingById.set(n.id, n);
          }
          const merged = Array.from(existingById.values()).sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          return {
            notifications: merged,
            unreadCount: merged.filter((m) => !m.read).length,
          };
        });
      },

      removeNotification: (id) => {
        set((state) => {
          const n = state.notifications.find((x) => x.id === id);
          return {
            notifications: state.notifications.filter((x) => x.id !== id),
            unreadCount:
              n && !n.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const n = state.notifications.find((x) => x.id === id);
          if (!n || n.read) return state;
          return {
            notifications: state.notifications.map((x) =>
              x.id === id ? { ...x, read: true } : x
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        });
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: "notification-center-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// ─── Socket listener hook ────────────────────────────────────────────────────

export function useNotificationSocketListener(isAuthenticated: boolean = false) {
  const { addNotification, setNotifications } = useNotificationCenter();

  // Fetch server-persisted notifications once authenticated
  const notificationsQuery = trpc.notifications.getNotifications.useQuery(
    {},
    { enabled: isAuthenticated, staleTime: 60_000 }
  );

  // Sync server notifications into local store
  useEffect(() => {
    if (!notificationsQuery.data?.items) return;
    try {
      const serverNotes: Notification[] = notificationsQuery.data.items.map(
        (i: any) => ({
          id: i.id,
          type: i.type,
          message: i.data?.message ?? "",
          description: i.data?.description ?? (i.data?.message ?? ""),
          timestamp: i.createdAt,
          read: !!i.read,
          bookingId: i.bookingId,
          propertyName: i.data?.propertyName,
        })
      );
      setNotifications(serverNotes);
    } catch {
      // Non-fatal – local state still works
    }
  }, [notificationsQuery.data, setNotifications]);

  // Wire socket events
  const handlersRef = useRef<{
    bookingRequest: (d: BookingRequestPayload) => void;
    bookingApproved: (d: BookingApprovedPayload) => void;
    bookingRejected: (d: BookingRejectedPayload) => void;
    paymentReceived: (d: PaymentReceivedPayload) => void;
  } | null>(null);

  useEffect(() => {
    const handlers = {
      bookingRequest: (data: BookingRequestPayload) => {
        addNotification({
          id: data.notificationId,
          type: "booking-request",
          message: "New Booking Request",
          description: `${data.travelerName} requested ${data.propertyName}`,
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },
      bookingApproved: (data: BookingApprovedPayload) => {
        addNotification({
          id: data.notificationId,
          type: "booking-approved",
          message: "Booking Approved",
          description: `Your booking for ${data.propertyName} is approved! Complete payment to confirm.`,
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },
      bookingRejected: (data: BookingRejectedPayload) => {
        addNotification({
          id: data.notificationId,
          type: "booking-rejected",
          message: "Booking Rejected",
          description: data.reason || "Your booking was rejected.",
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },
      paymentReceived: (data: PaymentReceivedPayload) => {
        addNotification({
          id: data.notificationId,
          type: "payment-received",
          message: "Payment Received",
          description: `Payment of $${data.amount?.toFixed(2)} received for booking ${data.bookingId}`,
          bookingId: data.bookingId,
        });
      },
    };

    handlersRef.current = handlers;

    const attach = () => {
      socket.on("booking-request-received", handlers.bookingRequest);
      socket.on("booking-approved-notification", handlers.bookingApproved);
      socket.on("booking-rejected-notification", handlers.bookingRejected);
      socket.on("payment-received", handlers.paymentReceived);
    };

    if (socket.connected) {
      attach();
    } else {
      socket.once("connect", attach);
    }

    return () => {
      socket.off("connect", attach);
      if (handlersRef.current) {
        socket.off("booking-request-received", handlersRef.current.bookingRequest);
        socket.off("booking-approved-notification", handlersRef.current.bookingApproved);
        socket.off("booking-rejected-notification", handlersRef.current.bookingRejected);
        socket.off("payment-received", handlersRef.current.paymentReceived);
      }
    };
  }, [addNotification]);
}
