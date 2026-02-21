import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole } from './AuthContext';

// Types
export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'chat' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Sample notifications for demo
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'order',
    title: 'New Order Received',
    message: 'You have a new order for 50kg of organic tomatoes from Rajesh Kumar',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    read: false,
  },
  {
    id: 'notif-002',
    type: 'delivery',
    title: 'Delivery In Progress',
    message: 'Your order #HRV-2024-001 is being transported by Amit Singh',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
  },
  {
    id: 'notif-003',
    type: 'system',
    title: 'Welcome to Harvest-Log!',
    message: 'Start by exploring the marketplace or adding your inventory',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
