import React, { useState } from 'react';
import { UserCircle, MapPin, CalendarDays, Wallet, Tag, Heart, User } from 'lucide-react';
import styles from '../styles/Account.module.css';
import { useTheme } from '../provider/ThemeProvider';
import { Link } from 'react-router-dom'; // Import Link from React Router

const AccountCard = ({ icon: Icon, title, to }) => { // Add 'to' prop to receive the link path
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { isDarkMode } = useTheme();

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <Link to={to} className={styles.cardLink}> {/* Wrap AccountCard with Link */}
      <div
        className={styles.card}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.cardOverlay}></div>
        <div
          className={styles.glow}
          style={{
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(var(--primary-color), 0.3), transparent 50%)`,
          }}
        />
        <div className={`${styles.cardContent} ${isHovered ? styles.hovered : ''}`}>
          <Icon className={styles.icon + ' ' + (isDarkMode ? styles.dark : '')} />
          <h3 className={styles.title + ' ' + (isDarkMode ? styles.dark : '')}>{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const AccountDashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Votre compte</h1>
      <div className={styles.grid}>
        <AccountCard icon={UserCircle} title="Informations" to="/my-account/profile" />
        <AccountCard icon={MapPin} title="Ajouter une première adresse" to="/my-account/addresses" />
        <AccountCard icon={CalendarDays} title="Historique et détails de mes commandes" to="/my-account/orders" />
        <AccountCard icon={Wallet} title="Avoirs" to="/my-account/credits" />
        <AccountCard icon={Tag} title="Bons de réduction" to="/my-account/discounts" />
        <AccountCard icon={Heart} title="Mes listes" to="/my-account/lists" />
        <AccountCard icon={User} title="Mes données personnelles" to="/my-account/personal-data" />
      </div>
    </div>
  );
};

export default AccountDashboard;
