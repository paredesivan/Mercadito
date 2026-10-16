'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']]
]);
const port = Number(process.env.PORT || 4173);

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`).pathname;
  } catch (_) {
    response.writeHead(400).end('Solicitud inválida');
    return;
  }

  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404).end('No encontrado');
    return;
  }

  fs.readFile(path.join(root, file[0]), (error, content) => {
    if (error) {
      response.writeHead(500).end('No se pudo leer el archivo de Mercadito');
      return;
    }
    response.writeHead(200, {
      'Content-Type': file[1],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Servidor de pruebas listo en http://127.0.0.1:${port}/\n`);
});

function stop() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
