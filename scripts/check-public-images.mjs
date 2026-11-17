import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const edcManifest = JSON.parse(await readFile(new URL('../config/edc-public-images.json', import.meta.url), 'utf8'));
export async function verifyPublicImages(directory) {
  const root = resolve(directory);
  const found = new Set();
  const approved = new Map(edcManifest.images.map(image => [image.src.slice(1), image]));
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = resolve(folder, entry.name);
      const name = relative(root, file).split(sep).join('/');
      assert.ok(!entry.isSymbolicLink(), `Public symlink is not allowed: ${name}`);
      assert.ok(!/puerto-dataspace\/|Captura de pantalla|\.verification|source-originals/.test(name), `Private source path in public output: ${name}`);
      if (entry.isDirectory()) { await walk(file); continue; }
      const bytes = await readFile(file);
      const hash = createHash('sha256').update(bytes).digest('hex');
      assert.ok(!edcManifest.originalHashes.includes(hash), `Original EDC screenshot found in public output: ${name}`);
      if (!name.startsWith('images/projects/puerto-dataspace-edc/')) continue;
      const image = approved.get(name);
      assert.ok(image, `Unreviewed EDC image: ${name}`);
      assert.equal(hash, image.sha256, `Reviewed raster changed: ${name}`);
      assert.equal(bytes.readUInt32BE(16), image.width);
      assert.equal(bytes.readUInt32BE(20), image.height);
      // Raster-only PNG: no EXIF, text, thumbnails, alternate frames or appended data.
      let offset = 8;
      while (offset < bytes.length) {
        const length = bytes.readUInt32BE(offset);
        const type = bytes.toString('ascii', offset + 4, offset + 8);
        assert.ok(['IHDR', 'IDAT', 'IEND', 'pHYs'].includes(type), `Unexpected PNG metadata: ${name}`);
        offset += length + 12;
        if (type === 'IEND') break;
      }
      assert.equal(offset, bytes.length, `Appended PNG data: ${name}`);
      found.add(name);
    }
  }
  await walk(root);
  assert.deepEqual([...found].sort(), [...approved.keys()].sort(), 'All six reviewed EDC images must exist');
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const directory = process.argv[2] || 'public';
  await verifyPublicImages(directory);
  console.log(`PASS: six reviewed EDC rasters; no original screenshots or private source paths in ${directory}.`);
}
