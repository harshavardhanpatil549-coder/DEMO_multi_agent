import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, SystemStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface SystemContextType {
  systemStatus: SystemStatus | null;
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  activeToast: string | null;
  clearToast: () => void;
  triggerGlobalDemo: (scenarioKey: string) => Promise<any>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.getSystemStatus();
      if (res.success) {
        setSystemStatus(res);
      }
    } catch (e) {
      console.error("Failed to load system status", e);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await api.getNotifications(currentUser.id, currentUser.role);
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchStatus();
    refreshNotifications();
    const interval = setInterval(() => {
      refreshNotifications();
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchStatus, refreshNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      refreshNotifications();
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead(currentUser.id);
      refreshNotifications();
    } catch (e) {}
  };

  const clearToast = () => setActiveToast(null);

  const triggerGlobalDemo = async (scenarioKey: string) => {
    setActiveToast(`AI Multi-Agent Coordinator launched for demo: "${scenarioKey}"`);
    const res = await api.triggerDemoScenario(scenarioKey, false);
    refreshNotifications();
    fetchStatus();
    return res;
  };

  return (
    <SystemContext.Provider
      value={{
        systemStatus,
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        activeToast,
        clearToast,
        triggerGlobalDemo
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
