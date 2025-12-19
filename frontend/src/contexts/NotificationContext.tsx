import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, Task } from '../types';
import { socketClient } from '../lib/socket';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen for task assignment notifications
    const unsubscribeAssigned = socketClient.on('taskAssigned', (data: { message: string; task: Task }) => {
      const notification: Notification = {
        _id: `${data.task._id}-assigned-${Date.now()}`,
        message: data.message,
        type: 'task_assigned',
        task: data.task._id,
        createdAt: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);
    });

    // Listen for task created notifications
    const unsubscribeCreated = socketClient.on('taskCreated', (task: Task) => {
      const notification: Notification = {
        _id: `${task._id}-created-${Date.now()}`,
        message: `New task created: ${task.title}`,
        type: 'task_created',
        task: task._id,
        createdAt: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);
    });

    // Listen for task updated notifications
    const unsubscribeUpdated = socketClient.on('taskUpdated', (task: Task) => {
      const notification: Notification = {
        _id: `${task._id}-updated-${Date.now()}`,
        message: `Task updated: ${task.title}`,
        type: 'task_updated',
        task: task._id,
        createdAt: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);
    });

    // Listen for task deleted notifications
    const unsubscribeDeleted = socketClient.on('taskDeleted', (data: { taskId: string }) => {
      const notification: Notification = {
        _id: `${data.taskId}-deleted-${Date.now()}`,
        message: `Task deleted`,
        type: 'task_deleted',
        task: data.taskId,
        createdAt: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);
    });

    return () => {
      unsubscribeAssigned();
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading: false, addNotification, markAsRead, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
