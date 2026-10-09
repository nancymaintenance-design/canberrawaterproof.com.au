import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['.'];
const excluded = new Set(['.git', 'node_modules', 'tests']);
const extensions = new Set(['.html', '.mjs']);
const replacements = [
  ['MEL ONE brings 10+ years of waterproofing experience, 10,000+ customers across Australia and a fast 30-minute response for Canberra service requests.', 'The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.'],
  ['For regulated work, MEL ONE identifies the responsible licensed contractor and records the service scope before work begins.', 'The Ellis team completes MEL ONE’s agreed waterproofing work. If a task requires a separate licence, the written scope names the licensed person responsible before work begins.'],
  ['For work that requires a specific licence or specialist trade, the quote identifies the responsible appropriately licensed contractor before the work proceeds.', 'The Ellis team completes the agreed waterproofing scope. If a task requires a separate licence, the quote names the licensed person responsible for that task before work begins.'],
  ['Waterproofing, tiling and building-envelope issues can need different expertise, and the responsible appropriately licensed contractor should be identified for regulated work.', 'The Ellis team completes the agreed waterproofing work. If the repair also needs a separately licensed plumbing, electrical or building task, the quote names the licensed person responsible for it.'],
  ['MEL ONE arranges the on-site assessment, identifies the cause and confirms the repair scope and written quote.', 'Our Ellis team inspects the affected area on site, explains the findings and confirms the repair scope and written quote.'],
  ['MEL ONE arranges an on-site assessment and confirms the repair scope and written quote.', 'Our Ellis team inspects the affected area on site and confirms the repair scope and written quote.'],
  ['MEL ONE arranges on-site waterproofing assessments in Canberra and confirms the repair scope and written quote, including preparation, materials, finishing and handover.', 'The Ellis team assesses Canberra properties on site and provides a written waterproofing scope covering preparation, materials, finishes and handover.'],
  ['MEL ONE will use that information to prepare the right next step.', 'Our Ellis team reviews those details and discusses the next step with you.'],
  ['MEL ONE takes waterproofing and leak-repair service requests across Canberra.', 'The Ellis team carries out MEL ONE waterproofing and leak-repair work across Canberra.'],
  ['Sealing around sinks, splashbacks and benchtop junctions; plumbing faults are directed to the appropriate trade.', 'The Ellis team seals sink, splashback and benchtop junctions. A leaking pipe or tap is identified separately as plumbing work.'],
  ['Resealing and finishing work, with plumbing concerns directed to the appropriate trade pathway.', 'Resealing and finishing by the Ellis team; a leaking pipe or tap is identified separately as plumbing work.'],
  ['Specialist roofing work is coordinated where the condition calls for that trade.', 'If a roof-covering repair needs a licensed roofer, the quote lists that task separately from the Ellis team’s waterproofing work.'],
  ['Agreed sealing, waterproofing, drainage or trade-coordination steps for the confirmed scope.', 'The Ellis team completes the agreed sealing and waterproofing work; any separate drainage or licensed roofing task is listed clearly in the quote.'],
  ['trade coordination and how variations will be handled', 'the work the Ellis team completes, any separately licensed tasks and how variations will be handled'],
  ['the appropriate repair pathway and trade coordination.', 'the waterproofing scope and explains if a separately licensed task is also needed.'],
  ['plumbing concerns directed to the appropriate trade pathway.', 'plumbing work identified separately from the Ellis team’s sealing scope.'],
  ['plumbing faults are directed to the appropriate trade.', 'pipe or tap faults are identified separately as plumbing work.'],
  ['the waterproofing work be coordinated with appliance and plumbing installation without confusing the two scopes.', 'the Ellis team’s waterproofing work is listed clearly alongside any separate appliance or plumbing work.'],
  ['Coordination of waterproofing, tiling and finishing stages; plumbing connections remain a separate trade task.', 'The Ellis team completes the listed waterproofing, tiling and finishing; licensed plumbing connections are listed separately.'],
  ['MEL ONE can use those details to arrange an assessment and explain whether the service is sealing, plumbing coordination or wet-area waterproofing.', 'The Ellis team uses those details to prepare for an on-site assessment and explain whether the work is sealing or wet-area waterproofing. Plumbing faults require a licensed plumber.'],
  ['MEL ONE can use this information to arrange a Canberra balcony waterproofing assessment and define the next step.', 'The Ellis team reviews this information before inspecting the Canberra balcony and setting out the waterproofing scope.'],
  ['MEL ONE can use that evidence to plan an external waterproofing or drainage assessment for the Canberra property.', 'The Ellis team assesses the Canberra property’s waterproofing needs and identifies any separate drainage work in the written scope.'],
  ['MEL ONE can then discuss the waterproofing and tiling labour, materials and finishing scope relevant to that property.', 'The Ellis team can explain the waterproofing and tiling labour, materials and finishing included in that property’s scope.'],
  ['MEL ONE team coordinating work on site beside a MEL ONE work vehicle', 'Ellis waterproofing team members preparing for work beside a MEL ONE vehicle'],
  ['MEL ONE team reviewing a work scope and preparing equipment at a job site', 'Ellis team members reviewing the waterproofing work scope and preparing equipment on site'],
  ['<figcaption><strong>Coordination on site</strong><span>Planning, tools and the work area are brought together before agreed tasks proceed.</span></figcaption>', '<figcaption><strong>Our team on site</strong><span>Ellis team members inspect the work area and prepare for the agreed waterproofing tasks.</span></figcaption>'],
  ['<p class="eyebrow">How a Canberra waterproofing service request is arranged</p>', '<p class="eyebrow">The Ellis waterproofing team in Canberra</p>'],
  ['<h2 id="about-workflow">A clear path from service request to next step.</h2>', '<h2 id="about-workflow">Our team inspects, scopes and completes the work.</h2>'],
  ['<h3>Confirm the condition</h3><p>We review the information available and clarify practical details such as access, the building type, visible damage, previous work and any specialist trade requirements.</p>', '<h3>Inspect the affected area</h3><p>Our Ellis team reviews the information and checks accessible details such as the building type, visible damage, previous repairs and the waterproofing work required.</p>'],
  ['<h3>Agree the scope</h3><p>Before work is booked, the quote or agreed documentation sets out inclusions, exclusions, responsible parties, timing and any licence information relevant to the work.</p>', '<h3>Complete the agreed scope</h3><p>The written quote sets out the waterproofing and finishing work our Ellis team will complete, along with timing and any separately licensed task that may be required.</p>'],
  ['MEL ONE team coordinating work on site', 'Ellis waterproofing team working on site'],
  ['Planning, tools and the work area are brought together before agreed tasks proceed.', 'Our Ellis team checks site conditions and prepares the area before waterproofing work begins.'],
  ['MEL ONE identifies the responsible appropriately licensed contractor before the work proceeds.', 'The Ellis team completes the agreed waterproofing work; any separately licensed task is named in the quote before work begins.'],
  ['<p class="eyebrow">MEL ONE service</p>', '<p class="eyebrow">Ellis team · MEL ONE waterproofing</p>'],
  ['<p class="eyebrow">MEL ONE waterproofing service</p>', '<p class="eyebrow">Ellis team · MEL ONE waterproofing</p>'],
  ['MEL ONE arranges an on-site assessment and confirms the repair scope and written quote.', 'Our Ellis team inspects the affected area on site and confirms the repair scope and written quote.'],
  ['MEL ONE delivers', 'The Ellis team completes'],
  ['Waterproofing, drainage-related coordination, retiling and finishing work listed in the written scope.', 'The Ellis team completes the listed waterproofing, retiling and finishing work; any separate drainage task is identified clearly.'],
  ['Written coordination of any specialist roof or trade work before a repair method is selected.', 'A clear written scope for the Ellis team’s waterproofing work and any separately licensed roof or drainage task before work begins.'],
  ['Definition of any access, excavation, drainage or specialist structural input needed before a wall membrane is specified.', 'The Ellis team checks access, excavation and drainage conditions before defining the waterproofing scope; any specialist structural task is listed separately.'],
  ['what needs further trade input', 'whether separate licensed work is required'],
  ['related trade work included in the price', 'separate licensed work and whether it is included in the price'],
  ['who arranges it and whether it is included in the quoted total', 'who completes the work and whether it is included in the quoted total'],
  ['MEL ONE provides waterproofing and leak repair services across Canberra.', 'The Ellis team carries out MEL ONE waterproofing and leak repair work across Canberra.'],
  ['A clear description helps MEL ONE prepare the right service response.', 'A clear description helps the Ellis team discuss the repair directly with you.'],
  ['Your service request is sent securely to MEL ONE. We use your details only to respond to this request; do not include financial, identity or access information.', 'Your details go securely to MEL ONE’s Ellis team for a direct response. We use them only to respond to this request; do not include financial, identity or access information.'],
  ['Choose a suitable time for MEL ONE to respond and arrange the service.', 'The Ellis team confirms an assessment time and the agreed waterproofing work with you.'],
  ['Before work proceeds, the agreed scope records inclusions, access requirements and any related trade coordination.', 'Before work proceeds, the written scope records the waterproofing tasks the Ellis team will complete, access requirements and any separate licensed work.'],
  ['MEL ONE arranges the on-site assessment, identifies the cause and confirms the repair plan and written quote.', 'The Ellis team inspects the affected area on site, explains the findings and confirms the repair plan and written quote.'],
  ['MEL ONE arranges the on-site assessment, identifies the water-entry cause and confirms the repair plan and written quote.', 'The Ellis team inspects the affected area on site, explains the findings and confirms the repair plan and written quote.'],
  ['MEL ONE provides a clear quote based on the affected area, access, preparation, materials, finishes, specialist trades and the agreed scope.', 'MEL ONE provides a clear quote for the affected area, access, preparation, materials, finishes and the agreed waterproofing scope, identifying any separate licensed task.'],
  ['Contact MEL ONE to arrange an on-site assessment in Canberra, identify the cause and confirm the repair plan and written quote.', 'Contact MEL ONE for the Ellis team to inspect the affected area in Canberra, explain the findings and confirm the repair plan and written quote.'],
  ['How does the Ellis team complete ${s.core} service from assessment to completion?', 'How does the Ellis team carry out ${s.core} from assessment to completion?'],
  ['membranes, sealants and made-to-order items need to align with the agreed sequence, drying times and specialist trade work.', 'membranes, sealants and made-to-order items need to align with the agreed sequence and drying times; any separate licensed task is identified in the written scope.'],
  ['MEL ONE reviews the property context, the timing of water entry and the relevant junctions before setting out the practical next step.', 'The Ellis team inspects the affected area, considers when water enters and checks accessible junctions before defining the waterproofing scope.'],
  ['Tell us where the problem is. MEL ONE helps homeowners, landlords and property managers clarify the next step for bathrooms, showers, balconies, kitchens and external water entry.', 'The Ellis team carries out waterproofing repairs for homeowners, landlords and property managers across bathrooms, showers, balconies, kitchens and external areas. Tell us where the problem is to discuss the right repair scope.'],
  ['Plumbing, drainage and specialist roof work are directed through the appropriate scope.', 'The Ellis team completes the agreed waterproofing work. Any separately licensed plumbing, drainage or roofing task is identified clearly in the written quote.'],
];

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    if (item.isDirectory()) return excluded.has(item.name) ? [] : filesUnder(join(directory, item.name));
    return item.isFile() && extensions.has(item.name.slice(item.name.lastIndexOf('.'))) ? [join(directory, item.name)] : [];
  });
}

for (const root of roots) {
  for (const file of filesUnder(root)) {
    if (file.endsWith('rewrite-ellis-team-voice.mjs')) continue;
    const before = readFileSync(file, 'utf8');
    let after = before;
    for (const [from, to] of replacements) after = after.replaceAll(from, to);
    after = after
      .replaceAll('MEL ONE arranges an on-site assessment', 'The Ellis team assesses the property on site')
      .replaceAll('How does MEL ONE manage a ', 'How does the Ellis team complete ')
      .replaceAll('How does the Ellis team complete ', 'How does the Ellis team carry out ')
      .replaceAll('How The Ellis team completes ', 'How the Ellis team carries out ')
      .replaceAll(' service from assessment to completion?', ' from assessment to completion?')
      .replaceAll('How MEL ONE delivers ', 'How the Ellis team completes ')
      .replaceAll('MEL ONE manages the service request', 'The Ellis team handles your service request directly')
      .replaceAll('MEL ONE responds to your service request', 'The Ellis team responds to your service request');
    if (after !== before) writeFileSync(file, after);
  }
}
