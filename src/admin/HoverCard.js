import React from 'react';
import styles from './HoverCard.module.css';
import { Plus } from 'lucide-react';

const HoverCard = ({ bgImage, name, description, onAdd }) => {
  return (
    <div className={styles.card} onClick={onAdd}>
      <div className={styles.cardImage} style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className={styles.cardContent}>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.cardHover}>
        <Plus size={48} />
      </div>
    </div>
  );
};

export default HoverCard;