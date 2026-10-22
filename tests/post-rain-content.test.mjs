import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {addRainFaq,applyPostRainContent} from '../scripts/post-rain-content.mjs';
import {rainFaq,headingRows,newsSections} from '../data/post-rain-content.mjs';
import {materialsFaq} from '../data/materials-guide.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('rain questions preserve native FAQ interaction and match bilingual visible schema',()=>{
 for(const prefix of ['', 'zh/']) {
  const q=load(read(prefix+'faq/index.html'));
  assert.equal(q('details').length,46+materialsFaq.length);
  for(const [id,en,zh,a,za] of rainFaq){
   assert.equal(q('#'+id).length,1);
   assert.equal(q('#'+id+' summary').text(),prefix?zh:en);
   assert.equal(q('#'+id+' p').text(),prefix?za:a);
  }
  const graph=JSON.parse(q('script[type="application/ld+json"]').first().html())['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,46+materialsFaq.length);
  for(const item of faq.mainEntity)assert.ok(q('details').toArray().some(e=>q(e).find('summary').text()===item.name&&q(e).find('p').map((i,p)=>q(p).text()).get().join(' ').replace(/\s+/g,' ').trim()===item.acceptedAnswer.text));
 }
 assert.equal(addRainFaq(read('faq/index.html')),read('faq/index.html'));
});
test('service heading revisions preserve H1, IDs, nested markup and repeat safely',()=>{
 for(const [slug,before,after] of headingRows){
  const path=`services/${slug}/index.html`;
  const original=`<h1>Keep this H1</h1><h2 id="retained">${before}</h2><p>Keep this body</p>`;
  const revised=applyPostRainContent(original,path);
  assert.equal(revised,`<h1>Keep this H1</h1><h2 id="retained">${after}</h2><p>Keep this body</p>`);
  assert.equal(applyPostRainContent(revised,path),revised);
  assert.ok(load(read(path))('h2').toArray().some(e=>load(e).text()===after),`${slug}: ${after}`);
 }
});
test('news additions use existing routes and retain historical feed items',()=>{
 for(const [slug,sections] of Object.entries(newsSections)){
  const p=`industry-news/${slug}/index.html`,html=read(p);
  assert.equal(applyPostRainContent(html,p),html);
  for(const [h,zh,p,zp] of sections){assert.ok(html.includes(h)&&html.includes(p));const translated=read('zh/'+`industry-news/${slug}/index.html`);assert.ok(translated.includes(zh)&&translated.includes(zp));}
 }
 for(const prefix of ['', 'zh/']){const feed=JSON.parse(read(prefix+'feed.json'));assert.equal(feed.items.length,10);assert.equal(new Set(feed.items.map(i=>i.id)).size,10);}
});
