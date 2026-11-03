import { statSync } from 'node:fs';
import { resolve } from 'node:path';
// Add only verified public URLs. CV paths are relative to public/.
export const profile = {
 name: 'Alberto Paleteiro', github: '', linkedin: '', email: '', cv: '',
};
export const cvUrl = profile.cv && /^[/][a-zA-Z0-9_./-]+$/.test(profile.cv) && !profile.cv.includes('..') && statSync(resolve('public', profile.cv.slice(1)), { throwIfNoEntry: false })?.isFile() ? profile.cv : undefined;
export const socialLinks = [
 { label: 'GitHub', href: profile.github },
 { label: 'LinkedIn', href: profile.linkedin },
].filter(link => link.href);
export const technologies = [
 ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'],
 ['Django', 'FastAPI', 'Spring Boot', 'Flask'],
 ['HTML', 'CSS', 'Astro'],
 ['PostgreSQL', 'PostGIS', 'MySQL', 'MariaDB', 'Oracle'],
 ['Git', 'GitHub', 'Docker', 'Linux'],
 ['TensorFlow', 'Keras', 'NetLogo'],
];
