import { statSync } from 'node:fs';
import { resolve } from 'node:path';
// Add only verified public URLs. CV paths are relative to public/.
export const profile = {
 name: 'Alberto Paleteiro',
 github: 'https://github.com/STX3837',
 linkedin: 'https://www.linkedin.com/in/alberto-josé-paleteiro-lópez-78a90b413',
 email: 'alberto.paleteiro.dev@gmail.com',
 cv: '',
};
export const cvUrl = profile.cv && /^[/][a-zA-Z0-9_./-]+$/.test(profile.cv) && !profile.cv.includes('..') && statSync(resolve('public', profile.cv.slice(1)), { throwIfNoEntry: false })?.isFile() ? profile.cv : undefined;
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
