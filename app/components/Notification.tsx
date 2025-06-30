
'use client';

import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string | null;
  type: 'success' | 'danger' | 'info' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000); // Notification disappears after 3 seconds
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [message, onClose]);

  if (!show) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`} role="alert" style={{ zIndex: 1050 }}>
      {message}
      <button type="button" className="btn-close" onClick={() => {
        setShow(false);
        onClose();
      }} aria-label="Close"></button>
    </div>
  );
};

export default Notification;
