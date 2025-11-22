'use client';

import { useEffect, useState, useRef } from 'react';
import { socket } from '@/lib/socket';

export function useSocket(userId?: string, userType?: 'owner' | 'traveller') {
  const [isConnected, setIsConnected] = useState(false);
  const roomJoinedRef = useRef(false);
  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    // Join appropriate room based on user type (only once per userId)
    const joinRoom = () => {
      if (!userId || !userType) return;

      const roomId = userType === 'owner' ? `owner-${userId}` : `traveller-${userId}`;

      // Skip if already joined this exact room
      if (roomJoinedRef.current && currentRoomRef.current === roomId) {
        console.log(`[Socket] Already in room: ${roomId}`);
        return;
      }

      const eventName = userType === 'owner' ? 'join-owner-room' : 'join-traveller-room';
      socket.emit(eventName, userId);
      
      roomJoinedRef.current = true;
      currentRoomRef.current = roomId;
      console.log(`[Socket] ✅ Joined ${userType} room: ${roomId}`);
    };

    // If already connected, join immediately
    if (socket.connected && !roomJoinedRef.current) {
      joinRoom();
    } else if (!socket.connected) {
      // Otherwise join when connected
      const onConnect = () => {
        console.log(`[Socket] 🔌 Socket connected: ${socket.id}`);
        joinRoom();
      };
      socket.once('connect', onConnect);
      
      return () => {
        socket.off('connect', onConnect);
      };
    }
  }, [userId, userType]);

  // Handle connection state separately
  useEffect(() => {
    const handleConnect = () => {
      console.log('[Socket] ✅ Connected:', socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('[Socket] 🔴 Disconnected');
      setIsConnected(false);
      roomJoinedRef.current = false;  // Reset room state on disconnect
    };

    const handleError = (error: any) => {
      console.error('[Socket] ❌ Connection error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    // Set initial connection state
    if (socket.connected) {
      setIsConnected(true);
    }

    // Cleanup listeners
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
    };
  }, []);

  return { socket, isConnected };
}

export default useSocket;
