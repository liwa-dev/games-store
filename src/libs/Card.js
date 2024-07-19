import React, { useState } from 'react';
import styles from '../styles/Card.module.css';
import Button from '../libs/Button';
import { faPlus, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({ bgImage, name, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {!imageError ? (
          <>
            <img
              src={bgImage}
              alt={name}
              className={styles.image}
              onError={handleImageError}
            />
            <div className={styles.imageOverlay} />
            <div className={styles.buttonContainer}>
              <Button color="blue" className={styles.button} onClick={onClick}>
                <FontAwesomeIcon icon={faPlus} /> Acheter
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.fallbackImage}>
              <FontAwesomeIcon icon={faImage} size="3x" />
              <p>{name}</p>
            </div>
            <div className={styles.buttonContainer}>
              <Button color="blue" className={styles.button} onClick={onClick}>
                <FontAwesomeIcon icon={faPlus} /> Acheter
              </Button>
            </div>
          </>
        )}
      </div>
      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>
      </div>
    </div>
  );
};

export default Card;