'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import useSocket from '@/hooks/useSocket';
import { useNotificationSocketListener } from '@/hooks/useNotificationCenter';
import { socket } from '@/lib/socket';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const user = useUserStore((state) => state.user);

  const socketRole =
    user?.role === "Owner" ? "owner" : user?.role === "Traveller" ? "traveller" : undefined;

  useEffect(() => {
    if (user?.id) {
      if (!socket.connected) {
        socket.connect();
        console.log("[Socket.io] 🔐 User logged in, socket connected");
      }
    } else {
      socket.disconnect();
      console.log("[Socket.io] 🔌 User logged out, socket disconnected");
    }
  }, [user?.id]);

  // Call hooks unconditionally - they handle undefined values
  useSocket(user?.id, socketRole);
  useNotificationSocketListener(!!user);

  return <>{children}</>;
}
