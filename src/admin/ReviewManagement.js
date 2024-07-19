import React, { useState, useEffect } from 'react';
import { getReviews } from '../supabase/getData';
import { addReview, updateReview, deleteReview } from '../supabase/setData';
import styles from './ReviewManagement.module.css';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user_name: '', date: '', rating: 5, content: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(newReview);
      setNewReview({ user_name: '', date: '', rating: 5, content: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleUpdateRating = async (id, currentRating, increment) => {
    const newRating = Math.max(1, Math.min(5, currentRating + increment));
    try {
      await updateReview(id, { rating: newRating });
      fetchReviews();
    } catch (error) {
      console.error('Error updating review rating:', error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Management</h2>
      <form onSubmit={handleAddReview} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          value={newReview.user_name}
          onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
          placeholder="User Name"
          required
        />
        <input
          className={styles.input}
          type="date"
          value={newReview.date}
          onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
          required
        />
        <input
          className={styles.input}
          type="number"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          min="1"
          max="5"
          required
        />
        <textarea
          className={styles.textarea}
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          placeholder="Review content"
          required
        />
        <button type="submit" className={styles.button}>Add Review</button>
      </form>
      <ul className={styles.reviewList}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span>{review.user_name} - {review.date}</span>
              <span>Rating: {review.rating}</span>
            </div>
            <p className={styles.reviewContent}>{review.content}</p>
            <div className={styles.reviewActions}>
              <button
                className={`${styles.actionButton} ${styles.increaseButton}`}
                onClick={() => handleUpdateRating(review.id, review.rating, 1)}
                disabled={review.rating === 5}
              >
                Increase Rating
              </button>
              <button
                className={`${styles.actionButton} ${styles.decreaseButton}`}
                onClick={() => handleUpdateRating(review.id, review.rating, -1)}
                disabled={review.rating === 1}
              >
                Decrease Rating
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}