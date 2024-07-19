import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, removeAuthToken } from './authUtils';

export const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isTokenValid()) {
        removeAuthToken();
        navigate('/login');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};