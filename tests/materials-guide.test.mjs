import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {materialsPath,materialsSections,materialsFaq} from '../data/materials-guide.mjs';
import {addMaterialsFaq,applyMaterialsContent} from '../scripts/materials-guide.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const guide=materialsPath.slice(1)+'index.html';
test('material guide distinguishes sheet, PVC/TPO and JS with project-specific installation checks',()=>{
 for(const prefix of ['', 'zh/']){
  const q=load(read(prefix+guide)),text=q('article').text();
  assert.equal(q('h1').length,1);
  for(const s of materialsSections){assert.equal(q('#'+s.id).text(),s.title[prefix?1:0]);for(const p of s.paragraphs)assert.ok(text.includes(p[prefix?1:0]));}
  for(const word of ['PVC','TPO','JS','WPM 750','WPM 185','C-1P','Sikalastic-488','WPM 300'])assert.ok(text.includes(word));
  const graph=JSON.parse(q('script[type="application/ld+json"]').first().html())['@graph'];
  assert.equal(graph.filter(n=>n['@type']==='LocalBusiness').length,1);
  const article=graph.find(n=>n['@type']==='Article');assert.equal(article.datePublished,'2026-10-22');assert.equal(article.dateModified,'2026-10-22');
  assert.ok(article.articleBody.includes(prefix?'不能证明':'does not by itself establish'));
  for(const a of q('a[href^="http"]').toArray())assert.ok(/canberrawaterproof\.com\.au|youtube\.com|tiktok\.com/.test(q(a).attr('href')));
 }
 const html=read(guide),authored=applyMaterialsContent(html,guide);assert.equal(applyMaterialsContent(authored,guide),authored);
});
test('all eight material FAQs are visible in both languages and existing 46 questions remain',()=>{
 for(const prefix of ['', 'zh/']){
  const q=load(read(prefix+'faq/index.html'));assert.equal(q('details').length,54);
  const graph=JSON.parse(q('script[type="application/ld+json"]').first().html())['@graph'];assert.equal(graph.find(n=>n['@type']==='FAQPage').mainEntity.length,54);
  for(const[id,en,zh,a,za]of materialsFaq){const e=q('#'+id);assert.equal(e.length,1);assert.equal(e.find('summary').text(),prefix?zh:en);assert.equal(e.find('p').first().text(),prefix?za:a);assert.equal(e.find('a').attr('href'),(prefix?'/zh':'')+materialsPath);}
  const original=load(execFileSync('git',['show','HEAD:'+prefix+'faq/index.html'],{cwd:new URL('..',import.meta.url)}).toString());
  for(const e of original('details').toArray()){const title=original(e).find('summary').text();const retained=q('details').filter((i,n)=>q(n).find('summary').text()===title);assert.equal(retained.length,1);assert.equal(retained.find('p').text(),original(e).find('p').text());}
 }
 assert.equal(addMaterialsFaq(read('faq/index.html')),read('faq/index.html'));
});
test('one new guide is linked from its real parent, listed in sitemap and added without losing historic feed IDs',()=>{
 for(const prefix of ['', 'zh/']){
  const q=load(read(prefix+'guides/index.html'));assert.equal(q(`a[href="${prefix?'/zh':''}${materialsPath}"]`).length,1);
  assert.ok(read('sitemap.xml').includes('https://www.canberrawaterproof.com.au'+(prefix?'/zh':'')+materialsPath));
  const feed=JSON.parse(read(prefix+'feed.json')),old=JSON.parse(execFileSync('git',['show','HEAD:'+prefix+'feed.json'],{cwd:new URL('..',import.meta.url)}).toString());
  assert.equal(feed.items.length,10);const previous=new Set(old.items.map(i=>i.id));assert.deepEqual(feed.items.filter(i=>previous.has(i.id)).map(i=>i.id),old.items.map(i=>i.id));
  const item=feed.items.find(i=>i.url.endsWith(materialsPath));assert.ok(item.content_html.includes('PVC')&&item.content_html.includes('JS'));
 }
});
