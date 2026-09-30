import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.canberrawaterproof.com.au';
const LAST_MODIFIED = '2026-09-28';
const GA4_TAG = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-5VJJKNSHLD"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-5VJJKNSHLD');</script>`;

export const SERVICES = [
  { slug: 'leaking-shower-repairs', name: 'Leaking shower repairs' },
  { slug: 'bathroom-waterproofing', name: 'Bathroom waterproofing' },
  { slug: 'shower-resealing-regrouting', name: 'Shower resealing and regrouting' },
  { slug: 'balcony-waterproofing', name: 'Balcony waterproofing' },
  { slug: 'kitchen-sealing', name: 'Kitchen sealing' },
  { slug: 'external-waterproofing', name: 'External waterproofing' },
];

const LOCAL_CONTEXTS = {
  belconnen: 'This Belconnen hub gives nearby owners and managers one place to compare bathroom, shower, balcony, roof, kitchen and external-water-entry enquiry pathways before they contact MEL ONE.',
  gungahlin: 'This Gungahlin hub is designed for people who need to describe a water-entry concern clearly, then move from visible symptoms to a sensible repair discussion without assuming the cause.',
  'inner-north-city': 'This Inner North and City hub helps apartment, townhouse, office and home enquiries start with the affected area, the timing of moisture and the information needed for a practical next conversation.',
  'inner-south': 'This Inner South hub groups common wet-area and external-water-entry enquiry paths so a property owner or manager can identify the most relevant MEL ONE service information before requesting help.',
  'woden-valley': 'This Woden Valley hub is for enquiries where the visible issue may be in a shower, bathroom, kitchen, balcony, roof or wall junction and the property needs a careful, evidence-led starting point.',
  'weston-creek-molonglo': 'This Weston Creek and Molonglo hub explains how to prepare a waterproofing enquiry when moisture may be linked to a wet area, an outdoor surface, a drainage path or an external junction.',
  tuggeranong: 'This Tuggeranong hub helps residents and property managers record what they have observed before a repair path is discussed, especially where a water issue changes after rain or regular use.',
  'east-canberra': 'This East Canberra hub provides a clear route from a reported moisture symptom to the relevant MEL ONE service information, while keeping diagnosis, scope and attendance subject to the actual enquiry.',
  'act-localities': 'This ACT Localities hub is a starting point for addresses outside the larger Canberra district groups, with local contact details and the same careful approach to describing a waterproofing concern.',
  aranda: 'For an Aranda property, note whether moisture is confined to the shower or bathroom, appears after rain near a roof or wall junction, or is visible around a kitchen, balcony or external corner.',
  bruce: 'For a Bruce waterproofing enquiry, a useful first record separates what happens during normal wet-area use from what appears after weather, because those timelines can lead to different next questions.',
  amaroo: 'For an Amaroo home or managed property, include the affected room, the first visible sign and whether the issue changes after showering, rainfall, cleaning or plumbing use.',
  casey: 'For a Casey property, MEL ONE can use clear photos and timing details to start a focused discussion about bathroom, shower, kitchen, balcony, roof or external-water-entry concerns.',
  'canberra-city': 'For Canberra City enquiries, identify the exact room, unit or external area and any building-management context that may affect access, safe photography or the timing of a repair discussion.',
  braddon: 'For a Braddon property, note whether the concern is inside a wet area, at a balcony or wall junction, below a roofline or near a kitchen so the enquiry can be directed to the most relevant information.',
  kingston: 'For a Kingston waterproofing concern, it helps to record the location of water, whether it is recurring and which conditions make it more noticeable before a property-specific repair path is considered.',
  griffith: 'For a Griffith property near the Manuka precinct, a helpful enquiry explains the affected surface and the sequence of events, rather than assuming that visible grout, sealant or staining identifies the cause.',
  woden: 'For a Woden enquiry, include whether the area is a shower, bathroom, kitchen, balcony, roof or exterior junction and whether the symptom is active, historic or only appears in particular conditions.',
  phillip: 'For a Phillip property, photos from a safe distance and a short timeline can help distinguish an initial moisture report from a confirmed cause, which requires the right level of investigation.',
  weston: 'For a Weston home or managed property, MEL ONE can begin with the information you can safely provide about the affected area, moisture pattern, recent work and access requirements.',
  coombs: 'For a Coombs waterproofing enquiry, describe the precise room or outdoor surface and when it becomes damp, rather than relying on a single visible finish or stain to explain the issue.',
  kambah: 'For a Kambah property, the most useful initial detail is often the event that precedes the symptom: shower use, rain, cleaning, plumbing use or another repeatable condition.',
  calwell: 'For a Calwell waterproofing concern, share the location, timing and any safe images of the affected area so MEL ONE can discuss the relevant service pathway before any repair scope is agreed.',
  fyshwick: 'For a Fyshwick property, record whether the concern relates to a wet area, roof, balcony, kitchen, exterior surface or wall corner and include any site-access considerations in the enquiry.',
};

