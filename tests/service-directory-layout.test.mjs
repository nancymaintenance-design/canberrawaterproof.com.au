import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('service directory receives a scoped balanced layout without adding, reordering or rewriting services',()=>{
 const before=read('services/index.html'),after=applySeoHtml(before,'services/index.html');
 const original=load(before),dom=load(after),cards=dom('[data-service-directory] > .grid > .card');
 assert.equal(cards.length,11,'the balanced grid must contain all eleven existing services');
 const details=(q,n)=>({title:q(n).find('h2').text(),body:q(n).find('p').map((_,p)=>q(p).text()).get(),links:q(n).find('a').map((_,a)=>q(a).attr('href')).get(),image:q(n).find('img').attr('src')});
 assert.deepEqual(cards.toArray().map(n=>details(dom,n)),original('main .grid').first().children('.card').toArray().map(n=>details(original,n)));
 assert.equal(dom('link[href="/assets/service-directory-layout.css"]').length,1);
 assert.equal(applySeoHtml(after,'services/index.html'),after);
});
test('service layout does not leak to the homepage or service detail pages',()=>{
 for(const p of ['index.html','services/leaking-shower-repairs/index.html']){
  const dom=load(applySeoHtml(read(p),p));
  assert.equal(dom('[data-service-directory]').length,0);
  assert.equal(dom('link[href="/assets/service-directory-layout.css"]').length,0);
 }
});
