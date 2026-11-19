import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Locale } from '../i18n/ui';
// Add only verified public URLs. CV paths are relative to public/.
export const profile = {
 name: 'Alberto Paleteiro',
 github: 'https://github.com/STX3837',
 linkedin: 'https://www.linkedin.com/in/alberto-josé-paleteiro-lópez-78a90b413',
 email: 'alberto.paleteiro.dev@gmail.com',
 cv: { es: '/cv/Alberto_Paleteiro_CV_ES.pdf', en: '' },
};
export function getCv(locale: Locale) {
 for (const language of (locale === 'en' ? ['en', 'es'] : ['es']) as Locale[]) {
  const href = profile.cv[language];
  if (href && /^[/][a-zA-Z0-9_./-]+\.pdf$/.test(href) && !href.includes('..') && statSync(resolve('public', href.slice(1)), { throwIfNoEntry: false })?.isFile()) return { href, language };
 }
 return undefined;
}
export const socialLinks = [
 { label: 'GitHub', href: profile.github },
 { label: 'LinkedIn', href: profile.linkedin },
].filter(link => link.href);
export const technologies = [
 ['Python', 'Java', 'Django', 'FastAPI', 'Flask', 'Spring Boot'],
 ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Astro'],
 ['PostgreSQL', 'PostGIS', 'MySQL', 'MariaDB', 'Oracle'],
 ['Docker', 'Docker Compose', 'Git', 'GitHub', 'Linux'],
 [{ es: 'APIs REST', en: 'REST APIs' }, 'Eclipse Dataspace Components', 'Dataspace Protocol', { es: 'Integración de servicios', en: 'Service integration' }],
 ['Keycloak', 'HashiCorp Vault', 'DCP'],
 [{ es: 'Integración de modelos de lenguaje', en: 'Language model integration' }],
] as const;
