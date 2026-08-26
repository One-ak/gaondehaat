'use client';

import { useEffect, useState } from 'react';

type Language = 'en' | 'hi';

export default function LanguageToggle() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('gao-dehat-language');
    const nextLanguage: Language = saved === 'hi' ? 'hi' : 'en';
    document.documentElement.dataset.language = nextLanguage;
    document.documentElement.lang = nextLanguage;
    if (nextLanguage !== 'en') {
      const frame = window.requestAnimationFrame(() => setLanguage(nextLanguage));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  function chooseLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem('gao-dehat-language', nextLanguage);
    document.documentElement.dataset.language = nextLanguage;
    document.documentElement.lang = nextLanguage;
  }

  return (
    <div className="language-toggle" aria-label="Language selector">
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => chooseLanguage('en')}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={language === 'hi' ? 'active' : ''}
        onClick={() => chooseLanguage('hi')}
        aria-pressed={language === 'hi'}
      >
        हिं
      </button>
    </div>
  );
}
