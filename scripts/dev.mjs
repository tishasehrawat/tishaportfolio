import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, join, extname, sep} from 'node:path';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const isPreview = process.argv.includes('--dist');
const base = isPreview ? join(root, 'dist') : root;
const index = process.argv.indexOf('--port');
const requestedPort = Number(index >= 0 ? process.argv[index + 1] : process.env.PORT || 5173);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  throw new Error('Please provide a valid --port between 1 and 65535.');
}
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp',
  '.png':'image/png', '.jpg':'image/jpeg', '.ttf':'font/ttf', '.woff2':'font/woff2', '.pdf':'application/pdf',
  '.json':'application/json; charset=utf-8',
};
const allowed = /^\/(src\/|images\/|fonts\/|documents\/|vendor\/|favicon\.svg$)/;
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const isIndex = pathname === '/' || pathname === '/index.html';
    if (!isIndex && !allowed.test(pathname)) {
      response.writeHead(404);response.end('Not found');return;
    }
    const isPublic = !isIndex && !pathname.startsWith('/src/');
    const directory = !isPreview && isPublic ? join(base, 'public') : base;
    const path = resolve(directory, '.' + (isIndex ? '/index.html' : pathname));
    if (!path.startsWith(directory + sep)) {
      response.writeHead(403);response.end('Forbidden');return;
    }
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const content = await readFile(path);
    response.writeHead(200, {
      'Content-Type': mime[extname(path)] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control':'no-cache',
      'X-Content-Type-Options':'nosniff',
    });
    if (request.method === 'HEAD') response.end(); else response.end(content);
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
