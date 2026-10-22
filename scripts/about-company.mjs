// Approved About content, shared by the static page and site regeneration.
// This transform owns the About main region; shared navigation/footer stay authored.
import {applyEditorialPresentation} from './editorial-presentation.mjs';
import {applyExternalLinkPolicy} from './external-link-policy.mjs';
import {applyCustomerFirstCopy} from './customer-first-copy.mjs';
const pageName = 'About MEL ONE waterproofing in Canberra';
const description = 'Meet MEL ONE’s Canberra waterproofing team: more than 10 years of experience, wet-area and external repairs, service capabilities and company details.';
const services = [
 ['bathroom-waterproofing','Bathroom waterproofing','Wet-area waterproofing and retiling for bathrooms and renovation work.'],
 ['leaking-shower-repairs','Leaking shower repairs','On-site assessment of shower leaks, followed by repairs to the identified cause.'],
 ['shower-resealing-regrouting','Shower resealing and regrouting','Replace worn silicone joints and deteriorated grout where these are the appropriate repair.'],
 ['balcony-waterproofing','Balcony waterproofing','Waterproofing and leak repairs for balcony floors, junctions and drainage details.'],
 ['kitchen-sealing','Kitchen caulking and silicone replacement','Seal sink edges, benchtop joints and splashback junctions.'],
 ['laundry-waterproofing','Laundry silicone resealing and waterproofing','Waterproofing for laundry renovations and repairs around wet-area details.'],
 ['external-waterproofing','External waterproofing','Address water entry at external walls, windows, doors and adjoining joints.'],
 ['roof-waterproofing','Roof membrane waterproofing and leak repairs','Repair roof water-entry details, including joints, outlets and penetrations.'],
 ['retaining-wall-waterproofing','Retaining-wall waterproofing','Waterproofing for retaining-wall surfaces and relevant wall junctions.'],
 ['tile-regrouting','Tile regrouting and epoxy grout','Standalone balcony and general tile regrouting, including epoxy grout work.'],
 ['commercial-waterproofing','Commercial waterproofing','Waterproofing and repairs for commercial premises and managed properties.'],
];

function teamPhoto(name, alt, caption, lazy = true) {
 return `<figure class="about-photo"><picture data-responsive-image><source type="image/webp" srcset="/assets/responsive/${name}-480.webp 480w, /assets/responsive/${name}-800.webp 800w, /assets/responsive/${name}-1200.webp 1200w, /assets/responsive/${name}-1499.webp 1499w" sizes="(max-width: 760px) calc(100vw - 42px), 480px"><img src="/assets/${name}.jpg" alt="${alt}" loading="${lazy ? 'lazy' : 'eager'}" width="1499" height="1049"></picture><figcaption>${caption}</figcaption></figure>`;
}

