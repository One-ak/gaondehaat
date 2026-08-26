'use client';

import { useEffect, useState } from 'react';

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hideLoader: number | undefined;
    const dismiss = () => {
      if (hideLoader) return;
      hideLoader = window.setTimeout(() => setVisible(false), 360);
    };

    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss, { once: true });

    const fallback = window.setTimeout(dismiss, 3000);
    return () => {
      window.removeEventListener('load', dismiss);
      window.clearTimeout(fallback);
      if (hideLoader) window.clearTimeout(hideLoader);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-loader" role="status" aria-label="Loading Gao Dehat">
      <div className="loader-orbit orbit-one" />
      <div className="loader-orbit orbit-two" />
      <div className="loader-logo-wrap">
        <img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" />
      </div>
      <p>ग्राम्य पोषण, समृद्ध किसान</p>
      <span>Preparing the field</span>
    </div>
  );
}
