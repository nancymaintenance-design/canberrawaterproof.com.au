import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const update = (path, transform) => {
  const file = resolve(root, path);
  const before = readFileSync(file, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`No update applied to ${path}`);
  writeFileSync(file, after);
};

const articles = [
  {
    path: 'industry-news/preparing-for-wet-weather/index.html',
    oldTitle: 'Preparing Wet Areas for Canberra’s Wet Weather',
    title: 'Canberra Waterproofing Before Wet Weather: What Should You Check?',
    description: 'A practical Canberra waterproofing checklist for spotting visible water entry, recording wet-weather patterns and arranging the right inspection.',
    body: `<h2>What should Canberra property owners check before wet weather?</h2><p>Before rain arrives, look at the areas you can safely reach from the ground: visible gutters and downpipes, balcony edges, door thresholds, external wall junctions and marks on ceilings or walls. Note where water appears, how long it lasts and whether the pattern follows wind-driven rain. These observations help the Ellis team understand the service request; they do not identify a concealed defect by themselves.</p><h2>How can you record a roof or wall leak safely?</h2><p>Photograph visible staining from inside and the corresponding external area only when it is safely accessible. Do not climb onto a wet roof, ladder or unstable surface. Record the date, recent weather, affected room and any change in the size or colour of the mark. Keep belongings clear of active drips and contact the appropriate emergency service if there is an immediate electrical or structural hazard.</p><h2>Does every rain leak need waterproofing?</h2><p>No single repair method fits every water-entry path. Roof coverings, flashings, plumbing, drainage and waterproofed balconies are different systems. A Canberra roof leak assessment should identify the accessible source and define whether the work concerns roof repair, external waterproofing or another trade. For tiled balconies, the scope may include inspection, removal, membrane replacement and retiling where access is required.</p><h2>What information helps arrange an inspection?</h2><p>Share the Canberra suburb, affected area, when the water appears and clear photographs taken from safe positions. The Ellis team carries out the agreed work directly and explains the inspection findings, inclusions and quote before work begins. For urgent Canberra jobs, on-site attendance may be available in as little as 30 minutes after contact, subject to current availability, address and safe access.</p><p>For <a href="/services/roof-waterproofing/">roof leak and waterproofing service</a>, <a href="/services/external-waterproofing/">external water-ingress repairs</a> or a property-specific <a href="/contact/">Canberra waterproofing assessment</a>, contact MEL ONE with the location and observed symptoms.</p>`
  },
  {
    path: 'industry-news/what-to-photograph-before-a-quote/index.html',
    oldTitle: 'What to Photograph Before a Waterproofing Service Request',
    title: 'What Photos Help With a Canberra Waterproofing Quote?',
    description: 'Learn which safe, clear photos help the Ellis team prepare for a Canberra waterproofing inspection and written repair quote.',
    body: `<h2>Which photos help with a Canberra waterproofing quote?</h2><p>Take one wide photo showing the affected room or exterior area, then closer photos of visible stains, cracked grout, failed silicone, lifted tiles or the wall-floor junction. Include a reference point so the location is clear. For a bathroom leak, show the shower, screen, floor, adjacent wall and any affected room on the other side if safely accessible. For a balcony leak, include the door threshold, perimeter and visible area below.</p><h2>How should you photograph a leak?</h2><p>Use steady, well-lit images and avoid filters. Photograph the area when the symptom is visible, then note the date and whether it followed shower use, rain or another event. Do not remove tiles, cut sealant, enter a ceiling space or climb onto a roof to get a better view. A photo documents an observation; it cannot confirm the concealed water path or replace an on-site assessment.</p><h2>What should you send with the images?</h2><p>Include your Canberra suburb, the room or external area affected, when the water appears, how long the issue has been occurring and any previous repair that you know about. Mention whether the property is occupied and any access constraints. Avoid sending personal documents, faces, house numbers or unrelated private details. The Ellis team uses this information to prepare for a focused inspection and discuss the next step.</p><h2>Can photos confirm the final waterproofing repair cost?</h2><p>Photos can support an initial conversation, but concealed conditions, access, demolition and reinstatement can change the work scope. A written quote should identify the observed issue, included preparation, waterproofing or sealing work, retiling if required, exclusions and any related trade coordination. Plumbing faults and drainage repairs may need a separate trade scope.</p><p>See the relevant MEL ONE services for <a href="/services/leaking-shower-repairs/">leaking shower repairs</a>, <a href="/services/bathroom-waterproofing/">bathroom waterproofing and retiling</a>, or <a href="/services/balcony-waterproofing/">balcony waterproofing</a>. Send safe photos through the <a href="/contact/">Canberra waterproofing service form</a> to arrange an inspection and property-specific quote.</p>`
  },
  {
    path: 'industry-news/understanding-repair-scopes/index.html',
    oldTitle: 'Why a Clear Repair Scope Matters',
    title: 'What Should a Canberra Waterproofing Repair Quote Include?',
    description: 'A plain-English guide to the inspection, preparation, waterproofing, retiling and exclusions to check in a Canberra repair quote.',
    body: `<h2>What should a waterproofing repair quote include?</h2><p>A useful Canberra waterproofing quote describes the affected area, the observations made during inspection and the work proposed to address them. It should make clear whether the price covers investigation, access, surface preparation, removal of existing finishes, membrane installation, curing time, retiling, grout, silicone and clean-up. The exact items depend on the property and should be confirmed in writing before work starts.</p><h2>How do you compare waterproofing and leak repair quotes?</h2><p>Compare the scope, not only the headline price. Check that each quote describes a similar area, access method, materials, preparation and reinstatement. Ask what is included if damaged substrate is uncovered, how variations are approved and whether fixtures need to be removed. A quote for local shower resealing is not the same scope as removing tiles and replacing a concealed membrane.</p><h2>Are plumbing, roof and drainage repairs part of waterproofing?</h2><p>Not automatically. Waterproofing, plumbing, roof covering and stormwater drainage are distinct work categories. The inspection should identify the observed water path and state whether another licensed trade is needed. This prevents a surface seal or membrane renewal from being presented as a solution to an unrelated plumbing or drainage fault.</p><h2>Who carries out the work and confirms the scope?</h2><p>The Ellis team carries out the agreed MEL ONE work directly. Before starting, the property owner should receive a clear written record of inclusions, access requirements, sequence, quote validity and any exclusions. Ask questions when the proposed method does not match the affected area or the symptoms you have recorded. A scope should describe the work that will be done, without promising outcomes that cannot be confirmed before access.</p><p>For <a href="/services/bathroom-waterproofing/">bathroom waterproofing and retiling</a>, <a href="/services/shower-resealing-regrouting/">shower resealing and regrouting</a>, or <a href="/services/external-waterproofing/">external water-ingress repairs</a>, contact MEL ONE to discuss an on-site inspection and written Canberra waterproofing quote.</p>`
  }
];

