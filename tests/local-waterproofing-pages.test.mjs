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
  assert.equal(manifest.pages.filter((page) => page.indexable).length, 9, 'only district hubs should be indexable');
  assert.ok(manifest.pages.filter((page) => page.kind === 'district').every((page) => page.indexable));
  assert.ok(manifest.pages.filter((page) => page.kind === 'locality').every((page) => !page.indexable));

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
    assert.equal(
      html.match(/<h1>([^<]+)<\/h1>/)?.[1].replaceAll('&amp;', '&'),
      `${page.focus.primary} in ${page.name}`,
      `${page.route} must use its assigned core service keyword in the H1`,
    );
    assert.match(html, new RegExp(page.focus.supporting[0], 'i'), `${page.route} must include its supporting service keyword`);
    assert.match(html, new RegExp(`name="robots" content="${page.indexable ? 'index,follow' : 'noindex,follow'}"`));
    localContexts.push(context);
  }
  assert.equal(new Set(localContexts).size, 24, 'every locality page needs distinct local context');

  const aranda = readFileSync('waterproofing/aranda/index.html', 'utf8');
  assert.equal((aranda.match(/<h1>Bathroom Waterproofing in Aranda<\/h1>/g) || []).length, 1);
  assert.match(aranda, /<title>Bathroom Waterproofing Aranda \| MEL ONE<\/title>/);
  assert.match(aranda, /<h2>Bathroom Waterproofing Services in Aranda<\/h2>/);
  assert.match(aranda, /<h2>How the Ellis team carries out bathroom waterproofing in Aranda<\/h2>/);
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
  for (const phrase of [
    'shower bases, screens, tiled wall-floor junctions',
    'bathrooms, ensuites and wet areas',
    'grout, silicone, shower-screen edges and tiled joints',
    'balcony thresholds, drainage points, tiled surfaces',
    'sink edges, splashbacks, benchtop junctions',
    'external wall junctions, window edges, roofline details',
  ]) {
    assert.match(aranda, new RegExp(phrase), `Aranda service card is missing: ${phrase}`);
  }
  assert.doesNotMatch(aranda, /plans leaking shower repairs around the affected surface/i);
  assert.match(aranda, /10\+ years/i);
  assert.match(aranda, /10,000\+ customers/i);
  assert.match(aranda, /Ellis team can be on site in as little as 30 minutes after contact/i);
  assert.match(aranda, /Licensed and insured/i);
  assert.match(aranda, /Request Service/);
  assert.match(aranda, /<form[^>]+action="\/api\/contact"[^>]+data-service-form/);
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

  for (const page of manifest.pages.filter((item) => item.indexable)) {
    assert.match(directory, new RegExp(`href="${page.route}"`), `directory missing ${page.route}`);
    const canonical = `${canonicalHost}${page.route}`;
    assert.equal((sitemap.match(new RegExp(`<loc>${canonical}<\\/loc>`, 'g')) || []).length, 1, `sitemap must list ${page.route} once`);
  }
  for (const page of manifest.pages.filter((item) => !item.indexable)) {
    assert.match(directory, new RegExp(`href="${page.route}"`), `directory should let visitors open ${page.route}`);
    const canonical = `${canonicalHost}${page.route}`;
    assert.equal((sitemap.match(new RegExp(`<loc>${canonical}<\\/loc>`, 'g')) || []).length, 0, `sitemap must exclude ${page.route}`);
  }

  const selectedNames = new Map(manifest.pages.map((page) => [page.name, page]));
  const buttons = [...directory.matchAll(/<a class="locality-button" href="([^"]+)">([^<]+)<\/a>/g)];
  assert.ok(buttons.length > 0, 'service area directory must retain locality buttons');
  for (const [, href, name] of buttons) {
    if (selectedNames.has(name)) {
      assert.equal(href, selectedNames.get(name).route, `${name} should link to its guide`);
    } else {
      assert.match(href, /^\/contact\/\?suburb=/, `${name} without a guide should prefill Contact`);
    }
  }

  assert.equal(feed.localities.length, 24, 'feed must list every local page');
  assert.deepEqual(
    new Set(feed.localities.map((item) => item.canonicalUrl)),
    new Set(manifest.pages.map((page) => `${canonicalHost}${page.route}`)),
  );
  for (const locality of feed.localities) {
    assert.ok(locality.primaryService, `${locality.locality} needs a primary service in the public feed`);
    assert.ok(locality.supportingServices?.length >= 2, `${locality.locality} needs supporting services in the public feed`);
  }
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
    assert.match(html, /Ellis team can be on site in as little as 30 minutes after contact/i, `${page.route} must describe urgent on-site attendance accurately`);
    assert.match(html, /Arrival timing depends on current availability, the address and safe access/i, `${page.route} must keep the attendance conditions clear`);
    assert.match(html, /10\+ years/i, `${page.route} must include the experience statement`);
    assert.match(html, /10,000\+ customers/i, `${page.route} must include the customer-trust statement`);
    assert.match(html, new RegExp(`${page.focus.primary} in ${page.name}`), `${page.route} must lead with its local service keyword`);
    assert.match(html, /data-service-form/, `${page.route} must use the service booking form`);
    assert.doesNotMatch(html, /plans (?:leaking shower repairs|bathroom waterproofing|shower resealing and regrouting|balcony waterproofing|kitchen sealing|external waterproofing) around the affected surface/i, `${page.route} must use service-specific card copy`);
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
