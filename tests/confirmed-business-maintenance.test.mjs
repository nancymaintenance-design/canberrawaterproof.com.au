import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { applySeoHtml, applyLlms } from '../scripts/apply-seo-maintenance.mjs';

const host = 'https://www.canberrawaterproof.com.au';
const nodes = html => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const source = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
// Recreate pre-maintenance input even after the checked-in site is regenerated.
const withoutHours = html => html
 .replace(/<p class="office-hours">[^<]*<\/p>/g, '')
 .replace(/,"openingHoursSpecification":\[[\s\S]*?\}\]/g, '');

// Catches omission of confirmed hours during maintenance/regeneration, while preserving address and copy.
test('maintenance restores visible reception hours and matching seven-day business hours', () => {
 const path = 'contact/index.html';
 const output = applySeoHtml(withoutHours(source(path)), path);
 const business = nodes(output).find(n => n['@type'] === 'LocalBusiness');
 assert.deepEqual(business.openingHoursSpecification, [{
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  opens: '09:00', closes: '21:00',
 }]);
 assert.equal(business.address.streetAddress, '121 Marcus Clarke St');
 for (const region of [output.match(/<div class="contact-details">[\s\S]*?<\/div>/)[0], output.match(/<footer\b[\s\S]*?<\/footer>/)[0]]) {
  assert.match(region, /Office reception: daily 09:00–21:00/);
  assert.match(region, /On-site work by arrangement/);
 }
 assert.equal(applySeoHtml(output, path), output);
});

// Catches inventing a human author, dropping an existing author, or leaving the real organization unlinked.
test('existing MEL ONE organization author resolves to genuine business and About page without new dates', () => {
 const path = 'industry-news/preparing-for-wet-weather/index.html';
 const input = source(path).replace(/("author":\{"@type":"Organization","name":"MEL ONE"),"@id":"[^"]+","url":"[^"]+"\}/, '$1}');
 const output = applySeoHtml(input, path);
 const article = nodes(output).find(n => ['Article','NewsArticle'].includes(n['@type']));
 assert.deepEqual(article.author, {'@type':'Organization', name:'MEL ONE', '@id':host+'/#business', url:host+'/about/'});
 const before = nodes(input).find(n => ['Article','NewsArticle'].includes(n['@type']));
 assert.equal(article.datePublished, before.datePublished);
 assert.equal(article.dateModified, before.dateModified);
 assert.equal(article.reviewedBy, undefined);
 assert.equal(applySeoHtml(output, path), output);
});

// Catches footer eager-loading regressions and missing 404 layout reservations without lazy-loading the header.
test('404 logos reserve intrinsic layout and only footer logo loads lazily', () => {
 const input = source('404.html').replace(/<img\b[^>]*src="\/assets\/mel-one-logo\.png"[^>]*>/g, image => image.replace(/\s(?:width|height|loading|decoding)="[^"]*"/g,''));
 const output = applySeoHtml(input, '404.html');
 const header = output.match(/<header\b[\s\S]*?<\/header>/)[0].match(/<img\b[^>]*>/)[0];
 const footer = output.match(/<footer\b[\s\S]*?<\/footer>/)[0].match(/<img\b[^>]*>/)[0];
 for (const image of [header,footer]) {
  assert.match(image, /width="1402"/);
  assert.match(image, /height="1122"/);
 }
 assert.doesNotMatch(header, /loading="lazy"/);
 assert.match(footer, /loading="lazy"/);
 assert.match(footer, /decoding="async"/);
 assert.equal(applySeoHtml(output, '404.html'), output);
});

// Catches stale scope/hours after the public content index is regenerated.
test('llms maintenance updates confirmed scope and reception hours while retaining discovery URLs', () => {
 const input = source('llms.txt').replace(/^- Office reception:.*\n/m, '').replace(/(## Scope\n)[\s\S]*?(\n\n## )/, '$1Bathroom waterproofing and leaking shower repairs.$2');
 const output = applyLlms(input);
 assert.match(output, /Office reception: daily 09:00–21:00/);
 assert.match(output, /On-site work by arrangement/);
 assert.match(output, /retaining-wall waterproofing/);
 assert.match(output, /commercial waterproofing/);
 assert.match(output, /121 Marcus Clarke St/);
 assert.match(output, /waterproofing\/belconnen\//);
 assert.equal(applyLlms(output), output);
});

test('every shipped business has confirmed hours and a lazy footer, retaining the locality indexing split', () => {
 const pages = [];
 const walk = directory => {
  for (const entry of readdirSync(directory,{withFileTypes:true})) {
   if (entry.name.startsWith('.') || ['node_modules','assets'].includes(entry.name)) continue;
   const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
   if (entry.isDirectory()) walk(url);
   else if (entry.name.endsWith('.html')) pages.push(readFileSync(url,'utf8'));
  }
 };
 walk(new URL('../',import.meta.url));
 assert.equal(pages.length, 56);
 let authors = 0;
 for (const html of pages) {
  const graph = nodes(html);
  const business = graph.find(n => n['@type'] === 'LocalBusiness');
  assert.equal(business.openingHoursSpecification[0].opens, '09:00');
  assert.equal(business.openingHoursSpecification[0].closes, '21:00');
  assert.equal(business.openingHoursSpecification[0].dayOfWeek.length, 7);
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.match(footer, /Office reception: daily 09:00–21:00/);
  assert.match(footer.match(/<img\b[^>]*>/)[0], /loading="lazy" decoding="async"/);
  for (const article of graph.filter(n => ['Article','NewsArticle','BlogPosting'].includes(n['@type']))) {
   authors++;
   assert.equal(article.author['@id'], host+'/#business');
   assert.equal(article.author.url, host+'/about/');
  }
 }
 assert.equal(authors, 9);
 assert.equal((source('sitemap.xml').match(/<loc>/g)||[]).length, 39);
 const locality = pages.filter(html => /rel="canonical" href="https:\/\/www\.canberrawaterproof\.com\.au\/waterproofing\//.test(html));
 assert.equal(locality.filter(html => /name="robots" content="noindex,follow"/.test(html)).length,15);
 assert.equal(locality.filter(html => /name="robots" content="index,follow"/.test(html)).length,9);
});
