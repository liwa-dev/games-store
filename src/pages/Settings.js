import React, { useState } from "react";
import styles from "../styles/Settings.module.css";
import Button from "../libs/Button";
import Selector from "../libs/Selector";
import Switch from "../libs/Switch";
import ThemeToggle from "../libs/Theme";
import { useTheme } from "../provider/ThemeProvider";
import Image from "../libs/Image";
import facebook from "../imgs/facebook.png";
import google from "../imgs/google.png";
import discord from "../imgs/discord.png";
import { useNotification } from "../provider/NotificationProvider";
import { useLanguage } from "../provider/LanguageProvider";
import { useModal } from "../provider/ModalProvider";
import { deleteUser } from "../supabase/setData";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../supabase/authUtils";
import { Filter } from "lucide-react";


const SettingItem = ({ title, description, disabled, isOn, handleToggle }) => (
  <div className={styles.settingItem}>
    <div className={styles.settingInfo}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <Switch
      isOn={isOn}
      handleToggle={handleToggle}
      disabled={disabled}
      fillBackground={true}
    />
  </div>
);

export default function Settings({currentUser}) {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultPayment, setDefaultPayment] = useState("credit_card");
  const { notifySuccess, notifyError, notifyInfo, notifyWarning } =
    useNotification();

  const { setLanguage, translations } = useLanguage();


  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const { isDarkMode } = useTheme();

  const handlePasswordChange = () => {
    console.log("Changing password...");
  };

  const handleViewLoginHistory = () => {
    console.log("Viewing login history...");
  };

  const handleDeleteAccount = () => {
    openModal(
      <div>Are you sure you want to delete your account?</div>,
      {
        showCancel: true,
        showOk: true,
        onOk: async () => {
          try {
            await deleteUser(currentUser.user.id);
            notifySuccess('Account deleted successfully');
            logoutUser();
            navigate('/home');
            window.location.reload();
          } catch (error) {
            notifyError(error.message);
          }
        },
      }
    );
  };

  
  const handleLinkAccount = (platform) => {
    if (currentUser.user.login_provider === platform.toLowerCase()) {
      notifyInfo(`You're already logged in with ${platform}`);
    } else {
      alert(`Linking ${platform} account...`);
      console.log(`Linking ${platform} account...`);
    }
  };



  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "عربية" },
  ];

  const paymentOptions = [
    { value: "credit_card", label: "Credit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
  ];

  const handleSaveSettings = () => {
    notifySuccess("Settings saved successfully");
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`}>
      {/* ACCOUNT SECURITY START */}
      {currentUser.isLoggedIn && (
        <>
        <h1>{translations?.settings?.title}</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {translations?.settings?.twoFactorAuth?.info}
          </h2>
          <SettingItem
            title={translations?.settings?.twoFactorAuth?.name}
            description={translations?.settings?.twoFactorAuth?.description}
            disabled={false}
            isOn={twoFactorAuth}
            handleToggle={() => setTwoFactorAuth(!twoFactorAuth)}
          />
          <Button dark={isDarkMode} onClick={handlePasswordChange}>
            {translations?.settings?.twoFactorAuth?.changepassword}
          </Button>
          <Button dark={isDarkMode} onClick={handleViewLoginHistory}>
            {translations?.settings?.twoFactorAuth?.viewloginhistory}
          </Button>
        </div>
        </>
      )}
      
      {/* ACCOUNT SECURITY END */}


      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {translations?.settings?.uiperferences?.info}
        </h2>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3>{translations?.settings?.uiperferences?.dark}</h3>
            <p>{translations?.settings?.uiperferences?.infodark}</p>
          </div>
          // <ThemeToggle />
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3>{translations?.settings?.uiperferences?.language}</h3>
            <p>{translations?.settings?.uiperferences?.infolanguage}</p>
          </div>
          <Selector
            dark={isDarkMode}
            items={languageOptions}
            showIndicator={true}
            isLoopable={true}
            onSelectionChange={(item) => setLanguage(item.value)}
          />
        </div>
      </div>


      {/* ACCOUNT MANAGEMENT START */}

      {currentUser.isLoggedIn && (
      <>
      <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {translations?.settings?.accountmanagement?.info}
      </h2>
      <div className={styles.settingItem}>
        <Button color={"red"} onClick={handleDeleteAccount} dark={isDarkMode}>
          {translations?.settings?.accountmanagement?.name}
        </Button>
      </div>
    </div>
    <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {translations?.settings?.linkedaccounts?.info}
        </h2>
        <div className={styles.settingItem}>
        <Image
  src={facebook}
  alt="Link Facebook Account"
  width={35}
  style={{
    cursor: currentUser.user.login_provider === 'facebook' ? 'not-allowed' : 'pointer',
    opacity: currentUser.user.login_provider === 'facebook' ? 0.7 : 1,
    transition: "opacity 0.3s ease-in-out",
    filter: currentUser.user.login_provider === 'facebook' ? 'grayscale(50%)' : 'none',
    pointerEvents: currentUser.user.login_provider === 'facebook' ? 'none' : 'auto',
  }}
  onMouseEnter={(e) => {
    if (currentUser.user.login_provider !== 'facebook') {
      e.currentTarget.style.opacity = 0.7;
    }
  }}
  onMouseLeave={(e) => {
    if (currentUser.user.login_provider !== 'facebook') {
      e.currentTarget.style.opacity = 1;
    }
  }}
  onClick={() => {
    if (currentUser.user.login_provider !== 'facebook') {
      handleLinkAccount("facebook");
    }
  }}
/>
          <Image
            src={google}
            alt="Link Google Account"
            width={35}
            style={{
              cursor: "pointer",
              opacity: 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            onClick={() => handleLinkAccount("google")}
          />
          <Image
            src={discord}
            alt="Link Discord Account"
            width={40}
            height={32}
            style={{
              cursor: "pointer",
              opacity: 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            onClick={() => handleLinkAccount("discord")}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {translations?.settings?.paymentmethods?.info}
        </h2>
        <div className={styles.settingItem}>
          <p>{translations?.settings?.paymentmethods?.name}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>DEFAULT PAYMENT METHOD</h2>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3>Set Default Payment Method</h3>
            <p>Choose your preferred payment method</p>
          </div>
        </div>
      </div>
      </>
      )}


      <div className={styles.settingItem}>
        <Button color={"green"} dark={isDarkMode} onClick={handleSaveSettings}>
          {translations?.settings?.save}
        </Button>
      </div>
    </div>
  );
}
