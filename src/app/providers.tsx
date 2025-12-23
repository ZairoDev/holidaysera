"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { trpc } from "@/trpc/client";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { useUserStore } from "@/lib/store";
import useSocket from "@/hooks/useSocket";
import { useNotificationSocketListener } from "@/hooks/useNotificationCenter";

// Socket initialization component
function SocketManager({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);

  // Initialize socket and join appropriate room
  const socketRole =
    user?.role === "Owner" ? "owner" : user?.role === "Traveller" ? "traveller" : undefined;
  useSocket(user?.id, socketRole);
  
  // Set up notification listeners (only when authenticated)
  useNotificationSocketListener(!!user);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers() {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SocketManager>
          {children}
        </SocketManager>
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
