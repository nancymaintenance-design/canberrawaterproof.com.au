import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const generator = 'scripts/build-local-waterproofing-pages.mjs';
const canonicalHost = 'https://www.canberrawaterproof.com.au';

function runGenerator(args) {
  return spawnSync(process.execPath, [generator, ...args], {
    encoding: 'utf8',
  });
}

function testContract() {
  const checked = runGenerator(['--check']);
  assert.equal(
    checked.status,
    0,
    `generator contract check failed:\n${checked.stderr || checked.stdout}`,
  );

  const manifest = JSON.parse(checked.stdout);
  assert.equal(manifest.pages.length, 24, 'expected 24 locality pages');

  const routes = manifest.pages.map((page) => page.route);
  assert.equal(new Set(routes).size, 24, 'routes must be unique');
  assert.ok(routes.every((route) => /^\/waterproofing\/[a-z0-9-]+\/$/.test(route)));
  assert.ok(routes.includes('/waterproofing/aranda/'), 'Aranda route is required');

  for (const district of [
    'belconnen',
    'gungahlin',
    'inner-north-city',
    'inner-south',
    'woden-valley',
    'weston-creek-molonglo',
    'tuggeranong',
    'east-canberra',
    'act-localities',
  ]) {
    assert.ok(routes.includes(`/waterproofing/${district}/`), `missing ${district} district hub`);
  }

  const duplicate = structuredClone(manifest.pages[0]);
  const validation = runGenerator([
    '--validate-json',
    JSON.stringify([...manifest.pages, duplicate]),
  ]);
  assert.notEqual(validation.status, 0, 'duplicate slugs must be rejected');
}

function schemaGraph(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  return blocks.flatMap((block) => block['@graph'] || [block]);
}

