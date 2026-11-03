import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { localizedPath } from '../utils/routes';
export const GET: APIRoute = ({ site }) => {
 const paths = (['es', 'en'] as const).flatMap(locale => [localizedPath(locale), ...projects.map(project => localizedPath(locale, `projects/${project.slug}/`))]);
 const urls = site ? paths.map(path => `<url><loc>${new URL(path, site).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</loc></url>`).join('') : '';
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
