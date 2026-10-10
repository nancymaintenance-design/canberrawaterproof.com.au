import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyOnsiteResponseCopy } from './onsite-response-copy.mjs';
import { applySocialLinks } from './social-links.mjs';
import { maintainSite } from './apply-seo-maintenance.mjs';

const SITE_URL = 'https://www.canberrawaterproof.com.au';
const LAST_MODIFIED = '2026-10-06';
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
  'inner-north-city': { primary: 'Waterproofing Services', supporting: ['bathroom waterproofing', 'wet area waterproofing'], summary: 'Waterproofing services for apartments, townhouses, offices and homes.' },
  'inner-south': { primary: 'Balcony and Bathroom Waterproofing', supporting: ['balcony waterproofing', 'bathroom waterproofing'], summary: 'Waterproofing repairs for wet areas, balconies and external junctions.' },
  'woden-valley': { primary: 'Bathroom Waterproofing', supporting: ['bathroom rewaterproofing', 'waterproofing and tiling'], summary: 'Bathroom waterproofing and rewaterproofing services for Woden Valley properties.' },
  'weston-creek-molonglo': { primary: 'External Waterproofing', supporting: ['balcony waterproofing', 'water ingress repairs'], summary: 'External waterproofing and balcony leak-repair services for outdoor building surfaces.' },
  tuggeranong: { primary: 'Leaking Shower Repairs', supporting: ['shower waterproofing', 'bathroom waterproofing'], summary: 'Leaking shower repair and bathroom waterproofing services for Tuggeranong properties.' },
  'east-canberra': { primary: 'External Waterproofing', supporting: ['water ingress repairs', 'roof leak repairs'], summary: 'External waterproofing and water-ingress repair services for East Canberra properties.' },
  'act-localities': { primary: 'Waterproofing Services', supporting: ['wet area waterproofing', 'remedial waterproofing'], summary: 'Local waterproofing repair services for ACT properties outside the main district hubs.' },
  aranda: { primary: 'Bathroom Waterproofing', supporting: ['leaking shower repairs', 'wet area waterproofing'], summary: 'Bathroom waterproofing and leaking shower repair services for Aranda homes.' },
  bruce: { primary: 'Shower Waterproofing', supporting: ['leaking shower repairs', 'shower base leak repair'], summary: 'Shower waterproofing and leaking shower repair services for Bruce properties.' },
  amaroo: { primary: 'Bathroom Waterproofing', supporting: ['shower repairs', 'ensuite waterproofing'], summary: 'Bathroom, ensuite and shower waterproofing services for Amaroo homes.' },
  casey: { primary: 'Shower Resealing and Regrouting', supporting: ['bathroom silicone replacement', 'shower screen resealing'], summary: 'Shower resealing, regrouting and silicone replacement services for Casey properties.' },
  'canberra-city': { primary: 'Waterproofing Services', supporting: ['wet area waterproofing', 'bathroom waterproofing'], summary: 'Waterproofing services for Canberra City apartments, commercial premises and homes.' },
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

