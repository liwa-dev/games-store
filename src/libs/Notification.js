import React, { useState, useEffect } from 'react';
import { useNotification } from "../provider/NotificationProvider";
import styles from '../styles/Notification.module.css';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();
  const [exitingNotifications, setExitingNotifications] = useState({});

  useEffect(() => {
    const timeouts = {};
    notifications.forEach(notification => {
      if (!timeouts[notification.id]) {
        timeouts[notification.id] = setTimeout(() => {
          startExitAnimation(notification.id);
        }, 4500); // Slightly less than your notification duration
      }
    });

    return () => Object.values(timeouts).forEach(clearTimeout);
  }, [notifications]);

  const startExitAnimation = (id) => {
    setExitingNotifications(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      removeNotification(id);
      setExitingNotifications(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 500); // Match this with your animation duration
  };

  return (
    <div className={styles.notificationContainer}>
      {notifications.map(({ id, type, title, message, animation }) => (
        <div 
          key={id} 
          className={`
            ${styles.notification} 
            ${styles[`notification${type.charAt(0).toUpperCase() + type.slice(1)}`]}
            ${styles[animation + 'In']}
            ${exitingNotifications[id] ? styles[animation + 'Out'] : ''}
          `}
          style={{
            animationFillMode: exitingNotifications[id] ? 'forwards' : 'none'
          }}
        >
          <div className={styles.notificationIcon}>
            <span>🔔</span>
          </div>
          <div className={styles.notificationContent}>
            <h3 className={styles.notificationTitle}>{title}</h3>
            <p className={styles.notificationMessage}>{message}</p>
          </div>
          <button className={styles.notificationClose} onClick={() => startExitAnimation(id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;