import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notification from '../libs/Notification';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const ANIMATION_TYPES = {
  FADE: 'fade',
  SLIDE: 'slide',
  POP: 'pop',
};

// Create context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message, animation = ANIMATION_TYPES.SLIDE, duration = 5000) => {
    const id = uuidv4();
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { id, type, title, message, animation }
    ]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  const notifySuccess = useCallback((title, message, animation, duration) => 
    addNotification(NOTIFICATION_TYPES.SUCCESS, title, message, animation, duration), [addNotification]);
  const notifyError = useCallback((title, message, animation, duration) => 
    addNotification(NOTIFICATION_TYPES.ERROR, title, message, animation, duration), [addNotification]);
  const notifyWarning = useCallback((title, message, animation, duration) => 
    addNotification(NOTIFICATION_TYPES.WARNING, title, message, animation, duration), [addNotification]);
  const notifyInfo = useCallback((title, message, animation, duration) => 
    addNotification(NOTIFICATION_TYPES.INFO, title, message, animation, duration), [addNotification]);




  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification,
      notifySuccess,
      notifyError,
      notifyWarning,
      notifyInfo
    }}>
      {children}
      <Notification />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;