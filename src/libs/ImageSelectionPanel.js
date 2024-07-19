import React, { useState, useRef } from 'react';
import styles from '../styles/ImageSelectionPanel.module.css';
import Avatar from './Avatar';
import Button from './Button';

const ImageSelectionPanel = () => {
  const [selectedImage, setSelectedImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [checkedImage, setCheckedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setCheckedImage(image);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCheckedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const randomImages = [
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/men/6.jpg',
    'https://randomuser.me/api/portraits/men/7.jpg',
    'https://randomuser.me/api/portraits/men/8.jpg',
    'https://randomuser.me/api/portraits/men/9.jpg',
    'https://randomuser.me/api/portraits/men/10.jpg',
    'https://randomuser.me/api/portraits/men/11.jpg',
    'https://randomuser.me/api/portraits/men/12.jpg',
    'https://randomuser.me/api/portraits/men/13.jpg',
    'https://randomuser.me/api/portraits/men/14.jpg',
    'https://randomuser.me/api/portraits/men/15.jpg',
    'https://randomuser.me/api/portraits/men/16.jpg',
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.left}>
        <Avatar src={selectedImage} alt="Selected" size={100} style={{margin: '15px'}} />
        <Button onClick={handleButtonClick}>Change</Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.right}>
        {randomImages.map((image, index) => (
          <div 
            key={index} 
            className={`${styles.randomImageContainer} ${checkedImage === image ? styles.checked : ''}`}
            onClick={() => handleImageClick(image)}
          >
            <img 
              src={image} 
              alt={`Random ${index}`} 
              className={styles.randomImage} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectionPanel;