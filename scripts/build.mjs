import {cp, mkdir, rm, stat, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {pages, renderPage} from './site.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
await rm(output, {recursive: true, force: true});
await mkdir(join(output, 'src'), {recursive: true});
for (const page of pages) {
  await writeFile(join(output, (page.slug || 'index') + '.html'), await renderPage(page));
}
for (const file of ['styles.css', 'main.js']) await cp(join(root, 'src', file), join(output, 'src', file));
await cp(join(root, 'public'), output, {recursive: true});
for (const asset of ['favicon.svg', 'images/social-preview.png', 'images/hero-tedx.webp', 'fonts/montserrat-var.woff2']) {
  await stat(join(output, asset));
}
console.log('Built ' + pages.length + ' pages in dist/. Only curated public assets and application files are included.');
