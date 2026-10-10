import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const thankYou = fs.readFileSync(path.join(root, 'thank-you', 'index.html'), 'utf8');

test('index.html permanently redirects to the canonical root', () => {
  assert.ok(config.redirects.some((rule) =>
    rule.source === '/index.html' && rule.destination === '/' && rule.permanent === true));
});

test('the existing apex host redirect is preserved', () => {
  assert.ok(config.redirects.some((rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'canberrawaterproof.com.au')));
});

test('the index redirect precedes the apex host redirect', () => {
  const indexRedirect = config.redirects.findIndex((rule) => rule.source === '/index.html');
  const hostRedirect = config.redirects.findIndex((rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'canberrawaterproof.com.au'));

  assert.ok(indexRedirect >= 0);
  assert.ok(hostRedirect >= 0);
  assert.ok(indexRedirect < hostRedirect);
});

test('thank-you remains crawlable while its page remains noindex', () => {
  assert.doesNotMatch(robots, /^Disallow:\s*\/thank-you\/$/m);
  assert.match(thankYou, /<meta name="robots" content="noindex,follow">/);
});

test('global headers include the required safe response headers and no CSP', () => {
  const headers = config.headers?.find((rule) => rule.source === '/:path*')?.headers ?? [];
  const headerMap = new Map(headers.map(({ key, value }) => [key, value]));

  assert.equal(headerMap.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(headerMap.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(headerMap.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
  assert.equal(headerMap.get('X-Frame-Options'), 'SAMEORIGIN');
  assert.equal(headers.some(({ key }) => key.toLowerCase() === 'content-security-policy'), false);
});
