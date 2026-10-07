import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const homeFile = resolve(root, 'index.html');
const servicesFile = resolve(root, 'services/index.html');
let home = readFileSync(homeFile, 'utf8');
let services = readFileSync(servicesFile, 'utf8');
const existingCards = [...services.match(/<div class="grid">([\s\S]*?)<\/div>/)[1].matchAll(/<article class="card">[\s\S]*?<\/article>/g)].map(match => match[0]);
if (![6, 9].includes(existingCards.length)) throw new Error(`Expected six or nine service cards, found ${existingCards.length}`);
const cards = existingCards.slice(0, 6);

const additions = [
  ['laundry-waterproofing', 'service-laundry.jpg', 'MEL ONE applying waterproofing in a laundry', 'Laundry Waterproofing in Canberra', 'Waterproofing for laundry floors and wet-area junctions, with plumbing faults identified as a separate repair path.'],
  ['roof-waterproofing', 'service-roof.jpg', 'MEL ONE working at a roof junction', 'Roof Leaks & Waterproofing in Canberra', 'Assessment of rainwater entry at roof surfaces, flashings and penetrations before the repair scope is set.'],
  ['retaining-wall-waterproofing', 'service-retaining-wall.jpg', 'MEL ONE team inspecting moisture at a retaining wall beside a garage', 'Retaining Wall Waterproofing in Canberra', 'Assess water entry beside soil-retaining walls and garages, including drainage and access requirements.']
];
const newCards = additions.map(([slug, image, alt, title, summary]) => `<article class="card"><figure class="service-card-image"><img src="/assets/${image}" alt="${alt}" loading="lazy" width="1536" height="1024"></figure><p class="eyebrow">MEL ONE service</p><h3><a href="/services/${slug}/">${title}</a></h3><p>${summary}</p><a href="/services/${slug}/">Read more →</a></article>`);

const serviceGrid = `<div class="grid">${[...cards, ...newCards].join('')}</div>`;
services = services.replace(/<div class="grid">[\s\S]*?<\/div>/, serviceGrid)
  .replace(/<article class="card"><h3>Laundry Waterproofing<\/h3>[\s\S]*?<\/article><article class="card"><h3>Roof Leaks [\s\S]*?<\/article>/, '');
if (!services.includes(serviceGrid)) throw new Error('Services grid replacement failed');
writeFileSync(servicesFile, services);

const homeGrid = `<div class="grid">${cards.join('')}</div><p class="service-grid-more"><a class="button primary" href="/services/">View All 9 Waterproofing Services</a></p>`;
home = home.replace(/<div class="grid">[\s\S]*?<\/div>(?:<p class="service-grid-more">[\s\S]*?<\/p>)*/, homeGrid);
if (!home.includes(homeGrid)) throw new Error('Home grid replacement failed');
writeFileSync(homeFile, home);

const sitemapFile = resolve(root, 'sitemap.xml');
let sitemap = readFileSync(sitemapFile, 'utf8');
for (const [slug] of additions) {
  const entry = `<url><loc>https://www.canberrawaterproof.com.au/services/${slug}/</loc></url>`;
  if (!sitemap.includes(entry)) sitemap = sitemap.replace('</urlset>', `${entry}</urlset>`);
}
writeFileSync(sitemapFile, sitemap);
