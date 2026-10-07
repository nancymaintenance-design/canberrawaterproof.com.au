import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

test('the linked case-studies URL renders a project-photo hub with working service and contact paths', async () => {
  const server = createServer((request, response) => {
    let file = resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!file.startsWith(root)) { response.writeHead(403); response.end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': extname(file) === '.html' ? 'text/html' : 'application/octet-stream' });
    response.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(origin + '/case-studies/');
    assert.equal(response.status, 200, 'the existing case-studies link must not return 404');
    const html = await response.text();
    assert.match(html, /<main\b/);
    const imageUrls = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(imageUrls.length >= 2, 'the hub renders project imagery');
    for (const url of imageUrls) assert.equal((await fetch(origin + url)).status, 200, url);
    for (const url of ['/services/bathroom-waterproofing/', '/contact/']) {
      assert.ok(html.includes(`href="${url}"`), `the hub offers ${url}`);
      assert.equal((await fetch(origin + url)).status, 200, url);
    }
    assert.match(html, /rel="canonical" href="https:\/\/www\.canberrawaterproof\.com\.au\/case-studies\/"/);
    assert.ok(readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('<loc>https://www.canberrawaterproof.com.au/case-studies/</loc>'));
  } finally {
    await new Promise((done) => server.close(done));
  }
});
