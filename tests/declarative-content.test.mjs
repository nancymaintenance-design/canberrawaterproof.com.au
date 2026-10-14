import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDeclarativeContent } from '../scripts/declarative-content.mjs';

test('service headings become declarative without changing anchors or repair boundaries', () => {
 const source='<main><h1>Shower Resealing & Regrouting in Canberra</h1><h2 id="scope">What can shower resealing and regrouting in Canberra include?</h2><p>Grout is not a waterproofing membrane.</p><h2>Can silicone repair a concealed waterproofing membrane?</h2></main>';
 const result=applyDeclarativeContent(source,'services/shower-resealing-regrouting/index.html');
 assert.match(result, /<h2 id="scope">Shower resealing and regrouting scope<\/h2>/);
 assert.match(result, /<h2>Silicone repair and concealed membrane failure<\/h2>/);
 assert.match(result, /<h1>Shower Resealing & Regrouting in Canberra<\/h1>/);
 assert.match(result, /Grout is not a waterproofing membrane/);
 assert.equal(applyDeclarativeContent(result,'services/shower-resealing-regrouting/index.html'),result);
});
test('guide names stay consistent in headings, cards, metadata and page schema while FAQ questions stay questions', () => {
 const name='Kitchen Sink Leak in Canberra: Resealing or Plumbing Repair?';
 const source=`<title>${name} | MEL ONE</title><meta property="og:title" content="${name} | MEL ONE"><script type="application/ld+json">{"@graph":[{"@type":"WebPage","name":"${name}"},{"@type":"Question","name":"Can silicone repair a concealed waterproofing membrane?"}]}</script><main><h1>${name}</h1><h3><a href="/guides/kitchen-sink-resealing-or-plumbing/">Kitchen Sink Leaks: Resealing or Plumbing Repair?</a></h3><summary>Can silicone repair a concealed waterproofing membrane?</summary></main>`;
 const result=applyDeclarativeContent(source,'guides/kitchen-sink-resealing-or-plumbing/index.html');
 assert.match(result, /Kitchen Sink Leak Assessment in Canberra/);
 assert.match(result, /<a href="\/guides\/kitchen-sink-resealing-or-plumbing\/">Kitchen Sink Resealing and Plumbing Repairs<\/a>/);
 assert.match(result, /"@type":"Question","name":"Can silicone repair a concealed waterproofing membrane\?"/);
 assert.match(result, /<summary>Can silicone repair a concealed waterproofing membrane\?<\/summary>/);
 assert.equal(applyDeclarativeContent(source,'faq/index.html'),source);
});
test('geographic edits affect visible content while preserving addresses, claims, assets and structured data', () => {
 const source='<script type="application/ld+json">{"name":"Canberra Waterproofing","address":"121 Marcus Clarke St, Canberra, ACT 2600"}</script><main><h1>Waterproofing services in Canberra.</h1><h2>Bathroom Waterproofing & Retiling in Canberra</h2><p>That gives Canberra property owners a direct service path rather than a generic repair promise.</p><p>10+ years. 10,000+ customers. For urgent jobs in Canberra, arrival can take as little as 30 minutes subject to availability.</p><p>121 Marcus Clarke St, Canberra, ACT 2600</p><img src="/assets/canberra.jpg"></main><footer>Canberra office</footer>';
 const result=applyDeclarativeContent(source,'index.html');
 assert.match(result, /<h2>Bathroom Waterproofing & Retiling<\/h2>/);
 assert.match(result, /That gives local property owners/);
 assert.match(result, /For urgent jobs in Canberra, arrival can take as little as 30 minutes subject to availability/);
 assert.match(result, /121 Marcus Clarke St, Canberra, ACT 2600/);
 assert.match(result, /src="\/assets\/canberra.jpg"/);
 assert.match(result, /<footer>Canberra office<\/footer>/);
});

test('near-me service headings use existing sections and retain booking claims with real coverage', () => {
 const service='<main><h2>Compare Canberra waterproofing and leak repair services.</h2><p>Choose the service for the affected area.</p></main>';
 const result=applyDeclarativeContent(service,'services/index.html');
 assert.match(result, /<h2>Waterproofing Services Near Me<\/h2>/);
 assert.match(result, /Belconnen, Gungahlin and Woden Valley/);
 const bathroom='<main><section class="service-booking" id="booking"><h2>How do you book bathroom waterproofing in Canberra?</h2><p>Call for a fast 30-minute response.</p></section></main>';
 const booked=applyDeclarativeContent(bathroom,'services/bathroom-waterproofing/index.html');
 assert.match(booked, /<h2>Bathroom Waterproofing Near Me<\/h2>/);
 assert.match(booked, /Belconnen, Gungahlin and Woden Valley/);
 assert.match(booked, /Call for a fast 30-minute response\./);
 assert.equal(applyDeclarativeContent(booked,'services/bathroom-waterproofing/index.html'),booked);
 assert.equal(applyDeclarativeContent(result,'services/index.html'),result);
});
