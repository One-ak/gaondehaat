import type { Metadata } from 'next';
import SiteLoader from '../components/SiteLoader';
import { COMPANY_EMAIL, WHATSAPP_DISPLAY_NUMBER } from './site-contact';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gao Dehat | Sustainable agricultural inputs',
  description: 'Gao Dehat brings dependable organic and bio-based agricultural inputs for healthy soil, stronger crops and better yields.',
  keywords: ['Gao Dehat', 'agricultural inputs', 'soil health', 'micronutrient fertilizer', 'organic manure', 'plant growth promoter', 'Barabanki'],
  metadataBase: new URL('https://gao-dehat.fishgoldindustries.chatgpt.site'),
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Gao Dehat | Sustainable agricultural inputs',
    description: 'Healthy soil. Abundant harvests.',
    siteName: 'Gao Dehat',
    type: 'website',
    images: [{ url: '/og.png', width: 1730, height: 910, alt: 'Gao Dehat — Healthy soil. Abundant harvests.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gao Dehat | Sustainable agricultural inputs',
    description: 'Healthy soil. Abundant harvests.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gao Dehat Industries Pvt. Ltd.',
    alternateName: 'Gao Dehat',
    url: 'https://gao-dehat.fishgoldindustries.chatgpt.site',
    logo: 'https://gao-dehat.fishgoldindustries.chatgpt.site/gao-dehat-logo.jpeg',
    email: COMPANY_EMAIL,
    telephone: WHATSAPP_DISPLAY_NUMBER,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gata No. 5, Palia Masoodpur Par Dew',
      addressLocality: 'Barabanki',
      addressRegion: 'Uttar Pradesh',
      postalCode: '225001',
      addressCountry: 'IN',
    },
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
