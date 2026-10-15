import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

const moduleUrl = new URL('../scripts/about-company.mjs', import.meta.url);
const implementation = existsSync(moduleUrl) ? await import(moduleUrl) : {};
const transform = html => {
 assert.equal(typeof implementation.applyAboutCompany, 'function', 'About company transform must be available to regeneration');
 return implementation.applyAboutCompany(html);
};
const fixture = '<html><head><title>Old About</title><meta name="description" content="Old description"><meta property="og:title" content="Old About"><meta property="og:description" content="Old description"><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"LocalBusiness","name":"MEL ONE","telephone":"0482 422 607"},{"@type":"WebPage","name":"Old About","description":"Old description","mainEntity":{"@id":"#faq"}},{"@type":"FAQPage","@id":"#faq","mainEntity":[{"@type":"Question","name":"Old question?"}]}]}</script></head><body><header>Existing navigation</header><main id="main"><section class="about-workflow">Old process</section><section class="about-prep">Old preparation</section><section class="about-faq">Old answers</section></main><footer>Existing company footer</footer></body></html>';

// A missing regeneration hook or duplicate rewrite breaks this contract.
test('About company transform replaces obsolete content once and preserves the document shell', () => {
 const result = transform(fixture);
 assert.equal(transform(result), result);
 assert.match(result, /<header>Existing navigation<\/header>/);
 assert.match(result, /<footer>Existing company footer<\/footer>/);
 assert.equal((result.match(/<main\b/g) || []).length, 1);
 assert.equal((result.match(/about-company\.css/g) || []).length, 1);
 assert.doesNotMatch(result, /Old process|Old preparation|Old answers|about-workflow|about-prep|about-faq/);
});

// Catches misrepresenting the national maintenance count as local waterproofing jobs.
test('regenerated About retains the qualified company facts and urgent attendance conditions', () => {
 const result = transform(fixture);
 assert.match(result, /more than 10 years of waterproofing experience/i);
 assert.match(result, /More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services\./);
 assert.match(result, /as little as 30 minutes after contact, subject to current availability, address and safe access/);
 for (const fact of ['Mel One Property Maintenance Pty Ltd','39 666 325 408 / 666 325 408','Chubb Insurance Australia Limited','AUD 20 million','13 April 2026 – 13 April 2027','121 Marcus Clarke St, Canberra, ACT 2600','Office reception: daily 09:00–21:00. On-site work by arrangement.']) assert.ok(result.includes(fact), fact);
 assert.doesNotMatch(result, /10,000[^<.]*waterproofing|warranty|guaranteed|licensed, insured/i);
});

// Catches a service being dropped or a new imaginary destination replacing a real service.
test('About capabilities link to all eleven real services without presenting a project case', () => {
 const result = transform(fixture);
 const expected = ['bathroom-waterproofing','leaking-shower-repairs','shower-resealing-regrouting','balcony-waterproofing','kitchen-sealing','laundry-waterproofing','external-waterproofing','roof-waterproofing','retaining-wall-waterproofing','tile-regrouting','commercial-waterproofing'];
 for (const slug of expected) assert.ok(result.includes('href="/services/'+slug+'/"'), slug);
 assert.match(result, /epoxy grout/i);
 assert.match(result, /balcony and general tile regrouting/i);
 assert.match(result, /all property types/i);
 assert.doesNotMatch(result, /Isaacs|documented-project|about-project|about-team-workshop|documented project work/);
 assert.match(result, /src="\/assets\/about-team-site\.jpg"/);
 assert.doesNotMatch(result, /<h[1-6][^>]*>[^<]*\?/);
});

test('case hub presents the confirmed Isaacs roof scope without unrelated team photography', async () => {
 const {applySeoHtml} = await import('../scripts/apply-seo-maintenance.mjs');
 const fixture = '<html><head></head><body><main><article><p data-existing>Existing bathroom case.</p><div class="field-notes-next">Existing booking.</div></article></main></body></html>';
 const result = applySeoHtml(fixture,'case-studies/index.html',{});
 assert.match(result, /id="isaacs-roof"/);
 assert.match(result, /April 2026/);
 assert.match(result, /Isaacs, Woden Valley/);
 assert.match(result, /chimney, ventilation outlets and eaves drainage outlets/);
 assert.match(result, /href="\/services\/roof-waterproofing\/#isaacs-roof"/);
 assert.match(result, /<p data-existing>Existing bathroom case\.<\/p>/);
 assert.doesNotMatch(result, /about-team-workshop|<img/);
 assert.equal(applySeoHtml(result,'case-studies/index.html',{}),result);
 assert.equal((result.match(/id="isaacs-roof"/g)||[]).length,1);
});

// Catches visible/schema drift and orphaned FAQ references after removing About answers.
test('About metadata matches company content and removes retired FAQ schema references', () => {
 const result = transform(fixture);
 const graph = JSON.parse(result.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.equal(graph.find(n => n['@type'] === 'LocalBusiness').telephone, '0482 422 607');
 assert.equal(graph.some(n => n['@type'] === 'FAQPage'), false);
 assert.equal(graph.find(n => n['@type'] === 'WebPage').mainEntity, undefined);
 assert.equal(graph.find(n => n['@type'] === 'WebPage').name, result.match(/<h1>([^<]+)<\/h1>/)[1]);
 assert.equal(graph.find(n => n['@type'] === 'WebPage').description, result.match(/<meta name="description" content="([^"]+)"/)[1]);
 assert.match(result, /href="tel:\+611300838722"/);
 assert.match(result, /href="mailto:riley@melonemaintenance.com.au"/);
});

test('shipped About uses the same repeatable company transform', () => {
 const shipped = readFileSync(new URL('../about/index.html', import.meta.url), 'utf8');
 assert.equal(transform(shipped), shipped);
});
