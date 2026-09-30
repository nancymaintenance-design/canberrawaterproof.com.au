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
  belconnen: 'Belconnen properties often need a practical wet-area repair plan for bathrooms, ensuites and shower floors, with clear attention to the affected surface and surrounding finishes.',
  gungahlin: 'Gungahlin homeowners and managers can book focused bathroom and shower waterproofing services when water appears during normal wet-area use or after cleaning.',
  'inner-north-city': 'Inner North and City apartments, townhouses, offices and homes benefit from clearly defined waterproofing services for wet areas, balconies and external junctions.',
  'inner-south': 'Inner South properties commonly need bathroom or balcony waterproofing repairs that account for the exact room, outdoor surface and access conditions.',
  'woden-valley': 'Woden Valley homes and managed buildings can arrange wet-area waterproofing, shower repair and kitchen sealing services with a clear description of the affected area.',
  'weston-creek-molonglo': 'Weston Creek and Molonglo properties can book external waterproofing and balcony leak-repair services where moisture is linked to an outdoor surface, drainage path or wall junction.',
  tuggeranong: 'Tuggeranong residents and property managers can request leaking shower and bathroom waterproofing repairs when water changes after regular use or rain.',
  'east-canberra': 'East Canberra properties can arrange external waterproofing, water-ingress repair and roof-water-entry services with practical details about the affected building area.',
  'act-localities': 'ACT Localities outside the larger district groups can access the same focused waterproofing repair services for bathrooms, showers, balconies, kitchens and external areas.',
  aranda: 'Aranda homeowners can arrange bathroom waterproofing and leaking shower repairs for ensuites, shower bases, tiled wet areas and nearby wall or floor junctions.',
  bruce: 'Bruce properties can book shower waterproofing and leaking shower repair services when water appears during normal shower use, at a shower base or around tiled junctions.',
  amaroo: 'Amaroo homes and managed properties can access bathroom waterproofing and shower repair services for wet areas affected by showering, cleaning or plumbing use.',
  casey: 'Casey homeowners can arrange shower resealing, regrouting and bathroom silicone replacement services for tired joints, damaged sealant and tiled shower finishes.',
  'canberra-city': 'Canberra City apartments and commercial premises can arrange waterproofing services for bathrooms, showers, balconies and wet areas with building-management access considered.',
  braddon: 'Braddon apartments and homes can book balcony waterproofing, leaking balcony repairs and external joint sealing for exposed surfaces and wall junctions.',
  kingston: 'Kingston properties can access balcony waterproofing and bathroom waterproofing services for recurring moisture, tiled outdoor areas and wet-room repairs.',
  griffith: 'Griffith homes can arrange leaking shower repairs, shower leak detection and shower resealing services for moisture around tiled shower walls, bases and screens.',
  woden: 'Woden properties can book bathroom waterproofing, bathroom rewaterproofing and waterproofing-and-tiling services for wet areas that need a clear repair scope.',
  phillip: 'Phillip homes and managed buildings can arrange kitchen sealing, kitchen sink leak repair and laundry waterproofing services for water around fixtures, joins and floors.',
  weston: 'Weston homeowners can access external wall waterproofing, window leak repair and balcony waterproofing services for moisture at building edges and outdoor junctions.',
  coombs: 'Coombs homes and apartments can book balcony waterproofing, balcony membrane repair and external waterproofing services for outdoor tiled areas and wall-floor junctions.',
  kambah: 'Kambah properties can arrange leaking shower repairs, shower waterproofing and bathroom waterproofing services when moisture follows shower use or wet-area cleaning.',
  calwell: 'Calwell homes can book laundry floor waterproofing, kitchen sealing and bathroom waterproofing services for water around fixtures, floors and adjacent surfaces.',
  fyshwick: 'Fyshwick properties can access external waterproofing, water-ingress repair and roof leak repair services for exterior surfaces, rooflines and wall corners.',
};

