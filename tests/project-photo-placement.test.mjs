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
 {slug:'balcony-waterproofing', files:[
  ['woden-valley-balcony-floor-preparation.png','aaf01495e5b52b6a7b64242ad8dc73e9f65fb59921f7071b2dee6138f6965781'],
  ['woden-valley-balcony-membrane-application.png','e2e019b07f4ef93670a0003875432a52c8e3beff588123cf0e54d32249067332'],
  ['woden-valley-balcony-partial-coating.png','0c15ebbee495cb4f0694ef01e799eaac3f9e7d667a5b9838137fe619c080b1b3'],
  ['woden-valley-balcony-drain-junction-detail.png','6f3514b28bb0b1f378ceec2b3eab9c7ef3744c8f7d93bf175feb616078e76b51'],
  ['woden-valley-balcony-broad-membrane-coverage.png','4b30e09f4c71715ab31b1556037f85ca76ac6db91afdd8343f9c878cbbd7240e'],
 ]},
 {slug:'external-waterproofing', files:[
  ['weetangera-external-wall-joint-application.png','411d86a2b1a010dbd4e6a366656dcfb34154958b666297da389858ae3efa119a'],
  ['weetangera-external-wall-joint-sealing-collage.png','e4e2dcf33c6402aea9fb618e25e42beaa3b3251361375910f435dc80587f16c4'],
 ]},
 {slug:'retaining-wall-waterproofing', files:[
  ['barton-block-retaining-wall-collage.png','c6a7d73a395232bd2e9f4500d13055753ed849ceae038ee44a71bb10189c083f'],
  ['barton-concrete-retaining-wall-collage.png','237a6c36934d73de061facce140b4c2194590ceea913feaade59ec13f2054ec1'],
 ]},
];
const paths = [...groups.map(g=>`services/${g.slug}/index.html`),gallery];

test('original marketing, keywords, imagery and cases remain unchanged without appended photo groups',()=>{
 const originalHashes={
  'services/balcony-waterproofing/index.html':'6a675cadd2c1e223b704d1d949063e7520e7aecac1f946ffd12ba54bd19b4a65',
  'services/external-waterproofing/index.html':'f5c78ceea002d655178111ced6e636de7edba29cb4d0e0971ea32d9ab4ebba92',
  'services/retaining-wall-waterproofing/index.html':'a5fd66c3c9da3137d378c0bf23dddbf75d8eea1a20e7a889a6f0b1befc5d9b41',
  'case-studies/index.html':'f48629bfad888abc92338582a53045c21780de34dde939abfe45aaea5cd03f5f',
 };
 for(const path of paths) {
  const original=read(path).replaceAll('\r\n','\n');
  assert.equal(hash(original),originalHashes[path],path);
 }
});

const originalImages={
 'services/balcony-waterproofing/index.html':['/assets/service-balcony.jpg','/assets/detail-balcony.jpg'],
 'services/external-waterproofing/index.html':['/assets/service-external.jpg','/assets/detail-external.jpg'],
 'services/retaining-wall-waterproofing/index.html':['/assets/service-retaining-wall.jpg','/assets/detail-retaining-wall.jpg'],
 'case-studies/index.html':['/assets/bathroom-membrane-application.png','/assets/bathroom-finished-wide.png','/assets/balcony-waterproofing-before.png','/assets/balcony-waterproofing-during.png','/assets/balcony-waterproofing-after.png'],
};
for (const group of groups) test(`${group.slug} retains its two distinct original content images and no appended panels`,()=>{
 const path=`services/${group.slug}/index.html`,html=read(path);
 const main=html.match(/<main\b[\s\S]*?<\/main>/)[0];
 assert.deepEqual([...main.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]),originalImages[path]);
 assert.equal(/supplied-project-photos|data-project-photo-group|supplied-project-photo-grid/.test(html),false,'retired panels must be absent');
 const hashes=originalImages[path].map(url=>hash(readFileSync(join(root,url))));
 assert.equal(new Set(hashes).size,2,'existing service imagery must remain distinct');
});

