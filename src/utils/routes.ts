import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '../i18n/ui';
export const localizedPath = (locale: Locale, path = '') => getRelativeLocaleUrl(locale, path);
