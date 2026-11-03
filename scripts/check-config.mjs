import assert from 'node:assert/strict';
import { getSiteOrigin } from '../config/site.mjs';

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
