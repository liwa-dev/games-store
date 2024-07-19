import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../styles/Reviews.module.css';
import Button from './Button';
import { getReviews } from '../supabase/getData';
import CryptoJS from 'crypto-js';

const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const SECRET_KEY = process.env.REACT_APP_REVIEW_SECRET_KEY;

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const cachedData = localStorage.getItem('reviews');
      const cachedTimestamp = localStorage.getItem('reviewsTimestamp');

      if (cachedData && cachedTimestamp) {
        const currentTime = new Date().getTime();
        if (currentTime - parseInt(cachedTimestamp) < CACHE_EXPIRATION) {
          const bytes = CryptoJS.AES.decrypt(cachedData, SECRET_KEY);
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          setReviews(JSON.parse(decryptedData));
          return;
        }
      }

      try {
        const fetchedReviews = await getReviews();
        console.log('Fetched Reviews:', fetchedReviews); // Debugging line
        setReviews(fetchedReviews);
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(fetchedReviews), SECRET_KEY).toString();
        localStorage.setItem('reviews', encryptedData);
        localStorage.setItem('reviewsTimestamp', new Date().getTime().toString());
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      console.log('All Reviews:', reviews.map(r => `${r.id} (${r.user_name})`));
    }
  }, [reviews]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % reviews.length;
      console.log('Next clicked. Current user:', reviews[newIndex].user_name);
      return newIndex;
    });
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + reviews.length) % reviews.length;
      console.log('Prev clicked. Current user:', reviews[newIndex].user_name);
      return newIndex;
    });
  };

  console.log('Current Index:', currentIndex, 'Total Reviews:', reviews.length);

  return (
    reviews.length > 0 ? (
      <div className={styles.carouselContainer}>

        <div className={styles.reviewsWrapper}>
          <div className={styles.reviewsSlider}>
            {reviews[currentIndex] && (
              <div key={reviews[currentIndex].id} className={styles.reviewCard}>
                <div className={styles.reviewContent}>
                  <div className={styles.reviewHeader}>
                    <div>
                      <div className={styles.userName}>{reviews[currentIndex].user_name}</div>
                      <div className={styles.userDate}>{reviews[currentIndex].date}</div>
                    </div>
                    <div className={styles.rating}>
                      {'★'.repeat(reviews[currentIndex].rating)}
                    </div>
                  </div>
                  <div className={styles.reviewText}>{reviews[currentIndex].content}</div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
          <Button
          
          onClick={handlePrev}
          style={{
            pointerEvents: 'auto',
            opacity: 1,
            width: '20%',
          }}
          color={"blue"}
        >
          <ChevronLeft size={24} />
        </Button>
          <Button
          onClick={handleNext}
          style={{
            pointerEvents: 'auto',
            opacity: 1,
            width: '20%',

          }}
          color={"blue"}
        >
          <ChevronRight size={24} />
        </Button>
        </div>
        </div>

      </div>
    ) : (
      <div>No reviews yet</div>
    )
  );
};

export default Reviews;