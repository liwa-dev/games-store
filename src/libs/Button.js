import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ onClick, children, isActive = false, dark = false, color, outline = false, ...props }) => {
  const buttonClasses = [
    styles.button,
    dark ? styles.dark : '',
    color ? styles[color] : '',
    outline ? styles.outline : ''
  ].filter(Boolean).join(' ');

  const activeStyles = isActive ? {
    backgroundColor: 'var(--primary-Colors)',
    color: '#fff', // Ensure text color contrasts with the background
    borderColor: 'transparent' // Ensure border color is not white
  } : {
    color: 'var(--text-color)',
    borderColor: 'var(--primary-Colors)'
  };

  return (
    <button
      className={buttonClasses}
      style={activeStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;