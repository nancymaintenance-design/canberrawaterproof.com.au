import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ROOT,englishPages,buildBilingual} from '../scripts/bilingual-site.mjs';

test('machine-only schema updates preserve legacy editor baselines but visible edits invalidate them',async()=>{
 const file=path.join(ROOT,'scripts/schema-feed-site.mjs');
 assert.ok(fs.existsSync(file),'local schema/feed integration is not implemented');
 const {editorContentHash,editorBaseline}=await import('../scripts/schema-feed-site.mjs');
 const en='<head><script type="application/ld+json">{"old":1}</script></head><body>Hello</body>';
 const zh='<head><script type="application/ld+json">{"old":1}</script></head><body>你好</body>';
 const contentHash=editorContentHash(en,zh),registry={pages:{'index.html':{contentHash,legacyHash:'saved-draft-baseline'}}};
 const after=en.replace('{"old":1}','{"new":2}').replace('</head>','<!-- schema-feed-v2:discovery:start --><link href="/feed.json"><!-- schema-feed-v2:discovery:end --></head>');
 assert.equal(editorBaseline('index.html',after,zh,registry),'saved-draft-baseline');
 assert.notEqual(editorBaseline('index.html',after.replace('Hello','Changed'),zh,registry),'saved-draft-baseline');
});

test('bilingual schema/feed build is deterministic, preserves the UI and per-format historic feed identity',async()=>{
 assert.ok(fs.existsSync(path.join(ROOT,'scripts/schema-feed-site.mjs')),'local schema/feed integration is not implemented');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'canberra-schema-test-'));
 try{
  for(const file of englishPages().flatMap(f=>[f,'zh/'+f]).concat(['sitemap.xml','vercel.json'])){
   fs.mkdirSync(path.dirname(path.join(temp,file)),{recursive:true});fs.copyFileSync(path.join(ROOT,file),path.join(temp,file));
  }
  fs.cpSync(path.join(ROOT,'data'),path.join(temp,'data'),{recursive:true});
  if(fs.existsSync(path.join(ROOT,'.schema-feed-v2')))fs.cpSync(path.join(ROOT,'.schema-feed-v2'),path.join(temp,'.schema-feed-v2'),{recursive:true});
  const files=englishPages(temp).flatMap(f=>[f,'zh/'+f]);
  const strip=h=>h.replace(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<!-- schema-feed-v2:discovery:start -->[\s\S]*?<!-- schema-feed-v2:discovery:end -->/g,'');
  const before=Object.fromEntries(files.map(f=>[f,strip(fs.readFileSync(path.join(temp,f),'utf8'))]));
  buildBilingual(temp);
  assert.deepEqual(buildBilingual(temp,{check:true}).changed,[]);
  for(const file of files)assert.equal(strip(fs.readFileSync(path.join(temp,file),'utf8')),before[file],file+' visible HTML changed');
  const feedFile=path.join(temp,'feed.json'),feed=JSON.parse(fs.readFileSync(feedFile,'utf8'));
  assert.equal(feed.items.length,9);assert.ok(feed.items.every(i=>i.content_html.length>1000));
  feed.items[0].id='historic-json-guid';fs.writeFileSync(feedFile,JSON.stringify(feed));
  const rssFile=path.join(temp,'feed.xml');fs.writeFileSync(rssFile,fs.readFileSync(rssFile,'utf8').replace(/<guid isPermaLink="false">[^<]+<\/guid>/,'<guid isPermaLink="false">historic-rss-guid</guid>'));
  buildBilingual(temp);
  assert.equal(JSON.parse(fs.readFileSync(feedFile,'utf8')).items[0].id,'historic-json-guid');
  assert.match(fs.readFileSync(rssFile,'utf8'),/historic-rss-guid/);
  assert.deepEqual(buildBilingual(temp).changed,[]);
  const edited=path.join(temp,'guides/shower-plumbing-or-waterproofing/index.html');
  fs.writeFileSync(edited,fs.readFileSync(edited,'utf8').replace('</article>','<p data-sync-probe>Observed water at the shower edge.</p></article>'));
  assert.throws(()=>buildBilingual(temp),/untranslated strings/);
  const dictionaryFile=path.join(temp,'data/i18n/zh-Hans-overrides.json'),dictionary=JSON.parse(fs.readFileSync(dictionaryFile,'utf8'));
  dictionary['Observed water at the shower edge.']='淋浴边缘出现可见水迹。';fs.writeFileSync(dictionaryFile,JSON.stringify(dictionary));
  buildBilingual(temp);
  const enFeed=JSON.parse(fs.readFileSync(feedFile,'utf8')),zhFeed=JSON.parse(fs.readFileSync(path.join(temp,'zh/feed.json'),'utf8'));
  assert.ok(enFeed.items.some(i=>i.content_html.includes('Observed water at the shower edge.')));
  assert.ok(zhFeed.items.some(i=>i.content_html.includes('淋浴边缘出现可见水迹。')));
  assert.ok(fs.readFileSync(edited,'utf8').includes('Observed water at the shower edge.'));
  assert.ok(fs.readFileSync(path.join(temp,'zh/guides/shower-plumbing-or-waterproofing/index.html'),'utf8').includes('淋浴边缘出现可见水迹。'));
  assert.deepEqual(buildBilingual(temp,{check:true}).changed,[]);
  const page=path.join(temp,'about/index.html');fs.writeFileSync(page,fs.readFileSync(page,'utf8').replace('"@type":"AboutPage"','"@type":"BrokenPage"'));
  assert.throws(()=>buildBilingual(temp,{check:true}),/schema|Schema|out of sync/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
