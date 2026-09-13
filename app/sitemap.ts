import type { MetadataRoute } from 'next';
import { products } from './product-data';
import { INDEXING_ENABLED, absoluteUrl } from './site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXING_ENABLED) return [];
  return ['/', ...products.map((product) => `/products/${product.slug}`)].map((path) => ({ url: absoluteUrl(path) }));
}
