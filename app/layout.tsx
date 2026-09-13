import type { Metadata } from 'next';
import { COMPANY_EMAIL, WHATSAPP_DISPLAY_NUMBER } from './site-contact';
import { SITE_URL, INDEXING_ENABLED, absoluteUrl, serializeSchema } from './site-config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gao Dehat | Crop Nutrition & Agricultural Inputs, Barabanki',
  description: 'Explore Gao Dehat crop nutrition, soil-health and micronutrient products. Compare pack sizes, benefits and label-guided use, and enquire with our Barabanki team.',
  keywords: ['Gao Dehat', 'agricultural inputs', 'soil health', 'micronutrient fertilizer', 'organic manure', 'plant growth promoter', 'Barabanki'],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  robots: { index: INDEXING_ENABLED, follow: INDEXING_ENABLED },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Gao Dehat | Sustainable agricultural inputs',
    description: 'Healthy soil. Abundant harvests.',
    siteName: 'Gao Dehat',
    type: 'website',
    url: SITE_URL,
    locale: 'en_IN',
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
    '@id': `${SITE_URL}/#organization`,
    url: SITE_URL,
    logo: absoluteUrl('/gao-dehat-logo.jpeg'),
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
        <a className="skip-link" href="#main-content">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(organizationSchema) }} />
        {children}
      </body>
    </html>
  );
}
