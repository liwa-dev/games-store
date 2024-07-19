import React, { useState } from 'react';
import styles from './language.module.css';
import Flag from 'react-flagkit';
import { useLanguage } from '../provider/LanguageProvider';

const languages = [
  { code: 'en', name: <Flag country="US" />},
  { code: 'fr', name: <Flag country="FR" /> },
  { code: 'ar', name: <Flag country="TN" /> },
];

export default function SelectLanguage() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSelector}>
      <div className={styles.selectedLanguage} onClick={() => setIsOpen(!isOpen)}>
        {languages.find(lang => lang.code === language).name}
      </div>
      {isOpen && (
        <ul className={styles.languageOptions}>
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={language === lang.code ? styles.active : ''}
            >
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}