const companyMain = `<main id="main" class="about-company">
<section class="page-intro"><div class="wrap"><p class="eyebrow">MEL ONE waterproofing company</p><h1>${pageName}</h1><p class="lede">Waterproofing, leak repairs and regrouting for all property types, from homes and apartments to commercial premises.</p><p>Serving Belconnen, Gungahlin, Woden Valley and the wider ACT from our office at 121 Marcus Clarke St.</p></div></section>
<article class="section wrap article about-article">
<section class="about-company-intro" aria-labelledby="company-introduction"><div><p class="eyebrow">Our waterproofing team</p><h2 id="company-introduction">MEL ONE’s waterproofing experience and company background.</h2><p>MEL ONE is the trading name of Mel One Property Maintenance Pty Ltd, an Australian private company. The Ellis team brings more than 10 years of waterproofing experience and completes MEL ONE’s agreed work directly.</p><p>More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services.</p><p>Our local services cover wet-area waterproofing, leaking showers, balconies, external water ingress and roof leaks, alongside sealing and tile regrouting.</p></div>${teamPhoto('about-team-site','Ellis waterproofing team members beside a MEL ONE vehicle','MEL ONE team members on site.',false)}</section>
<section class="about-advantages" aria-labelledby="service-advantages"><p class="eyebrow">Waterproofing service advantages</p><h2 id="service-advantages">Experienced waterproofing repairs with a clear scope.</h2><div class="about-advantage-grid"><article><h3>10+ years of waterproofing experience</h3><p>The team works across wet areas, balconies and external building details, matching the repair to the affected part of the property.</p></article><article><h3>Waterproofing and finishing from one team</h3><p>The Ellis team completes the agreed waterproofing work directly, with sealing, regrouting and retiling available within the confirmed scope.</p></article><article><h3>Local waterproofing and urgent leak support</h3><p>Service coverage includes homes, rental properties, strata buildings and commercial premises across the ACT.</p></article></div><p class="about-response">For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.</p></section>
<section class="about-capabilities" aria-labelledby="waterproofing-capabilities"><p class="eyebrow">Waterproofing, sealing and grout repairs</p><h2 id="waterproofing-capabilities">Waterproofing and repair capabilities.</h2><p>Wet-area and external waterproofing, sealing, retiling, balcony and general tile regrouting, including epoxy grout work, are available within the assessed scope.</p><ul class="about-capability-grid">${services.map(([slug,name])=>`<li><a href="/services/${slug}/">${name}</a></li>`).join('')}</ul><p class="about-scope-note">Resealing and regrouting address joints and grout; they do not replace a failed waterproofing membrane. The on-site assessment determines the appropriate work.</p></section>
<section class="about-credentials" aria-labelledby="company-cover"><p class="eyebrow">Waterproofing company and insurance details</p><h2 id="company-cover">Company identity and waterproofing insurance information.</h2><dl class="about-facts"><div><dt>Legal entity</dt><dd>Mel One Property Maintenance Pty Ltd</dd></div><div><dt>Entity type</dt><dd>Australian private company</dd></div><div><dt>ABN / ACN</dt><dd>39 666 325 408 / 666 325 408</dd></div><div><dt>GST status</dt><dd>Registered</dd></div><div><dt>Insurer</dt><dd>Chubb Insurance Australia Limited</dd></div><div><dt>Public &amp; Products Liability</dt><dd>AUD 20 million</dd></div><div><dt>Policy period</dt><dd>13 April 2026 – 13 April 2027</dd></div><div><dt>Canberra office</dt><dd>121 Marcus Clarke St, Canberra, ACT 2600</dd></div></dl><p class="about-note">If a task requires a separate licence, the written scope names the licensed person responsible before work begins. Insurance cover is subject to the policy wording, period, conditions and insurer terms.</p><p><a class="text-link" href="https://abr.business.gov.au/ABN/View?abn=39666325408" target="_blank" rel="noopener noreferrer">View the official ABN record ↗</a></p></section>
<section class="about-contact" aria-labelledby="company-contact"><p class="eyebrow">Contact our waterproofing team</p><h2 id="company-contact">Book waterproofing or leak repair service.</h2><p>Contact MEL ONE for an on-site assessment, repair or installation plan and written quote.</p><p class="office-hours">Office reception: daily 09:00–21:00. On-site work by arrangement.</p><div class="actions"><a class="button primary" href="/contact/#service-form">Request assessment</a><a class="button secondary-dark" href="tel:+61482422607">Call 0482 422 607</a></div><dl class="about-contact-details"><dt>Address</dt><dd>121 Marcus Clarke St, Canberra, ACT 2600</dd><dt>Email</dt><dd><a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a></dd><dt>Phone</dt><dd><a href="tel:+61482422607">0482 422 607</a></dd></dl><p><a class="text-link" href="/faq/">Read the waterproofing service FAQ</a></p></section>
</article></main>`;

export function applyAboutCompany(html) {
 return applyCustomerFirstCopy(applyExternalLinkPolicy(renderAboutCompany(html)),'about/index.html');
}
function renderAboutCompany(html) {
 if (!/<main\b[\s\S]*?<\/main>/i.test(html)) return html;
 const newline = html.includes('\r\n') ? '\r\n' : '\n';
 const breadcrumb=html.match(/<!-- customer-navigation:breadcrumb:start -->[\s\S]*?<!-- customer-navigation:breadcrumb:end -->/)?.[0]||'';
 html = html.replace(/<main\b[\s\S]*?<\/main>/i, applyEditorialPresentation(companyMain,'about/index.html').replace(/\n/g, newline).replace(/(<main\b[^>]*>)/,'$1'+breadcrumb));
 html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>About MEL ONE Waterproofing in Canberra | MEL ONE</title>`)
  .replace(/(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/gi, '$1'+description+'$2')
  .replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/gi, '$1About MEL ONE Waterproofing in Canberra | MEL ONE$2');
 if (!html.includes('href="/assets/about-company.css"')) html = html.replace('</head>', '<link rel="stylesheet" href="/assets/about-company.css"></head>');
 return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi, (whole,start,json,end) => {
  const data = JSON.parse(json);
  const faqIds = new Set();
  const findFaq = value => {
   if (!value || typeof value !== 'object') return;
   if ([value['@type']].flat().includes('FAQPage') && value['@id']) faqIds.add(value['@id']);
   for (const child of Object.values(value)) if (child && typeof child === 'object') findFaq(child);
  };
  findFaq(data);
  const clean = value => {
   if (!value || typeof value !== 'object') return value;
   if ([value['@type']].flat().includes('FAQPage') || faqIds.has(value['@id'])) return undefined;
   if (Array.isArray(value)) return value.map(clean).filter(v => v !== undefined);
   const result = {};
   for (const [key,child] of Object.entries(value)) {
    const cleaned = clean(child);
    if (cleaned !== undefined) result[key] = cleaned;
   }
   if ([result['@type']].flat().includes('WebPage')) { result.name = pageName; result.description = description; }
   return result;
  };
  const cleaned = clean(data);
  return cleaned ? start+JSON.stringify(cleaned).replace(/</g,'\\u003c')+end : '';
 });
}
