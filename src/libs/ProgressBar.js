import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = ({
  type = 'radius',
  strokeWidth = 10,
  color = '#4158d0',
  loop = false,
  size = 100,
  duration = 2000, // Duration of one loop in milliseconds
  width = 200, // Default width for slide progress bar
  percentage = 0 // New prop for setting a specific percentage
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(percentage);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const animatedPercentage = (progress % duration) / duration * 100;

      setCurrentPercentage(animatedPercentage);

      if (loop) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (loop) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setCurrentPercentage(percentage);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [loop, duration, percentage]);

  const SlideProgressBar = () => (
    <div style={{ position: 'relative', width, height: strokeWidth + 20 }}>
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: '14px',
        color: color,
        marginBottom: '5px'
      }}>
        
      </div>
      <div style={{ 
        width: '100%',
        height: strokeWidth,
        backgroundColor: '#d6d6d6',
        borderRadius: strokeWidth / 2,
        marginTop: '20px'
      }}>
        <div
          style={{
            width: `${currentPercentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: strokeWidth / 2,
            transition: 'width 0.1s linear'
          }}
          
        />{Math.round(currentPercentage)}%
      </div>
    </div>
  );

  const RadiusProgressBar = () => (
    <CircularProgressbar
      value={currentPercentage}
      text={`${Math.round(currentPercentage)}%`}
      strokeWidth={strokeWidth}
      styles={buildStyles({
        rotation: 0,
        strokeLinecap: 'butt',
        pathTransitionDuration: 0,
        pathColor: color,
        textColor: color,
        trailColor: '#d6d6d6'
      })}
    />
  );

  return (
    <div style={{ width: type === 'radius' ? size : width }}>
      {type === 'radius' ? <RadiusProgressBar /> : <SlideProgressBar />}
    </div>
  );
};

export default ProgressBar;