import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCategories } from '../supabase/getData';
import { useLanguage } from './LanguageProvider';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const { language } = useLanguage();
  const [headerConfig, setHeaderConfig] = useState({
    categories: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setHeaderConfig((prevConfig) => ({
          ...prevConfig,
          categories: data.map(category => ({
            ...category,
            name: category.name[language] || Object.values(category.name)[0] || ''
          })),
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [language]);

  return (
    <HeaderContext.Provider value={{ headerConfig, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);