# Gao Dehat website

Next.js / React agricultural product website with 17 product pages, English/Hindi content, dark mode, product comparison and a downloadable catalogue.

## Hostinger Node.js deployment through GitHub

Production is deployed to **https://gaondehaat.com** on the existing Hostinger Node.js plan, connected to `One-ak/gaondehaat`, branch `main`.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Node.js | 22 LTS, at least 22.13 |
| Package manager | npm; commit package-lock.json |
| Install | npm ci (include build/dev dependencies) |
| Build command | npm run build |
| Start command | npm run start |
| Root directory | repository root |

The Node server honours Hostinger's `PORT`. Use Hostinger's Next.js preset; do not upload the old `dist` Worker output to public_html. Standard production output is `.next`. Existing Sites/Vinext configuration is retained for compatibility under `build:sites` / `start:sites`; it is not used by the Hostinger build.

Before the production build, configure these environment variables in Hostinger:

- `SITE_URL=https://gaondehaat.com`: the production HTTPS origin. No path/query.
- `SITE_INDEXING=true` on the final production domain. Use `false` for a temporary preview to disable indexing; rebuild after changing it.
- `GOOGLE_SITE_VERIFICATION`: optional Search Console HTML-tag verification token, not the whole meta tag.

The current URL fallback is the existing chatgpt.site origin so the existing preview does not acquire an invented domain. **Do not launch the new domain without setting SITE_URL and rebuilding.** Canonicals, sitemap, robots and structured-data URLs all use this one setting. Environment examples contain no credentials; keep real `.env` files out of Git.

## Local checks

```sh
npm ci
npm run lint
npm run build
npm run start -- --port 3100
# In a second terminal:
npm run check:launch -- http://localhost:3100
```

For a custom SITE_URL build, pass that origin as the second check argument. `npm run dev:next` is the normal Next.js development server. `npm run dev` preserves the previous local Vinext preview.

## Go-live checklist

1. Set final domain, HTTPS and environment variables, then build. Redirect HTTP to HTTPS and the unused www/non-www variant at Hostinger; do not create a redirect loop.
2. Run the launch check against the live URL with that same URL as canonical origin. Check image optimisation, mobile menu, search, product comparison, both themes and the PDF download in a browser.
3. Open a WhatsApp enquiry yourself and confirm the company account. Links now match the existing displayed number `+91 91967 02525`; recipient ownership cannot be validated from source code.
4. Verify ownership in Google Search Console, submit `/sitemap.xml`, and inspect homepage and representative product URLs. Check that no Hostinger password protection or `X-Robots-Tag: noindex` remains on production.
5. If replacing the old published URL, arrange permanent redirects from it where the old host permits. Avoid running competing copies with different canonicals. Old product slugs are deliberately retained to preserve existing links.
6. Run PageSpeed Insights on the final deployment after launch. Local checks are not field Core Web Vitals or a ranking score.
7. Keep package-lock.json current; review `npm audit` regularly. GitHub/Hostinger credentials and deployment permissions remain owner-managed.

## Security and content boundaries

No login, payments, uploads, database or form-submission service is present. Product data is repository-controlled; search/comparison/preferences are browser-local. Enquiries are outbound WhatsApp/mailto links. Node response headers restrict framing, executable content sources, sensitive browser permissions and MIME sniffing. CSP retains inline scripts for Next hydration; it does not constitute a strict nonce-based XSS policy. HTTPS/TLS and edge rate limits must be configured by the host.

Hostinger CDN was observed replacing the app's CSP header with `upgrade-insecure-requests`. The shared policy in `app/security-policy.ts` is therefore also emitted inside `<head>` so content-source restrictions remain enforced. The header retains `frame-ancestors`; the document policy omits this unsupported meta directive. The live `X-Frame-Options: SAMEORIGIN` header provides framing protection when the CDN replaces CSP. The launch check requires the document policy and framing header, not just Hostinger's default CSP. See [MDN CSP guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

Product structured data intentionally has no invented prices, ratings or reviews; Product rich-result eligibility is not promised. SEO foundations improve crawlability and clarity, not guaranteed positions. Keep product names, claims, doses and contact details verified against approved packaging. Director messages are drafted copy and should receive director approval before launch.

`public/gao-dehat-product-catalogue.pdf` is the published 20-page catalogue including the directors. The legacy offline `scripts/create_catalogue.py` outputs a separate older template into `output/pdf`; do not overwrite the published PDF with it without updating/reviewing the template and rendering every page. PDF generation is not part of the Hostinger build.

References: [Hostinger Node.js deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), [Next.js Node deployment](https://nextjs.org/docs/app/getting-started/deploying), [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
