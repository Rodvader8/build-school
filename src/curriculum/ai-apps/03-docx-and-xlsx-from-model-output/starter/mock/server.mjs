// Starts the pretend Anthropic API on a spare local port. Used by the tests; handy in your own experiments too.
import http from 'node:http';
import { mockMessages, mockCountTokens, resetMock } from './anthropic-mock.js';

export async function startMockServer() {
  const requests = []; // every request the app made, newest last, so tests can look at what was sent
  const server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      let body = null;
      try {
        body = JSON.parse(raw);
      } catch {}
      const path = new URL(req.url, 'http://x').pathname;
      requests.push({ path, headers: req.headers, body });
      const handler = path === '/v1/messages' ? mockMessages : path === '/v1/messages/count_tokens' ? mockCountTokens : null;
      const result = handler ? handler(req.headers, body) : { status: 404, body: { type: 'error', error: { type: 'not_found_error', message: path } } };
      res.writeHead(result.status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result.body));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requests,
    reset: () => {
      requests.length = 0;
      resetMock();
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
