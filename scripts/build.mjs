import {cp, mkdir, rm, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(join(root, 'index.html'), join(output, 'index.html'));
await cp(join(root, 'src'), join(output, 'src'), {recursive:true});
await cp(join(root, 'public'), output, {recursive:true});
for (const asset of ['favicon.svg', 'images/social-preview.png', 'documents/tisha-sehrawat-resume.pdf', 'vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/SplitText.min.js', 'vendor/lenis.min.js', 'fonts/fraunces-var.woff2', 'fonts/geist-var.woff2']) {
  await stat(join(output, asset));
}
console.log('Built portfolio in dist/. Only curated public assets and application files are included.');
