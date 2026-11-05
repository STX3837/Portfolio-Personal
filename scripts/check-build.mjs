import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { getSiteOrigin } from '../config/site.mjs';

const root = resolve('dist');
const origin = getSiteOrigin(process.env.SITE_URL);
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]))).flat();
}
const pages = new Map();
const attr = (tag, key) => tag.match(new RegExp(`(?:^|\\s)${key}="([^"]*)"`))?.[1];
for (const file of (await walk(root)).filter(file => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const route = '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
  pages.set(route, { html, ids: [...html.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]) });
}
const expected = ['/', '/en/', ...['distans', 'puerto-dataspace-edc', 'aura']
  .flatMap(slug => [`/projects/${slug}/`, `/en/projects/${slug}/`])];
assert.deepEqual([...pages.keys()].sort(), expected.sort());
const titles = new Set();
const descriptions = new Set();
let linkCount = 0;
for (const [route, { html, ids }] of pages) {
  const check = (value, message) => assert.ok(value, `${route}: ${message}`);
  check(!/cyber-simulation|Simulador de ciberataques|Cyberattack simulator/i.test(html), 'retired project absent');
  if (route === '/' || route === '/en/') {
    const cards = [...html.matchAll(/<article\b[^>]*class="project-card"[^>]*>([\s\S]*?)<\/article>/g)].map(m => m[1]);
    check(cards.length === 3, 'exactly three featured projects');
    for (const [index, slug] of ['distans', 'puerto-dataspace-edc', 'aura'].entries()) {
      check(cards[index].includes(`/projects/${slug}/`), `featured order: ${slug}`);
    }
    for (const repo of ['https://github.com/STX3837/Distans-Django', 'https://github.com/STX3837/Distans-FastAPI', 'https://github.com/STX3837/puerto-dataspace-edc']) {
      check(html.includes(`href="${repo}"`), `configured repository ${repo}`);
    }
  }
  if (route === '/projects/distans/' || route === '/en/projects/distans/') {
    for (const repo of ['Distans-Django', 'Distans-FastAPI']) check(html.includes(`href="https://github.com/STX3837/${repo}"`), `DISTANS repository ${repo}`);
    check(html.includes('id="concurrency-title"'), 'visible concurrency case');
    check(html.includes('id="comparison-title"'), 'comparison table');
    check(html.includes('class="technical-section technical-references"'), 'secondary technical references');
  }
  check(html.includes(`<html lang="${route.startsWith('/en/') ? 'en' : 'es'}"`), 'language');
  check((html.match(/<h1\b/g) || []).length === 1, 'one h1');
  check(new Set(ids).size === ids.length, 'unique IDs');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  check(title && !titles.has(title), 'unique nonempty title'); titles.add(title);
  const description = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => m[0]).find(tag => attr(tag, 'name') === 'description');
  const descriptionText = description && attr(description, 'content');
  check(descriptionText && !descriptions.has(descriptionText), 'unique description'); descriptions.add(descriptionText);
  for (const meta of ['description', 'twitter:card', 'twitter:title', 'twitter:description', 'og:title', 'og:description', 'og:site_name']) {
    check([...html.matchAll(/<meta\b[^>]*>/g)].some(([tag]) => (attr(tag, 'name') === meta || attr(tag, 'property') === meta) && attr(tag, 'content')), meta);
  }
  const tags = [...html.matchAll(/<link\b[^>]*>/g)].map(m => m[0]);
  const canonical = tags.filter(tag => attr(tag, 'rel') === 'canonical');
  const alternates = tags.filter(tag => attr(tag, 'rel') === 'alternate');
  if (origin) {
    check(canonical.length === 1 && attr(canonical[0], 'href') === origin + route, 'canonical');
    check([...html.matchAll(/<meta\b[^>]*>/g)].some(([tag]) => attr(tag, 'property') === 'og:url' && attr(tag, 'content') === origin + route), 'og:url');
    const baseRoute = route.startsWith('/en/') ? route.slice(3) : route;
    for (const [lang, path] of [['es', baseRoute], ['en', '/en' + baseRoute], ['x-default', baseRoute]]) {
      check(alternates.some(tag => attr(tag, 'hreflang') === lang && attr(tag, 'href') === origin + path), `hreflang ${lang}`);
    }
  } else check(!canonical.length && !alternates.length, 'no invented domain');
  for (const [tag] of html.matchAll(/<(?:a|link)\b[^>]*>/g)) {
    const href = attr(tag, 'href'); if (!href) continue;
    const url = new URL(href.replaceAll('&amp;', '&'), 'http://local.invalid' + route);
    if (url.origin !== 'http://local.invalid') continue;
    if (pages.has(url.pathname)) {
      if (url.hash) check(pages.get(url.pathname).ids.includes(decodeURIComponent(url.hash.slice(1))), `anchor ${href}`);
    } else check((await stat(resolve(root, '.' + url.pathname)).catch(() => null))?.isFile(), `file ${href}`);
    linkCount++;
  }
  const language = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]).find(tag => /\bdata-language\b/.test(tag));
  check(language && attr(language, 'href') === (route.startsWith('/en/') ? route.slice(3) : '/en' + route), 'equivalent language link');
}
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(locations.sort(), origin ? expected.map(path => origin + path).sort() : []);
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
assert.ok(robots.includes('User-agent: *\nAllow: /\n'));
assert.equal(robots.includes('Sitemap:'), Boolean(origin));
if (origin) assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`PASS: ${pages.size} pages, ${linkCount} internal links/assets, anchors, ES/EN, metadata, canonical, hreflang, sitemap and robots (${origin || 'no domain'}).`);
