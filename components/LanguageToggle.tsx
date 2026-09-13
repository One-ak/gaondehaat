'use client';

import { useEffect, useState } from 'react';

type Language = 'en' | 'hi';

export default function LanguageToggle() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem('gao-dehat-language'); } catch { /* Storage is optional. */ }
    if (saved === 'hi') {
      const frame = window.requestAnimationFrame(() => setLanguage('hi'));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language;
  }, [language]);

  function chooseLanguage(nextLanguage: Language) {
    try { window.localStorage.setItem('gao-dehat-language', nextLanguage); } catch { /* Storage is optional. */ }
    setLanguage(nextLanguage);
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
