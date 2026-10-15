import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const origin = 'https://www.canberrawaterproof.com.au';
const read = (file) => readFileSync(file, 'utf8');
const writeIfChanged = (file, before, after) => {
  if (before !== after) writeFileSync(file, after);
};

const homeFile = resolve('index.html');
let home = read(homeFile);
let hasFieldNotes = false;
home = home.replace(/<section class="field-notes section" aria-labelledby="field-notes-title">[\s\S]*?<\/section>/g, (section) => {
  if (hasFieldNotes) return '';
  hasFieldNotes = true;
  return section;
});
if (!hasFieldNotes) {
  const marker = '<section class="band section">';
  if (!home.includes(marker)) throw new Error('Home process section was not found');
  const fieldNotes = `<section class="field-notes section" aria-labelledby="field-notes-title"><div class="wrap field-notes-grid"><div class="field-notes-copy"><p class="eyebrow">MEL ONE field notes · Bathroom waterproofing</p><h2 id="field-notes-title">Canberra bathroom waterproofing, shown on site.</h2><p>See MEL ONE photographs of waterproofing membrane application and a completed tiled wet area. They show the work behind a bathroom repair scope, from the surfaces that need waterproofing to the finish people use every day.</p><a class="button primary" href="/case-studies/">View project photographs</a></div><figure class="field-notes-photo"><img src="/assets/bathroom-membrane-application.png" alt="MEL ONE technician applying membrane at a shower floor and wall junction" loading="lazy" width="1586" height="992"><figcaption><span>Field note</span> Waterproofing membrane application</figcaption></figure></div></section>`;
  home = home.replace(marker, `${fieldNotes}${marker}`);
}

const guideStart = home.indexOf('<p class="eyebrow">Guides for homeowners</p>');
if (guideStart < 0) throw new Error('Home guide section was not found');
const guideEnd = home.indexOf('</section>', guideStart);
if (guideEnd < 0) throw new Error('Home guide section has no end');
home = home.slice(0, guideStart)
  + home.slice(guideStart, guideEnd).replaceAll('<p class="eyebrow">Ellis team · MEL ONE waterproofing</p>', '<p class="eyebrow">MEL ONE guide</p>')
  + home.slice(guideEnd);
home = home.replace(
  '<img src="/assets/mel-one-hero-bathroom.jpg"',
  '<img fetchpriority="high" src="/assets/mel-one-hero-bathroom.jpg"',
);
writeIfChanged(homeFile, read(homeFile), home);

const servicesFile = resolve('services/index.html');
let services = read(servicesFile);
if (!services.includes('<aside class="field-note-rail"')) {
  const marker = '<section class="scope-matrix">';
  if (!services.includes(marker)) throw new Error('Service scope section was not found');
  const rail = `<aside class="field-note-rail"><div class="wrap field-note-rail-inner"><div><p class="eyebrow">MEL ONE field notes</p><h2>See bathroom waterproofing work on site.</h2><p>Browse original photographs of membrane application and a finished tiled wet area before discussing the right repair scope for your property.</p></div><a class="button primary" href="/case-studies/">View project photographs</a></div></aside>`;
  services = services.replace(marker, `${rail}${marker}`);
}
writeIfChanged(servicesFile, read(servicesFile), services);