test('nine untouched originals and every responsive candidate resolve with truthful metadata',()=>{
 const manifest=JSON.parse(read('data/responsive-images.json'));
 const inventory=[];
 for(const group of groups) for(const [file,sha256] of group.files) {
  const url='/assets/'+file;
  assert.ok(existsSync(join(root,url)),url);
  const original=readFileSync(join(root,url));
  assert.equal(hash(original),sha256);
  inventory.push({url,sha256:hash(original)});
  assert.equal(original.readUInt32BE(16),1448);assert.equal(original.readUInt32BE(20),1086);
  const entry=manifest[url];assert.ok(entry,url+' manifest missing');
  assert.equal(entry.sha256,sha256);assert.equal(entry.bytes,original.length);
  assert.equal(entry.width,1448);assert.equal(entry.height,1086);
  assert.deepEqual(entry.candidates.map(c=>c.width),[480,800,1200,1448]);
  for(const c of entry.candidates) {
   const bytes=readFileSync(join(root,c.url));
   inventory.push({url:c.url,sha256:hash(bytes)});
   assert.equal(bytes.length,c.bytes);assert.equal(bytes.toString('ascii',8,12),'WEBP');
   const kind=bytes.toString('ascii',12,16);
   const [width,height]=kind==='VP8X'?[1+bytes.readUIntLE(24,3),1+bytes.readUIntLE(27,3)]:kind==='VP8L'?[1+(bytes.readUInt32LE(21)&0x3fff),1+((bytes.readUInt32LE(21)>>>14)&0x3fff)]:[bytes.readUInt16LE(26)&0x3fff,bytes.readUInt16LE(28)&0x3fff];
   assert.equal(width,c.width);assert.equal(height,c.height);assert.equal(height,Math.round(width*.75));
  }
 }
 inventory.sort((a,b)=>a.url.localeCompare(b.url));
 assert.equal(inventory.length,45);
 assert.equal(hash(JSON.stringify(inventory)),'9bf3361a2796f4f7365b8d7259cb0f5003803da93f0c4c4a5861c8ffd28be6e2');
});

test('maintenance leaves curated pages unchanged, preserves authored content and does not reintroduce retired groups',()=>{
 const photoSections=JSON.parse(read('data/project-photo-sections.json'));
 const images=JSON.parse(read('data/responsive-images.json'));
 for(const path of paths) {
  const curated=read(path).replace(block,'');
  const maintained=applySeoHtml(curated,path,{photoSections,images});
  assert.equal(/supplied-project-photos|data-project-photo-group/.test(maintained),false,'maintenance must not restore retired panels');
  assert.equal(maintained,curated);
  const authored=curated.replace('</main>','<p data-authored-note>Existing authored property note.</p></main>');
  assert.equal(applySeoHtml(authored,path,{photoSections,images}),authored);
  assert.equal(applySeoHtml(maintained,path,{photoSections,images}),maintained);
 }
});

test('supported locality generation keeps curated pages free of retired photo groups in an isolated root',()=>{
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
   assert.equal(/supplied-project-photos|data-project-photo-group/.test(restored),false,'generator must not restore retired panels');
   assert.equal(restored,read(path).replace(block,''));
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
   assert.equal(/supplied-project-photos|data-project-photo-group|Real project photos to be added/.test(html),false,'served page must not contain retired panels or placeholder');
   const main=html.match(/<main\b[\s\S]*?<\/main>/)[0];
   assert.deepEqual([...main.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]),originalImages[path]);
   const urls=new Set();
   for(const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
    const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
    if(src) urls.add(src);
    const srcset=tag.match(/\bsrcset="([^"]+)"/)?.[1];
    if(srcset) for(const candidate of srcset.split(',')) urls.add(candidate.trim().split(' ')[0]);
   }
   for(const url of urls) assert.equal((await fetch(origin+url)).status,200,url);
  }
  const manifest=JSON.parse(read('data/responsive-images.json'));
  for(const group of groups) for(const [file] of group.files) {
   const url='/assets/'+file;
   for(const asset of [url,...manifest[url].candidates.map(c=>c.url)]) assert.equal((await fetch(origin+asset)).status,200,asset);
  }
 } finally {await new Promise(done=>server.close(done));}
});
