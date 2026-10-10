import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as api from '../scripts/apply-seo-maintenance.mjs';
const apply = api.applySeoHtml;
const host = 'https://www.canberrawaterproof.com.au';
const graph = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const fixture = `<html><head><link rel="canonical" href="${host}/services/bathroom-waterproofing/"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'LocalBusiness','@id':host+'/#business'},{'@type':'WebPage','@id':host+'/services/bathroom-waterproofing/#webpage'},{'@type':'Service','@id':host+'/services/bathroom-waterproofing/#service'}]})}</script></head><body><main><h1>Original heading</h1><p>Original marketing.</p><img src="/assets/photo.jpg" alt="Original alt"></main></body></html>`;
test('restores exact missing keyword block while retaining authored content and is idempotent', () => {
 const path='services/bathroom-waterproofing/index.html';
 const sections=JSON.parse(readFileSync(new URL('../data/keyword-content-sections.json',import.meta.url)));
 const output=apply(fixture,path,{keywords:sections,images:{}});
 assert.ok(output.includes(sections[path]));
 assert.ok(output.includes('<h1>Original heading</h1><p>Original marketing.</p>'));
 assert.equal(apply(output,path,{keywords:sections,images:{}}),output);
});
test('connects real Service owner to WebPage and canonical business',()=>{
 const output=apply(fixture,'services/bathroom-waterproofing/index.html',{keywords:{},images:{}});
 const nodes=graph(output);
 assert.deepEqual(nodes[1].mainEntity,{'@id':host+'/services/bathroom-waterproofing/#service'});
 assert.deepEqual(nodes[2].provider,{'@id':host+'/#business'});
});
test('locality Service without id acquires canonical identity and WebPage relationship',()=>{
 const html=fixture.replace(/,"@id":"https:\/\/www.canberrawaterproof.com.au\/services\/bathroom-waterproofing\/#service"/,',"url":"https://www.canberrawaterproof.com.au/services/bathroom-waterproofing/"');
 const nodes=graph(apply(html,'waterproofing/example/index.html',{keywords:{},images:{}}));
 assert.equal(nodes[2]['@id'],host+'/services/bathroom-waterproofing/#service');
 assert.deepEqual(nodes[1].mainEntity,{'@id':nodes[2]['@id']});
});
test('article uses real page, visible image and publisher; guide gets two relevant services and CTA once',()=>{
 const path='guides/shower-plumbing-or-waterproofing/index.html';
 const html=readFileSync(new URL('../'+path,import.meta.url),'utf8')
  .replace(/<!-- seo-maintenance-related:start -->[\s\S]*?<!-- seo-maintenance-related:end -->/g,'')
  .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,a,json,b)=>{
   const data=JSON.parse(json), article=data['@graph'].find(n=>n['@type']==='Article');
   article.mainEntityOfPage=host+'/guides/shower-plumbing-or-waterproofing/';delete article.image;
   return a+JSON.stringify(data)+b;
  });
 const output=apply(html,path,{keywords:{},images:{}});
 const article=graph(output).find(n=>n['@type']==='Article');
 assert.deepEqual(article.mainEntityOfPage,{'@id':host+'/guides/shower-plumbing-or-waterproofing/#webpage'});
 assert.equal(article.image,host+'/assets/guide-shower-plumbing.jpg');
 const added=output.match(/<!-- seo-maintenance-related:start -->[\s\S]*?<!-- seo-maintenance-related:end -->/)?.[0];
 assert.ok(added?.includes('/services/leaking-shower-repairs/'));
 assert.ok(added?.includes('/services/bathroom-waterproofing/'));
 assert.ok(added?.includes('/contact/'));
 assert.equal(apply(output,path,{keywords:{},images:{}}),output);
});
test('canonicalises discovery and adds missing core services and cases once',()=>{
 const fn=api.applyLlms;
 const output=fn('- https://canberrawaterproof.com.au/\n');
 assert.ok(output.includes(host+'/'));
 assert.ok(output.includes(host+'/case-studies/'));
 assert.ok(output.includes(host+'/services/retaining-wall-waterproofing/'));
 assert.equal(fn(output),output);
});
test('lastmod only changes manifest content pages and retains other dates',()=>{
 const fn=api.applySitemap;
 const xml=`<urlset><url><loc>${host}/guides/shower-plumbing-or-waterproofing/</loc></url><url><loc>${host}/services/bathroom-waterproofing/</loc></url><url><loc>${host}/guides/waterproofing-or-drainage/</loc></url><url><loc>${host}/about/</loc><lastmod>2025-01-01</lastmod></url><url><loc>${host}/</loc></url></urlset>`;
 const output=fn(xml);
 assert.ok(output.includes('/guides/shower-plumbing-or-waterproofing/</loc><lastmod>2026-10-10</lastmod>'));
 assert.ok(output.includes('/services/bathroom-waterproofing/</loc><lastmod>2026-10-10</lastmod>'));
 assert.ok(output.includes('/guides/waterproofing-or-drainage/</loc></url>'));
 assert.ok(output.includes('/about/</loc><lastmod>2025-01-01</lastmod>'));
 assert.ok(output.includes(`${host}/</loc></url>`));
 assert.equal(fn(output),output);
});
test('protects modified authored keyword sections instead of silently replacing them',()=>{
 const path='services/bathroom-waterproofing/index.html';
 const sections=JSON.parse(readFileSync(new URL('../data/keyword-content-sections.json',import.meta.url)));
 const html=fixture.replace('</main>',sections[path].replace('Sometimes','Changed')+'</main>');
 assert.throws(()=>apply(html,path,{keywords:sections}),/Protected keyword section differs/);
});
test('restores responsive sources retaining exact image fallback',()=>{
 const output=apply(fixture,'unmanaged/index.html',{images:{'/assets/photo.jpg':{candidates:[{url:'/assets/photo-480.webp',width:480}]}}});
 assert.ok(output.includes('srcset="/assets/photo-480.webp 480w"'));
 assert.ok(output.includes('<img src="/assets/photo.jpg" alt="Original alt">'));
 assert.equal(apply(output,'unmanaged/index.html',{images:{'/assets/photo.jpg':{candidates:[{url:'/assets/photo-480.webp',width:480}]}}}),output);
});
test('supported locality generation restores maintenance and is repeatable in isolated root',()=>{
 const root=mkdtempSync(join(tmpdir(),'melone-seo-'));
 try {
  for(const path of ['scripts','data','services','guides','service-areas','waterproofing','llms.txt','sitemap.xml']) cpSync(new URL('../'+path,import.meta.url),join(root,path),{recursive:true});
  const path='services/bathroom-waterproofing/index.html', file=join(root,path);
  writeFileSync(file,readFileSync(file,'utf8').replace(/<!-- keyword-content-expansion:start -->[\s\S]*?<!-- keyword-content-expansion:end -->/,''));
  const before=readFileSync(join(root,'data/local-waterproofing-services.json'),'utf8');
  const result=spawnSync(process.execPath,[join(root,'scripts/build-local-waterproofing-pages.mjs'),'--verify'],{encoding:'utf8',cwd:root});
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).pages,24);
  const keyword=JSON.parse(readFileSync(join(root,'data/keyword-content-sections.json'),'utf8'))[path];
  assert.ok(readFileSync(file,'utf8').includes(keyword));
  const local=readFileSync(join(root,'waterproofing/belconnen/index.html'),'utf8');
  assert.ok(local.includes('<picture data-responsive-image>'));
  assert.ok(graph(local).find(n=>n['@type']==='WebPage').mainEntity);
  assert.ok(readFileSync(join(root,'sitemap.xml'),'utf8').includes('<lastmod>2026-10-10</lastmod>'));
  assert.deepEqual(api.maintainSite(root).changed,[]);
  const result2=spawnSync(process.execPath,[join(root,'scripts/build-local-waterproofing-pages.mjs'),'--verify'],{encoding:'utf8',cwd:root});
  assert.equal(result2.status,0,result2.stderr);
  assert.equal(readFileSync(join(root,'waterproofing/belconnen/index.html'),'utf8'),local);
  // The historical generator owns this feed; maintenance itself must leave it untouched.
  const generated=readFileSync(join(root,'data/local-waterproofing-services.json'),'utf8');
  api.maintainSite(root);
  assert.equal(readFileSync(join(root,'data/local-waterproofing-services.json'),'utf8'),generated);
  assert.ok(before.length>0);
 } finally { rmSync(root,{recursive:true,force:true}); }
});
