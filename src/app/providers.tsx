"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { trpc } from "@/trpc/client";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { useUserStore } from "@/lib/store";
import { useSocket } from "@/hooks/useSocket";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";

// Global socket provider component
function GlobalSocketProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useUserStore();
  const userId = authUser?.id;
  const userRole = authUser?.role as "owner" | "traveller" | undefined;
  const { addNotification } = useNotificationCenter();

  console.log("GlobalSocketProvider: userId=", userId, "role=", userRole);

  // Keep socket connected globally for all owners
  const { socket: ownerSocket } = useSocket(userId && userRole === "owner" ? userId : undefined, userRole === "owner" ? "owner" : undefined);
  
  // Keep socket connected globally for all travellers
  const { socket: travellerSocket } = useSocket(userId && userRole === "traveller" ? userId : undefined, userRole === "traveller" ? "traveller" : undefined);

  // Owner: Listen for new booking requests globally
  useEffect(() => {
    if (!ownerSocket) {
      console.log("Owner socket not ready yet");
      return;
    }

    console.log("Setting up owner booking request listener");

    const handleNewBooking = (data: any) => {
      console.log("Owner received booking request:", data);
      const { toast } = require("sonner");
      
      // Add to notification center
      addNotification({
        type: "booking-request",
        message: "🎉 New Booking Request!",
        description: `${data.propertyName} - ${data.travelerName} (Service charge: ₹${data.serviceCharge?.toFixed(2) || "0"})`,
      });

      // Show toast
      toast.success("🎉 New Booking Request!", {
        description: `${data.propertyName} - ${data.travelerName} (Service charge: ₹${data.serviceCharge?.toFixed(2) || "0"})`,
        duration: 6000,
      });
    };

    ownerSocket.on("booking-request-received", handleNewBooking);
    return () => {
      ownerSocket.off("booking-request-received", handleNewBooking);
    };
  }, [ownerSocket?.id, addNotification]);

  // Owner: Listen for approval confirmations
  useEffect(() => {
    if (!ownerSocket) return;

    console.log("Setting up owner payment received listener");

    const handleApprovalConfirm = (data: any) => {
      console.log("Owner received payment confirmation:", data);
      const { toast } = require("sonner");
      
      addNotification({
        type: "payment-received",
        message: "✅ Payment Received",
        description: `Payment received for booking`,
      });

      toast.success("✅ Payment Received", {
        description: `Payment incoming for ${data.propertyId}`,
        duration: 5000,
      });
    };

    ownerSocket.on("payment-received", handleApprovalConfirm);
    return () => {
      ownerSocket.off("payment-received", handleApprovalConfirm);
    };
  }, [ownerSocket?.id, addNotification]);

  // Traveller: Listen for approval notifications globally
  useEffect(() => {
    if (!travellerSocket) {
      console.log("Traveller socket not ready yet");
      return;
    }

    console.log("Setting up traveller approval listener");

    const handleApproval = (data: any) => {
      console.log("Traveller received approval notification:", data);
      const { toast } = require("sonner");
      
      addNotification({
        type: "booking-approved",
        message: "🎉 Booking Approved!",
        description: "Your booking has been approved. Please proceed with payment.",
      });

      toast.success("🎉 Booking Approved!", {
        description: "Your booking has been approved. Please proceed with payment.",
        duration: 6000,
      });
    };

    travellerSocket.on("booking-approved-notification", handleApproval);
    return () => {
      travellerSocket.off("booking-approved-notification", handleApproval);
    };
  }, [travellerSocket?.id, addNotification]);

  // Traveller: Listen for rejection notifications globally
  useEffect(() => {
    if (!travellerSocket) return;

    console.log("Setting up traveller rejection listener");

    const handleRejection = (data: any) => {
      console.log("Traveller received rejection notification:", data);
      const { toast } = require("sonner");
      
      addNotification({
        type: "booking-rejected",
        message: "❌ Booking Declined",
        description: data.reason || "Unfortunately, the owner has declined your booking request.",
      });

      toast.error("❌ Booking Declined", {
        description: data.reason || "Unfortunately, the owner has declined your booking request.",
        duration: 6000,
      });
    };

    travellerSocket.on("booking-rejected-notification", handleRejection);
    return () => {
      travellerSocket.off("booking-rejected-notification", handleRejection);
    };
  }, [travellerSocket?.id, addNotification]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson, // ✅ v11: transformer belongs *inside* the link
          headers() {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  // Initialize Socket.io on app start
  useEffect(() => {
    const initSocket = async () => {
      try {
        await fetch("/api/socket");
      } catch (error) {
        console.error("Failed to initialize Socket.io:", error);
      }
    };

    initSocket();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GlobalSocketProvider>{children}</GlobalSocketProvider>
        <Toaster
          position="top-right"
          richColors
          expand={true}
          duration={5000}
          closeButton
        />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
