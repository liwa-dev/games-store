import React from 'react';
import styles from '../styles/Avatar.module.css';

const Avatar = ({ src, alt, size = 50, style, onClick }) => {
  return (
    <div 
      className={styles.avatar} 
      style={{ width: size, height: size, ...style }} 
      onClick={onClick}
    >
      <img src={src} alt={alt} className={styles.image} />
      <div className={styles.overlay}></div>
    </div>
  );
};

export default Avatar;