for (const item of articles) {
  update(item.path, (html) => {
    let next = html.replaceAll(item.oldTitle, item.title);
    next = next.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${item.description}">`);
    next = next.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${item.description}">`);
    next = next.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${item.description}</p>`);
    const contentStart = next.indexOf('<h2>What to look for</h2>');
    const contactStart = next.indexOf('<div class="callout">', contentStart);
    if (contentStart < 0 || contactStart < 0) throw new Error(`Article body markers missing: ${item.path}`);
    return next.slice(0, contentStart) + item.body + next.slice(contactStart);
  });
}

const typo = 'MEL ONE organises waterproofing service service requests across Canberra’s nine districts.';
const fixed = 'Find MEL ONE waterproofing and leak repair services across Canberra’s nine districts, with local information for each area.';
update('service-areas/index.html', (html) => html.replaceAll(typo, fixed));

const guideTitle = 'Shower Regrouting & Resealing in Canberra: Will It Fix a Leaking Shower?';
update('guides/regrouting-resealing-or-rewaterproofing/index.html', (html) => html
  .replaceAll('Leaking Shower Repair: Regrouting, Resealing or Rewaterproofing?', guideTitle)
  .replace(/<title>[^<]*<\/title>/, `<title>${guideTitle} | MEL ONE</title>`)
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Learn when shower regrouting or resealing may help, when to inspect the waterproofing membrane, and how to choose a Canberra repair scope.">'));
update('index.html', (html) => html.replaceAll('Regrouting, Resealing or Rewaterproofing: What’s the Difference?', guideTitle));
update('guides/index.html', (html) => html.replaceAll('Regrouting, Resealing or Rewaterproofing: What’s the Difference?', guideTitle));
update('about/index.html', (html) => html.replaceAll(
  'The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.',
  'The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.',
));

update('industry-news/index.html', (html) => html
  .replace('A seasonal checklist for recording water entry, moisture marks and affected locations before making contact.', 'Check visible rainwater pathways, record when leaks appear and arrange a safe inspection before wet weather worsens the damage.')
  .replace('Send safe photos of the affected area with your Canberra suburb. The Ellis team inspects the affected area on site, explains the findings and confirms the repair plan and written quote.', 'Learn which safe photos and details help the Ellis team prepare for a Canberra waterproofing inspection and quote.')
  .replace('A clear written scope identifies what the contractor will inspect, repair, replace and reinstate before work starts.', 'Compare inspection, preparation, waterproofing, retiling and exclusions in a written Canberra repair quote.'));
