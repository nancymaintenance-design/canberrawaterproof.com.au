import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {serviceMaterialsRows} from '../data/service-materials-copy.mjs';
import {applyServiceMaterialsCopy,serviceMaterialsHtml} from '../scripts/service-materials-copy.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('seven bilingual service pages explain positive material choices and installation with a guide link',()=>{
 assert.equal(new Set(serviceMaterialsRows.map(r=>r.slug)).size,7);
 assert.equal(serviceMaterialsRows.length,14);
 for(const row of serviceMaterialsRows){
  const q=load(read(`services/${row.slug}/index.html`)),zh=load(read(`zh/services/${row.slug}/index.html`));
  assert.ok(q('main p').toArray().some(p=>q(p).text().startsWith(row.en)),row.slug+' English');
  assert.ok(zh('main p').toArray().some(p=>zh(p).text().replace(/\s+/g,'').startsWith(row.zh.replace(/\s+/g,''))),row.slug+' Chinese');
  assert.doesNotMatch(row.en,/\bJS\b|Chinese|\bcannot\b|\bnot\b|mustn't/);
  assert.doesNotMatch(row.zh,/不能|不得|无法|不应/);
  if(row.link){assert.equal(q('main a[href="/guides/waterproofing-materials-and-systems/"]').length,1);assert.equal(zh('main a[href="/zh/guides/waterproofing-materials-and-systems/"]').length,1);}
 }
});
test('paragraph transform preserves attributes and surrounding content without touching machine scripts',()=>{
 for(const row of serviceMaterialsRows){
  const file=`services/${row.slug}/index.html`;
  const before=`<head><script type="application/json">${JSON.stringify({text:row.beforeHtml})}</script></head><main><h1>Keep H1</h1><p class="retained" id="original">${row.beforeHtml}</p></main>`;
  const after=applyServiceMaterialsCopy(before,file);
  assert.ok(after.includes(`<p class="retained" id="original">${serviceMaterialsHtml(row)}</p>`));
  assert.equal(after.slice(0,after.indexOf('<main>')),before.slice(0,before.indexOf('<main>')));
  assert.equal(applyServiceMaterialsCopy(after,file),after);
  assert.equal(applyServiceMaterialsCopy(before,'services/tile-regrouting/index.html'),before);
 }
});
