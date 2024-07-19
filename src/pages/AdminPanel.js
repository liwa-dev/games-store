import React, { useEffect, useState } from 'react';
import styles from '../styles/AdminPanel.module.css';
import { useHeader } from '../provider/HeaderProvider';
import HeaderControl from '../admin/HeaderControl';
import ServiceManagement from '../admin/ServiceManagement';
import UserManagement from '../admin/UserManagement';
import { useLanguage } from '../provider/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import ReviewManagement from '../admin/ReviewManagement';

const DashboardCard = ({ title, value, change, icon, color }) => (
  <div className={`${styles.card} ${styles[color]}`}>
    <div className={styles.cardContent}>
      <h3>{title}</h3>
      <p className={styles.value}>{value}</p>
      <p className={styles.change}>{change}</p>
    </div>
    <div className={styles.icon}>{icon}</div>
  </div>
);

export default function AdminPanel({currentUser}) {
  const { headerConfig, setHeaderConfig } = useHeader();
  const { translations } = useLanguage();
  const navigate = useNavigate();


  const menuItems = [
    { id: 'dashboard', translationKey: 'admin.dashboard.name' },
    { id: 'userManagement', translationKey: 'admin.userManagement.name' },
    { id: 'headerControl', translationKey: 'admin.headerControl.name' },
    { id: 'serviceManagement', translationKey: 'admin.serviceManagement.name' },
    { id: 'reviews', translationKey: 'admin.reviews.name' },
  ];


  const [activeSection, setActiveSection] = useState(menuItems[0].id);

  useEffect(() => {
    setActiveSection(menuItems[0].id);
  }, []);


  if (currentUser.user.role !== 'admin') {
    navigate('/');
  }



  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <h2>Dashboard Content</h2>;
      case 'headerControl':
        return <HeaderControl headerConfig={headerConfig} setHeaderConfig={setHeaderConfig} />;
      case 'serviceManagement':
        return <ServiceManagement />;
      case 'userManagement':
        return <UserManagement />;
      case 'reviews':
        return <ReviewManagement />;
      default:
        return <h2>{activeSection} Content</h2>;
    }
  };


  const getTranslation = (key) => {
    const parts = key.split('.');
    let result = translations;
    for (const part of parts) {
      if (result && result[part]) {
        result = result[part];
      } else {
        return key; // Return the key itself if translation is not found
      }
    }
    return typeof result === 'string' ? result : key;
  };

  

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <div className={styles.profile}>
        <img src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Liwa" alt="User Avatar" className={styles.avatar}/>
          <span>{currentUser.user.username}</span>
          <small>{currentUser.user.role}</small>
        </div>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeSection === item.id ? styles.active : ''}
              onClick={() => setActiveSection(item.id)}
            >
              {getTranslation(item.translationKey) || item.id}
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
}
