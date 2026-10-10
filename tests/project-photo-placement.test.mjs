import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { applySeoHtml, applySitemap, maintainSite } from '../scripts/apply-seo-maintenance.mjs';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(root, path), 'utf8');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const block = /<!-- supplied-project-photos:start -->[\s\S]*?<!-- supplied-project-photos:end -->/g;
const gallery = 'case-studies/index.html';
const groups = [
 {slug:'balcony-waterproofing', id:'balcony', place:'Woden Valley', month:'June 2026', files:[
  ['woden-valley-balcony-floor-preparation.png','aaf01495e5b52b6a7b64242ad8dc73e9f65fb59921f7071b2dee6138f6965781',/Floor preparation.*Walls already treated/i],
  ['woden-valley-balcony-membrane-application.png','e2e019b07f4ef93670a0003875432a52c8e3beff588123cf0e54d32249067332',/Membrane application/i],
  ['woden-valley-balcony-partial-coating.png','0c15ebbee495cb4f0694ef01e799eaac3f9e7d667a5b9838137fe619c080b1b3',/Partial floor coating/i],
  ['woden-valley-balcony-drain-junction-detail.png','6f3514b28bb0b1f378ceec2b3eab9c7ef3744c8f7d93bf175feb616078e76b51',/Drain and wall-floor junction detail/i],
  ['woden-valley-balcony-broad-membrane-coverage.png','4b30e09f4c71715ab31b1556037f85ca76ac6db91afdd8343f9c878cbbd7240e',/Broad membrane coverage stage/i],
 ]},
 {slug:'external-waterproofing', id:'external', place:'Weetangera', month:'April 2026', files:[
  ['weetangera-external-wall-joint-application.png','411d86a2b1a010dbd4e6a366656dcfb34154958b666297da389858ae3efa119a',/Joint sealant application/i],
  ['weetangera-external-wall-joint-sealing-collage.png','e4e2dcf33c6402aea9fb618e25e42beaa3b3251361375910f435dc80587f16c4',/Application and visible sealed joint/i],
 ]},
 {slug:'retaining-wall-waterproofing', id:'retaining-wall', place:'Barton', month:'April 2026', files:[
  ['barton-block-retaining-wall-collage.png','c6a7d73a395232bd2e9f4500d13055753ed849ceae038ee44a71bb10189c083f',/Block wall.*construction and visible finished face/i],
  ['barton-concrete-retaining-wall-collage.png','237a6c36934d73de061facce140b4c2194590ceea913feaade59ec13f2054ec1',/Concrete wall.*construction and visible finished face/i],
 ]},
];
const paths = [...groups.map(g=>`services/${g.slug}/index.html`),gallery];
const sectionFor = (html,id) => html.match(new RegExp(`<section\\b[^>]*data-project-photo-group="${id}"[^>]*>[\\s\\S]*?<\\/section>`))?.[0];

test('existing marketing, keyword blocks, service images and old cases remain byte-for-byte after removing the additive block',()=>{
 const originalHashes={
  'services/balcony-waterproofing/index.html':'6a675cadd2c1e223b704d1d949063e7520e7aecac1f946ffd12ba54bd19b4a65',
  'services/external-waterproofing/index.html':'f5c78ceea002d655178111ced6e636de7edba29cb4d0e0971ea32d9ab4ebba92',
  'services/retaining-wall-waterproofing/index.html':'a5fd66c3c9da3137d378c0bf23dddbf75d8eea1a20e7a889a6f0b1befc5d9b41',
  'case-studies/index.html':'f48629bfad888abc92338582a53045c21780de34dde939abfe45aaea5cd03f5f',
 };
 for(const path of paths) {
  const original=read(path).replace(block,'').replaceAll('\r\n','\n').replace('<p class="eyebrow">Real project photos to be added</p>','');
  assert.equal(hash(original),originalHashes[path],path);
 }
});

