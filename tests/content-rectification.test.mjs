import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {applySeoHtml,applySitemap} from '../scripts/apply-seo-maintenance.mjs';
import {applyDeclarativeContent} from '../scripts/declarative-content.mjs';
import {applyKeywordHeadings} from '../scripts/keyword-headings.mjs';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const slugs=['leaking-shower-repairs','shower-resealing-regrouting','balcony-waterproofing','kitchen-sealing','external-waterproofing','laundry-waterproofing','roof-waterproofing','retaining-wall-waterproofing'];
const specifics={
 'leaking-shower-repairs':[/screen edges/i,/supply or waste/i,/adjacent room/i],
 'shower-resealing-regrouting':[/old silicone/i,/movement joints/i,/membrane/i],
 'balcony-waterproofing':[/threshold/i,/outlet/i,/strata/i],
 'kitchen-sealing':[/sink rim/i,/splashback/i,/cabinet/i],
 'external-waterproofing':[/window perimeter/i,/door threshold/i,/wall.base/i],
 'laundry-waterproofing':[/washing.machine/i,/floor waste/i,/installation requirements/i],
 'roof-waterproofing':[/penetration/i,/flashing/i,/safe access/i],
 'retaining-wall-waterproofing':[/soil.side/i,/excavation/i,/structural/i],
};
test('each template service explains its inspection, repair limits and access without recycled body paragraphs',()=>{
 for(const slug of slugs){const p=`services/${slug}/index.html`,h=applySeoHtml(read(p),p);
  assert.doesNotMatch(h,/Visible damage can be a useful starting point|That gives local property owners a direct service path|Your written scope is tailored to the location and condition found on site|We review the accessible details, identify the appropriate repair pathway/);
  for(const pattern of specifics[slug])assert.match(h,pattern,slug);
  assert.match(h,/on-site assessment/);assert.match(h,/written quote/);
  assert.equal(applySeoHtml(h,p),h,slug+' idempotence');
 }
});
test('maintenance keeps every protected scene and existing service photograph',()=>{
 const keywords=JSON.parse(read('data/keyword-content-sections.json'));
 for(const [p,block] of Object.entries(keywords)){
  const original=read(p),out=applySeoHtml(original,p,{keywords});
  assert.ok(out.includes('<!-- keyword-content-expansion:start -->'));
  const paragraphs=applyDeclarativeContent(applyKeywordHeadings(block,p),p).match(/<p\b[\s\S]*?<\/p>/g)||[];
  for(const paragraph of paragraphs)assert.ok(out.includes(paragraph),p+' protected paragraph');
  for(const m of original.matchAll(/<img\b[^>]*src="([^"]+)"/g))assert.ok(out.includes(`src="${m[1]}"`),p+' '+m[1]);
 }
});
test('headings are topical declarative statements without concatenated template labels',()=>{
 for(const slug of [...slugs,'bathroom-waterproofing','tile-regrouting','commercial-waterproofing']){
  const p=`services/${slug}/index.html`,h=applySeoHtml(read(p),p);
  assert.doesNotMatch(h,/warning signs and repair suitability|waterproofing and water ingress repairs assessment and completion|<p>No\./);
  for(const m of h.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g))assert.doesNotMatch(m[1],/\?|straightforward|near me|What the|not just/i);
  assert.match(h,/<h1>[^<]*Canberra/);
 }
});
test('case hub identifies photograph evidence and relevant anchors without inventing project results',()=>{
 const p='case-studies/index.html',h=applySeoHtml(read(p),p);
 assert.match(h,/not presented as a same-job before-and-after/i);
 for(const id of ['bathroom-work','balcony-stages','tile-joints','commercial-roof','isaacs-roof'])assert.ok(h.includes(`id="${id}"`),id);
 for(const slug of ['bathroom-waterproofing','balcony-waterproofing','tile-regrouting','commercial-waterproofing','roof-waterproofing'])assert.ok(h.includes(`/services/${slug}/`));
 assert.match(h,/April 2026/);assert.match(h,/chimney, ventilation outlets and eaves drainage outlets/);
 assert.doesNotMatch(h,/leak.free|guaranteed|flood.test passed|completed in \d|TODO|evidence pending/i);
 assert.equal(applySeoHtml(h,p),h);
});
test('shared navigation restores Projects in regenerated shells and contextual links resolve',()=>{
 const shell='<html><head></head><body><header><nav class="nav"><a href="/guides/">Guides</a></nav></header><main><h1>Waterproofing in Aranda</h1></main><footer><a href="/guides/">Guides</a></footer></body></html>';
 const h=applySeoHtml(shell,'waterproofing/aranda/index.html');
 assert.match(h,/<nav[^>]*class="nav"[\s\S]*href="\/case-studies\/"/);
 assert.match(h,/<footer[\s\S]*href="\/case-studies\/"/);
 assert.equal(applySeoHtml(h,'waterproofing/aranda/index.html'),h);
 for(const p of ['services/balcony-waterproofing/index.html','services/roof-waterproofing/index.html','guides/balcony-leaking-room-below/index.html']){
  const out=applySeoHtml(read(p),p),main=out.match(/<main\b[\s\S]*?<\/main>/)[0];
  const links=[...main.matchAll(/href="(\/case-studies\/#([^"]+))"/g)];assert.ok(links.length,p);
  for(const m of links)assert.ok(applySeoHtml(read('case-studies/index.html'),'case-studies/index.html').includes(`id="${m[2]}"`),m[1]);
 }
});
test('collection cards begin with H2 while retaining images and destinations',()=>{
 for(const p of ['services/index.html','guides/index.html','industry-news/index.html']){
  const input=read(p),h=applySeoHtml(input,p);
  for(const m of h.matchAll(/<article class="card[^"]*">[\s\S]*?<\/article>/g))assert.match(m[0],/<h2\b/);
  for(const m of input.matchAll(/<img\b[^>]*src="([^"]+)"|href="(\/(?:services|guides|industry-news)\/[^"#]+)"/g))assert.ok(h.includes(m[1]||m[2]));
 }
});
test('semantic collection card H2 titles retain a bounded card-sized type scale',()=>{
 const css=read('assets/site.css');
 const rules=[...css.matchAll(/\.card h2\s*\{([^}]+)\}/g)];
 assert.ok(rules.length,'H2 cards need their own type scale rather than the section H2 scale');
 const rule=rules.at(-1)[1],size=rule.match(/font-size:\s*([\d.]+)rem/);
 assert.ok(size,'card titles use a bounded rem size');assert.ok(Number(size[1])>=1.1&&Number(size[1])<=1.5);
 assert.match(rule,/margin:\s*0\s+0\s+17px/,'article section spacing must not enlarge card titles');
});
test('all contextual project links and hub service anchors reach unique existing targets',()=>{
 const hub=applySeoHtml(read('case-studies/index.html'),'case-studies/index.html');
 const paths=[...readdirSync(resolve(root,'services'),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>`services/${e.name}/index.html`),...readdirSync(resolve(root,'guides'),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>`guides/${e.name}/index.html`),'case-studies/index.html'];
 for(const p of paths){const out=applySeoHtml(read(p),p);
  for(const m of out.matchAll(/href="(\/(?:case-studies|services\/[^/]+)\/)#([^"]+)"/g)){
   const file=m[1].slice(1)+'index.html';assert.ok(existsSync(resolve(root,file)),file);
   const target=file==='case-studies/index.html'?hub:applySeoHtml(read(file),file);
   assert.equal([...target.matchAll(/\bid="([^"]+)"/g)].filter(x=>x[1]===m[2]).length,1,p+' '+m[0]);
  }
 }
 for(const [slug,id]of [['tile-regrouting','tile-project-photos-heading'],['commercial-waterproofing','commercial-project-photos-heading']]){
  const p=`services/${slug}/index.html`,withoutId=read(p).replace(` id="${id}"`,'');
  assert.ok(applySeoHtml(withoutId,p).includes(`id="${id}"`),'maintenance restores '+id);
 }
});
test('fixed content dates reflect guide baseline and current service edits without refreshing unrelated pages',()=>{
 const host='https://www.canberrawaterproof.com.au';
 const xml='<urlset>'+['/services/roof-waterproofing/','/guides/waterproofing-or-drainage/','/privacy-policy/'].map(p=>`<url><loc>${host}${p}</loc><lastmod>2026-01-01</lastmod></url>`).join('')+'</urlset>';
 const out=applySitemap(xml);assert.match(out,/roof-waterproofing\/<\/loc><lastmod>2026-10-15/);
 assert.match(out,/waterproofing-or-drainage\/<\/loc><lastmod>2026-10-14/);
 assert.match(out,/privacy-policy\/<\/loc><lastmod>2026-01-01/);assert.equal(applySitemap(out),out);
});
test('locality pages keep one full urgent-attendance message, one photo instruction and matching FAQ schema',()=>{
 const p='waterproofing/belconnen/index.html',out=applySeoHtml(read(p),p),main=out.match(/<main\b[\s\S]*?<\/main>/)[0];
 assert.equal((main.match(/as little as 30 minutes after contact/g)||[]).length,1);
 assert.equal((main.match(/Photos are optional/g)||[]).length,1);
 assert.match(main,/Arrival timing depends on current availability, the address and safe access/);
 assert.match(main,/Do not remove tiles, membranes or fixtures/);
 assert.doesNotMatch(out,/<meta[^>]*"\)>/);
 assert.doesNotMatch(main,/<h[1-6][^>]*>[^<]*(?:backed by proven experience|How the Ellis team)/);
 const graph=JSON.parse(out.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const visible=main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 for(const faq of graph.filter(n=>n['@type']==='FAQPage'))for(const qa of faq.mainEntity)assert.ok(visible.includes(qa.acceptedAnswer.text));
 assert.equal(applySeoHtml(out,p),out);
});
