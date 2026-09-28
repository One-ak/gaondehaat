import type { Metadata } from 'next';
import { COMPANY_EMAIL, WHATSAPP_DISPLAY_NUMBER } from './site-contact';
import { SITE_URL, INDEXING_ENABLED, absoluteUrl, serializeSchema } from './site-config';
import { DOCUMENT_SECURITY_POLICY } from './security-policy';
import { BRAND_NAME, BRAND_ALTERNATE_NAMES, HOME_TITLE, HOME_DESCRIPTION } from './site-brand';
import './globals.css';

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [BRAND_NAME, 'Gao Dehat', 'agricultural inputs', 'soil health', 'micronutrient fertilizer', 'organic manure', 'plant growth promoter', 'Barabanki'],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  robots: { index: INDEXING_ENABLED, follow: INDEXING_ENABLED },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: BRAND_NAME,
    type: 'website',
    url: SITE_URL,
    locale: 'en_IN',
    images: [{ url: '/og.png', width: 1730, height: 910, alt: 'Gaon Dehat (Gao Dehat) — Healthy soil. Abundant harvests.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gao Dehat Industries Pvt. Ltd.',
    alternateName: [BRAND_NAME, ...BRAND_ALTERNATE_NAMES],
    '@id': `${SITE_URL}/#organization`,
    url: SITE_URL,
    logo: absoluteUrl('/gao-dehat-logo.jpeg'),
    brand: {
      '@type': 'Brand',
      '@id': absoluteUrl('/#brand'),
      name: BRAND_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
    },
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
      <head>
        <meta httpEquiv="Content-Security-Policy" content={DOCUMENT_SECURITY_POLICY} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(organizationSchema) }} />
        {children}
      </body>
    </html>
  );
}
