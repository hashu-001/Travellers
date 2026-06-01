import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usersAPI } from '../utils/api';

// Vercel serverless can't host long-lived WebSockets, so presence is REST-based.
// Clients call `heartbeat` periodically; the admin view polls `getActiveUsers`.
// The hook keeps the original `useSocket` API surface so call sites don't change.

const SocketContext = createContext();

const ACTIVE_USERS_POLL_MS = 15 * 1000;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const adminPollRef = useRef(null);

  const fetchActiveUsers = useCallback(async () => {
    try {
      const res = await usersAPI.getActiveUsers();
      setActiveUsers(res.data.activeUsers || []);
      setIsConnected(true);
    } catch (err) {
      // 401 = not an admin / not logged in. Silent — admin view simply stays empty.
      setIsConnected(false);
    }
  }, []);

  // Mark current user as online; safe to call repeatedly.
  const sendHeartbeat = useCallback(async () => {
    try {
      await usersAPI.heartbeat();
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
  }, []);

  // Public API — preserved from the old socket-based context.
  const emitUserLogin = useCallback(() => {
    sendHeartbeat();
  }, [sendHeartbeat]);

  const emitUserLogout = useCallback(async () => {
    try {
      await usersAPI.markOffline();
    } catch (err) {
      // Best-effort: cookie may already be gone after logout. Ignore.
    }
  }, []);

  const getActiveUsers = useCallback(() => {
    fetchActiveUsers();
    if (adminPollRef.current) clearInterval(adminPollRef.current);
    adminPollRef.current = setInterval(fetchActiveUsers, ACTIVE_USERS_POLL_MS);
  }, [fetchActiveUsers]);

  const sendActivityPing = useCallback(() => {
    sendHeartbeat();
  }, [sendHeartbeat]);

  useEffect(() => {
    return () => {
      if (adminPollRef.current) clearInterval(adminPollRef.current);
    };
  }, []);

  const value = {
    socket: null,
    isConnected,
    activeUsers,
    emitUserLogin,
    emitUserLogout,
    getActiveUsers,
    sendActivityPing
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
