
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from './Notification';

interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'danger' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' | 'warning' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'danger' | 'info' | 'warning') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Notification message={notification?.message ?? null} type={notification?.type || 'info'} onClose={clearNotification} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
