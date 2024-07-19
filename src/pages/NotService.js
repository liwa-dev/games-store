import React from 'react';
import notfound from '../imgs/notfound.png';
import { useLanguage } from '../provider/LanguageProvider';

export default function NotService() {
  const { translations } = useLanguage();
  const styles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '48px',
    textAlign: 'center',
  };

  return (
    <div style={styles}>
        {translations.notFound.name}
      <img style={{ width: '30%', height: '30%' }} src={notfound} alt="Not Found" />
    </div>
  );
}
