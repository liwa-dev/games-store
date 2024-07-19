import React from 'react';
import { useTheme } from '../provider/ThemeProvider';
import Switch from './Switch';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Switch 
      isOn={isDarkMode} 
      handleToggle={toggleTheme} 
      fillBackground={false} 
      color="#1768ea"
    />
  );
};

export default ThemeToggle;