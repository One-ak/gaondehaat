import Link from 'next/link';
import SiteImage from './SiteImage';
import { COMPANY_EMAIL, generalWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '../app/site-contact';

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand-block">
          <Link className="footer-brand" href="/" aria-label="Gao Dehat home">
            <SiteImage src="/gao-dehat-logo.jpeg" alt="Gao Dehat" sizes="80px" />
          </Link>
          <div className="footer-company">
            <p className="footer-company-name">Gao Dehat Industries Pvt. Ltd.</p>
            <p><Copy en="A Vansh Group company" hi="वंश ग्रुप की एक कंपनी" /></p>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <p className="footer-section-title"><Copy en="Explore" hi="जानें" /></p>
          <Link href="/#about"><Copy en="Our purpose" hi="हमारा उद्देश्य" /></Link>
          <Link href="/#products"><Copy en="Products" hi="उत्पाद" /></Link>
          <Link href="/#directors"><Copy en="Our directors" hi="हमारे निदेशक" /></Link>
          <Link href="/#contact"><Copy en="Connect" hi="संपर्क" /></Link>
        </nav>

        <div className="footer-contact">
          <p className="footer-section-title"><Copy en="Contact" hi="संपर्क" /></p>
          <a className="footer-whatsapp" href={generalWhatsAppLink} target="_blank" rel="noreferrer">
            <Copy en={`WhatsApp: ${WHATSAPP_DISPLAY_NUMBER}`} hi={`व्हाट्सऐप: ${WHATSAPP_DISPLAY_NUMBER}`} /> <span>↗</span>
          </a>
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
          <address>Gata No. 5, Palia Masoodpur Par Dew,<br />Barabanki, Uttar Pradesh – 225001</address>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Gao Dehat Industries Pvt. Ltd.</p>
          <p className="footer-phrase">ग्राम्य पोषण, समृद्ध किसान</p>
        </div>
      </div>
    </footer>
  );
}
