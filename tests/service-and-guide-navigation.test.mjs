import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = path => readFileSync(resolve(root, path), 'utf8');
const firstGridCards = html => [...html.match(/<div class="grid">([\s\S]*?)<\/div>/)?.[1].matchAll(/<article class="card">/g) || []].length;

test('home has six service cards and a route to nine complete services', () => {
  const home = read('index.html');
  const index = read('services/index.html');
  assert.equal(firstGridCards(home), 6);
  assert.match(home, /href="\/services\/">View All 9 Waterproofing Services<\/a>/);
  assert.equal(firstGridCards(index), 9);
  for (const slug of ['laundry-waterproofing', 'roof-waterproofing', 'retaining-wall-waterproofing']) {
    assert.match(index, new RegExp(`href="/services/${slug}/"`));
    assert.ok(existsSync(resolve(root, 'services', slug, 'index.html')));
    const detail = read(`services/${slug}/index.html`);
    assert.match(detail, new RegExp(`<h1>[^<]+ in Canberra<\\/h1>`));
    assert.match(detail, /<section class="service-booking"/);
    assert.match(detail, new RegExp(`rel="canonical" href="https://www.canberrawaterproof.com.au/services/${slug}/"`));
  }
  const retaining = read('services/retaining-wall-waterproofing/index.html');
  assert.match(index, /src="\/assets\/service-retaining-wall.jpg"/);
  assert.match(retaining, /src="\/assets\/service-retaining-wall.jpg"/);
  assert.match(retaining, /src="\/assets\/detail-retaining-wall.jpg"/);
});

test('all six guides have scenario-specific question headings and service links', () => {
  for (const slug of ['shower-plumbing-or-waterproofing', 'regrouting-resealing-or-rewaterproofing', 'waterproofing-retiling-quote', 'balcony-leaking-room-below', 'kitchen-sink-resealing-or-plumbing', 'waterproofing-or-drainage']) {
    const html = read(`guides/${slug}/index.html`);
    assert.match(html, /<h1>[^<]+Canberra[^<]*<\/h1>|<h1>Leaking Shower Repair:/);
    if (slug === 'waterproofing-retiling-quote') {
      assert.match(html, /<table>/);
      assert.match(html, /written approval/);
    } else {
      assert.ok((html.match(/<section class="guide-answer">/g) || []).length >= 4);
    }
    assert.match(html, /<h2>[^<]+\?<\/h2>/);
    assert.match(html, /href="\/services\//);
    assert.doesNotMatch(html, /<section class="intent-summary">/);
  }
});
