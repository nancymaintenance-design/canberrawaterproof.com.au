import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const canonicalOrigin = 'https://www.canberrawaterproof.com.au';
const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'assets', 'tests'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
};
walk(root);

test('published pages, sitemap and robots use the www canonical origin', () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalOrigin.replaceAll('.', '\\.')}`));
    assert.doesNotMatch(html, /https:\/\/canberrawaterproof\.com\.au/);
  }
  assert.match(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), new RegExp(canonicalOrigin.replaceAll('.', '\\.'), 'g'));
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /https:\/\/canberrawaterproof\.com\.au\//, 'sitemap excludes non-canonical apex URLs');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, 'sitemap has no duplicate URLs');
  assert.match(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${canonicalOrigin.replaceAll('.', '\\.')}`));
});

test('apex requests permanently redirect to the www canonical origin', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const hostRedirect = config.redirects.find((rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'canberrawaterproof.com.au'));
  assert.equal(hostRedirect?.destination, 'https://www.canberrawaterproof.com.au/:path*');
  assert.equal(hostRedirect?.permanent, true);
});