function testPages() {
  const generated = runGenerator([]);
  assert.equal(generated.status, 0, `generator failed:\n${generated.stderr}`);

  const manifest = JSON.parse(runGenerator(['--check']).stdout);
  const localContexts = [];
  for (const page of manifest.pages) {
    const file = resolve('.', page.route.slice(1), 'index.html');
    assert.ok(existsSync(file), `missing generated page: ${page.route}`);
    const html = readFileSync(file, 'utf8');
    const context = html.match(/<p data-local-context>([^<]+)<\/p>/)?.[1];
    assert.ok(context, `${page.route} needs a visible local context paragraph`);
    localContexts.push(context);
  }
  assert.equal(new Set(localContexts).size, 24, 'every locality page needs distinct local context');

  const aranda = readFileSync('waterproofing/aranda/index.html', 'utf8');
  assert.equal((aranda.match(/<h1>Waterproofing Repairs in Aranda, ACT<\/h1>/g) || []).length, 1);
  assert.match(aranda, /<link rel="canonical" href="https:\/\/www\.canberrawaterproof\.com\.au\/waterproofing\/aranda\/">/);
  for (const term of ['bathroom', 'shower', 'roof', 'kitchen', 'balcony', 'external water-entry']) {
    assert.match(aranda.toLowerCase(), new RegExp(term));
  }
  for (const service of [
    'leaking-shower-repairs',
    'bathroom-waterproofing',
    'shower-resealing-regrouting',
    'balcony-waterproofing',
    'kitchen-sealing',
    'external-waterproofing',
  ]) {
    assert.match(aranda, new RegExp(`href="/services/${service}/"`));
  }
  assert.match(aranda, /aims to respond as fast as 30 minutes, subject to availability and enquiry details/i);
  assert.match(aranda, /<form[^>]+action="\/api\/contact"/);
  assert.match(aranda, /name="suburb"[^>]+value="Aranda"/);

  const visibleQuestions = [...aranda.matchAll(/data-faq-question="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(visibleQuestions.length >= 3 && visibleQuestions.length <= 5, 'expected 3–5 visible FAQs');
  const graph = schemaGraph(aranda);
  const faqSchema = graph.find((item) => item['@type'] === 'FAQPage');
  assert.ok(faqSchema, 'FAQPage JSON-LD is required');
  assert.deepEqual(faqSchema.mainEntity.map((item) => item.name), visibleQuestions);
  assert.ok(graph.some((item) => item['@type'] === 'BreadcrumbList'), 'breadcrumb JSON-LD is required');
  assert.ok(graph.some((item) => item['@type'] === 'Service'), 'service JSON-LD is required');
}

function testDiscovery() {
  const generated = runGenerator([]);
  assert.equal(generated.status, 0, `generator failed:\n${generated.stderr}`);
  const manifest = JSON.parse(runGenerator(['--check']).stdout);
  const directory = readFileSync('service-areas/index.html', 'utf8');
  const sitemap = readFileSync('sitemap.xml', 'utf8');
  const llms = readFileSync('llms.txt', 'utf8');
  const feed = JSON.parse(readFileSync('data/local-waterproofing-services.json', 'utf8'));

  for (const page of manifest.pages) {
    assert.match(directory, new RegExp(`href="${page.route}"`), `directory missing ${page.route}`);
    const canonical = `${canonicalHost}${page.route}`;
    assert.equal((sitemap.match(new RegExp(`<loc>${canonical}<\\/loc>`, 'g')) || []).length, 1, `sitemap must list ${page.route} once`);
  }

  const selectedNames = new Map(manifest.pages.map((page) => [page.name, page.route]));
  const buttons = [...directory.matchAll(/<a class="locality-button" href="([^"]+)">([^<]+)<\/a>/g)];
  assert.ok(buttons.length > 0, 'service area directory must retain locality buttons');
  for (const [, href, name] of buttons) {
    if (selectedNames.has(name)) {
      assert.equal(href, selectedNames.get(name), `${name} should link to its local information page`);
    } else {
      assert.match(href, /^\/contact\/\?suburb=/, `${name} should keep its contact pre-fill link`);
    }
  }

  assert.equal(feed.localities.length, 24, 'feed must list every local page');
  assert.deepEqual(
    new Set(feed.localities.map((item) => item.canonicalUrl)),
    new Set(manifest.pages.map((page) => `${canonicalHost}${page.route}`)),
  );
  assert.match(llms, /https:\/\/www\.canberrawaterproof\.com\.au\/service-areas\//);
  assert.match(llms, /https:\/\/www\.canberrawaterproof\.com\.au\/data\/local-waterproofing-services\.json/);
}

function testRegression() {
  const verified = runGenerator(['--verify']);
  assert.equal(verified.status, 0, `full locality verification failed:\n${verified.stderr || verified.stdout}`);
  const report = JSON.parse(verified.stdout);
  assert.equal(report.verified, true, 'generator must report a verified static build');
  assert.equal(report.pages, 24, 'verified build must include every locality page');

  const manifest = JSON.parse(runGenerator(['--check']).stdout);
  for (const page of manifest.pages) {
    const file = resolve('.', page.route.slice(1), 'index.html');
    assert.ok(existsSync(file), `missing route directory for ${page.route}`);
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<form[^>]+action="\/api\/contact"/, `${page.route} must retain the contact endpoint`);
    assert.match(html, /href="tel:\+61482422607"/, `${page.route} must retain the public phone link`);
    assert.match(html, /href="mailto:riley@melonemaintenance\.com\.au"/, `${page.route} must retain the public email link`);
    assert.doesNotMatch(
      html,
      /aims to respond as fast as 30 minutes\.(?!\s*This is a response target)/i,
      `${page.route} must qualify the response target`,
    );
    assert.match(html, /subject to availability and enquiry details/i, `${page.route} must qualify the response target`);
  }
}

const runAll = process.argv.length === 2;

if (process.argv.includes('--contract') || runAll) {
  testContract();
  console.log('locality generator contract: pass');
}

if (process.argv.includes('--pages') || runAll) {
  testPages();
  console.log('locality pages: pass');
}

if (process.argv.includes('--discovery') || runAll) {
  testDiscovery();
  console.log('locality discovery: pass');
}

if (process.argv.includes('--regression') || runAll) {
  testRegression();
  console.log('locality regression: pass');
}
