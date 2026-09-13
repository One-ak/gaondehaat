import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Usage: npm run check:launch -- http://localhost:3100 https://your-domain.com
const base = new URL(process.argv[2] || 'http://localhost:3100');
const canonicalBase = new URL(process.argv[3] || process.env.SITE_URL || 'https://gao-dehat.fishgoldindustries.chatgpt.site');
const source = await readFile(new URL('../app/product-data.ts', import.meta.url), 'utf8');
const slugs = [...source.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]);
assert.equal(slugs.length, 17, 'Expected the complete 17-product catalogue');
const routes = ['/', ...slugs.map((slug) => `/products/${slug}`)];
const results = await Promise.allSettled(routes.map(async (path) => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path}: status`);
  const html = await response.text();
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${path}: one H1`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${path}: description`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${path}: canonical exists`);
  assert.equal(new URL(canonical).href, new URL(path, canonicalBase).href, `${path}: self canonical`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  const documentPolicy = (head.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"\s*\/?\s*>/i)?.[1] || '')
    .replaceAll('&#x27;', "'").replaceAll('&#39;', "'").replaceAll('&apos;', "'");
  const headerPolicy = response.headers.get('content-security-policy') || '';
  // Hostinger CDN replaces the response CSP with upgrade-insecure-requests.
  // Require the real restrictions in the head policy too, not just that header.
  assert.ok(headerPolicy.includes('object-src') || headerPolicy.includes('upgrade-insecure-requests'), `${path}: response CSP exists`);
  const policies = headerPolicy.includes('object-src') ? [documentPolicy, headerPolicy] : [documentPolicy];
  for (const policy of policies) {
    for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "connect-src 'self'", "script-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "font-src 'self' data:", "style-src 'self' 'unsafe-inline'"]) {
      assert.ok(policy.split(';').map((part) => part.trim()).includes(directive), `${path}: CSP ${directive}`);
    }
    assert.ok(!policy.includes('unsafe-eval'), `${path}: no production eval allowance`);
  }
  assert.match(html, /wa\.me\/919196702525/, `${path}: correct enquiry destination`);
  assert.ok(!html.includes('class="site-loader"'), `${path}: no blocking loader`);
  if (path !== '/') assert.match(html, /BreadcrumbList/, `${path}: breadcrumb schema`);
  console.log(`PASS ${path}`);
}));
const failures = results.filter((r) => r.status === 'rejected');
for (const failure of failures) console.error(failure.reason);
assert.equal(failures.length, 0, 'Route checks failed');
for (const path of ['/missing-page', '/products/not-a-product']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 404, `${path}: real 404`);
}
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text();
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 18, 'Sitemap includes all pages');
for (const path of routes) assert.ok(sitemap.includes(new URL(path, canonicalBase).href), `Sitemap: ${path}`);
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.ok(robots.includes(new URL('/sitemap.xml', canonicalBase).href), 'robots links final-domain sitemap');
const pdf = await fetch(new URL('/gao-dehat-product-catalogue.pdf', base));
assert.equal(pdf.status, 200);
assert.match(pdf.headers.get('content-type') || '', /pdf/);
const home = await (await fetch(base)).text();
const assets = new Set([...home.matchAll(/(?:src|href)="(\/(?:_next\/static|products|directors)[^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&')));
for (const path of assets) assert.equal((await fetch(new URL(path, base))).status, 200, `Asset ${path}`);
console.log(`PASS: ${routes.length} pages, metadata, structured data, security headers, sitemap, robots, 404s, PDF and ${assets.size} assets.`);
