/** Only deployment configuration lives here; personal data is in src/data/profile.ts. */
export function getSiteOrigin(value, { production = false } = {}) {
  if (!value) {
    if (production) throw new Error('SITE_URL is required for a production deployment.');
    return undefined;
  }

  let url;
  try { url = new URL(value); } catch {
    throw new Error('SITE_URL must be an absolute HTTP(S) origin.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash || value !== value.trim()) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
  }
  if (production && url.protocol !== 'https:') {
    throw new Error('Production SITE_URL must use HTTPS.');
  }
  return url.origin;
}