function page(slug, name, district, kind, relatedLocalities) {
  const article = /^[aeiou]/i.test(name) ? 'an' : 'a';
  return {
    slug,
    name,
    district,
    kind,
    route: `/waterproofing/${slug}/`,
    relatedLocalities,
    localContext: LOCAL_CONTEXTS[slug],
    faq: [
      {
        question: `What waterproofing enquiries can MEL ONE help organise in ${name}?`,
        answer: `MEL ONE can discuss bathroom, shower, kitchen, balcony, roof and external water-entry enquiries for properties in ${name}. The right repair path depends on the site and the cause of the water entry.`,
      },
      {
        question: `How quickly can MEL ONE respond to ${article} ${name} waterproofing enquiry?`,
        answer: 'MEL ONE provides fast 30-minute enquiry responses and clear next steps for Canberra waterproofing concerns. Include your suburb, affected area and photos so our team can prepare the most helpful response.',
      },
      {
        question: `What should I send with ${article} ${name} waterproofing repair enquiry?`,
        answer: 'Please include the property suburb, affected room or area, when the issue occurs, clear photos or video if safe, and any recent plumbing or building work. This helps MEL ONE understand the enquiry before discussing next steps.',
      },
    ],
  };
}

export const LOCALITY_PAGES = [
  page('belconnen', 'Belconnen', 'Belconnen', 'district', ['Aranda', 'Bruce', 'Cook']),
  page('gungahlin', 'Gungahlin', 'Gungahlin', 'district', ['Amaroo', 'Casey', 'Franklin']),
  page('inner-north-city', 'Inner North & City', 'Inner North & City', 'district', ['Canberra City', 'Braddon', 'Ainslie']),
  page('inner-south', 'Inner South', 'Inner South', 'district', ['Kingston', 'Griffith', 'Barton']),
  page('woden-valley', 'Woden Valley', 'Woden Valley', 'district', ['Woden', 'Phillip', 'Curtin']),
  page('weston-creek-molonglo', 'Weston Creek & Molonglo', 'Weston Creek & Molonglo', 'district', ['Weston', 'Coombs', 'Denman Prospect']),
  page('tuggeranong', 'Tuggeranong', 'Tuggeranong', 'district', ['Kambah', 'Calwell', 'Greenway']),
  page('east-canberra', 'East Canberra', 'East Canberra & ACT localities', 'district', ['Fyshwick', 'Pialligo', 'Symonston']),
  page('act-localities', 'ACT Localities', 'Other ACT localities', 'district', ['Duntroon', 'Waramanga', 'Royalla']),
  page('aranda', 'Aranda', 'Belconnen', 'locality', ['Belconnen', 'Bruce', 'Cook']),
  page('bruce', 'Bruce', 'Belconnen', 'locality', ['Aranda', 'Belconnen', 'Macquarie']),
  page('amaroo', 'Amaroo', 'Gungahlin', 'locality', ['Gungahlin', 'Casey', 'Ngunnawal']),
  page('casey', 'Casey', 'Gungahlin', 'locality', ['Amaroo', 'Gungahlin', 'Nicholls']),
  page('canberra-city', 'Canberra City', 'Inner North & City', 'locality', ['Braddon', 'Acton', 'Inner North & City']),
  page('braddon', 'Braddon', 'Inner North & City', 'locality', ['Canberra City', 'Ainslie', 'Inner North & City']),
  page('kingston', 'Kingston', 'Inner South', 'locality', ['Griffith', 'Barton', 'Inner South']),
  page('griffith', 'Griffith', 'Inner South', 'locality', ['Kingston', 'Red Hill', 'Inner South']),
  page('woden', 'Woden', 'Woden Valley', 'locality', ['Phillip', 'Curtin', 'Woden Valley']),
  page('phillip', 'Phillip', 'Woden Valley', 'locality', ['Woden', 'Mawson', 'Woden Valley']),
  page('weston', 'Weston', 'Weston Creek & Molonglo', 'locality', ['Coombs', 'Chapman', 'Weston Creek & Molonglo']),
  page('coombs', 'Coombs', 'Weston Creek & Molonglo', 'locality', ['Weston', 'Denman Prospect', 'Weston Creek & Molonglo']),
  page('kambah', 'Kambah', 'Tuggeranong', 'locality', ['Tuggeranong', 'Greenway', 'Calwell']),
  page('calwell', 'Calwell', 'Tuggeranong', 'locality', ['Kambah', 'Tuggeranong', 'Theodore']),
  page('fyshwick', 'Fyshwick', 'East Canberra & ACT localities', 'locality', ['East Canberra', 'Pialligo', 'Symonston']),
];

