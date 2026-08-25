import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gao Dehat | Sustainable agricultural inputs',
  description: 'Gao Dehat brings dependable organic and bio-based agricultural inputs for healthy soil, stronger crops and better yields.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