const LOCAL_SERVICE_FOCUSES = {
  belconnen: { primary: 'Bathroom Waterproofing', supporting: ['wet area waterproofing', 'waterproofing and tiling'], summary: 'Bathroom waterproofing services for family bathrooms, ensuites and shower floors.' },
  gungahlin: { primary: 'Shower Waterproofing', supporting: ['bathroom waterproofing', 'shower repairs'], summary: 'Shower and bathroom waterproofing services for homes and managed properties.' },
  'inner-north-city': { primary: 'Waterproofing Services', supporting: ['waterproofing contractors', 'wet area waterproofing'], summary: 'Waterproofing services for apartments, townhouses, offices and homes.' },
  'inner-south': { primary: 'Balcony and Bathroom Waterproofing', supporting: ['balcony waterproofing', 'bathroom waterproofing'], summary: 'Waterproofing repairs for wet areas, balconies and external junctions.' },
  'woden-valley': { primary: 'Bathroom Waterproofing', supporting: ['bathroom rewaterproofing', 'waterproofing and tiling'], summary: 'Bathroom waterproofing and rewaterproofing services for Woden Valley properties.' },
  'weston-creek-molonglo': { primary: 'External Waterproofing', supporting: ['balcony waterproofing', 'water ingress repairs'], summary: 'External waterproofing and balcony leak-repair services for outdoor building surfaces.' },
  tuggeranong: { primary: 'Leaking Shower Repairs', supporting: ['shower waterproofing', 'bathroom waterproofing'], summary: 'Leaking shower repair and bathroom waterproofing services for Tuggeranong properties.' },
  'east-canberra': { primary: 'External Waterproofing', supporting: ['water ingress repairs', 'roof leak repairs'], summary: 'External waterproofing and water-ingress repair services for East Canberra properties.' },
  'act-localities': { primary: 'Waterproofing Services', supporting: ['local waterproofer', 'remedial waterproofing'], summary: 'Local waterproofing repair services for ACT properties outside the main district hubs.' },
  aranda: { primary: 'Bathroom Waterproofing', supporting: ['leaking shower repairs', 'wet area waterproofing'], summary: 'Bathroom waterproofing and leaking shower repair services for Aranda homes.' },
  bruce: { primary: 'Shower Waterproofing', supporting: ['leaking shower repairs', 'shower base leak repair'], summary: 'Shower waterproofing and leaking shower repair services for Bruce properties.' },
  amaroo: { primary: 'Bathroom Waterproofing', supporting: ['shower repairs', 'ensuite waterproofing'], summary: 'Bathroom, ensuite and shower waterproofing services for Amaroo homes.' },
  casey: { primary: 'Shower Resealing and Regrouting', supporting: ['bathroom silicone replacement', 'shower screen resealing'], summary: 'Shower resealing, regrouting and silicone replacement services for Casey properties.' },
  'canberra-city': { primary: 'Waterproofing Services', supporting: ['waterproofing contractors', 'bathroom waterproofing'], summary: 'Waterproofing services for Canberra City apartments, commercial premises and homes.' },
  braddon: { primary: 'Balcony Waterproofing', supporting: ['leaking balcony repairs', 'external joint sealing'], summary: 'Balcony waterproofing and leaking balcony repair services for Braddon properties.' },
  kingston: { primary: 'Balcony Waterproofing', supporting: ['bathroom waterproofing', 'balcony membrane replacement'], summary: 'Balcony and bathroom waterproofing services for Kingston homes and apartments.' },
  griffith: { primary: 'Leaking Shower Repairs', supporting: ['shower leak detection', 'shower resealing'], summary: 'Leaking shower repair, detection and resealing services for Griffith properties.' },
  woden: { primary: 'Bathroom Waterproofing', supporting: ['bathroom rewaterproofing', 'waterproofing and tiling'], summary: 'Bathroom waterproofing, rewaterproofing and tiling support for Woden properties.' },
  phillip: { primary: 'Kitchen and Laundry Waterproofing', supporting: ['kitchen sink leak repair', 'laundry floor waterproofing'], summary: 'Kitchen sealing and laundry waterproofing services for Phillip homes and managed buildings.' },
  weston: { primary: 'External Wall Waterproofing', supporting: ['window leak repairs', 'balcony waterproofing'], summary: 'External wall waterproofing and window leak-repair services for Weston properties.' },
  coombs: { primary: 'Balcony Waterproofing', supporting: ['balcony membrane replacement', 'external waterproofing'], summary: 'Balcony waterproofing and external membrane repair services for Coombs properties.' },
  kambah: { primary: 'Leaking Shower Repairs', supporting: ['shower waterproofing', 'bathroom waterproofing'], summary: 'Leaking shower repair and bathroom waterproofing services for Kambah homes.' },
  calwell: { primary: 'Laundry and Kitchen Waterproofing', supporting: ['laundry floor waterproofing', 'kitchen sealing'], summary: 'Laundry floor waterproofing and kitchen sealing services for Calwell properties.' },
  fyshwick: { primary: 'External Waterproofing', supporting: ['water ingress repairs', 'roof leak repairs'], summary: 'External waterproofing, water-ingress and roof leak-repair services for Fyshwick properties.' },
};

