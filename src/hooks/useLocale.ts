import { useState, useEffect } from 'react';

function useLocale() {
  const [locale, setLocale] = useState(navigator.language || 'en-US');

  useEffect(() => {
    const handleLocaleChange = () => {
      setLocale(navigator.language);
    };

    window.addEventListener('languagechange', handleLocaleChange);

    return () => {
      window.removeEventListener('languagechange', handleLocaleChange);
    };
  }, []);

  return { locale, setLocale };
}

export default useLocale;