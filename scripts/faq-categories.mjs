import {rainFaq} from '../data/post-rain-content.mjs';
// Reclassify the authored FAQ without replacing its answers or related links.
const categories = [
  { id: 'service-enquiries-quotes', title: 'Waterproofing Service Enquiries &amp; Quotes', description: 'Service coverage, assessment visits, costs and the information to prepare before booking.', questions: [
    'Do you provide waterproofing services in all Canberra suburbs?',
    'Can I send waterproofing photos before arranging a visit?',
    'What information should a waterproofing quote include?',
    'How should I prepare for a waterproofing inspection or repair?',
    'Can a tenant report a waterproofing issue?',
    'How much will waterproofing cost?',
    'What records should I discuss before bathroom waterproofing work?',
    'Does an ABN prove a waterproofing tradesperson holds the required licence?',
    'Do you accept commercial and strata waterproofing enquiries?',
  ] },
  { id: 'leak-symptoms-repair-scenarios', title: 'Leak Symptoms &amp; Repair Scenarios', description: 'Find a practical starting point for leaking showers, balcony ponding, damp cupboards and rainwater entry.', questions: [
    'What are the common signs of a waterproofing problem?',
    'How can I tell whether a leak is plumbing or waterproofing?',
    'Can a leaking shower be repaired without removing tiles?',
    'Can a leak appear away from the water-entry point?',
    'Will mould go away once I reseal the shower?',
    'Can I keep using the bathroom while a leak is being investigated?',
    'Do you need a plumber for every wet-area leak?',
    'Can just the shower be rewaterproofed rather than the whole bathroom?',
    'When does shower silicone replacement help?',
    'How is a balcony leak different from a shower leak?',
    'Why does water pool on a balcony after rain?',
    'Can resealing a kitchen sink fix a wet cupboard underneath?',
    'Can external water ingress be fixed with sealant alone?',
    'Can a roof membrane be locally repaired instead of replaced?',
    'How is condensation different from rainwater ingress?',
    'Will exterior paint or another sealant layer fix water ingress?',
    'Does water pooling beside a house need waterproofing or drainage?',
    'What should I do first if water is actively leaking?',
  ] },
  { id: 'waterproofing-knowledge-materials', title: 'Waterproofing Knowledge &amp; Materials', description: 'Understand membranes, grout, flexible joints, preparation and curing before choosing a repair scope.', questions: [
    'What is the difference between waterproof and water resistant?',
    'Do all bathroom floors need the same waterproofing treatment?',
    'Why is the wall-to-floor junction important in a shower?',
    'What should be checked before waterproofing over an existing surface?',
    'How long does waterproofing need to cure before tiling?',
    'Does cracked grout mean the waterproofing membrane has failed?',
    'Is resealing the same as replacing waterproofing?',
    'Is epoxy grout the same as an epoxy moisture barrier?',
    'What is a bond breaker, and is it tile grout?',
    'Can surface sealing replace a balcony waterproofing membrane?',
    'Is ground-level paving the same as a balcony over a room?',
    'What needs checking before laundry floor tiling?',
    'Is roof painting the same as roof waterproofing?',
  ] },
];
categories[1].questions.push(...rainFaq.map(([,q])=>q));
const aliases = {
  'Do you provide waterproofing services in all Canberra suburbs?': 'areas',
  'What information should a waterproofing quote include?': 'quotes',
  'What are the common signs of a waterproofing problem?': 'bathrooms',
  'Does cracked grout mean the waterproofing membrane has failed?': 'tile-joints',
  'How is a balcony leak different from a shower leak?': 'balconies',
  'Can resealing a kitchen sink fix a wet cupboard underneath?': 'kitchen-laundry',
  'Can external water ingress be fixed with sealant alone?': 'roof-external',
  'What should I do first if water is actively leaking?': 'safety',
};
const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export function applyFaqCategories(html) {
  if (!/<section class="section wrap faq(?:\s|\")/.test(html)) return html;
  const boundary = html.match(/<section class="section wrap faq(?:\s[^\"]*)?">([\s\S]*?)<\/section><\/main>/);
  if (!boundary) throw new Error('Missing FAQ content boundary');
  const questions = new Map();
  for (const match of boundary[1].matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/g)) {
    const name = plain(match[0].match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '');
    if (!categories.some(category => category.questions.includes(name))) throw new Error(`Unclassified FAQ question: ${name}`);
    if (questions.has(name)) throw new Error(`Duplicate FAQ question: ${name}`);
    questions.set(name, match[0]);
  }
  const added=rainFaq.filter(([,q])=>questions.has(q)).length;
  if (questions.size !== 40+added) throw new Error(`Expected 40 retained FAQ questions plus reviewed additions; found ${questions.size}`);
  const activeCategories=categories.map(c=>({...c,questions:c.questions.filter(q=>!rainFaq.some(([,name])=>name===q)||questions.has(q))}));
  const intro = boundary[1].match(/<p class="faq-lede">[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/)?.[0];
  const note = boundary[1].match(/<p class="faq-source-note">[\s\S]*?<\/p>/)?.[0];
  if (!intro || !note) throw new Error('Missing FAQ introduction or source note');
  const schemaQuestions = [];
  const panels = activeCategories.map(category => {
    const details = category.questions.map(name => {
      let markup = questions.get(name);
      if (aliases[name] && !markup.includes(`id="${aliases[name]}"`)) markup = markup.replace('<details', `<details id="${aliases[name]}"`);
      schemaQuestions.push({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: [...markup.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(p => plain(p[1])).join(' ') } });
      return markup;
    }).join('');
    return `<section class="faq-category" aria-labelledby="${category.id}"><div class="faq-category-heading"><p class="eyebrow">${category.questions.length} waterproofing questions</p><h2 id="${category.id}">${category.title}</h2><p>${category.description}</p></div>${details}</section>`;
  }).join('');
  const shortLabels = ['Enquiries &amp; quotes', 'Leak symptoms', 'Materials &amp; systems'];
  const navigation = `<nav class="faq-navigation" aria-label="Question categories"><p class="eyebrow">Waterproofing answers</p><div class="faq-category-links">${activeCategories.map((category, i) => `<a href="#${category.id}" aria-label="${category.title}"${i === 0 ? ' aria-current="location"' : ''}><span>${shortLabels[i]}</span><small>${category.questions.length} questions</small></a>`).join('')}</div><p class="faq-navigation-help">Need help with an active leak? <a href="#safety">Read the immediate safety advice</a> or <a href="tel:+61482422607">call 0482 422 607</a>.</p></nav>`;
  html = html.replace(boundary[0], `<section class="section wrap faq"><div class="faq-layout">${navigation}<div class="faq-questions"><div class="faq-introduction">${intro}</div>${panels}${note}</div></div></section></main>`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
    const data = JSON.parse(json);
    const nodes = data['@graph'] || [data];
    const faq = nodes.find(node => node['@type'] === 'FAQPage');
    if (!faq) return block;
    faq.mainEntity = schemaQuestions;
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
  if (!html.includes('href="/assets/faq-navigation.css"')) html = html.replace('</head>', '<link rel="stylesheet" href="/assets/faq-navigation.css"></head>');
  if (!html.includes('src="/assets/faq-navigation.js"')) html = html.replace('</body>', '<script src="/assets/faq-navigation.js" defer></script></body>');
  html = html.replace(/<body(?: class="([^"]*)")?>/, (_, classes = '') => `<body class="${[...new Set([...classes.split(/\s+/).filter(Boolean), 'faq-page'])].join(' ')}">`);
  return html;
}
