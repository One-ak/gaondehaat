import type { MetadataRoute } from 'next';
import { INDEXING_ENABLED, absoluteUrl } from './site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: INDEXING_ENABLED ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    ...(INDEXING_ENABLED ? { sitemap: absoluteUrl('/sitemap.xml') } : {}),
  };
}
