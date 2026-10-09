import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

const services = {
  'leaking-shower-repairs': { core: 'leaking shower repairs', symptom: 'water escaping from a shower, stained finishes or recurring moisture', alternative: 'resealing, regrouting or full waterproofing renewal' },
  'bathroom-waterproofing': { core: 'bathroom waterproofing and retiling', symptom: 'a leaking shower, failed wet-area finishes or water entry', alternative: 'targeted repair or wet-area membrane renewal' },
  'shower-resealing-regrouting': { core: 'shower resealing and regrouting', symptom: 'cracked grout, failed silicone or water around shower joints', alternative: 'local joint renewal or broader waterproofing work' },
  'balcony-waterproofing': { core: 'balcony waterproofing and leak repairs', symptom: 'rainwater entry, a leaking balcony or moisture below an external tiled area', alternative: 'local sealing, drainage work or membrane replacement' },
  'kitchen-sealing': { core: 'kitchen sealing and resealing', symptom: 'moisture around a sink, splashback or benchtop junction', alternative: 'joint resealing or the appropriate plumbing repair pathway' },
  'external-waterproofing': { core: 'external waterproofing and water ingress repairs', symptom: 'rainwater entering around walls, windows, thresholds or exterior junctions', alternative: 'sealing, drainage, flashing or building-envelope repair work' }
};

const guides = {
  'balcony-leaking-room-below': { core: 'balcony waterproofing', symptom: 'a balcony leaking into the room below' },
  'kitchen-sink-resealing-or-plumbing': { core: 'kitchen sink resealing', symptom: 'water around a kitchen sink or cabinet' },
  'regrouting-resealing-or-rewaterproofing': { core: 'shower regrouting, resealing or waterproofing', symptom: 'a leaking shower with worn grout or silicone' },
  'shower-plumbing-or-waterproofing': { core: 'leaking shower repairs', symptom: 'water appearing after shower use' },
  'waterproofing-or-drainage': { core: 'external waterproofing or drainage assessment', symptom: 'water pooling beside a house after rain' },
  'waterproofing-retiling-quote': { core: 'bathroom waterproofing and retiling', symptom: 'a bathroom repair quote' }
};

function replaceHeading(html, oldHeading, newHeading) {
  return html.replaceAll(`<h2>${oldHeading}</h2>`, `<h2>${newHeading}</h2>`);
}

function removeHiddenFaqSchema(html) {
  // These generated questions were not displayed on the page. Keep schema
  // limited to user-visible information rather than adding hidden FAQ markup.
  return html.replace(/<script type="application\/ld\+json">(?=[^<]*#service-faq)[\s\S]*?<\/script>/g, '');
}

function placeClosingSectionAtArticleEnd(html, section) {
  // Service pages contain related-service <article> cards. The closing content must
  // sit after the final article body, never inside one of those narrow cards.
  html = html.replace(/<section class="(?:intent-summary|service-assessment)">[\s\S]*?<\/section>/g, '');
  const closingArticle = html.lastIndexOf('</article>');
  if (closingArticle === -1) throw new Error('Expected a page-level article closing tag');
  const before = html.slice(0, closingArticle).replace(/(?:[ \t\r]*\n)+[ \t\r]*$/, '\n');
  return `${before}${section}${html.slice(closingArticle)}`;
}

for (const [slug, detail] of Object.entries(services)) {
  const file = resolve(root, 'services', slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  html = replaceHeading(html, 'When to get it checked', `When should you book ${detail.core} in Canberra?`);
  html = replaceHeading(html, 'What the service includes', `What does ${detail.core} in Canberra include?`);
  html = replaceHeading(html, 'Repair options and limitations', `Can ${detail.core} address ${detail.symptom}?`);
  html = replaceHeading(html, 'What affects a quote', `What affects the cost of ${detail.core} in Canberra?`);
  html = replaceHeading(html, 'Next step', `How do you arrange ${detail.core} in Canberra?`);
  html = replaceHeading(html, 'Signs to record', `What signs should you record before booking ${detail.core}?`);
  html = replaceHeading(html, 'What MEL ONE includes in the agreed scope', `What should a ${detail.core} scope identify?`);
  html = replaceHeading(html, 'Service boundaries', `When might ${detail.core} need another trade pathway?`);
  html = replaceHeading(html, 'Quote factors', `Which property details change a ${detail.core} quote?`);
  html = replaceHeading(html, 'Related guides', `Which MEL ONE guides explain ${detail.core} choices?`);
  const close = `<section class="service-assessment"><h2>How do you arrange an on-site assessment with MEL ONE?</h2><p>Tell us your Canberra suburb and the affected area or planned work. The Ellis team completes an on-site assessment, checks the water-entry cause or installation requirements and confirms the repair plan and written quote. The team completes the agreed waterproofing work directly; any separately licensed task is identified in the quote with its responsible licensed professional.</p><p>Call <a href="tel:+61482422607">0482 422 607</a> or use the <a href="/contact/">MEL ONE service form</a>. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos.</p></section>`;
  html = placeClosingSectionAtArticleEnd(html, close);
  html = removeHiddenFaqSchema(html);
  writeFileSync(file, html);
}

for (const [slug, detail] of Object.entries(guides)) {
  const file = resolve(root, 'guides', slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  html = replaceHeading(html, 'What to look for', `What should you check before booking ${detail.core}?`);
  html = replaceHeading(html, 'Why the scope matters', `Why does the repair scope matter for ${detail.symptom}?`);
  html = replaceHeading(html, 'Prepare for a useful conversation', `How should you prepare for a ${detail.core} service request?`);
  html = replaceHeading(html, 'What you can observe', `What can you safely observe about ${detail.symptom}?`);
  html = replaceHeading(html, 'How repair scopes differ', `How do repair options differ for ${detail.symptom}?`);
  html = replaceHeading(html, 'What to record before you request service', `What should you record before requesting ${detail.core}?`);
  html = replaceHeading(html, 'Next step with MEL ONE', `How can you arrange the right ${detail.core} service in Canberra?`);
  const close = `<section class="service-assessment"><h2>How do you arrange an on-site assessment with MEL ONE?</h2><p>Tell us your Canberra suburb and the affected area or planned work. The Ellis team completes an on-site assessment, checks the water-entry cause or installation requirements and confirms the repair plan and written quote. The team completes the agreed waterproofing work directly; any separately licensed task is identified in the quote with its responsible licensed professional.</p><p>Call <a href="tel:+61482422607">0482 422 607</a> or use the <a href="/contact/">MEL ONE service form</a>. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos.</p></section>`;
  html = placeClosingSectionAtArticleEnd(html, close);
  html = removeHiddenFaqSchema(html);
  writeFileSync(file, html);
}

