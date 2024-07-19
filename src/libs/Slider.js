import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Slider.module.css'; // Import the private CSS file

const Slider = ({ min = 0, max = 100, value = 0, onChange, valueLabelPosition = 'above' }) => {
  const [dragging, setDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(value);
  const sliderRef = useRef(null);

  // Calculate the position of the slider handle
  const calculatePosition = (event) => {
    const slider = sliderRef.current;
    if (!slider) return 0; // Ensure slider is not null
    const rect = slider.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = Math.min(Math.max(0, offsetX / rect.width), 1);
    return Math.round(percentage * (max - min) + min);
  };

  // Update the slider value and notify parent
  const updateValue = (event) => {
    const newValue = calculatePosition(event);
    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Handle mouse/touch start event
  const handleStart = (event) => {
    event.preventDefault();
    setDragging(true);
    updateValue(event);
  };

  // Handle mouse/touch move event
  const handleMove = (event) => {
    if (dragging) {
      updateValue(event);
    }
  };

  // Handle mouse/touch end event
  const handleEnd = () => {
    setDragging(false);
  };

  // Event listeners for mouse and touch events
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragging]);

  // Calculate the percentage position of the handle
  const handlePosition = ((sliderValue - min) / (max - min)) * 95 + 5;

  // Calculate the width of the track based on slider value
  const trackWidth = ((sliderValue - min) / (max - min)) * 95;

  return (
    <div
      className={`${styles.slider} ${valueLabelPosition === 'inside' ? styles.zoomEffect : ''} ${valueLabelPosition === 'above' ? styles.scaleHandle : ''}`}
      ref={sliderRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div
        className={styles.track}
        style={{
          width: `${trackWidth}%`,
        }}
      />
      <div
        className={`${styles.handle} ${valueLabelPosition === 'inside' ? styles.scaleHandle : ''}`}
        style={{
          left: `${handlePosition}%`,
        }}
      >
        {valueLabelPosition === 'inside' && (
          <div className={styles.valueLabelInside}>
            {sliderValue}
          </div>
        )}
      </div>

      {valueLabelPosition === 'above' && (
        <div
          className={`${styles.valueLabel} ${styles.valueLabelAbove}`}
          style={{
            left: `${handlePosition}%`,
          }}
        >
          {sliderValue}
        </div>
      )}

      {valueLabelPosition === 'right' && (
        <div className={styles.valueLabelRight}>
          {sliderValue}
        </div>
      )}
    </div>
  );
};

export default Slider;