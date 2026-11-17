import { defineConfig } from 'astro/config';
import { resolveSiteOrigin } from './config/site.mjs';
const site = resolveSiteOrigin(process.env);
export default defineConfig({
 site: site || undefined,
 output: 'static', trailingSlash: 'always',
 i18n: { locales: ['es', 'en'], defaultLocale: 'es', routing: { prefixDefaultLocale: false } },
});
