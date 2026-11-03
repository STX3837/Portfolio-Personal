import { defineConfig } from 'astro/config';
// SITE_URL is optional locally; set the real production origin before deployment.
const site = process.env.SITE_URL;
if (site && (!/^https?:\/\//.test(site) || new URL(site).pathname !== '/')) {
 throw new Error('SITE_URL must be an absolute HTTP(S) origin without a path.');
}
export default defineConfig({
 site: site || undefined,
 output: 'static', trailingSlash: 'always',
 i18n: { locales: ['es', 'en'], defaultLocale: 'es', routing: { prefixDefaultLocale: false } },
});
