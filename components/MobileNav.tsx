 'use client';

import Link from 'next/link';
import { generalWhatsAppLink } from '../app/site-contact';

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

export default function MobileNav() {
  return (
    <details className="mobile-nav" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary')?.focus();
      }
    }} onClick={(event) => {
      if ((event.target as HTMLElement).closest('a')) event.currentTarget.open = false;
    }}>
      <summary aria-label="Open navigation menu">
        <span className="copy-en">Menu</span>
        <span className="copy-hi" lang="hi">मेनू</span>
        <span aria-hidden="true">☰</span>
      </summary>
      <nav aria-label="Mobile navigation">
        <Link href="/#about"><Copy en="Our purpose" hi="हमारा उद्देश्य" /></Link>
        <Link href="/#products"><Copy en="Products" hi="उत्पाद" /></Link>
        <Link href="/#directors"><Copy en="Our directors" hi="हमारे निदेशक" /></Link>
        <Link href="/#crop-guides"><Copy en="Crop guides" hi="फसल मार्गदर्शिका" /></Link>
        <Link href="/#contact"><Copy en="Contact" hi="संपर्क" /></Link>
        <a href={generalWhatsAppLink} target="_blank" rel="noreferrer">WhatsApp ↗</a>
      </nav>
    </details>
  );
}
