"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { trpc } from "@/trpc/client";

interface Notification {
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
  addNotification: (notification: Partial<Notification> & { type: Notification["type"] }) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
  setNotifications: (notes: Notification[]) => void;
}

interface BookingRequestPayload {
  bookingId: string;
  propertyId: string;
  propertyName: string;
  travellerId: string;
  travelerName: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  serviceCharge: number;
  timestamp: Date;
  notificationId?: string;
}

interface BookingApprovedPayload {
  bookingId: string;
  propertyId: string;
  propertyName: string;
  serviceCharge: number;
  totalPrice: number;
  message: string;
  timestamp: Date;
  notificationId?: string;
}

interface BookingRejectedPayload {
  bookingId: string;
  propertyName: string;
  reason: string;
  timestamp: Date;
  notificationId?: string;
}

interface PaymentReceivedPayload {
  bookingId: string;
  propertyId: string;
  travellerId: string;
  amount: number;
  transactionId: string;
  timestamp: Date;
  notificationId?: string;
}

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
          // Prevent duplicate by ID
          if (state.notifications.some((n) => n.id === newNotification.id)) {
            console.warn("[Notifications] Duplicate (id) prevented:", newNotification.id);
            return state;
          }

          // Prevent duplicate notifications for same booking within 1 second
          const isSimilar = state.notifications.some(
            (n) => n.bookingId === newNotification.bookingId &&
                   n.type === newNotification.type &&
                   Date.now() - new Date(n.timestamp).getTime() < 1000
          );

          if (isSimilar) {
            console.warn("[Notifications] Similar notification prevented:", newNotification);
            return state;
          }

          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: read ? state.unreadCount : state.unreadCount + 1,
          };
        });

        console.log("[Notifications] Added:", newNotification);
      },

      setNotifications: (notes) => {
        set((state) => {
          const existingById = new Map(state.notifications.map((n) => [n.id, n]));
          for (const n of notes) {
            if (!existingById.has(n.id)) {
              existingById.set(n.id, n);
            }
          }

          const merged = Array.from(existingById.values()).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          const unread = merged.filter((m) => !m.read).length;

          return {
            notifications: merged,
            unreadCount: unread,
          };
        });
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.read
                ? state.unreadCount - 1
                : state.unreadCount,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.unreadCount - 1,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
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

/*******************
 * 🚀 SOCKET LISTENERS FOR NOTIFICATIONS
 ********************/
export function useNotificationSocketListener() {
  const { addNotification, setNotifications } = useNotificationCenter();
  const notificationsQuery = trpc.notifications.getNotifications.useQuery({}, { enabled: true });
  const listenersSetup = useRef(false);
  const handlersRef = useRef<{
    bookingRequest: (data: BookingRequestPayload) => void;
    bookingApproved: (data: BookingApprovedPayload) => void;
    bookingRejected: (data: BookingRejectedPayload) => void;
    paymentReceived: (data: PaymentReceivedPayload) => void;
  } | null>(null);

  // TRPC mutations must be called at the top-level of this custom hook
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const removeNotificationMutation = trpc.notifications.removeNotification.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();

  useEffect(() => {
    // Skip if already set up or socket not connected
    if (listenersSetup.current || !socket.connected) {
      if (!socket.connected) {
        console.log("[Notifications] Socket not connected, skipping listener setup");
      }
      return;
    }

    console.log("[Notifications] Initializing socket event listeners");

    // Load persisted notifications from server on first mount
    if (notificationsQuery.data && notificationsQuery.data.items) {
      try {
        const serverNotes = notificationsQuery.data.items.map((i: any) => ({
          id: i.id,
          type: i.type,
          message: i.data?.message ?? "",
          description: i.data?.description ?? (i.data?.message ?? ""),
          timestamp: i.createdAt,
          read: !!i.read,
          bookingId: i.bookingId,
          propertyName: i.data?.propertyName,
        }));
        setNotifications(serverNotes);
      } catch (err) {
        console.warn("[Notifications] Failed to map server notifications", err);
      }
    }

    // Override store actions to call server then update local state

    // Override store actions to call server then update local state
    try {
      // markAsRead
      useNotificationCenter.setState({
        markAsRead: async (id: string) => {
          // call server
          try {
            await markAsReadMutation.mutateAsync({ id });
            // update local store
            useNotificationCenter.setState((state: any) => {
              const exists = state.notifications.find((n: any) => n.id === id);
              if (!exists || exists.read) return state;
              return {
                notifications: state.notifications.map((n: any) => (n.id === id ? { ...n, read: true } : n)),
                unreadCount: Math.max(0, state.unreadCount - 1),
              };
            });
          } catch (err) {
            console.warn("[Notifications] markAsRead failed, applying locally", err);
            useNotificationCenter.setState((state: any) => {
              const exists = state.notifications.find((n: any) => n.id === id);
              if (!exists || exists.read) return state;
              return {
                notifications: state.notifications.map((n: any) => (n.id === id ? { ...n, read: true } : n)),
                unreadCount: Math.max(0, state.unreadCount - 1),
              };
            });
          }
        },
      });

      // removeNotification
      useNotificationCenter.setState({
        removeNotification: async (id: string) => {
          try {
            await removeNotificationMutation.mutateAsync({ id });
            useNotificationCenter.setState((state: any) => {
              const notification = state.notifications.find((n: any) => n.id === id);
              return {
                notifications: state.notifications.filter((n: any) => n.id !== id),
                unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
              };
            });
          } catch (err) {
            console.warn("[Notifications] removeNotification failed, removing locally", err);
            useNotificationCenter.setState((state: any) => {
              const notification = state.notifications.find((n: any) => n.id === id);
              return {
                notifications: state.notifications.filter((n: any) => n.id !== id),
                unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
              };
            });
          }
        },
      });

      // clearAll -> mark all as read on server and locally
      useNotificationCenter.setState({
        clearAll: async () => {
          try {
            await markAllAsReadMutation.mutateAsync();
            useNotificationCenter.setState((state: any) => ({
              notifications: state.notifications.map((n: any) => ({ ...n, read: true })),
              unreadCount: 0,
            }));
          } catch (err) {
            console.warn("[Notifications] markAllAsRead failed, marking locally", err);
            useNotificationCenter.setState((state: any) => ({
              notifications: state.notifications.map((n: any) => ({ ...n, read: true })),
              unreadCount: 0,
            }));
          }
        },
      });
    } catch (err) {
      console.warn("[Notifications] Failed to wire persistence mutations", err);
    }

    // Define all handlers with proper typing
    const handlers = {
      bookingRequest: (data: BookingRequestPayload) => {
        console.log("[Notifications] booking-request-received:", data);
        addNotification({
          id: (data as any).notificationId,
          type: "booking-request",
          message: "New Booking Request",
          description: `${data.travelerName} requested ${data.propertyName}`,
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },

      bookingApproved: (data: BookingApprovedPayload) => {
        console.log("[Notifications] booking-approved-notification:", data);
        addNotification({
          id: (data as any).notificationId,
          type: "booking-approved",
          message: "Booking Approved ✅",
          description: `Your booking for ${data.propertyName} is approved! Complete payment to confirm.`,
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },

      bookingRejected: (data: BookingRejectedPayload) => {
        console.log("[Notifications] booking-rejected-notification:", data);
        addNotification({
          id: (data as any).notificationId,
          type: "booking-rejected",
          message: "Booking Rejected ❌",
          description: data.reason || "Your booking was rejected.",
          bookingId: data.bookingId,
          propertyName: data.propertyName,
        });
      },

      paymentReceived: (data: PaymentReceivedPayload) => {
        console.log("[Notifications] payment-received:", data);
        addNotification({
          id: (data as any).notificationId,
          type: "payment-received",
          message: "Payment Received 💰",
          description: `Payment of $${data.amount.toFixed(2)} received for booking ${data.bookingId}`,
          bookingId: data.bookingId,
        });
      },
    };

    handlersRef.current = handlers;

    // Attach listeners
    socket.on("booking-request-received", handlers.bookingRequest);
    socket.on("booking-approved-notification", handlers.bookingApproved);
    socket.on("booking-rejected-notification", handlers.bookingRejected);
    socket.on("payment-received", handlers.paymentReceived);

    listenersSetup.current = true;
    console.log("[Notifications] ✅ Socket listeners attached successfully");

    // Cleanup on unmount
    return () => {
      if (handlersRef.current) {
        socket.off("booking-request-received", handlersRef.current.bookingRequest);
        socket.off("booking-approved-notification", handlersRef.current.bookingApproved);
        socket.off("booking-rejected-notification", handlersRef.current.bookingRejected);
        socket.off("payment-received", handlersRef.current.paymentReceived);
        console.log("[Notifications] 🧹 Cleaned up socket listeners");
      }
      listenersSetup.current = false;
    };
  }, [addNotification, notificationsQuery.data, setNotifications]);
}
