import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Format/size conversion only: preserve the supplied brand artwork unchanged.
// Run manually after replacing the logo; generated assets are committed so
// production does not depend on running this script.
const publicFile = (name) => new URL(`../public/${name}`, import.meta.url);
const logo = await readFile(publicFile('gao-dehat-logo.jpeg'));
const png = (size) => sharp(logo)
  .resize(size, size, { fit: 'contain', background: '#ffffff' })
  .png()
  .toBuffer();

await writeFile(publicFile('favicon-96x96.png'), await png(96));
await writeFile(publicFile('apple-touch-icon.png'), await png(180));

// ICO directory followed by PNG-encoded images at standard browser sizes.
const sizes = [16, 32, 48, 64, 128, 256];
const images = await Promise.all(sizes.map(png));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index] === 256 ? 0 : sizes[index];
  directory[entry + 1] = directory[entry];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(publicFile('favicon.ico'), Buffer.concat([directory, ...images]));

// Keep the old URL valid for previously cached HTML. It used to contain JPEG
// bytes despite its .svg extension; now it is a real, self-contained SVG.
const embeddedLogo = images.at(-1).toString('base64');
await writeFile(publicFile('favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><title>Gao Dehat</title><image width="256" height="256" href="data:image/png;base64,${embeddedLogo}"/></svg>\n`);
console.log('Generated Gao Dehat PNG, ICO, Apple and legacy SVG favicons.');
