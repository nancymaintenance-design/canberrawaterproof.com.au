import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, cpSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {applyLlms, applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(fileURLToPath(new URL(p, root)), 'utf8');
const host = 'https://www.canberrawaterproof.com.au';
for (const slug of ['tile-regrouting','commercial-waterproofing']) {
 test(`maintenance discovers ${slug} once`, () => {
  const url = `${host}/services/${slug}/`;
  const result = applyLlms('');
  assert.ok(result.includes(url));
  assert.equal(applyLlms(result), result);
 });
 test(`${slug} is an indexable service with valid entity references`, () => {
  const path = `services/${slug}/index.html`;
  const html = read(path);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const service = graph.find(n => n['@type'] === 'Service');
  const page = graph.find(n => n['@type'] === 'WebPage');
  assert.equal(page.mainEntity['@id'], service['@id']);
  assert.equal(service.url, `${host}/services/${slug}/`);
  assert.match(html, /name="robots" content="index,follow"/);
  const images = JSON.parse(read('data/responsive-images.json'));
  assert.equal(applySeoHtml(html,path,{images}),html);
  assert.equal((read('sitemap.xml').match(new RegExp(`<loc>${service.url}</loc>`, 'g')) || []).length,1);
 });
}

test('navigation regeneration retains both new service destinations without duplicate sitemap entries', () => {
 const fixture = mkdtempSync(join(tmpdir(),'cwp-navigation-'));
 try {
  for(const p of ['scripts','index.html','services','sitemap.xml']) cpSync(new URL(p,root),join(fixture,p),{recursive:true});
  const run = () => spawnSync(process.execPath,[join(fixture,'scripts/build-nine-service-navigation.mjs')],{cwd:fixture,encoding:'utf8'});
  for(let pass=0;pass<2;pass++) {
   const result=run();
   assert.equal(result.status,0,result.stderr);
   const hub=readFileSync(join(fixture,'services/index.html'),'utf8');
   for(const slug of ['tile-regrouting','commercial-waterproofing']) assert.ok(hub.includes(`href="/services/${slug}/"`));
   const urls=[...readFileSync(join(fixture,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
   assert.equal(new Set(urls).size, urls.length);
  }
 } finally {rmSync(fixture,{recursive:true,force:true});}
});
