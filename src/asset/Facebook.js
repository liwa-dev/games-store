import React from 'react';
import { FacebookLoginButton } from 'react-social-login-buttons';
import FacebookLogin from '@greatsumini/react-facebook-login';
import styles from '../styles/Login.module.css';

const FacebookLoginComponent = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID}
      onSuccess={(response) => {
        // Fetch additional profile information if needed
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (profile) => {
          onLoginSuccess({ ...response, profile });
        });
      }}
      onFail={(error) => {
        onLoginFailure(error);
      }}
      onProfileSuccess={(response) => {
        }}
      render={({ onClick }) => (
        <FacebookLoginButton className={styles.facebook} children={""} onClick={onClick} />
      )}
    />
  );
};

export default FacebookLoginComponent;