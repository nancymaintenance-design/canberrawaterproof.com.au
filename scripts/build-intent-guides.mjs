import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applySocialLinks } from './social-links.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const guides = [
  {
    slug: 'shower-plumbing-or-waterproofing', title: 'Leaking Shower in Canberra: Is It Plumbing or Waterproofing?', image: 'guide-shower-plumbing.jpg', alt: 'MEL ONE checking moisture at a shower wall and floor junction', service: ['leaking-shower-repairs', 'Leaking Shower Repairs'],
    intro: 'Water beside a shower can follow a pipe, waste fitting, screen edge or wet-area assembly. The timing and position of moisture help narrow the inspection path before a repair is chosen.',
    sections: [
      ['Is a shower leak from the plumbing or the waterproofing?', 'A supply-pipe fault may show water even when the shower is not in use. A waste or fitting problem can appear while water is draining. Moisture that follows shower spray may involve screen seals, tiled junctions or the concealed waterproofing layer. These are clues, not a diagnosis: testing and accessible inspection determine the actual path.'],
      ['What if the carpet next to the shower gets wet after use?', 'Record how soon the carpet becomes damp, whether the skirting or wall paint has changed and whether the pattern follows each shower. A wet adjacent room or bubbling paint behind a shower deserves attention because water may have travelled beyond the visible joint. Avoid repeatedly covering the surface with silicone before the source is understood.'],
      ['Can a leaking shower be repaired without removing tiles?', 'A local seal or grout repair may suit a confirmed surface-junction issue. If the membrane or substrate is affected, access beneath tiles and a defined waterproofing and retiling scope may be needed. A confirmed pipe or waste fault is plumbing work; MEL ONE identifies that task separately from the waterproofing scope. The right path depends on the finding, not on a universal no-tile-removal promise.'],
      ['What should you send when booking leaking shower repairs?', 'Share your Canberra suburb, when water appears, photos of the shower and adjacent damage, and any earlier resealing or regrouting. The Ellis team uses those details to prepare for an on-site assessment and explain whether the work is sealing or wet-area waterproofing. Plumbing faults require a licensed plumber.']
    ]
  },
  {
    slug: 'regrouting-resealing-or-rewaterproofing', title: 'Shower Regrouting & Resealing in Canberra: Will It Fix a Leaking Shower?', image: 'guide-resealing.jpg', alt: 'Shower grout, sealant and waterproofing layers shown during assessment', service: ['shower-resealing-regrouting', 'Shower Resealing & Regrouting'],
    intro: 'Grout, silicone and a waterproofing membrane do different jobs. Knowing which layer has failed helps a Canberra property owner choose a repair scope that addresses the water path.',
    sections: [
      ['Will regrouting fix a leaking shower?', 'Regrouting renews worn tile joints and can improve the finish of a shower. Grout is not a substitute for the waterproofing membrane behind or beneath the tiles. If a shower still leaks after regrouting, the source should be reassessed before another surface treatment is applied.'],
      ['When is shower resealing the right repair?', 'New silicone can address a confirmed gap at a screen edge, corner or fixture junction. Old sealant should be removed and the joint prepared before replacement. If moisture is reaching adjoining rooms through a deeper assembly fault, resealing the visible edge alone is unlikely to define the complete repair.'],
      ['When do shower tiles need to be removed for new waterproofing?', 'Tile removal may be required when the membrane, substrate or concealed junction needs access. The written scope should state the demolition area, preparation, membrane, curing, tiling, grout and silicone work. A shower-only repair can sometimes be scoped without renovating the whole bathroom, but the extent follows inspection.'],
      ['What should you ask before choosing regrouting or rewaterproofing?', 'Ask what water path has been identified, which materials will be removed, which surfaces will be treated and what finish will be restored. Tell MEL ONE where the grout, silicone or damp wall needs attention. We inspect the area on site and confirm the repair plan and written quote. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos. Do not remove finishes, climb onto roofs or approach hazards to take them.']
    ]
  },
  {
    slug: 'waterproofing-retiling-quote', title: 'Bathroom Waterproofing and Retiling Quote in Canberra: What Is Included?', image: 'guide-retile-quote.jpg', alt: 'MEL ONE measuring a bathroom for waterproofing and tiling work', service: ['bathroom-waterproofing', 'Bathroom Waterproofing & Retiling'],
    intro: 'A useful bathroom waterproofing quote separates removal, substrate work, membrane installation and tile reinstatement. That makes the proposed repair easier to compare and schedule.',
    sections: [
      ['What should a bathroom waterproofing and retiling quote include?', 'Check that the affected area, tile removal, disposal, substrate repairs, membrane system, wall and floor junctions, floor waste and threshold details are identified. The quote should also show tiling, grout, silicone, fixtures and any separate licensed work and whether it is included in the price. An itemised scope helps prevent a membrane-only quote being mistaken for a finished bathroom.'],
      ['Can only the shower be waterproofed instead of the whole bathroom?', 'The answer depends on the wet-area layout, how the existing waterproofing connects to adjoining surfaces and the condition found after access. A shower-only scope may be practical, while another property may need a larger repair area. Ask the contractor to mark the exact boundary and how the new work joins the retained finishes.'],
      ['How long before tiles can be installed over waterproofing?', 'Preparation, membrane coats and cure time depend on the specified product, substrate and site conditions. A quote should describe the sequence rather than promise a universal same-day finish. For a home with only one bathroom, discuss temporary access and scheduling before work begins.'],
      ['What information helps MEL ONE prepare a written quote?', 'Provide the Canberra suburb, bathroom size, clear photos, leak history and whether you have already purchased tiles. Explain if the shower must remain usable during part of the project. The Ellis team can explain the waterproofing and tiling labour, materials and finishing included in that property’s scope.']
    ]
  },
  {
    slug: 'balcony-leaking-room-below', title: 'Balcony Waterproofing in Canberra: Why Is the Room Below Leaking?', image: 'guide-balcony.jpg', alt: 'MEL ONE inspecting a balcony threshold and drainage detail', service: ['balcony-waterproofing', 'Balcony Waterproofing & Leak Repairs'],
    intro: 'A ceiling stain beneath a balcony is a sign of water entry, but the entry point may be at a tile joint, threshold, outlet or wall junction away from the stain.',
    sections: [
      ['What should be checked when a balcony leaks into the room below?', 'Record whether the stain follows ordinary rain, wind-driven rain or washing the balcony. The assessment should review accessible tiles, edge details, door thresholds, drainage outlets and the underside. Water can move along the assembly before it appears inside, so the visible ceiling mark does not prove the membrane failed directly above it.'],
      ['Does standing water on a balcony need drainage work or waterproofing?', 'Persistent pooling may indicate falls or outlet restrictions; moisture below may also involve membrane and junction details. Drainage and waterproofing are related but separate parts of the balcony system. The repair scope should state which issue is being addressed and whether both require work.'],
      ['Can balcony tiles be removed, waterproofing renewed and tiles replaced?', 'Yes, where inspection supports that scope. A written plan should identify tile and substrate removal, preparation, membrane and edge details, curing, new falls or drainage work if specified, and the final tiled finish. A local joint repair is a different service and should not be presented as a full membrane replacement.'],
      ['What should you send for a balcony leak assessment?', 'Share safe photos of the balcony surface, door threshold, outlets and room below, plus the timing of rain and any previous repairs. The Ellis team reviews this information before inspecting the Canberra balcony and setting out the waterproofing scope.']
    ]
  },
  {
    slug: 'kitchen-sink-resealing-or-plumbing', title: 'Kitchen Sink Leak in Canberra: Resealing or Plumbing Repair?', image: 'guide-kitchen.jpg', alt: 'MEL ONE inspecting moisture in a kitchen sink cabinet', service: ['kitchen-sealing', 'Kitchen Sealing & Resealing'],
    intro: 'A wet cabinet under a kitchen sink can result from water crossing the benchtop joint or from a supply, waste or appliance connection below. The repair depends on where water begins.',
    sections: [
      ['Why is the cupboard under my kitchen sink wet?', 'If moisture appears after wiping or splashing around the sink rim, the perimeter seal may be relevant. If water drips from a pipe, trap, mixer or dishwasher hose, a plumbing repair is the appropriate path. A swollen cabinet records the effect of moisture but does not identify its source.'],
      ['When should a kitchen sink be resealed?', 'Resealing is suitable when an accessible sink edge or benchtop junction is the confirmed water path. Failed silicone is removed, the surface is cleaned and dried, then a suitable new seal is applied. A fresh bead placed over a wet or leaking plumbing fitting will not resolve that fitting.'],
      ['Do I need a plumber or a kitchen sealing specialist?', 'You do not need to choose a trade before contacting MEL ONE. We check the source on site, reseal a confirmed surface junction and arrange a qualified plumber for supply or waste faults. The written quote identifies the repair work and responsible contractor before cabinet or finish repairs proceed.'],
      ['What details help with a kitchen sink leak service request?', 'Tell us whether water appears during washing, draining or while the taps are off. MEL ONE inspects the sink rim, cabinet and accessible connections on site, then confirms the cause, repair plan, qualified trade arrangements and written quote. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos. Do not remove finishes, climb onto roofs or approach hazards to take them.']
    ]
  },
  {
    slug: 'waterproofing-or-drainage', title: 'Waterproofing or Drainage in Canberra: Water Beside the House?', image: 'guide-drainage.jpg', alt: 'MEL ONE inspecting an external wall and downpipe after rain', service: ['external-waterproofing', 'External Waterproofing & Water Ingress Repairs'],
    intro: 'Water pooling beside a house after rain can involve surface falls, downpipes, drainage or the building envelope. The position and timing of water entry guide the repair investigation.',
    sections: [
      ['Do I need waterproofing or better drainage beside my house?', 'Standing water against an external wall is a drainage and ground-level observation; dampness inside may involve a separate wall or threshold detail. An inspection should trace runoff, outlets, downpipes, surface levels and accessible junctions before deciding whether drainage changes, sealing or waterproofing are required.'],
      ['What if rainwater comes under a back door?', 'Check when it happens, whether the water reaches the threshold from outside and whether the external surface slopes toward the door. A threshold seal, flashing or drainage change can each be relevant. Replacing one seal without reviewing the direction of water may leave the main cause untouched.'],
      ['Can a leaking retaining wall affect a garage after rain?', 'Yes, a garage wall next to retained soil can show dampness after rain. The symptom does not by itself establish whether the cause is drainage, a wall junction, membrane access or structural movement. A separate <a href="/services/retaining-wall-waterproofing/">retaining wall waterproofing service page</a> explains the investigation and scope boundaries.'],
      ['What should you record before booking external water-entry repairs?', 'Photograph the wall, ground, downpipes, outlets and interior moisture when safe. Note the rainfall pattern and whether ponding remains after rain. The Ellis team assesses the Canberra property’s waterproofing needs and identifies any separate drainage work in the written scope.']
    ]
  }
];

