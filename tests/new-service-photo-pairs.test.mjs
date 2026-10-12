import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
for(const [slug,files] of [
 ['tile-regrouting',['tile-regrouting-before.jpg','tile-regrouting-after.jpg']],
 ['commercial-waterproofing',['commercial-roof-waterproofing-work.jpg','commercial-roof-junction-waterproofing.jpg']]
]) {
 test(`${slug} displays only its assigned pair with loadable responsive assets`,()=>{
  const path=`services/${slug}/index.html`,html=read(path);
  const group=html.match(/<!-- approved-service-photos:start -->[\s\S]*?<!-- approved-service-photos:end -->/)?.[0];
  assert.ok(group,'Approved photo pair is missing');
  const images=[...group.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
  assert.equal(images.length,2);
  for(const [i,img] of images.entries()) {
   assert.ok(img.includes(`/assets/projects/${files[i]}`));
   assert.match(img,/loading="lazy"/);
   assert.match(img,/decoding="async"/);
   assert.match(img,/width="\d+" height="\d+"/);
   assert.match(img,/alt="[^"]+"/);
  }
  for(const m of group.matchAll(/(?:src="|srcset=")([^"<>]+)"/g)) for(const part of m[1].split(',')) {
   const url=part.trim().split(/\s+/)[0];
   assert.ok(existsSync(new URL(url.slice(1),root)),url);
  }
  const manifest=JSON.parse(read('data/responsive-images.json'));
  assert.equal(applySeoHtml(html,path,{images:manifest}),html);
  assert.ok(!read('case-studies/index.html').includes(files[0]));
 });
}