const caseFile = resolve('case-studies/index.html');
let caseStudy = read(caseFile);
const article = `<article class="section wrap article field-notes-page"><div class="field-notes-lead"><p class="eyebrow">MEL ONE field notes</p><h2>Photographs that show the work.</h2><p>These MEL ONE photographs show two useful views of bathroom waterproofing: membrane being applied at a shower floor and wall junction, and the finished tiled wet area. They help explain the work involved without standing in for an assessment of your property.</p></div><section class="field-note-stage" aria-labelledby="application-stage"><figure><img src="/assets/bathroom-membrane-application.png" alt="Waterproofing membrane being applied to a shower floor and wall junctions" width="1586" height="992"><figcaption>Application stage · Shower floor and wall junction</figcaption></figure><div class="field-note-stage-copy"><span class="field-note-marker">Application stage</span><h2 id="application-stage">Bathroom waterproofing membrane application</h2><p>The photograph shows membrane being rolled across the shower floor, with waterproofing visible at the surrounding wall junctions and beside the floor drain. Preparation, junction details and drainage are checked as part of the agreed work scope.</p><a href="/services/bathroom-waterproofing/">Explore bathroom waterproofing and retiling →</a></div></section><section class="field-note-stage" aria-labelledby="finished-stage"><figure><img src="/assets/bathroom-finished-wide.png" alt="Finished tiled bathroom with shower screen, threshold and floor drains" loading="lazy" width="1586" height="992"><figcaption>Finished wet area · Tiling, screen and drainage details</figcaption></figure><div class="field-note-stage-copy"><span class="field-note-marker">Finished wet area</span><h2 id="finished-stage">The tiled bathroom finish</h2><p>This completed wet-area photograph shows tiled floors and walls, a shower screen, threshold and floor drains. The materials, reinstatement work and return-to-use arrangements for your property are confirmed in its own written repair scope.</p><a href="/services/leaking-shower-repairs/">Explore leaking shower repairs →</a></div></section><section class="case-photo-request" aria-labelledby="case-photo-request-title"><p class="eyebrow">Real project photos to be added</p><h2 id="case-photo-request-title">MEL ONE waterproofing case studies</h2><p>These reserved slots are not project evidence. They will be replaced with authorised photographs from completed MEL ONE work, with property details and customer identities protected.</p><div class="grid case-photo-grid"><figure><div class="case-photo-placeholder"><div><span>BEFORE WORK</span><small>Existing condition · 1200 × 800 px or larger</small></div></div><figcaption>Before · Affected area and visible condition</figcaption></figure><figure><div class="case-photo-placeholder"><div><span>DURING WATERPROOFING</span><small>Preparation or membrane work · 1200 × 800 px or larger</small></div></div><figcaption>During · Repair stage and work detail</figcaption></figure><figure><div class="case-photo-placeholder"><div><span>COMPLETED RESULT</span><small>Finished area · 1200 × 800 px or larger</small></div></div><figcaption>After · Completed repair or reinstated finish</figcaption></figure></div><p class="case-photo-note">Use landscape 3:2 images from the same project where possible. Please confirm permission to publish; omit faces, street numbers and identifying property details unless the owner has approved them.</p></section><div class="field-notes-next"><p class="eyebrow">Your property is the next field note</p><h2>Arrange a Canberra waterproofing assessment.</h2><p>Send the suburb, affected area, when water appears and any safe photographs. MEL ONE can then discuss an on-site assessment and a property-specific repair scope.</p><div class="actions"><a class="button primary" href="/contact/">Book a Waterproofing Assessment</a><a class="button secondary" href="tel:+61482422607">Call 0482 422 607</a></div></div></article>`;
const outerArticle = /<article class="section wrap article(?: field-notes-page)?">[\s\S]*?<\/article>/;
if (!outerArticle.test(caseStudy)) throw new Error('Case-study article was not found');
caseStudy = caseStudy.replace(outerArticle, article);
const casePhotoAssets = [
  [/<figure><div class="case-photo-placeholder"><div><span>BEFORE WORK<\/span>[\s\S]*?<\/div><\/div><figcaption>Before · Affected area and visible condition<\/figcaption><\/figure>/, '<figure><img src="/assets/balcony-waterproofing-before.png" alt="Balcony before waterproofing, showing water damage and deteriorated wall-floor junctions" loading="lazy" width="1536" height="1024"><figcaption>Before · Water damage and deteriorated balcony junction</figcaption></figure>'],
  [/<figure><div class="case-photo-placeholder"><div><span>DURING WATERPROOFING<\/span>[\s\S]*?<\/div><\/div><figcaption>During · Repair stage and work detail<\/figcaption><\/figure>/, '<figure><img src="/assets/balcony-waterproofing-during.png" alt="Ellis team member applying waterproofing to the balcony wall-floor junction" loading="lazy" width="1536" height="1024"><figcaption>During · Waterproofing applied to balcony junctions</figcaption></figure>'],
  [/<figure><div class="case-photo-placeholder"><div><span>COMPLETED RESULT<\/span>[\s\S]*?<\/div><\/div><figcaption>After · Completed repair or reinstated finish<\/figcaption><\/figure>/, '<figure><img src="/assets/balcony-waterproofing-after.png" alt="Completed balcony waterproofing with a continuous grey waterproof coating across the floor and wall junction" loading="lazy" width="1536" height="1024"><figcaption>After · Completed balcony waterproofing finish</figcaption></figure>'],
];
for (const [pattern, replacement] of casePhotoAssets) {
  if (!pattern.test(caseStudy)) throw new Error('A balcony case-study photo slot was not found');
  caseStudy = caseStudy.replace(pattern, replacement);
}
caseStudy = caseStudy.replace('These reserved slots are not project evidence. They will be replaced with authorised photographs from completed MEL ONE work, with property details and customer identities protected.', 'This balcony waterproofing project is shown in before, during and completed stages. The photographs show visible site conditions and work progress; each property still requires its own inspection and agreed scope.');
caseStudy = caseStudy.replace('Use landscape 3:2 images from the same project where possible. Please confirm permission to publish; omit faces, street numbers and identifying property details unless the owner has approved them.', 'The Ellis team assesses each balcony’s water-entry path, accessible junctions and drainage before confirming the repair scope.');
writeIfChanged(caseFile, read(caseFile), caseStudy);

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const file = join(dir, item.name);
    if (item.isDirectory() && !['.git', 'node_modules'].includes(item.name)) return htmlFiles(file);
    return item.isFile() && item.name === 'index.html' ? [file] : [];
  });
}

for (const file of htmlFiles('.')) {
  const before = read(file);
  if (before.includes('<meta property="og:image"')) continue;
  const main = before.match(/<main\b[\s\S]*?<\/main>/)?.[0] || '';
  const asset = main.match(/<img[^>]*src="(\/assets\/[^"]+)"/)?.[1]
    || '/assets/mel-one-hero-bathroom.jpg';
  const image = `<meta property="og:image" content="${origin}${asset}">`;
  writeIfChanged(file, before, before.replace('<link rel="stylesheet" href="/assets/site.css">', `${image}<link rel="stylesheet" href="/assets/site.css">`));
}