function focusServiceLabel(focus) {
  return /services$/i.test(focus.primary) ? focus.primary : `${focus.primary} Services`;
}

function page(slug, name, district, kind, relatedLocalities) {
  const article = /^[aeiou]/i.test(name) ? 'an' : 'a';
  const focus = LOCAL_SERVICE_FOCUSES[slug];
  if (!focus) throw new Error(`missing service focus: ${slug}`);
  return {
    slug,
    name,
    district,
    kind,
    route: `/waterproofing/${slug}/`,
    relatedLocalities,
    localContext: LOCAL_CONTEXTS[slug],
    focus,
    faq: [
      {
        question: `What ${focusServiceLabel(focus).toLowerCase()} does MEL ONE provide in ${name}?`,
        answer: `MEL ONE provides ${focusServiceLabel(focus).toLowerCase()} in ${name}, including ${focus.supporting.join(' and ')} where those services suit the affected area and repair scope.`,
      },
      {
        question: `How quickly can MEL ONE respond to ${article} ${name} waterproofing service request?`,
        answer: 'MEL ONE provides fast 30-minute responses for Canberra waterproofing service requests. Include your suburb, affected area and safe photos so our team can prepare the most helpful service response.',
      },
      {
        question: `What information helps MEL ONE plan ${article} ${name} waterproofing service?`,
        answer: 'Please include the property suburb, affected room or area, when the issue occurs, safe photos or video, and any recent plumbing or building work. This helps MEL ONE prepare a focused waterproofing service plan.',
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

  const fields = ['slug', 'name', 'district', 'kind', 'route', 'relatedLocalities', 'faq', 'focus'];
  for (const item of pages) {
    for (const field of fields) {
      if (!(field in item)) throw new Error(`missing ${field} for locality record`);
    }
    if (!/^[a-z0-9-]+$/.test(item.slug)) throw new Error(`invalid slug: ${item.slug}`);
    if (item.route !== `/waterproofing/${item.slug}/`) throw new Error(`invalid route: ${item.route}`);
    if (!item.localContext) throw new Error(`missing local context: ${item.slug}`);
    if (!item.focus?.primary || !Array.isArray(item.focus.supporting) || item.focus.supporting.length < 2) {
      throw new Error(`missing keyword focus: ${item.slug}`);
    }
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

function serviceCards(page) {
  return SERVICES.map(({ slug, name }) => `<article class="card"><h3>${escapeHtml(name)}</h3><p>MEL ONE provides focused repair services for the affected area, with safe photos and property details used to plan the work.</p><a href="/services/${slug}/">Explore ${escapeHtml(name)}</a></article>`).join('');
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
  return `<form class="form" action="/api/contact" method="post" data-enquiry-form><h2>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}.</h2><p>Tell us about the affected area and the repair service you need. A clear description helps MEL ONE prepare the right service response.</p><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label>Name<input name="name" required></label><label for="suburb">Suburb<input id="suburb" name="suburb" value="${escapeHtml(page.name)}" required></label><div class="two"><label>Phone<input name="phone" type="tel"></label><label>Email for your service confirmation<input name="email" type="email" autocomplete="email" required></label></div><label>Affected area<select name="area" required><option>Shower</option><option>Bathroom</option><option>Balcony</option><option>Kitchen</option><option>Laundry</option><option>External</option><option>Roof</option><option>Other waterproofing service</option></select></label><label>Tell us about the repair needed<textarea name="message" rows="6" required></textarea></label><button class="button primary" type="submit">Request Service</button><p class="form-status" data-form-status role="status" aria-live="polite"></p><p><small>Your service request is sent securely to MEL ONE. We use your details only to respond to this request; do not include financial, identity or access information.</small></p></form>`;
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
    intro: `MEL ONE provides ${page.focus.primary.toLowerCase()} in ${localPhrase}, ACT. ${page.focus.summary} Our experienced repair team supports owners, tenants, property managers and builders with focused work for bathrooms, showers, balconies, kitchens, roofs and external water-entry areas.`,
    detail: `For ${propertyPhrase} in ${localPhrase}, MEL ONE can plan ${page.focus.primary.toLowerCase()} alongside ${page.focus.supporting.join(' and ')}. Staining, loose finishes, recurring mould, damp carpet, bubbling paint, cracked sealant or water at an adjoining surface give our experienced team useful details for a focused assessment and practical repair recommendation.`,
    symptoms: `Water-entry signs often appear ${entryPhrase}. If water is actively entering a property, protect people and belongings first, follow any safe building procedures and arrange urgent assistance where needed. Do not remove tiles, membranes or fixtures simply to investigate a cause unless a qualified professional has advised that approach.`,
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
        name: `${page.focus.primary} in ${page.name}, Canberra | MEL ONE`,
        description: `${page.focus.summary} MEL ONE provides ${page.focus.supporting.join(', ')} in ${page.name}, Canberra.`,
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Service',
        name: `${page.focus.primary} in ${page.name}`,
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'AdministrativeArea', name: `${page.name}, ACT` },
        serviceType: `${page.focus.primary}; ${page.focus.supporting.join('; ')}`,
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
  const title = `${page.focus.primary} in ${page.name}, Canberra | MEL ONE`;
  const description = `${page.focus.summary} MEL ONE also provides ${page.focus.supporting.join(', ')} in ${page.name}, Canberra ACT. Call 0482 422 607 to request service.`;
  const article = /^[aeiou]/i.test(page.name) ? 'an' : 'a';
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png"><link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><link rel="stylesheet" href="/assets/site.css"><script type="application/ld+json">${JSON.stringify(schemasFor(page))}</script></head><body><a class="skip" href="#main">Skip to content</a><div class="top"><div class="wrap"><span>Canberra waterproofing repair services</span><span>0482 422 607 · riley@melonemaintenance.com.au</span></div></div><header class="header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="MEL ONE home"><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="58" height="58"><span class="brand-name">MEL ONE</span></a><nav class="nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/service-areas/" aria-current="page">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a class="button primary" href="#enquiry">Request a Quote</a></nav></div></header><main id="main"><section class="page-intro"><div class="wrap"><p class="eyebrow">${escapeHtml(page.district)} service area</p><h1>${escapeHtml(page.focus.primary)} in ${escapeHtml(page.name)}, Canberra</h1><p class="lede">${escapeHtml(page.focus.summary)} Serving ${escapeHtml(page.name)}, Canberra ACT with practical repair services.</p><p class="crumbs"><a href="/">Home</a> / <a href="/service-areas/">Service areas</a> / ${escapeHtml(page.name)}</p></div></section><article class="section wrap article"><p>${escapeHtml(copy.intro)}</p><p data-local-context>${escapeHtml(page.localContext)}</p><p>${escapeHtml(copy.detail)}</p><div class="callout"><strong>Book a focused repair service:</strong> Send the suburb, affected area, timing and safe photos where available. Our team uses these details to prepare the right waterproofing service response.</div><h2>${escapeHtml(focusServiceLabel(page.focus))} in ${escapeHtml(page.name)}</h2><p>MEL ONE provides ${escapeHtml(page.focus.primary.toLowerCase())}, plus ${escapeHtml(page.focus.supporting.join(' and '))}, for property-specific waterproofing repairs.</p><div class="grid">${serviceCards(page)}</div><h2>Common water-entry signs in ${escapeHtml(page.name)}</h2><p>${escapeHtml(copy.symptoms)}</p><ul><li>Discolouration, bubbling paint or a musty smell near a wet area.</li><li>Water that appears outside a shower, below a balcony or at a ceiling after weather.</li><li>Damaged grout, sealant, tiles, flashings or external junctions that need assessment.</li><li>Recurring moisture near a kitchen, bathroom, laundry, roofline or wall corner.</li></ul><h2>How MEL ONE delivers ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}</h2><p>MEL ONE has more than ten years in the waterproofing industry and a standardised repair team with experienced repair professionals. The team works methodically: review the affected area, ask about timing and recent work, use safe photos where available, and prepare a practical repair plan before work is agreed.</p><p>MEL ONE has been trusted by more than ten thousand customers. Our experienced team provides fast 30-minute responses for Canberra waterproofing service requests and helps customers book the right repair service.</p><h2>What to include in a waterproofing service request</h2><ol><li>Your ${escapeHtml(page.name)} property suburb and the room or external area affected.</li><li>When the issue appears: after showering, rain, cleaning, plumbing use or at another time.</li><li>Clear photos or video from a safe position, plus any recent plumbing, renovation or maintenance work.</li><li>Your preferred contact details and a suitable time to arrange the service.</li></ol><section class="about-faq"><h2>${escapeHtml(page.name)} waterproofing FAQs</h2>${visibleFaqs(page)}</section><h2>Related Canberra service areas</h2><p>Use a nearby service page where it better matches the property location, or request service with the exact suburb.</p><div class="locality-grid">${relatedLinks(page, pageMap)}</div></article><section class="section wrap two" id="enquiry"><div class="contact-details"><p class="eyebrow">Contact MEL ONE</p><h2>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}.</h2><p>121 Marcus Clarke St, Canberra, ACT 2600</p><p><a href="tel:+61482422607">0482 422 607</a><br><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a></p><p>For urgent matters, call directly. For planned waterproofing services, include safe photos and timing details so MEL ONE can prepare the repair response.</p></div>${contactForm(page)}</section></main><footer class="footer"><div class="wrap footer-grid"><div><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="70" height="56"><p>Waterproofing and leak repair services across Canberra.</p><p>121 Marcus Clarke St, Canberra, ACT 2600</p></div><div><p class="eyebrow">Explore</p><a href="/services/">Services</a><a href="/service-areas/">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></div><div><p class="eyebrow">Contact</p><a href="tel:+61482422607">0482 422 607</a><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a><a href="/privacy-policy/">Privacy Policy</a></div></div></footer><nav class="mobile" aria-label="Quick contact"><a href="tel:+61482422607">Call</a><a href="#enquiry">Request a Quote</a></nav><script src="/assets/enquiry-form.js" defer></script></body></html>`;
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
  llms = `${llms.trimEnd()}\n\n<!-- LOCAL_WATERPROOFING_INDEX:START -->\n## Local waterproofing services\n- Directory: ${SITE_URL}/service-areas/\n- Public locality data: ${SITE_URL}/data/local-waterproofing-services.json\n- These pages provide locality-specific waterproofing repair services, practical assessment guidance and direct ways to request service from MEL ONE.\n${localityIndex}\n<!-- LOCAL_WATERPROOFING_INDEX:END -->\n`;
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
    if (!html.includes('fast 30-minute responses for Canberra waterproofing service requests')) {
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
