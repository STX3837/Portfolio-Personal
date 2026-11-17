import { statSync } from 'node:fs';
import { resolve } from 'node:path';

/** Optional screenshots must be real public files with dimensions and both translations. */
export function validateScreenshot(image, publicDirectory = resolve('public')) {
  if (!image) return undefined;
  if (!/^\/images\/projects\/[a-zA-Z0-9_/-]+\.(png|jpe?g|webp|avif)$/.test(image.src) ||
      !Number.isInteger(image.width) || image.width <= 0 ||
      !Number.isInteger(image.height) || image.height <= 0 ||
      !['es', 'en'].every(locale => typeof image.alt?.[locale] === 'string' && image.alt[locale].trim())) {
    throw new Error('Project screenshot requires a local /images/projects/ path, positive dimensions and descriptive ES/EN alt text.');
  }
  if (!statSync(resolve(publicDirectory, image.src.slice(1)), { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`Project screenshot file not found: ${image.src}`);
  }
  return image;
}
