import React, { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import CustomInput from "../libs/CustomInput";
import Button from "../libs/Button";
import { registerUser, loginUser, registerFacebookUser, registerGoogleUser } from "../supabase/setData";
import { checkUserSession, getUserByEmailOrUsername } from "../supabase/getData";
import {
  setAuthToken,
  isTokenValid,
  removeAuthToken,
  setFacebookToken,
  setGoogleToken,
} from "../supabase/authUtils";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../provider/LanguageProvider";
import { useNotification } from "../provider/NotificationProvider";
import FacebookLoginComponent from "../asset/Facebook";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ setCurrentUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { notifyError, notifySuccess, notifyInfo, notifyWarning } =
    useNotification();

    useEffect(() => {
      setIsAnimated(true);
      checkUserSession().then(user => {
        if (user) {
          setCurrentUser({ isLoggedIn: true, user: user });
          navigate("/home");
        }
      });
    }, []);

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
      setError("");
    }, 500);
  };

  useEffect(() => {
    if (!isTokenValid()) {
      removeAuthToken();
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // Check if the email or username already exists
      const existingUser = await getUserByEmailOrUsername(email, username);
      
      if (isLogin) {
        if (!existingUser) {
          setError("Email not found");
          notifyError("Email not found");
          return;
        }
        const result = await loginUser(email, password);
        const { user, token } = result;
        setAuthToken(token);
        setCurrentUser({ isLoggedIn: true, user: user });
        notifySuccess("You have successfully logged in");
        navigate("/home");
      } else {
        if (existingUser) {
          setError("Oops! You've already signed up with this account.");
          notifyError("Oops! You've already signed up with this account.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          notifyInfo("Passwords do not match");
          return;
        }
        const result = await registerUser(username, email, password);
        const { user, token } = result;
        setAuthToken(token);
        setCurrentUser({ isLoggedIn: true, user: user });
        notifySuccess("You have successfully registered");
        navigate("/home");
      }
    } catch (error) {
      notifyError("An error occurred during authentication");
      setError(error.message);
      console.error("Authentication error:", error);
    }
  };

  const handleFacebookLoginSuccess = async (response) => {
    console.log("Facebook login successful:", response);
    const { name, email } = response.profile;
  
    try {
      // Check if the user exists
      const existingUser = await getUserByEmailOrUsername(email, name);
  
      if (existingUser) {
        // User already exists
        notifySuccess("You have successfully logged in with Facebook");
        setFacebookToken(existingUser);
        setCurrentUser({ isLoggedIn: true, user: existingUser });
        navigate("/home");
      } else {
        // New user, proceed with registration
        const newUser = await registerFacebookUser({ name, email });
        notifySuccess("You have successfully registered with Facebook");
        setFacebookToken(newUser);
        setCurrentUser({ isLoggedIn: true, user: newUser });
        navigate("/home");
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        // This error code indicates a duplicate entry (may vary depending on your database)
        notifyError("An account with this email already exists. Please log in instead.");
      } else {
        notifyError("An error occurred while logging in with Facebook");
      }
      setError(error.message);
      console.error("Facebook authentication error:", error);
    }
  };


  const handleFacebookLoginFailure = (error) => {
    console.log("Facebook login failed:", error);
    notifyError("Facebook login failed");
  };

  
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log("Google login successful:", credentialResponse);
    try {
      const result = await registerGoogleUser(credentialResponse.credential);
      const { user, token } = result;
      console.log("Login.js, token:", token)
      setGoogleToken(token);
      setCurrentUser({ isLoggedIn: true, user: user });
      notifySuccess("You have successfully logged in with Google");
      navigate("/home");
    } catch (error) {
      notifyError("An error occurred while logging in with Google");
      setError(error.message);
      console.error("Google authentication error:", error);
    }
  }

  return (
    <div
      className={`${styles.container} ${isAnimated ? styles.animate : ""} ${
        isAnimating ? styles.animating : ""
      }`}
    >
      <div className={styles.background}></div>
      <h1>
        {isLogin ? translations?.login?.login : translations?.login?.register}
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <CustomInput
          style="standard"
          type="email"
          placeholder={translations?.login?.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomInput
          style="standard"
          type="password"
          placeholder={translations?.login?.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <>
            <CustomInput
              style="standard"
              type="password"
              placeholder={translations?.login?.rePassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <CustomInput
              style="standard"
              type="text"
              placeholder={translations?.login?.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </>
        )}
        <Button color="blue" type="submit">
          {isLogin ? translations?.login?.login : translations?.login?.register}
        </Button>
      </form>
      <p className={styles.registerPrompt}>
        {isLogin
          ? translations?.login?.noaccount
          : translations?.login?.haveaccount}
        <a href="#" onClick={toggleForm}>
          {isLogin
            ? translations?.login?.registerText
            : translations?.login?.login}
        </a>
      </p>
      <div className={styles.socialLogin}>
        <FacebookLoginComponent
          onLoginSuccess={handleFacebookLoginSuccess}
          onLoginFailure={handleFacebookLoginFailure}
        />
               <GoogleLogin
               type="icon"
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log('Google Login Failed');
            notifyError("Google login failed");
          }}
        />
      </div>
    </div>
  );
};

export default Login;