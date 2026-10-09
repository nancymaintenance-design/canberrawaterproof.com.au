import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (route) => readFileSync(route, 'utf8');

test('service structured data only describes visible FAQ content', () => {
  for (const slug of [
    'leaking-shower-repairs', 'bathroom-waterproofing',
    'shower-resealing-regrouting', 'balcony-waterproofing',
    'kitchen-sealing', 'external-waterproofing',
  ]) {
    const html = read(`services/${slug}/index.html`);
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]));
    const faqNodes = blocks.flatMap((block) => block['@graph'] || [block])
      .filter((node) => node['@type'] === 'FAQPage');
    for (const faq of faqNodes) {
      for (const item of faq.mainEntity) {
        assert.ok(visible.includes(item.name), `${slug}: FAQ question must be visible`);
        assert.ok(visible.includes(item.acceptedAnswer.text), `${slug}: FAQ answer must be visible`);
      }
    }
  }
});

test('home and case study connect services to project evidence', () => {
  const home = read('index.html');
  const services = read('services/index.html');
  const caseStudy = read('case-studies/index.html');
  assert.match(home, /href="\/case-studies\/"/);
  assert.match(home, /<section class="field-notes section"/);
  assert.match(services, /<aside class="field-note-rail"/);
  assert.match(caseStudy, /class="field-note-stage"/);
  assert.match(caseStudy, /href="\/services\/bathroom-waterproofing\/"/);
  assert.match(home, /<meta property="og:image" content="https:\/\/www\.canberrawaterproof\.com\.au\/assets\//);
});

test('home shows exactly one project-photo feature', () => {
  const home = read('index.html');
  assert.equal((home.match(/<section class="field-notes section"/g) || []).length, 1);
  assert.equal((home.match(/id="field-notes-title"/g) || []).length, 1);
});

test('every publishable HTML page has a branded social preview image', () => {
  function pages(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
      const file = join(dir, item.name);
      if (item.isDirectory() && !['.git', 'node_modules'].includes(item.name)) return pages(file);
      return item.isFile() && item.name === 'index.html' ? [file] : [];
    });
  }
  for (const file of pages('.')) {
    assert.match(read(file), /<meta property="og:image" content="https:\/\/www\.canberrawaterproof\.com\.au\/assets\/[^\"]+"/, file);
  }
});

test('guide links are labelled as guides, not services', () => {
  const html = read('index.html');
  const guideSection = html.match(/Guides for homeowners[\s\S]*?<\/section>/i)?.[0];
  assert.ok(guideSection);
  assert.doesNotMatch(guideSection, /MEL ONE SERVICE/i);
  assert.match(guideSection, /MEL ONE GUIDE/i);
});