for (const guide of guides) {
  // The quotation guide is maintained as a longer project-specific article;
  // do not replace its comparison table, source links or visible FAQ.
  if (guide.slug === 'waterproofing-retiling-quote') continue;
  const file = resolve(root, 'guides', guide.slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  const description = guide.intro;
  const sections = guide.sections.map(([heading, body]) => `<section class="guide-answer"><h2>${heading}</h2><p>${body}</p></section>`).join('');
  const main = `<main id="main"><div class="wrap crumbs"><a href="/">Home</a> / <a href="/guides/">Guides</a> / ${guide.title}</div><article class="section wrap article intent-guide"><p class="eyebrow">MEL ONE guide</p><h1>${guide.title}</h1><p class="lede">${guide.intro}</p><figure class="guide-cover"><img src="/assets/${guide.image}" alt="${guide.alt}" loading="lazy" width="1586" height="992"><figcaption>Use the visible conditions and timing to choose the right inspection and repair scope.</figcaption></figure>${sections}<section class="guide-conclusion"><h2>How do you arrange the right Canberra waterproofing service?</h2><p>These scenarios help you describe the problem; the repair method follows a property-specific assessment. Contact MEL ONE with your suburb, affected area and timing. We arrange an on-site assessment, trace the water-entry cause and confirm the repair plan and written quote. Prior repair details help when available. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos. Do not remove finishes, climb onto roofs or approach hazards to take them. Review our <a href="/services/${guide.service[0]}/">${guide.service[1]}</a> service or <a href="/contact/">book an assessment online</a>. You can also call <a href="tel:+61482422607">0482 422 607</a>.</p></section></article></main>`;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${guide.title} | MEL ONE</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${guide.title} | MEL ONE">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<main id="main">[\s\S]*?<\/main>/, main)
    .replace(/<script type="application\/ld\+json">(?=[^<]*#service-faq)[\s\S]*?<\/script>/g, '');
  const schemaMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  const schema = JSON.parse(schemaMatch[1]);
  for (const item of schema['@graph']) {
    if (item['@type'] === 'WebPage') { item.name = guide.title; item.description = description; }
    if (item['@type'] === 'Article') { item.headline = guide.title; item.description = description; }
    if (item['@type'] === 'BreadcrumbList') item.itemListElement[2].name = guide.title;
  }
  html = html.replace(schemaMatch[0], `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  writeFileSync(file, applySocialLinks(html));
}
