import {materialsPath,materialsTitle,materialsDescription,materialsIntro,materialsSections,materialsFaq,materialsSources} from '../data/materials-guide.mjs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function materialsGuideArticle(){
 const toc=materialsSections.map(s=>`<li><a href="#${s.id}">${esc(s.title[0])}</a></li>`).join('');
 const sections=materialsSections.map(s=>`<section class="deep-guide-section" aria-labelledby="${s.id}"><h2 id="${s.id}">${esc(s.title[0])}</h2><div class="deep-guide-copy">${s.paragraphs.map(([p])=>`<p>${esc(p)}</p>`).join('')}</div></section>`).join('');
 const questions=materialsFaq.map(([,q,,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
 return `<article class="section wrap deep-guide"><header class="deep-guide-heading"><p class="eyebrow">Waterproofing materials and installation systems</p><h1>${esc(materialsTitle[0])}</h1><p class="lede">${esc(materialsIntro[0])}</p><p class="deep-guide-byline">Reviewed 22 October 2026 · MEL ONE</p></header><div class="deep-guide-layout"><nav class="deep-guide-toc" aria-label="Article contents"><h2>Waterproofing materials guide contents</h2><ol>${toc}</ol><p><a href="#guide-questions">Related questions</a> · <a href="#guide-sources">Services and projects</a></p></nav><div class="deep-guide-overview"><section class="deep-guide-summary" aria-labelledby="guide-summary"><h2 id="guide-summary">Materials, sheet membranes and installation checks</h2><p>Choose materials by location, substrate and exposure; understand sheet, PVC, TPO and polymer-cement systems before agreeing to the work.</p><p><a href="/services/bathroom-waterproofing/">Bathroom Waterproofing &amp; Retiling</a> · <a href="/services/balcony-waterproofing/">Balcony Waterproofing &amp; Leak Repairs</a> · <a href="/services/roof-waterproofing/">Roof Waterproofing</a> · <a href="/services/retaining-wall-waterproofing/">Retaining Wall Waterproofing</a></p></section></div></div><div class="deep-guide-body">${sections}</div><section class="deep-guide-questions" aria-labelledby="guide-questions"><h2 id="guide-questions">Material and waterproofing system questions</h2><div class="deep-guide-copy">${questions}</div></section><section class="deep-guide-section" aria-labelledby="guide-sources"><h2 id="guide-sources">Manufacturer documentation for waterproofing materials</h2><div class="deep-guide-copy"><p>Manufacturer examples reviewed for this guide: ARDEX WPM 155 Rapid Plus, WPM 185, WPM 750 and WPM 300; Gripset 38FC, C-1P, 2P and 51; Sika Sarnafil G 410-20 L, Sikaplan ranges, Sikalastic-488 and SikaRoof MTC-12 UV; Xypex concrete treatments. Check the current Australian data for the exact proposed system.</p><p>Australian manufacturer instructions, ACT building-code adoption information and wet-area guidance support the material discussion. Confirm the applicable project requirements and the exact proposed system with the responsible building professional.</p><p><a href="/guides/waterproofing-retiling-quote/">Waterproofing &amp; Retiling Quote Guide</a> · <a href="/guides/waterproofing-or-drainage/">Waterproofing or Drainage Guide</a></p><p>Arrange an on-site assessment and written quote for the waterproofing required at your property.</p><div class="actions"><a class="button primary" href="/contact/#service-form">Request assessment</a><a class="button secondary" href="tel:+61482422607">Call 0482 422 607</a></div></div></section></article>`;
}
export function addMaterialsFaq(html){
 for(const [id,q,,a] of materialsFaq){
  const block=`<details id="${id}"><summary>${esc(q)}</summary><p>${esc(a)}</p><p><a href="${materialsPath}">Read the waterproofing materials guide</a></p></details>`;
  if(html.includes(`id="${id}"`))html=html.replace(new RegExp(`<details id="${id}">[\\s\\S]*?<\\/details>`),block);
  else html=html.replace('<p class="faq-source-note">',block+'<p class="faq-source-note">');
 }
 return html;
}
export function applyMaterialsContent(html,file){
 if(file===materialsPath.slice(1)+'index.html'){
  html=html.replace(/(<meta[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/g,'$1'+esc(materialsDescription[0])+'$2');
  html=html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/,materialsGuideArticle()).replace(/<script id="llm-entity-json" type="application\/json">[\s\S]*?<\/script>/g,'');
  const host='https://www.canberrawaterproof.com.au';
  const matrix={article_metadata:{title:materialsTitle[0],url:host+materialsPath,language:'en-AU',date_modified:'2026-10-22'},knowledge_matrix:{sections:materialsSections.map(s=>({id:s.id,title:s.title[0],content:s.paragraphs.map(([p])=>p).join(' ')})),questions:materialsFaq.map(([,q,,a])=>({question:q,answer:a})),sources:materialsSources,related_services:['bathroom-waterproofing','balcony-waterproofing','roof-waterproofing','retaining-wall-waterproofing'].map(s=>host+'/services/'+s+'/')}};
  return html.replace('</head>','<script id="llm-entity-json" type="application/json">'+JSON.stringify(matrix).replaceAll('<','\\u003c')+'</script></head>');
 }
 if(file==='guides/index.html'&&!html.includes(`href="${materialsPath}"`)){
  const card=`<article class="card"><h2><a href="${materialsPath}">${esc(materialsTitle[0])}</a></h2><p>Choose materials by location, substrate and exposure; understand sheet, PVC, TPO and polymer-cement systems before agreeing to the work.</p></article>`;
  html=html.replace(/(<div class="grid">)/,'$1'+card);
 }
 return html;
}
