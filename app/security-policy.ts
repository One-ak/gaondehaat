// Keep the response header and document policy in sync. Some hosting CDNs
// replace the CSP response header; an early head policy preserves restrictions.
const development = process.env.NODE_ENV === 'development';

export const DOCUMENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ''}`,
  `connect-src 'self'${development ? ' ws: wss:' : ''}`,
].join('; ');

// frame-ancestors is header-only; X-Frame-Options also protects hosted pages.
export const RESPONSE_SECURITY_POLICY = `${DOCUMENT_SECURITY_POLICY}; frame-ancestors 'self'`;
