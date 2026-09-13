// Set SITE_URL at build time to the final HTTPS domain. Never derive canonical
// URLs from request Host headers (which visitors can control).
const configuredUrl = process.env.SITE_URL || 'https://gao-dehat.fishgoldindustries.chatgpt.site';
const parsedUrl = new URL(configuredUrl);
if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password || parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash) {
  throw new Error('SITE_URL must be an HTTPS origin, for example https://www.example.com');
}
export const SITE_URL = parsedUrl.origin;
export const INDEXING_ENABLED = process.env.SITE_INDEXING !== 'false';
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;
export const serializeSchema = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
