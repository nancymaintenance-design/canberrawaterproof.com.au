import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyOnsiteResponseCopy } from './onsite-response-copy.mjs';
import { applySocialLinks } from './social-links.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pagePath = resolve(root, 'services', 'bathroom-waterproofing', 'index.html');
const description = 'Bathroom waterproofing and retiling in Canberra for leaking showers, failed membranes and wet-area damage. Book MEL ONE on 0482 422 607.';

const main = `<main id="main">
  <section class="page-intro service-hero">
    <div class="wrap service-hero-grid">
      <div>
        <p class="eyebrow">Ellis team · MEL ONE waterproofing</p>
        <h1>Bathroom Waterproofing &amp; Retiling in Canberra</h1>
        <p class="lede">A clearly scoped bathroom waterproofing and retiling service for leaking showers, failed wet-area finishes and bathrooms affected by water entry.</p>
        <div class="actions"><a class="button primary" href="#booking">Book Bathroom Waterproofing</a><a class="button secondary" href="tel:+61482422607">Call 0482 422 607</a></div>
        <p class="service-proof"><strong>10+ years of waterproofing experience.</strong> Trusted by 10,000+ customers across Australia, with a fast 30-minute response for Canberra service requests.</p>
      </div>
      <figure class="service-hero-image"><img src="/assets/service-bathroom.jpg" alt="MEL ONE technician assessing a bathroom waterproofing area in Canberra" width="1536" height="1024"><figcaption>Bathroom waterproofing starts with a clear assessment of the affected wet area and repair scope.</figcaption></figure>
    </div>
  </section>
  <article class="section wrap article service-story">
    <h2>Bathroom waterproofing that addresses the failed wet area, not just the visible symptom</h2>
    <p>Water staining, a leaking shower, loose tiles or failed silicone can be signs of a deeper wet-area issue. MEL ONE assesses the bathroom as a whole, including the shower base, wall-floor junctions, tiled finishes and nearby surfaces, before recommending the most suitable repair path for the property.</p>
    <p>Where the waterproofing system needs renewal, the service can bring removal, substrate preparation, waterproofing membrane work, retiling and finishing work into one written scope. This gives you a clear view of what the bathroom repair includes before work starts.</p>
    <figure class="detail-evidence"><img src="/assets/bathroom-membrane-application.png" alt="MEL ONE technician applying waterproofing membrane to a bathroom shower area" loading="lazy" width="1586" height="992"><figcaption><span class="evidence-label">Waterproofing membrane application</span><strong>The wet area is prepared before the membrane work begins</strong><p>This project image shows membrane application to the shower floor and wall junctions after the bathroom substrate has been prepared.</p></figcaption></figure>
    <h2>What the bathroom waterproofing service can include</h2>
    <p>Your written scope is tailored to the bathroom and the condition found on site. Depending on the repair required, MEL ONE can include the following work as clearly listed items:</p>
    <ul class="service-list"><li>Removal of affected tiles, fittings or finishes where access to the waterproofing area is required.</li><li>Preparation and repair of the substrate before a new wet-area membrane system is applied.</li><li>Waterproofing membrane work to the agreed bathroom, shower or floor-and-wall junction areas.</li><li>Retiling, grout, silicone and agreed finishing work to return the bathroom to a practical finished condition.</li></ul>
    <h2>A straightforward process from assessment to finished bathroom</h2>
    <ol class="service-steps"><li><strong>Tell us what you are seeing.</strong> Call us with the Canberra suburb, bathroom area affected, when the issue occurs and any safe photos you can provide.</li><li><strong>We define the repair scope.</strong> MEL ONE checks the relevant wet-area details and prepares a direct plan for the waterproofing, access and finishing work required.</li><li><strong>We complete the agreed work.</strong> The repair is delivered to the written scope, with waterproofing and retiling work coordinated as required for the bathroom.</li></ol>
    <section class="case-study">
      <div><p class="eyebrow">Documented MEL ONE project</p><h2>Canberra bathroom waterproofing and tiling project</h2><p>This real MEL ONE project record shows a bathroom before work, during waterproofing preparation and after the tiled shower area was completed. Every property has its own condition and work scope, but the sequence shows how a full wet-area repair is managed from assessment through to the finished result.</p><a class="button secondary" href="/case-studies/">View Bathroom Case Studies</a></div>
      <figure><img src="/assets/case-canberra-bathroom.jpg" alt="Before, during and after a MEL ONE bathroom waterproofing and tiling project in Canberra" loading="lazy" width="1448" height="1086"></figure>
    </section>
    <figure class="detail-evidence"><img src="/assets/bathroom-finished-wide.png" alt="Completed MEL ONE bathroom waterproofing and tiled shower area" loading="lazy" width="1586" height="992"><figcaption><span class="evidence-label">Completed bathroom result</span><strong>A finished tiled bathroom with a waterproofed shower area and floor drainage</strong><p>This completed bathroom shows the clean, practical finish achieved after the agreed wet-area waterproofing and tiling work.</p></figcaption></figure>
    <section class="service-booking" id="booking"><p class="eyebrow">Book MEL ONE</p><h2>How do you book bathroom waterproofing in Canberra?</h2><p>Call <a href="tel:+61482422607">0482 422 607</a> for a fast 30-minute response, or send the affected bathroom area, timing and safe photos through our <a href="/contact/">service booking form</a>. MEL ONE will use that information to prepare the right next step for your bathroom repair.</p><div class="grid related-services"><article class="card"><h3><a href="/services/leaking-shower-repairs/">Leaking Shower Repairs</a></h3><p>For shower bases, screens, tiled joints and water escaping during normal shower use.</p></article><article class="card"><h3><a href="/services/shower-resealing-regrouting/">Shower Resealing &amp; Regrouting</a></h3><p>For failed silicone, cracked grout and worn shower junctions that need targeted repair.</p></article></div></section>
    <section class="intent-summary"><h2>How can Canberra property owners arrange bathroom waterproofing and retiling for a leaking shower or failed wet area?</h2><p>MEL ONE provides bathroom waterproofing and retiling in Canberra for leaking showers, failed membranes and wet-area water entry. Share the bathroom location, symptoms, timing and safe photos so we can determine whether the next step is targeted repair or wet-area renewal.</p><p>For searches such as “bathroom waterproofing Canberra”, “bathroom waterproofing near me” or “who can repair a leaking shower?”, call <a href="tel:+61482422607">0482 422 607</a> or use the <a href="/contact/">waterproofing service form</a>. The final repair scope is confirmed for the property before work proceeds.</p></section>
  </article>
</main>`;

let html = readFileSync(pagePath, 'utf8');
html = html
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
  .replace(/"description":"Removal, preparation, waterproofing and retiling can be planned as one agreed scope\."/g, `"description":"${description}"`)
  .replace(/<main id="main">[\s\S]*?<\/main>/, main);
html = applySocialLinks(applyOnsiteResponseCopy(html, 'Canberra'));

writeFileSync(pagePath, html);
