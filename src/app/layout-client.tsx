'use client';

import React from 'react';
import { useUserStore } from '@/lib/store';
import useSocket from '@/hooks/useSocket';
import { useNotificationSocketListener } from '@/hooks/useNotificationCenter';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const user = useUserStore((state) => state.user);

  // Call hooks unconditionally - they handle undefined values
  useSocket(user?.id, user?.role);
  useNotificationSocketListener();

  return <>{children}</>;
}