// Each page carries a locally relevant service angle. These are not claims about
// individual properties; they explain the area, repair type and practical first
// checks a customer can expect from MEL ONE.
const LOCALITY_PROFILES = {
  belconnen: { propertyFocus: 'family bathrooms, ensuites and shower floors', check: 'shower bases, wall-floor junctions and the condition of tiled wet areas', result: 'a direct bathroom-waterproofing plan for the affected room' },
  gungahlin: { propertyFocus: 'homes, townhouses and managed wet areas', check: 'shower screens, silicone joints, floors and any water that escapes during use', result: 'the right shower-waterproofing service for the visible issue' },
  'inner-north-city': { propertyFocus: 'apartments, townhouses, offices and compact wet areas', check: 'access requirements, shared-building considerations and wet-area junctions', result: 'a practical service route that fits the building and repair area' },
  'inner-south': { propertyFocus: 'bathrooms, balconies and outdoor tiled surfaces', check: 'balcony thresholds, bathroom finishes and exposed junctions', result: 'a focused repair service for the relevant wet or external area' },
  'woden-valley': { propertyFocus: 'bathrooms, ensuites, kitchens and managed buildings', check: 'the affected wet area, nearby finishes and the path water takes', result: 'a clear waterproofing or rewaterproofing service plan' },
  'weston-creek-molonglo': { propertyFocus: 'balconies, external walls and outdoor building edges', check: 'wall-floor junctions, drainage paths, thresholds and exposed finishes', result: 'an external-waterproofing service matched to the entry point' },
  tuggeranong: { propertyFocus: 'showers, bathrooms and family wet areas', check: 'when water appears, shower-base details and surrounding tiled joints', result: 'a leaking-shower repair plan that targets the affected area' },
  'east-canberra': { propertyFocus: 'external walls, rooflines and water-entry areas', check: 'the exterior surface, visible entry point and water movement after weather', result: 'a direct external-waterproofing or water-ingress repair service' },
  'act-localities': { propertyFocus: 'homes and managed properties across outer ACT localities', check: 'the affected room or external surface and the most useful first repair path', result: 'a service plan built around the property rather than a generic quote' },
  aranda: { propertyFocus: 'bathrooms, ensuites and tiled shower areas', check: 'shower bases, tile junctions, silicone lines and nearby floor or wall finishes', result: 'a bathroom-waterproofing repair plan for the Aranda property' },
  bruce: { propertyFocus: 'showers, ensuites and apartment wet areas', check: 'shower screens, bases, wall junctions and water movement during normal use', result: 'a targeted Bruce shower-waterproofing service' },
  amaroo: { propertyFocus: 'bathrooms, ensuites and family shower areas', check: 'wet-area joins, shower use patterns and the condition of surrounding finishes', result: 'a direct Amaroo bathroom-waterproofing repair service' },
  casey: { propertyFocus: 'tiled showers, grout lines and silicone joints', check: 'failed sealant, grout condition, shower screens and wall-floor transitions', result: 'a Casey resealing and regrouting service matched to the shower' },
  'canberra-city': { propertyFocus: 'apartments, commercial premises and city wet areas', check: 'building access, bathrooms, balconies and the exact water-affected surface', result: 'a Canberra City waterproofing service with a clear access plan' },
  braddon: { propertyFocus: 'apartment balconies, outdoor tiles and exposed wall junctions', check: 'balcony edges, door thresholds, sealant lines and visible surface movement', result: 'a Braddon balcony-waterproofing repair plan for the outdoor area' },
  kingston: { propertyFocus: 'balconies, bathrooms and apartment wet areas', check: 'external tiled surfaces, bathroom details and recurring moisture points', result: 'a Kingston waterproofing service for the relevant balcony or wet area' },
  griffith: { propertyFocus: 'leaking showers, shower screens and tiled bathroom finishes', check: 'when the leak appears, shower-wall joins, bases and sealing details', result: 'a Griffith leaking-shower repair service that follows the symptoms' },
  woden: { propertyFocus: 'bathrooms, rewaterproofing projects and tiled wet areas', check: 'existing finishes, the waterproofing scope and the work sequence needed', result: 'a Woden bathroom-waterproofing plan with the right repair scope' },
  phillip: { propertyFocus: 'kitchens, laundries, fixtures and floor junctions', check: 'sink connections, floor edges, nearby cabinetry and visible water pathways', result: 'a Phillip kitchen or laundry waterproofing service for the affected area' },
  weston: { propertyFocus: 'external walls, windows, balconies and building edges', check: 'window junctions, thresholds, wall surfaces and water entry after weather', result: 'a Weston external-wall waterproofing service that targets the entry area' },
  coombs: { propertyFocus: 'balconies, outdoor tiles and external wall-floor junctions', check: 'balcony membranes, drainage points, tiled surfaces and exposed edges', result: 'a Coombs balcony-waterproofing repair service for the outdoor area' },
  kambah: { propertyFocus: 'leaking showers, bathrooms and family wet areas', check: 'shower use patterns, tiled joins, shower bases and surrounding surfaces', result: 'a Kambah leaking-shower repair service based on the visible condition' },
  calwell: { propertyFocus: 'laundries, kitchens, fixtures and adjacent floor areas', check: 'floor edges, sink and laundry connections, sealant and nearby finishes', result: 'a Calwell kitchen or laundry waterproofing service that suits the room' },
  fyshwick: { propertyFocus: 'external walls, rooflines, commercial surfaces and water-entry points', check: 'roof-edge details, wall corners, drainage paths and weather-related entry points', result: 'a Fyshwick external-waterproofing service matched to the exterior condition' },
};

