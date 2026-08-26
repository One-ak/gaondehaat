import type { Metadata } from 'next';
import SiteLoader from '../components/SiteLoader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gao Dehat | Sustainable agricultural inputs',
  description: 'Gao Dehat brings dependable organic and bio-based agricultural inputs for healthy soil, stronger crops and better yields.',
  metadataBase: new URL('https://gao-dehat.fishgoldindustries.chatgpt.site'),
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
  return (
    <html lang="en">
      <body>
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