for (const group of groups) test(`${group.place} photographs render on their service and gallery in approved order`,()=>{
 for(const path of [`services/${group.slug}/index.html`,gallery]) {
  const section=sectionFor(read(path),group.id);
  assert.ok(section,`${path}: missing ${group.id} photo group`);
  assert.ok(section.includes(group.place) && section.includes(group.month));
  assert.ok(section.includes(`href="/services/${group.slug}/"`));
  assert.deepEqual([...section.matchAll(/<img\b[^>]*src="\/assets\/([^"]+)"/g)].map(m=>m[1]),group.files.map(f=>f[0]));
  const figures=[...section.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map(m=>m[0]);
  for(const [i,figure] of figures.entries()) {
   assert.match(figure,group.files[i][2]);
   assert.match(figure,/<img\b[^>]*alt="[^"]{35,}"/);
   assert.match(figure,/width="1448" height="1086"/);
   assert.match(figure,/loading="lazy"/);assert.match(figure,/decoding="async"/);
   assert.match(figure,/<picture data-responsive-image><source type="image\/webp"/);
   assert.ok(figure.includes('sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 800px) calc((100vw - 57px) / 2), (max-width: 830px) calc((100vw - 74px) / 3), 252px"'));
  }
  if(group.id==='balcony') assert.match(section,/does not show whole-project completion/i);
  if(group.id==='external') assert.match(section,/external wall joint sealing/i);
  if(group.id==='retaining-wall') {
   assert.match(section,/separate retaining-wall examples/i);
   assert.match(section,/do not establish concealed waterproofing/i);
   assert.match(section,/not presented as one before-and-after project/i);
  }
 }
});

test('nine untouched originals and every responsive candidate resolve with truthful metadata',()=>{
 const manifest=JSON.parse(read('data/responsive-images.json'));
 for(const group of groups) for(const [file,sha256] of group.files) {
  const url='/assets/'+file;
  assert.ok(existsSync(join(root,url)),url);
  const original=readFileSync(join(root,url));
  assert.equal(hash(original),sha256);
  assert.equal(original.readUInt32BE(16),1448);assert.equal(original.readUInt32BE(20),1086);
  const entry=manifest[url];assert.ok(entry,url+' manifest missing');
  assert.equal(entry.sha256,sha256);assert.equal(entry.bytes,original.length);
  assert.equal(entry.width,1448);assert.equal(entry.height,1086);
  assert.deepEqual(entry.candidates.map(c=>c.width),[480,800,1200,1448]);
  for(const c of entry.candidates) {
   const bytes=readFileSync(join(root,c.url));
   assert.equal(bytes.length,c.bytes);assert.equal(bytes.toString('ascii',8,12),'WEBP');
   const kind=bytes.toString('ascii',12,16);
   const [width,height]=kind==='VP8X'?[1+bytes.readUIntLE(24,3),1+bytes.readUIntLE(27,3)]:kind==='VP8L'?[1+(bytes.readUInt32LE(21)&0x3fff),1+((bytes.readUInt32LE(21)>>>14)&0x3fff)]:[bytes.readUInt16LE(26)&0x3fff,bytes.readUInt16LE(28)&0x3fff];
   assert.equal(width,c.width);assert.equal(height,c.height);assert.equal(height,Math.round(width*.75));
  }
 }
});

test('maintenance restores missing photo sections, preserves authored additions, and is repeatable',()=>{
 assert.ok(existsSync(join(root,'data/project-photo-sections.json')),'missing restorable photo sections');
 const photoSections=JSON.parse(read('data/project-photo-sections.json'));
 const images=JSON.parse(read('data/responsive-images.json'));
 for(const path of paths) {
  const shipped=read(path), missing=shipped.replace(block,'');
  const restored=applySeoHtml(missing,path,{photoSections,images});
  assert.equal(restored,shipped);
  assert.equal(applySeoHtml(restored,path,{photoSections,images}),restored);
  const authored=restored.replace('June 2026','June 2026 · Authored note');
  assert.equal(applySeoHtml(authored,path,{photoSections,images}),authored);
 }
});

test('supported locality generator restores removed photo groups through maintenance in an isolated root',()=>{
 const isolated=mkdtempSync(join(tmpdir(),'melone-photo-'));
 try {
  // Locality pages are generated inside this fixture; copying live generated
  // pages can lock them while the historical suite regenerates the real root.
  for(const path of ['scripts','data','services','guides','case-studies','service-areas','llms.txt','sitemap.xml']) cpSync(join(root,path),join(isolated,path),{recursive:true});
  for(const path of paths) writeFileSync(join(isolated,path),read(path).replace(block,''));
  const result=spawnSync(process.execPath,[join(isolated,'scripts/build-local-waterproofing-pages.mjs'),'--verify'],{cwd:isolated,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  for(const path of paths) {
   const restored=readFileSync(join(isolated,path),'utf8');
   assert.ok(restored.includes('supplied-project-photos:start'),path+' missing restored photos');
   assert.equal(restored,read(path));
  }
  assert.deepEqual(maintainSite(isolated).changed,[]);
 } finally {rmSync(isolated,{recursive:true,force:true});}
});

test('photo batch lastmod includes retaining wall and gallery while unrelated dates stay unchanged',()=>{
 const host='https://www.canberrawaterproof.com.au';
 const input='<urlset>'+[...paths.map(p=>'/'+p.replace('index.html','')),'/about/'].map(p=>`<url><loc>${host}${p}</loc><lastmod>2026-01-01</lastmod></url>`).join('')+'</urlset>';
 const result=applySitemap(input);
 for(const path of paths) assert.ok(result.includes(`${host}/${path.replace('index.html','')}</loc><lastmod>2026-10-10</lastmod>`));
 assert.ok(result.includes('/about/</loc><lastmod>2026-01-01</lastmod>'));
 assert.equal(applySitemap(result),result);
});

test('gallery, service, original and WebP URLs render from the static tree',async()=>{
 const server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=join(root,pathname,pathname.endsWith('/')?'index.html':'');
  if(!existsSync(file)){res.writeHead(404);res.end();return;}
  res.end(readFileSync(file));
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 try {
  const origin=`http://127.0.0.1:${server.address().port}`;
  for(const path of paths) {
   const response=await fetch(origin+'/'+path.replace('index.html',''));
   assert.equal(response.status,200);
   const html=await response.text();
   assert.ok(html.includes('supplied-project-photos:start'));
   const urls=new Set();
   for(const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
    const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
    if(src) urls.add(src);
    const srcset=tag.match(/\bsrcset="([^"]+)"/)?.[1];
    if(srcset) for(const candidate of srcset.split(',')) urls.add(candidate.trim().split(' ')[0]);
   }
   for(const url of urls) assert.equal((await fetch(origin+url)).status,200,url);
  }
 } finally {await new Promise(done=>server.close(done));}
});
