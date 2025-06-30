
'use client';

import React from 'react';
import Navbar from "./Navbar";
import { NotificationProvider } from "./NotificationContext";
import { SessionProvider } from 'next-auth/react';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
  return (
    <SessionProvider>
      <NotificationProvider>
        <Navbar />
        {children}
      </NotificationProvider>
    </SessionProvider>
  );
};

export default ClientLayoutWrapper;
