import assert from 'node:assert/strict';
import { getSiteOrigin, resolveSiteOrigin } from '../config/site.mjs';
import { verifyPublicImages } from './check-public-images.mjs';
import { validateScreenshot } from '../config/project-screenshot.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

assert.equal(getSiteOrigin(undefined), undefined);
assert.equal(getSiteOrigin('https://portfolio.invalid/'), 'https://portfolio.invalid');
assert.equal(getSiteOrigin('http://localhost:4321'), 'http://localhost:4321');
for (const value of ['invalid', '//portfolio.invalid', 'javascript:alert(1)',
  'https://user:pass@portfolio.invalid', 'https://portfolio.invalid/projects/',
  'https://portfolio.invalid/?q=test', 'https://portfolio.invalid/#about', ' https://portfolio.invalid']) {
  assert.throws(() => getSiteOrigin(value), undefined, value);
}
assert.throws(() => getSiteOrigin(undefined, { production: true }));
assert.throws(() => getSiteOrigin('http://portfolio.invalid', { production: true }));
assert.equal(getSiteOrigin('https://portfolio.invalid', { production: true }), 'https://portfolio.invalid');
console.log('PASS: production origin validation, missing domain, HTTPS and malformed URLs.');
const vercel = { VERCEL: '1', VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.invalid' };
assert.equal(resolveSiteOrigin({}), undefined);
assert.equal(resolveSiteOrigin(vercel), 'https://portfolio.invalid');
assert.equal(resolveSiteOrigin({ ...vercel, VERCEL_ENV: 'preview' }), 'https://portfolio.invalid');
assert.equal(resolveSiteOrigin({ ...vercel, VERCEL_PROJECT_PRODUCTION_URL: 'https://portfolio.invalid/' }), 'https://portfolio.invalid');
assert.equal(resolveSiteOrigin({ ...vercel, SITE_URL: 'https://explicit.invalid/' }), 'https://explicit.invalid');
assert.throws(() => resolveSiteOrigin({ ...vercel, SITE_URL: 'invalid' }));
assert.throws(() => resolveSiteOrigin({ VERCEL_ENV: 'production', VERCEL_URL: 'deployment.invalid' }));
assert.throws(() => resolveSiteOrigin({ ...vercel, VERCEL: undefined }));
assert.throws(() => resolveSiteOrigin({ ...vercel, VERCEL_PROJECT_PRODUCTION_URL: undefined }));
for (const domain of ['not-a-domain', 'bad host.invalid', '-bad.invalid', 'bad..invalid', 'bad.invalid/path', '//bad.invalid']) {
  assert.throws(() => resolveSiteOrigin({ ...vercel, VERCEL_PROJECT_PRODUCTION_URL: domain }), undefined, domain);
}
for (const value of ['http://portfolio.invalid', 'ftp://portfolio.invalid', 'https://localhost', 'https://LOCALHOST.', 'https://sub.localhost', 'https://127.0.0.1', 'https://[::1]', 'https://0.0.0.0', 'https://', 'https:////portfolio.invalid', 'https://portfolio.invalid/path', 'https://user:pass@portfolio.invalid', 'https://portfolio.invalid/?x=1', 'https://portfolio.invalid/#x']) {
  assert.throws(() => resolveSiteOrigin({ ...vercel, SITE_URL: value }), undefined, value);
  assert.throws(() => resolveSiteOrigin({ ...vercel, VERCEL_PROJECT_PRODUCTION_URL: value }), undefined, value);
}
console.log('PASS: Vercel production origin, explicit priority, preview canonical, missing/invalid origins and no VERCEL_URL fallback.');
const directory = mkdtempSync(join(tmpdir(), 'portfolio-image-'));
try {
  mkdirSync(join(directory, 'images/projects'), { recursive: true });
  // A file-existence fixture, not a fabricated project screenshot.
  writeFileSync(join(directory, 'images/projects/fixture.png'), 'fixture');
  const image = { src: '/images/projects/fixture.png', width: 1600, height: 900, alt: { es: 'Vista de prueba', en: 'Test view' } };
  assert.equal(validateScreenshot(undefined, directory), undefined);
  assert.equal(validateScreenshot(image, directory), image);
  for (const invalid of [{ src: 'https://example.com/image.png' }, { src: '/images/projects/../image.png' },
    { width: 0 }, { height: -1 }, { alt: { es: 'Vista' } }, { src: '/images/projects/missing.png' }]) {
    assert.throws(() => validateScreenshot({ ...image, ...invalid }, directory));
  }
} finally { rmSync(directory, { recursive: true, force: true }); }
console.log('PASS: optional screenshots, local files, dimensions, translated alt and invalid configurations.');
await verifyPublicImages('public');
console.log('PASS: reviewed EDC image hashes, raster metadata and private source exclusion.');