function focusServiceLabel(focus) {
  return /services$/i.test(focus.primary) ? focus.primary : `${focus.primary} Services`;
}

function page(slug, name, district, kind, relatedLocalities) {
  const article = /^[aeiou]/i.test(name) ? 'an' : 'a';
  const focus = LOCAL_SERVICE_FOCUSES[slug];
  const profile = LOCALITY_PROFILES[slug];
  if (!focus) throw new Error(`missing service focus: ${slug}`);
  if (!profile) throw new Error(`missing locality profile: ${slug}`);
  return {
    slug,
    name,
    district,
    kind,
    indexable: kind === 'district',
    route: `/waterproofing/${slug}/`,
    relatedLocalities,
    localContext: LOCAL_CONTEXTS[slug],
    focus,
    profile,
    faq: [
      {
        question: `What ${focusServiceLabel(focus).toLowerCase()} does MEL ONE provide in ${name}?`,
        answer: `MEL ONE provides ${focusServiceLabel(focus).toLowerCase()} in ${name}, including ${focus.supporting.join(' and ')} where those services suit the affected area and repair scope.`,
      },
      {
        question: `How quickly can MEL ONE respond to ${article} ${name} waterproofing service request?`,
        answer: `MEL ONE provides a fast 30-minute response for ${name} waterproofing service requests. Call 0482 422 607 or send the suburb, affected area and when water appears. We arrange the on-site assessment and confirm the repair scope and written quote. Photos are optional; email them to riley@melonemaintenance.com.au.`,
      },
      {
        question: `What does MEL ONE check for ${name} ${focus.primary.toLowerCase()}?`,
        answer: `For ${name} ${focus.primary.toLowerCase()}, MEL ONE starts with ${profile.check}. This helps our experienced team prepare ${profile.result}.`,
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
    if (!item.localContext || !item.profile?.propertyFocus || !item.profile?.check || !item.profile?.result) throw new Error(`missing locality profile: ${item.slug}`);
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
    localities: validatePages(pages).map(({ name, district, kind, route, focus }) => ({
      locality: name,
      district,
      type: kind,
      canonicalUrl: `${SITE_URL}${route}`,
      primaryService: focus.primary,
      supportingServices: focus.supporting,
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
  const serviceDescriptions = {
    'leaking-shower-repairs': `MEL ONE assesses shower bases, screens, tiled wall-floor junctions and visible water escape points before planning leaking shower repairs for ${page.name} properties.`,
    'bathroom-waterproofing': `MEL ONE plans bathroom waterproofing for ${page.name} bathrooms, ensuites and wet areas, with the affected surface and repair scope clearly identified.`,
    'shower-resealing-regrouting': `MEL ONE checks grout, silicone, shower-screen edges and tiled joints before planning shower resealing and regrouting for ${page.name} properties.`,
    'balcony-waterproofing': `MEL ONE assesses balcony thresholds, drainage points, tiled surfaces and exposed junctions before planning balcony waterproofing for ${page.name} properties.`,
    'kitchen-sealing': `MEL ONE checks sink edges, splashbacks, benchtop junctions and cabinet-adjacent moisture before planning kitchen sealing for ${page.name} properties.`,
    'external-waterproofing': `MEL ONE checks external wall junctions, window edges, roofline details and weather-related water-entry points before planning external waterproofing for ${page.name} properties.`,
  };

  return SERVICES.map(({ slug, name }) => `<article class="card"><h3>${escapeHtml(name)} in ${escapeHtml(page.name)}</h3><p>${escapeHtml(serviceDescriptions[slug])}</p><a href="/services/${slug}/">Book ${escapeHtml(name.toLowerCase())}</a></article>`).join('');
}

function relatedLinks(page, pageMap) {
  return page.relatedLocalities.map((name) => {
    const related = [...pageMap.values()].find((item) => item.name === name);
    const href = related?.route || `/contact/?suburb=${encodeURIComponent(name)}`;
    return `<a class="locality-button" href="${href}">${escapeHtml(name)}</a>`;
  }).join('');
}

function visibleFaqs(page) {
  return page.faq.map(({ question, answer }) => `<details data-faq-question="${escapeHtml(question)}"><summary>${escapeHtml(question)}</summary><p data-faq-answer>${escapeHtml(answer)}</p></details>`).join('');
}

function contactForm(page) {
  return `<form class="form" action="/api/contact" method="post" data-service-form><h2>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}.</h2><p>Tell us about the affected area and the repair service you need. A clear description helps the Ellis team discuss the repair directly with you.</p><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><label>Name<input name="name" required></label><label for="suburb">Suburb<input id="suburb" name="suburb" value="${escapeHtml(page.name)}" required></label><div class="two"><label>Phone<input name="phone" type="tel"></label><label>Email for your service confirmation<input name="email" type="email" autocomplete="email" required></label></div><label>Affected area<select name="area" required><option>Shower</option><option>Bathroom</option><option>Balcony</option><option>Kitchen</option><option>Laundry</option><option>External</option><option>Roof</option><option>Other waterproofing service</option></select></label><label>Tell us about the repair needed<textarea name="message" rows="6" required></textarea></label><button class="button primary" type="submit">Request Service</button><p class="form-status" data-form-status role="status" aria-live="polite"></p><p><small>Your details go securely to MEL ONE’s Ellis team for a direct response. We use them only to respond to this request; do not include financial, identity or access information.</small></p></form>`;
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
    intro: `The Ellis team completes ${page.focus.primary.toLowerCase()} in ${localPhrase}. ${page.focus.summary} Our experienced repair team supports ${propertyPhrase} with direct service for bathrooms, showers, balconies, kitchens, roofs and external water-entry areas.`,
    detail: `For ${propertyPhrase} in ${localPhrase}, MEL ONE focuses on ${page.profile.propertyFocus}. Our team checks ${page.profile.check} before preparing ${page.profile.result}.`,
    symptoms: `Water-entry signs often appear ${entryPhrase}. If water is actively entering a property, protect people and belongings first, follow any safe building procedures and arrange urgent assistance where needed. Do not remove tiles, membranes or fixtures simply to investigate a cause unless a qualified professional has advised that approach.`,
  };
}

function trustPanel(page) {
  return `<section class="local-trust" aria-labelledby="${escapeHtml(page.slug)}-trust"><p class="eyebrow">Established waterproofing service</p><h2 id="${escapeHtml(page.slug)}-trust">${escapeHtml(page.focus.primary)} in ${escapeHtml(page.name)} backed by proven experience.</h2><div class="local-trust-grid"><article><strong>10+ years</strong><span>Waterproofing industry experience and a standardised repair team.</span></article><article><strong>10,000+ customers</strong><span>Trusted by customers across Australia for property maintenance and repair services.</span></article><article><strong>30-minute response</strong><span>Call MEL ONE for a fast response to your ${escapeHtml(page.name)} service request.</span></article></div><p class="local-trust-note"><strong>Licensed and insured:</strong> MEL ONE operates through Mel One Property Maintenance Pty Ltd, ABN 39 666 325 408, with AUD 20 million Public &amp; Products Liability cover. <a href="https://abr.business.gov.au/ABN/View?abn=39666325408" target="_blank" rel="noopener noreferrer">Verify our ABN</a> · <a href="/about/#company-cover">View licence and insurance information</a></p></section>`;
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
        name: `${page.focus.primary} in ${page.name} | MEL ONE`,
        description: `${page.focus.primary} in ${page.name}. MEL ONE provides ${page.focus.supporting.join(', ')} with 10+ years of waterproofing experience and a fast 30-minute response.`,
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
  const localKeyword = `${page.focus.primary} ${page.name}`;
  const title = `${localKeyword} | MEL ONE`;
  const description = `${localKeyword}: 10+ years’ experience, 10,000+ customers Australia-wide and a fast 30-minute response. Call 0482 422 607.`;

  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png"><link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${page.indexable ? 'index,follow' : 'noindex,follow'}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><link rel="stylesheet" href="/assets/site.css"><script type="application/ld+json">${JSON.stringify(schemasFor(page))}</script></head><body><a class="skip" href="#main">Skip to content</a><div class="top"><div class="wrap"><span>${escapeHtml(page.name)} waterproofing repair services</span><span>0482 422 607 · riley@melonemaintenance.com.au</span></div></div><header class="header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="MEL ONE home"><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="58" height="58"><span class="brand-name">MEL ONE</span></a><nav class="nav" aria-label="Main navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/service-areas/" aria-current="page">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a class="button primary" href="#booking">Book Waterproofing Service</a></nav></div></header><main id="main"><section class="page-intro"><div class="wrap"><p class="eyebrow">${escapeHtml(page.district)} service area</p><h1>${escapeHtml(page.focus.primary)} in ${escapeHtml(page.name)}</h1><p class="lede">${escapeHtml(page.focus.summary)} Call MEL ONE for a fast 30-minute response in ${escapeHtml(page.name)}.</p><p class="crumbs"><a href="/">Home</a> / <a href="/service-areas/">Service areas</a> / ${escapeHtml(page.name)}</p></div></section><article class="section wrap article"><p>${escapeHtml(copy.intro)}</p>${trustPanel(page)}<p data-local-context>${escapeHtml(page.localContext)}</p><p>${escapeHtml(copy.detail)}</p><div class="callout"><strong>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}:</strong> Call 0482 422 607, or send the affected area, timing and safe photos so our team can prepare the right service response.</div><h2>${escapeHtml(focusServiceLabel(page.focus))} in ${escapeHtml(page.name)}</h2><p>MEL ONE provides ${escapeHtml(page.focus.primary.toLowerCase())}, plus ${escapeHtml(page.focus.supporting.join(' and '))}, for ${escapeHtml(page.name)} property repairs.</p><div class="grid">${serviceCards(page)}</div><h2>Common water-entry signs in ${escapeHtml(page.name)}</h2><p>${escapeHtml(copy.symptoms)}</p><ul><li>Discolouration, bubbling paint or a musty smell near a wet area.</li><li>Water that appears outside a shower, below a balcony or at a ceiling after weather.</li><li>Damaged grout, sealant, tiles, flashings or external junctions that need assessment.</li><li>Recurring moisture near a kitchen, bathroom, laundry, roofline or wall corner.</li></ul><h2>How the Ellis team carries out ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}</h2><p>MEL ONE brings more than 10 years of waterproofing industry experience to ${escapeHtml(page.name)}. Our standardised repair team checks the affected area, confirms the repair service required and prepares a practical plan before work begins.</p><p>More than 10,000 customers across Australia have trusted MEL ONE. Call 0482 422 607 for a fast 30-minute response to ${escapeHtml(page.name)} waterproofing service requests.</p><h2>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}</h2><ol><li>Call 0482 422 607 or send your ${escapeHtml(page.name)} suburb and the room or external area affected.</li><li>Tell MEL ONE when the issue appears: after showering, rain, cleaning, plumbing use or another event.</li><li>Share clear photos or video from a safe position, plus any recent plumbing, renovation or maintenance work.</li><li>The Ellis team confirms an assessment time and the agreed waterproofing work with you.</li></ol><section class="about-faq"><h2>${escapeHtml(page.name)} waterproofing FAQs</h2>${visibleFaqs(page)}</section><h2>Related waterproofing services near ${escapeHtml(page.name)}</h2><p>Choose a nearby service area where it matches the property location, or book a service with the exact suburb.</p><div class="locality-grid">${relatedLinks(page, pageMap)}</div></article><section class="section wrap two" id="booking"><div class="contact-details"><p class="eyebrow">Book MEL ONE</p><h2>Book ${escapeHtml(page.focus.primary.toLowerCase())} in ${escapeHtml(page.name)}.</h2><p>121 Marcus Clarke St, Canberra, ACT 2600</p><p><a href="tel:+61482422607">0482 422 607</a><br><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a></p><p><strong>Call for a fast 30-minute response.</strong> For planned waterproofing services, include the affected area, timing and safe photos so MEL ONE can prepare the repair response.</p></div>${contactForm(page)}</section></main><footer class="footer"><div class="wrap footer-grid"><div><img src="/assets/mel-one-logo.png" alt="MEL ONE" width="70" height="56"><p>Waterproofing and leak repair services across Canberra.</p><p>121 Marcus Clarke St, Canberra, ACT 2600</p></div><div><p class="eyebrow">Explore</p><a href="/services/">Services</a><a href="/service-areas/">Service Areas</a><a href="/about/">About Us</a><a href="/guides/">Guides</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></div><div><p class="eyebrow">Contact</p><a href="tel:+61482422607">0482 422 607</a><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a><a href="/privacy-policy/">Privacy Policy</a></div></div></footer><nav class="mobile" aria-label="Quick contact"><a href="tel:+61482422607">Call</a><a href="#booking">Book Service</a></nav><script src="/assets/service-form.js" defer></script></body></html>`;
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
    const html = applySocialLinks(applyOnsiteResponseCopy(renderPage(page, pageMap, position), page.name)).replace(
      '<link rel="stylesheet" href="/assets/site.css">',
      `<meta property="og:image" content="${SITE_URL}/assets/mel-one-hero-bathroom.jpg"><link rel="stylesheet" href="/assets/site.css">`,
    );
    writeFileSync(target, html);
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
  const selectedByName = new Map(LOCALITY_PAGES.map((item) => [item.name, item]));
  const directoryPath = resolve(root, 'service-areas', 'index.html');
  let directory = readFileSync(directoryPath, 'utf8');

  for (const [name, page] of selectedByName) {
    const contactHref = `/contact/?suburb=${encodeURIComponent(name)}`;
    const route = page.route;
    const href = route;
    directory = directory.replace(
      `<a class="locality-button" href="${contactHref}">${name}</a>`,
      `<a class="locality-button" href="${href}">${name}</a>`,
    );
    directory = directory.replace(
      `<a class="locality-button" href="${route}">${name}</a>`,
      `<a class="locality-button" href="${href}">${name}</a>`,
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
    '<p class="area-note">Choose a listed locality to read about its waterproofing services. For other ACT suburbs, open Contact with your suburb already entered.</p>',
  );
  directory = directory.replace(
    '<p class="area-note">Open a locality guide for detailed waterproofing information, or choose any other locality to open Contact with the suburb already entered.</p>',
    '<p class="area-note">Choose a listed locality to read about its waterproofing services. For other ACT suburbs, open Contact with your suburb already entered.</p>',
  );
  writeFileSync(directoryPath, directory);

  const sitemapPath = resolve(root, 'sitemap.xml');
  let sitemap = readFileSync(sitemapPath, 'utf8');
  const routePattern = new RegExp(`<url><loc>${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/waterproofing\\/[a-z0-9-]+\\/<\\/loc><\\/url>`, 'g');
  sitemap = sitemap.replace(routePattern, '');
  const routeEntries = LOCALITY_PAGES.filter((page) => page.indexable).map((page) => `<url><loc>${SITE_URL}${page.route}</loc></url>`).join('');
  sitemap = sitemap.replace('</urlset>', `${routeEntries}</urlset>`);
  writeFileSync(sitemapPath, sitemap);

  const llmsPath = resolve(root, 'llms.txt');
  let llms = readFileSync(llmsPath, 'utf8');
  llms = llms.replace(/\n<!-- LOCAL_WATERPROOFING_INDEX:START -->[\s\S]*?<!-- LOCAL_WATERPROOFING_INDEX:END -->\n?/g, '\n');
  const localityIndex = LOCALITY_PAGES.filter((page) => page.indexable).map((page) => `- ${SITE_URL}${page.route} — ${page.name} (${page.kind})`).join('\n');
  llms = `${llms.trimEnd()}\n\n<!-- LOCAL_WATERPROOFING_INDEX:START -->\n## Local waterproofing services\n- Directory: ${SITE_URL}/service-areas/\n- Public locality data: ${SITE_URL}/data/local-waterproofing-services.json\n- These pages provide locality-specific waterproofing repair services, practical assessment guidance and direct ways to request service from MEL ONE.\n${localityIndex}\n<!-- LOCAL_WATERPROOFING_INDEX:END -->\n`;
  writeFileSync(llmsPath, llms);
}

function verifyBuild() {
  validatePages(LOCALITY_PAGES);
  writeFeed();
  writePages();
  addAnalyticsToLocalityPages();
  writeDiscoveryResources();
  maintainSite();
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  for (const page of LOCALITY_PAGES) {
    const html = readFileSync(resolve(root, page.route.slice(1), 'index.html'), 'utf8');
    if (!html.includes(`name="suburb" value="${escapeHtml(page.name)}"`)) {
      throw new Error(`generated suburb field is missing for ${page.slug}`);
    }
    if (!html.includes('as little as 30 minutes after contact')) {
      throw new Error(`on-site attendance statement is missing for ${page.slug}`);
    }
    if (!html.includes('10+ years') || !html.includes('10,000+ customers')) {
      throw new Error(`experience proof is missing for ${page.slug}`);
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
    maintainSite();
  } else {
    throw new Error(`unknown command: ${command}`);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
