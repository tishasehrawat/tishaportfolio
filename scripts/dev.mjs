import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, join, extname, sep} from 'node:path';
import {findPage, renderPage} from './site.mjs';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const isPreview = process.argv.includes('--dist');
const index = process.argv.indexOf('--port');
const requestedPort = Number(index >= 0 ? process.argv[index + 1] : process.env.PORT || 5173);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  throw new Error('Please provide a valid --port between 1 and 65535.');
}
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp',
  '.png':'image/png', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.pdf':'application/pdf',
  '.txt':'text/plain; charset=utf-8',
};
// Only application files and curated public assets are served, never resources/.
const allowed = /^\/(src\/|images\/|fonts\/|documents\/|favicon\.svg$)/;
const headers = type => ({'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff'});

async function serveFile(response, path, method) {
  if (!(await stat(path)).isFile()) throw new Error('Not a file');
  const content = await readFile(path);
  response.writeHead(200, {...headers(mime[extname(path)] || 'application/octet-stream'), 'Content-Length': content.length});
  if (method === 'HEAD') response.end(); else response.end(content);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const page = findPage(pathname);
    if (page) {
      if (isPreview) return await serveFile(response, join(root, 'dist', (page.slug || 'index') + '.html'), request.method);
      const html = await renderPage(page);
      response.writeHead(200, headers(mime['.html']));
      return response.end(request.method === 'HEAD' ? undefined : html);
    }
    if (!allowed.test(pathname)) {response.writeHead(404);response.end('Not found');return;}
    const base = isPreview ? join(root, 'dist') : pathname.startsWith('/src/') ? root : join(root, 'public');
    const path = resolve(base, '.' + pathname);
    if (!path.startsWith(base + sep)) {response.writeHead(403);response.end('Forbidden');return;}
    await serveFile(response, path, request.method);
  } catch {
    response.writeHead(404);response.end('Not found');
  }
});
let port = requestedPort;
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && port < requestedPort + 10) {port++;server.listen(port, '127.0.0.1');}
  else {console.error(error.message);process.exitCode = 1;}
});
server.on('listening', () => console.log('Portfolio ' + (isPreview ? 'preview' : 'dev') + ': http://localhost:' + port));
server.listen(port, '127.0.0.1');
for (const signal of ['SIGTERM','SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
