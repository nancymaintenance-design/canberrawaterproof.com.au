import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const measurementId = 'G-5VJJKNSHLD';

function findHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory() && !['.git', 'node_modules', 'tests'].includes(entry.name)) return findHtml(target);
    return entry.isFile() && entry.name.endsWith('.html') ? [target] : [];
  });
}

test('every public HTML document contains one Canberra Waterproof GA4 tag', () => {
  const pages = findHtml(root);
  assert.ok(pages.length > 0, 'public HTML pages found');
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, new RegExp(`https://www\\.googletagmanager\\.com/gtag/js\\?id=${measurementId}`), page);
    assert.equal((html.match(new RegExp(`gtag\\('config','${measurementId}'\\)`, 'g')) || []).length, 1, page);
  }
});