export function validatePages(pages) {
  if (!Array.isArray(pages) || pages.length !== 24) {
    throw new Error('expected exactly 24 locality page records');
  }

  const fields = ['slug', 'name', 'district', 'kind', 'route', 'relatedLocalities', 'faq'];
  for (const item of pages) {
    for (const field of fields) {
      if (!(field in item)) throw new Error(`missing ${field} for locality record`);
    }
    if (!/^[a-z0-9-]+$/.test(item.slug)) throw new Error(`invalid slug: ${item.slug}`);
    if (item.route !== `/waterproofing/${item.slug}/`) throw new Error(`invalid route: ${item.route}`);
    if (!item.localContext) throw new Error(`missing local context: ${item.slug}`);
  }

  const slugs = pages.map((item) => item.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('duplicate locality slug');

  const routes = pages.map((item) => item.route);
  if (new Set(routes).size !== routes.length) throw new Error('duplicate locality route');

  return pages;
}

export function buildManifest(pages = LOCALITY_PAGES) {
  return { siteUrl: SITE_URL, lastModified: LAST_MODIFIED, pages: validatePages(pages) };
}

export function buildFeed(pages = LOCALITY_PAGES) {
  return {
    name: 'MEL ONE Canberra locality waterproofing services',
    canonicalDirectory: `${SITE_URL}/service-areas/`,
    lastModified: LAST_MODIFIED,
    services: SERVICES.map(({ slug, name }) => ({ name, url: `${SITE_URL}/services/${slug}/` })),
    localities: validatePages(pages).map(({ name, district, kind, route }) => ({
      locality: name,
      district,
      type: kind,
      canonicalUrl: `${SITE_URL}${route}`,
      services: SERVICES.map(({ slug }) => `${SITE_URL}/services/${slug}/`),
      lastModified: LAST_MODIFIED,
    })),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function serviceCards() {
  return SERVICES.map(({ slug, name }) => `<article class="card"><h3>${escapeHtml(name)}</h3><p>Discuss the symptoms, affected area and safe photos with MEL ONE before agreeing a repair path.</p><a href="/services/${slug}/">Explore ${escapeHtml(name)}</a></article>`).join('');
}

function relatedLinks(page, pageMap) {
  return page.relatedLocalities.map((name) => {
    const related = [...pageMap.values()].find((item) => item.name === name);
    const href = related ? related.route : `/contact/?suburb=${encodeURIComponent(name)}`;
    return `<a class="locality-button" href="${href}">${escapeHtml(name)}</a>`;
  }).join('');
}

function visibleFaqs(page) {
  return page.faq.map(({ question, answer }) => `<details data-faq-question="${escapeHtml(question)}"><summary>${escapeHtml(question)}</summary><p data-faq-answer>${escapeHtml(answer)}</p></details>`).join('');
}

function contactForm(page) {
  return `<form class="form" action="/api/contact" method="post" data-enquiry-form><h2>Request waterproofing help in ${escapeHtml(page.name)}.</h2><p>Tell us what you have noticed. A clear description helps MEL ONE discuss the next practical step.</p><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label>Name<input name="name" required></label><label for="suburb">Suburb<input id="suburb" name="suburb" value="${escapeHtml(page.name)}" required></label><div class="two"><label>Phone<input name="phone" type="tel"></label><label>Email for your confirmation<input name="email" type="email" autocomplete="email" required></label></div><label>Affected area<select name="area" required><option>Shower</option><option>Bathroom</option><option>Balcony</option><option>Kitchen</option><option>Laundry</option><option>External</option><option>Roof</option><option>Not sure</option></select></label><label>Tell us about the problem<textarea name="message" rows="6" required></textarea></label><button class="button primary" type="submit">Send enquiry</button><p class="form-status" data-form-status role="status" aria-live="polite"></p><p><small>Your enquiry is sent securely to MEL ONE. We use your details only to respond to this request; do not include financial, identity or access information.</small></p></form>`;
}

function pageCopy(page, position) {
  const localPhrase = page.kind === 'district' ? `the ${page.name} area` : page.name;
  const propertyPhrase = position % 2 === 0 ? 'homes, apartments and commercial premises' : 'residential properties and managed buildings';
  const entryPhrase = position % 3 === 0
    ? 'after rain, shower use or routine cleaning'
    : position % 3 === 1
      ? 'around a wet area, external junction or drainage path'
      : 'when water appears in a room, ceiling, wall or outdoor surface';
  return {
    localPhrase,
    intro: `MEL ONE provides waterproofing and leak-repair support in ${localPhrase}, ACT. We help owners, tenants, property managers and builders move from visible symptoms to a clear repair discussion. Bathroom waterproofing, leaking showers, roof-water entry, kitchen moisture, balcony leaks and external wall-corner issues all receive a focused, property-specific approach.`,
    detail: `For ${propertyPhrase} in ${localPhrase}, note what you can see and when it happens. Staining, loose finishes, recurring mould, damp carpet, bubbling paint, cracked sealant or water at an adjoining surface give our experienced team a strong starting point for a focused assessment and practical repair recommendation.`,
    symptoms: `A concern may become visible ${entryPhrase}. If water is actively entering a property, protect people and belongings first, follow any safe building procedures and arrange urgent assistance where needed. Do not remove tiles, membranes or fixtures simply to investigate a cause unless a qualified professional has advised that approach.`,
  };
}

function schemasFor(page) {
  const url = `${SITE_URL}${page.route}`;
  const faq = {
    '@type': 'FAQPage',
    mainEntity: page.faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: 'MEL ONE',
        url: `${SITE_URL}/`,
        telephone: '0482 422 607',
        email: 'riley@melonemaintenance.com.au',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '121 Marcus Clarke St',
          addressLocality: 'Canberra',
          addressRegion: 'ACT',
          postalCode: '2600',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `Waterproofing Repairs in ${page.name}, ACT`,
        description: `Waterproofing and leak-repair enquiry information for ${page.name}, ACT.`,
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Service',
        name: `Waterproofing repair enquiries in ${page.name}`,
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'AdministrativeArea', name: `${page.name}, ACT` },
        serviceType: 'Waterproofing and leak repair enquiry',
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${SITE_URL}/service-areas/` },
          { '@type': 'ListItem', position: 3, name: page.name, item: url },
        ],
      },
      faq,
    ],
  };
}

function renderPage(page, pageMap, position) {
  const copy = pageCopy(page, position);
  const url = `${SITE_URL}${page.route}`;
  const title = `Waterproofing Repairs in ${page.name}, ACT | MEL ONE`;
  const description = `Waterproofing and leak-repair enquiry information for ${page.name}, ACT. Discuss bathrooms, showers, balconies, kitchens, roofs and external water entry with MEL ONE.`;
  const article = /^[aeiou]/i.test(page.name) ? 'an' : 'a';
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png"><link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><link rel="stylesheet" href="/assets/site.css"><script type="application/ld+json">${JSON.stringify(schemasFor(page))}</script></head><body><a class="skip" href="#main">Skip to content</a><div class="top"><div class="wrap"><span>Canberra waterproofing enquiries</span><span>0482 422 607 · riley@melonemaintenance.com.au</span></div></div><header class="header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="MEL ONE home"><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="58" height="58"><span class="brand-name">MEL ONE</span></a><nav class="nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/service-areas/" aria-current="page">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a class="button primary" href="#enquiry">Request a Quote</a></nav></div></header><main id="main"><section class="page-intro"><div class="wrap"><p class="eyebrow">${escapeHtml(page.district)} service area</p><h1>Waterproofing Repairs in ${escapeHtml(page.name)}, ACT</h1><p class="lede">Practical local information for bathroom, shower, balcony, kitchen, roof and external water-entry enquiries.</p><p class="crumbs"><a href="/">Home</a> / <a href="/service-areas/">Service areas</a> / ${escapeHtml(page.name)}</p></div></section><article class="section wrap article"><p>${escapeHtml(copy.intro)}</p><p data-local-context>${escapeHtml(page.localContext)}</p><p>${escapeHtml(copy.detail)}</p><div class="callout"><strong>Clear first step:</strong> Send the suburb, affected area, timing and safe photos where available. Our team uses these details to prepare a focused assessment and clear next steps.</div><h2>Waterproofing services in ${escapeHtml(page.name)}</h2><p>These service pages explain common enquiry pathways and help MEL ONE prepare a clear, property-specific repair recommendation.</p><div class="grid">${serviceCards()}</div><h2>Common water-entry signs in ${escapeHtml(page.name)}</h2><p>${escapeHtml(copy.symptoms)}</p><ul><li>Discolouration, bubbling paint or a musty smell near a wet area.</li><li>Water that appears outside a shower, below a balcony or at a ceiling after weather.</li><li>Damaged grout, sealant, tiles, flashings or external junctions that need assessment.</li><li>Recurring moisture near a kitchen, bathroom, laundry, roofline or wall corner.</li></ul><h2>How MEL ONE approaches ${article} ${escapeHtml(page.name)} enquiry</h2><p>MEL ONE has more than ten years in the waterproofing industry and a standardised repair team with experienced repair professionals. The team works methodically: understand the symptoms, ask about timing and recent work, review safe photos where available, and discuss an appropriate next step before agreeing a repair path.</p><p>MEL ONE has been trusted by more than ten thousand customers. Our experienced team provides fast 30-minute enquiry responses and clear next steps for Canberra waterproofing concerns.</p><h2>What to send with a waterproofing enquiry</h2><ol><li>Your ${escapeHtml(page.name)} property suburb and the room or external area affected.</li><li>When the issue appears: after showering, rain, cleaning, plumbing use or at another time.</li><li>Clear photos or video from a safe position, plus any recent plumbing, renovation or maintenance work.</li><li>Your preferred contact details and a suitable time to discuss the enquiry.</li></ol><section class="about-faq"><h2>${escapeHtml(page.name)} waterproofing FAQs</h2>${visibleFaqs(page)}</section><h2>Related Canberra service areas</h2><p>Use a nearby information page where it better matches the property location, or contact MEL ONE with the exact suburb.</p><div class="locality-grid">${relatedLinks(page, pageMap)}</div></article><section class="section wrap two" id="enquiry"><div class="contact-details"><p class="eyebrow">Contact MEL ONE</p><h2>Discuss a ${escapeHtml(page.name)} waterproofing concern.</h2><p>121 Marcus Clarke St, Canberra, ACT 2600</p><p><a href="tel:+61482422607">0482 422 607</a><br><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a></p><p>For urgent matters, call directly. For non-urgent enquiries, include photos and timing details where safe to do so.</p></div>${contactForm(page)}</section></main><footer class="footer"><div class="wrap footer-grid"><div><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="70" height="56"><p>Waterproofing and leak repair enquiries across Canberra.</p><p>121 Marcus Clarke St, Canberra, ACT 2600</p></div><div><p class="eyebrow">Explore</p><a href="/services/">Services</a><a href="/service-areas/">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></div><div><p class="eyebrow">Contact</p><a href="tel:+61482422607">0482 422 607</a><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a><a href="/privacy-policy/">Privacy Policy</a></div></div></footer><nav class="mobile" aria-label="Quick contact"><a href="tel:+61482422607">Call</a><a href="#enquiry">Request a Quote</a></nav><script src="/assets/enquiry-form.js" defer></script></body></html>`;
}

function writeFeed() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const target = resolve(root, 'data', 'local-waterproofing-services.json');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(buildFeed(), null, 2)}\n`);
}

function writePages() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const pageMap = new Map(LOCALITY_PAGES.map((item) => [item.slug, item]));
  for (const [position, page] of LOCALITY_PAGES.entries()) {
    const target = resolve(root, page.route.slice(1), 'index.html');
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, renderPage(page, pageMap, position));
  }
}

function addAnalyticsToLocalityPages() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  for (const page of LOCALITY_PAGES) {
    const target = resolve(root, page.route.slice(1), 'index.html');
    const html = readFileSync(target, 'utf8');
    const withAnalytics = html.includes("gtag('config','G-5VJJKNSHLD')")
      ? html
      : html.replace('</head>', `${GA4_TAG}</head>`);
    writeFileSync(target, withAnalytics);
  }
}

function writeDiscoveryResources() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const pageMap = new Map(LOCALITY_PAGES.map((item) => [item.slug, item]));
  const selectedByName = new Map(LOCALITY_PAGES.map((item) => [item.name, item.route]));
  const directoryPath = resolve(root, 'service-areas', 'index.html');
  let directory = readFileSync(directoryPath, 'utf8');

  for (const [name, route] of selectedByName) {
    const contactHref = `/contact/?suburb=${encodeURIComponent(name)}`;
    directory = directory.replace(
      `<a class="locality-button" href="${contactHref}">${name}</a>`,
      `<a class="locality-button" href="${route}">${name}</a>`,
    );
  }

  const districtHeadings = [
    ['Belconnen', pageMap.get('belconnen').route],
    ['Gungahlin', pageMap.get('gungahlin').route],
    ['Inner North & City', pageMap.get('inner-north-city').route],
    ['Inner South', pageMap.get('inner-south').route],
    ['Woden Valley', pageMap.get('woden-valley').route],
    ['Weston Creek & Molonglo', pageMap.get('weston-creek-molonglo').route],
    ['Tuggeranong', pageMap.get('tuggeranong').route],
    ['East Canberra & ACT localities', pageMap.get('east-canberra').route],
    ['Other ACT localities', pageMap.get('act-localities').route],
  ];
  for (const [heading, route] of districtHeadings) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    directory = directory.replace(
      new RegExp(`<h2>(?:<a href="/waterproofing/[a-z0-9-]+/">)?${escapedHeading}(?:<\\/a>)?<\\/h2>`),
      `<h2><a href="${route}">${heading}</a></h2>`,
    );
  }
  directory = directory.replace(
    '<p class="area-note">Choose a locality to open Contact with the suburb already entered.</p>',
    '<p class="area-note">Open a locality guide for detailed waterproofing information, or choose any other locality to open Contact with the suburb already entered.</p>',
  );
  writeFileSync(directoryPath, directory);

  const sitemapPath = resolve(root, 'sitemap.xml');
  let sitemap = readFileSync(sitemapPath, 'utf8');
  const routePattern = new RegExp(`<url><loc>${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/waterproofing\\/[a-z0-9-]+\\/<\\/loc><\\/url>`, 'g');
  sitemap = sitemap.replace(routePattern, '');
  const routeEntries = LOCALITY_PAGES.map((page) => `<url><loc>${SITE_URL}${page.route}</loc></url>`).join('');
  sitemap = sitemap.replace('</urlset>', `${routeEntries}</urlset>`);
  writeFileSync(sitemapPath, sitemap);

  const llmsPath = resolve(root, 'llms.txt');
  let llms = readFileSync(llmsPath, 'utf8');
  llms = llms.replace(/\n<!-- LOCAL_WATERPROOFING_INDEX:START -->[\s\S]*?<!-- LOCAL_WATERPROOFING_INDEX:END -->\n?/g, '\n');
  const localityIndex = LOCALITY_PAGES.map((page) => `- ${SITE_URL}${page.route} — ${page.name} (${page.kind})`).join('\n');
  llms = `${llms.trimEnd()}\n\n<!-- LOCAL_WATERPROOFING_INDEX:START -->\n## Local waterproofing information\n- Directory: ${SITE_URL}/service-areas/\n- Public locality data: ${SITE_URL}/data/local-waterproofing-services.json\n- These pages provide local waterproofing information, practical assessment guidance and direct ways to request a quote from MEL ONE.\n${localityIndex}\n<!-- LOCAL_WATERPROOFING_INDEX:END -->\n`;
  writeFileSync(llmsPath, llms);
}

function verifyBuild() {
  validatePages(LOCALITY_PAGES);
  writeFeed();
  writePages();
  addAnalyticsToLocalityPages();
  writeDiscoveryResources();
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  for (const page of LOCALITY_PAGES) {
    const html = readFileSync(resolve(root, page.route.slice(1), 'index.html'), 'utf8');
    if (!html.includes(`name="suburb" value="${escapeHtml(page.name)}"`)) {
      throw new Error(`generated suburb field is missing for ${page.slug}`);
    }
    if (!html.includes('fast 30-minute enquiry responses')) {
      throw new Error(`fast-response statement is missing for ${page.slug}`);
    }
  }
  return { verified: true, pages: LOCALITY_PAGES.length };
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

const [command, value] = process.argv.slice(2);
try {
  if (command === '--validate-json') {
    validatePages(JSON.parse(value));
  } else if (command === '--check') {
    process.stdout.write(`${JSON.stringify(buildManifest())}\n`);
  } else if (command === '--verify') {
    process.stdout.write(`${JSON.stringify(verifyBuild())}\n`);
  } else if (!command) {
    validatePages(LOCALITY_PAGES);
    writeFeed();
    writePages();
    addAnalyticsToLocalityPages();
    writeDiscoveryResources();
  } else {
    throw new Error(`unknown command: ${command}`);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
