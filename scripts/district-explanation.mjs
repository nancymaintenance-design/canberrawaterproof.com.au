// Service navigation uses existing page focus, not inferred district property facts.
const destinations = {
 belconnen: ['bathroom-waterproofing', 'Bathroom waterproofing'],
 gungahlin: ['leaking-shower-repairs', 'Leaking shower repairs'],
 'inner-north-city': ['', 'Waterproofing services'],
 'inner-south': ['balcony-waterproofing', 'Balcony waterproofing'],
 'woden-valley': ['bathroom-waterproofing', 'Bathroom waterproofing'],
 'weston-creek-molonglo': ['external-waterproofing', 'External waterproofing'],
 tuggeranong: ['leaking-shower-repairs', 'Leaking shower repairs'],
 'east-canberra': ['external-waterproofing', 'External waterproofing'],
 'act-localities': ['', 'Waterproofing services'],
};

export function applyDistrictExplanation(html, page) {
 if (page.kind !== 'district') return html;
 const destination = destinations[page.slug];
 if (!destination) return html;
 // The following list already names the signs. Retain all safety advice and sales copy.
 html = html.replace(/Water-entry signs often appear (?:after rain, shower use or routine cleaning|around a wet area, external junction or drainage path|when water appears in a room, ceiling, wall or outdoor surface)\. /g, '');
 if (html.includes('data-district-help')) return html;
 const [slug, label] = destination;
 const proof = page.slug === 'woden-valley'
  ? ' · <a href="/services/roof-waterproofing/#isaacs-roof">Isaacs roof project: April 2026</a>' : '';
 const help = `<p data-district-help>Repair information: <a href="/services/${slug ? slug+'/' : ''}">${label}</a> · <a href="/faq/">Waterproofing questions and answers</a>${proof}.</p>`;
 return html.replace(/(<h2>Common water-entry signs in [^<]+<\/h2><p>[\s\S]*?<\/p>)/, '$1'+help);
}
