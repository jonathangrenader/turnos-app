
'use client';

import React from 'react';
import Navbar from "./Navbar";
import { NotificationProvider } from "./NotificationContext";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <Navbar />
      {children}
    </NotificationProvider>
  );
};

export default ClientLayoutWrapper;
