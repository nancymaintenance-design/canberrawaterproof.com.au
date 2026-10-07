import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const origin = 'https://www.canberrawaterproof.com.au';

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

function addFaqSchema(html, path, core, symptom) {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${origin}${path}#service-faq`,
    mainEntity: [
      { '@type': 'Question', name: `Who can assess ${symptom} in Canberra?`, acceptedAnswer: { '@type': 'Answer', text: `MEL ONE takes Canberra service requests for ${core}. Share the affected area, when the issue occurs and clear photos where safe; the next step is based on the accessible condition and agreed scope.` } },
      { '@type': 'Question', name: `What information helps when booking ${core}?`, acceptedAnswer: { '@type': 'Answer', text: 'Include the Canberra suburb, property type, affected area, timing, visible changes and relevant previous repair information. This helps define whether waterproofing, sealing, drainage, plumbing or another trade pathway should be considered.' } }
    ]
  };
  const markup = `<script type="application/ld+json">${JSON.stringify(faq)}</script>`;
  // Rerunning this script must be idempotent: retain exactly one generated FAQ block.
  html = html.replace(/<script type="application\/ld\+json">(?=[^<]*#service-faq)[\s\S]*?<\/script>/g, '');
  return html.replace('</script><script async src="https://www.googletagmanager.com', `</script>${markup}<script async src="https://www.googletagmanager.com`);
}

function placeClosingSectionAtArticleEnd(html, section) {
  // Service pages contain related-service <article> cards. The closing content must
  // sit after the final article body, never inside one of those narrow cards.
  html = html.replace(/<section class="intent-summary">[\s\S]*?<\/section>/g, '');
  const closingArticle = html.lastIndexOf('</article>');
  if (closingArticle === -1) throw new Error('Expected a page-level article closing tag');
  const before = html.slice(0, closingArticle).replace(/(?:[ \t\r]*\n)+[ \t\r]*$/, '\n');
  return `${before}${section}${html.slice(closingArticle)}`;
}

for (const [slug, detail] of Object.entries(services)) {
  const path = `/services/${slug}/`;
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
  const close = `<section class="intent-summary"><h2>How can Canberra property owners arrange ${detail.core} for ${detail.symptom}?</h2><p>MEL ONE provides ${detail.core} for Canberra homes and properties where the visible issue needs a clear repair pathway. Share the suburb, affected area, timing and safe photos so we can identify whether the next step is ${detail.alternative}.</p><p>For Canberra searches such as “${detail.core} near me”, “${detail.core} Canberra” or “who can assess ${detail.symptom}?”, call <a href="tel:+61482422607">0482 422 607</a> or use the <a href="/contact/">waterproofing service form</a>. The final service scope is confirmed for the property before work proceeds.</p></section>`;
  html = placeClosingSectionAtArticleEnd(html, close);
  html = addFaqSchema(html, path, detail.core, detail.symptom);
  writeFileSync(file, html);
}

for (const [slug, detail] of Object.entries(guides)) {
  const path = `/guides/${slug}/`;
  const file = resolve(root, 'guides', slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  html = replaceHeading(html, 'What to look for', `What should you check before booking ${detail.core}?`);
  html = replaceHeading(html, 'Why the scope matters', `Why does the repair scope matter for ${detail.symptom}?`);
  html = replaceHeading(html, 'Prepare for a useful conversation', `How should you prepare for a ${detail.core} service request?`);
  html = replaceHeading(html, 'What you can observe', `What can you safely observe about ${detail.symptom}?`);
  html = replaceHeading(html, 'How repair scopes differ', `How do repair options differ for ${detail.symptom}?`);
  html = replaceHeading(html, 'What to record before you request service', `What should you record before requesting ${detail.core}?`);
  html = replaceHeading(html, 'Next step with MEL ONE', `How can you arrange the right ${detail.core} service in Canberra?`);
  const close = `<section class="intent-summary"><h2>What is the next step for ${detail.symptom} in Canberra?</h2><p>This guide explains the questions that help separate ${detail.core} from other possible repair paths. The next practical step is to record the affected area, timing and visible signs, then arrange a property-specific assessment.</p><p>If you are searching for “${detail.core} Canberra”, “${detail.core} near me” or “who can inspect ${detail.symptom}?”, call <a href="tel:+61482422607">0482 422 607</a> or use the <a href="/contact/">MEL ONE service form</a>. The suitable scope is confirmed after the relevant property details are reviewed.</p></section>`;
  html = placeClosingSectionAtArticleEnd(html, close);
  html = addFaqSchema(html, path, detail.core, detail.symptom);
  writeFileSync(file, html);
}

