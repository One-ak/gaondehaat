import type { NextConfig } from 'next';
import { RESPONSE_SECURITY_POLICY } from './app/security-policy';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // All catalogue images are local. No external image fetches are needed.
  images: {
    remotePatterns: [],
    localPatterns: [{ pathname: '/products/**', search: '' }, { pathname: '/directors/**', search: '' }, { pathname: '/gao-dehat-logo.jpeg', search: '' }],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Content-Security-Policy', value: RESPONSE_SECURITY_POLICY },
    ] }];
  },
};

export default nextConfig;
