import { defineConfig } from 'astro/config';
import { getSiteOrigin } from './config/site.mjs';
const site = getSiteOrigin(process.env.SITE_URL, {
 production: process.env.VERCEL_ENV === 'production',
});
export default defineConfig({
 site: site || undefined,
 output: 'static', trailingSlash: 'always',
 i18n: { locales: ['es', 'en'], defaultLocale: 'es', routing: { prefixDefaultLocale: false } },
});
