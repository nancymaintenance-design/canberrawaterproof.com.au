import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const slugs=['shower-plumbing-or-waterproofing','regrouting-resealing-or-rewaterproofing','waterproofing-retiling-quote','balcony-leaking-room-below','kitchen-sink-resealing-or-plumbing','waterproofing-or-drainage'];
// Catch regeneration silently restoring shallow articles or divorcing the feed from visible answers.
for(const slug of slugs)test(`${slug} regenerates deep visible content and matching two-layer feed`,()=>{
 const path=`guides/${slug}/index.html`;
 const shipped=read(path);
 const fixture=shipped.replace(/<article\b[\s\S]*?<\/article>/,'<article class="section wrap article"><h1>Old guide</h1><figure class="guide-cover"><img src="/assets/guide-placeholder.jpg" alt="Existing guide illustration" width="800" height="500"></figure><p>Shallow content.</p></article>');
 const result=applySeoHtml(fixture,path);
 assert.match(result,/class="deep-guide-toc"/);
 assert.doesNotMatch(result,/Shallow content/);
 const main=result.match(/<main\b[\s\S]*?<\/main>/)[0];
 const plain=main.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 assert.ok(plain.split(' ').length>1200,'Needs substantive content, not short fragments');
 assert.equal((main.match(/<h1\b/g)||[]).length,1);
 assert.doesNotMatch(main,/<h[1-6][^>]*>[^<]*\?/);
 const matrix=JSON.parse(result.match(/<script id="llm-entity-json" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(matrix.entity_metadata.brand_name,'MEL ONE');
 assert.equal(matrix.article_metadata.url,`https://www.canberrawaterproof.com.au/guides/${slug}/`);
 assert.ok(matrix.knowledge_matrix.sections.length>=8);
 for(const section of matrix.knowledge_matrix.sections)assert.ok(main.includes(`id="${section.id}"`));
 const graphs=[...result.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const d=JSON.parse(m[1]);return d['@graph']||[d];});
 assert.ok(graphs.some(n=>n['@type']==='Organization'&&n.name==='MEL ONE'));
 const article=graphs.find(n=>n['@type']==='Article');
 assert.ok(article&&plain.includes(article.headline));
 const faq=graphs.find(n=>n['@type']==='FAQPage');
 assert.equal(faq.mainEntity.length,3);
 for(const q of faq.mainEntity){assert.ok(plain.includes(q.name));assert.ok(plain.includes(q.acceptedAnswer.text));}
 assert.equal(applySeoHtml(result,path),result,'Repeat regeneration must not duplicate content or feed');
 for(const href of [...main.matchAll(/href="(\/[^"#]+)"/g)].map(m=>m[1]))assert.ok(existsSync(new URL(href.slice(1)+'index.html',root)),href);
});
