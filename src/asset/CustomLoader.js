import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from './loading.json';

const CustomLoader = ({ resourceName }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [lottieError, setLottieError] = useState(null);

  const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      progressiveLoad: true,
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    console.log('Animation data:', animationData);
    const interval = setInterval(() => {
      setAnimationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 3;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMessage(`Loading ${resourceName}...`);
  }, [resourceName]);

  const handleLottieError = (error) => {
    console.error('Lottie error:', error);
    setLottieError(error.toString());
  };

  

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ position: 'relative', width: '350px', height: '350px' }}>
          {lottieError ? (
            <div style={{ color: 'red' }}>Error loading animation: {lottieError}</div>
          ) : (
            <Lottie 
              options={defaultOptions}
              width={350}
              height={350}
              eventListeners={[
                {
                  eventName: 'error',
                  callback: handleLottieError,
                },
              ]}
            />
          )}
        </div>
        <div style={{
          marginTop: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: 'white',
        }}>
          {animationProgress}%
        </div>
        <h3 style={{ marginTop: '10px', color: 'white' }}>{message}</h3>
      </div>
    </div>
  );
};

export default CustomLoader;