import React from 'react';
import { FacebookLoginButton } from 'react-social-login-buttons';
import FacebookLogin from '@greatsumini/react-facebook-login';
import styles from '../styles/Login.module.css';

const FacebookLoginComponent = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID}
      onSuccess={(response) => {
        console.log('Login Success!', response);
        // Fetch additional profile information if needed
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (profile) => {
          console.log('Get Profile Success!', profile);
          onLoginSuccess({ ...response, profile });
        });
      }}
      onFail={(error) => {
        console.log('Login Failed!', error);
        onLoginFailure(error);
      }}
      onProfileSuccess={(response) => {
        console.log('Get Profile Success!', response);
      }}
      render={({ onClick }) => (
        <FacebookLoginButton className={styles.facebook} children={""} onClick={onClick} />
      )}
    />
  );
};

export default FacebookLoginComponent;