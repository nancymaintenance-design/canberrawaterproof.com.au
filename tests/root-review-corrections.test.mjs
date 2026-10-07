import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const pages=['industry-news/index.html','industry-news/what-to-photograph-before-a-quote/index.html'];
test('both photography news pages reference existing local image assets',()=>{
 for(const page of pages){
  const html=readFileSync(page,'utf8');
  const images=[...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(images.includes('/assets/news-photograph-enquiry.jpg'),page+' uses the real existing photo');
  for(const src of images) if(src.startsWith('/')) assert.ok(existsSync(resolve('.'+src)),page+' missing image '+src);
 }
});
test('photography article description channels make photos optional and offer actual assessment',()=>{
 const html=readFileSync(pages[1],'utf8');
 for(const attr of ['name="description"','property="og:description"']){
  const meta=html.match(new RegExp('<meta '+attr+' content="([^"]+)"'))?.[1];
  assert.ok(meta,attr); assert.doesNotMatch(meta,/^Send safe photos/);
  assert.match(meta,/^Optional safe photos can help us prepare\./);
  assert.match(meta,/on-site assessment, repair plan and written quote/);
 }
});
