import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, onOk, children, showCancel = true, showOk = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    if (isOpen) {
      setShowModal(true);
      setTimeout(() => setIsVisible(true), 10);

      // Add class to body for smooth hiding of scroll bar
      document.body.classList.add(styles.noScroll);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setShowModal(false);
        onClose();
      }, 300);

      // Remove class from body
      document.body.classList.remove(styles.noScroll);
    }

    // Cleanup function to ensure class and event listeners are removed
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isOpen, onClose]);

  if (!showModal && !isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.show : ''}`}>
      <div className={`${styles.modalWrapper} ${isVisible ? styles.show : ''}`} onClick={(e) => e.stopPropagation()}> {/* Prevent click propagation */}
        
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Modal Title</h2>
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
        <div className={`${styles.footer} ${isVisible ? styles.show : ''}`}>
          {showCancel && (
            <button onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }} className={`${styles.button} ${styles.cancel}`}>
              Cancel
            </button>
          )}
          {showOk && (
            <button onClick={() => {
              console.log('OK button clicked'); // Debugging log
              setIsVisible(false);
              setTimeout(() => {
                if (onOk) {
                  console.log('Calling onOk function'); // Debugging log
                  onOk();
                }
                onClose();
              }, 300);
            }} className={`${styles.button} ${styles.ok}`}>
              GOT IT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;