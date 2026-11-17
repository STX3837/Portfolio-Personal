/** Only deployment configuration lives here; personal data is in src/data/profile.ts. */
export function getSiteOrigin(value, { production = false } = {}) {
  if (!value) {
    if (production) throw new Error('A valid SITE_URL or VERCEL_PROJECT_PRODUCTION_URL on Vercel is required for a production deployment.');
    return undefined;
  }

  let url;
  try { url = new URL(value); } catch {
    throw new Error('SITE_URL must be an absolute HTTP(S) origin.');
  }
  if (!/^https?:\/\/[^/\\]/i.test(value) || value.includes('\\') || !['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash || value !== value.trim()) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
  }
  if (production && url.protocol !== 'https:') {
    throw new Error('Production SITE_URL must use HTTPS.');
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (production && !host.startsWith('[') && (!host.includes('.') ||
      host.split('.').some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)))) {
    throw new Error('Production site origin must use a valid fully qualified hostname.');
  }
  if (production && (host === 'localhost' || host.endsWith('.localhost') ||
      /^127\./.test(host) || host === '0.0.0.0' || host === '[::1]' || host === '[::]')) {
    throw new Error('Production site origin must not use localhost or a loopback address.');
  }
  return url.origin;
}

/** SITE_URL wins, including invalid values: never silently replace a bad explicit origin. */
export function resolveSiteOrigin(env) {
  const production = env.VERCEL_ENV === 'production';
  if (env.SITE_URL) return getSiteOrigin(env.SITE_URL, { production });
  if (env.VERCEL === '1' && env.VERCEL_PROJECT_PRODUCTION_URL) {
    const domain = env.VERCEL_PROJECT_PRODUCTION_URL;
    const value = domain.includes('://') ? domain : `https://${domain}`;
    return getSiteOrigin(value, { production: true });
  }
  return getSiteOrigin(undefined, { production });
}
