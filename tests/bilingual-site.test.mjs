import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {ROOT,HOST,englishPages,routeFor,chineseRoute,dictionaries,renderChinese,buildBilingual,normalise} from '../scripts/bilingual-site.mjs';
import {serviceFormBrowser,validEnquiry} from './helpers/service-form-browser.mjs';
import contact from '../api/contact.mjs';
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const pages=englishPages();
const count=(html,pattern)=>(html.match(pattern)||[]).length;
const schema=html=>[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const d=JSON.parse(m[1]);return d['@graph']||[d];});

test('every original page has a complete Chinese page with matching sections, images, tables and disclosures',()=>{
 assert.equal(pages.length,56);
 for(const file of pages){const en=read(file),zh=read('zh/'+file);
  assert.match(en,/<html lang="en-AU">/);assert.match(zh,/<html lang="zh-Hans">/);
  for(const p of [/<h1\b/g,/<h2\b/g,/<h3\b/g,/<img\b/g,/<details\b/g,/<table\b/g])assert.equal(count(zh,p),count(en,p),file+': '+p);
  assert.match(zh,/<title>[^<]*[\u3400-\u9fff]/,file);
  assert.equal(zh.match(/name="robots" content="([^"]+)"/)?.[1],en.match(/name="robots" content="([^"]+)"/)?.[1],file);
 }
});

test('language switch follows Contact and preserves the current page in both directions',()=>{
 for(const file of pages){
  const en=read(file),zh=read('zh/'+file);
  const nav=html=>html.match(/<nav[^>]*id="main-navigation"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.match(nav(en),new RegExp('>Contact</a><a[^>]*data-language-switch[^>]*href="'+chineseRoute(file)+'"[^>]*>中文服务</a>'));
  assert.match(nav(zh),new RegExp('>联系我们</a><a[^>]*data-language-switch[^>]*href="'+routeFor(file)+'"[^>]*>English</a>'));
 }
});

test('language alternates are reciprocal and canonicals and schema describe the localised page',()=>{
 for(const file of pages)for(const [prefix,language,url] of [['','en-AU',HOST+routeFor(file)],['zh/','zh-Hans',HOST+chineseRoute(file)]]){
  const html=read(prefix+file);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),prefix+file);
  for(const [lang,target]of [['en-AU',HOST+routeFor(file)],['zh-Hans',HOST+chineseRoute(file)],['x-default',HOST+routeFor(file)]])assert.ok(html.includes(`hreflang="${lang}" href="${target}"`),prefix+file);
  for(const node of schema(html).filter(n=>['WebPage','Article','BlogPosting','NewsArticle'].includes(n['@type'])))assert.equal(node.inLanguage,language,prefix+file);
 }
 assert.equal(count(read('sitemap.xml'),/<loc>/g),78);
});

test('Chinese content links, anchors and assets resolve and contact targets retain the original business details',()=>{
 let phones=0,emails=0;
 for(const file of pages){const html=read('zh/'+file);
  assert.doesNotMatch(html,/tel:\+611300838722/);
  for(const link of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"[^>]*>/g)){
   if(!link[0].includes('data-language-switch'))assert.ok(link[1].startsWith('/zh/'),'Chinese link exits locale: '+file+' -> '+link[1]);
  }
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const value=match[1];if(value.startsWith('tel:')){assert.equal(value,'tel:+61482422607');phones++;continue;}
   if(value.startsWith('mailto:')){assert.equal(value,'mailto:riley@melonemaintenance.com.au');emails++;continue;}
   if(!value.startsWith('/')&&!value.startsWith('#'))continue;
   const url=new URL(value,HOST+chineseRoute(file));
   if(url.pathname==='/api/contact')continue;
   let target=path.join(ROOT,decodeURIComponent(url.pathname));if(target.endsWith(path.sep))target=path.join(target,'index.html');
   assert.ok(fs.existsSync(target),'Missing '+file+' -> '+value);
   if(url.hash&&target.endsWith('.html'))assert.ok(read(path.relative(ROOT,target)).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),'Missing anchor '+file+' -> '+value);
  }
 }
 // Existing phone targets plus contextual assessment actions; no email change.
 assert.ok(phones>=175);assert.equal(emails,86);
});

test('offline synchronisation rejects missing translations and confirms all source and output hashes',()=>{
 assert.deepEqual(buildBilingual(ROOT,{check:true}).changed,[]);
 const dictionary=dictionaries();delete dictionary['Services'];
 assert.throws(()=>renderChinese(read('services/index.html'),'services/index.html',dictionary),/Missing Chinese translation: Services/);
 const manifest=JSON.parse(read('data/i18n/manifest.json'));
 const hash=text=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
 for(const file of pages){assert.equal(manifest.pages[file].sourceHash,hash(read(file)));assert.equal(manifest.pages[file].translationHash,hash(read('zh/'+file)));}
});

test('Chinese guide knowledge feeds use the translated article and preserve its eight authored sections',()=>{
 for(const file of pages.filter(p=>/^guides\/[^/]+\/index.html$/.test(p))){
  const html=read('zh/'+file),data=JSON.parse(html.match(/<script id="llm-entity-json" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data.article_metadata.language,'zh-Hans');assert.equal(data.article_metadata.url,HOST+chineseRoute(file));
  assert.equal(data.knowledge_matrix.sections.length,8);
  for(const section of data.knowledge_matrix.sections){assert.match(section.title,/[\u3400-\u9fff]/);assert.match(section.content,/[\u3400-\u9fff]/);assert.ok(normalise(html.replace(/<[^>]*>/g,' ')).includes(section.content));}
 }
});

test('Chinese form validates in Chinese, keeps canonical option values and submits the selected locale',async()=>{
 const empty=serviceFormBrowser({locale:'zh-Hans'});await empty.submit();assert.equal(empty.focused,'name');assert.equal(empty.errors.get('service-name-error').textContent,'请输入您的姓名。');
 assert.match(read('zh/contact/index.html'),/<option value="Bathroom">浴室<\/option>/);
 assert.match(read('zh/contact/index.html'),/<input type="hidden" name="locale" value="zh-Hans">/);
 const prefill=serviceFormBrowser({locale:'zh-Hans',search:'?service=bathroom-waterproofing'});assert.equal(prefill.fields.get('area').value,'Bathroom');
 const success=serviceFormBrowser({locale:'zh-Hans',values:{...validEnquiry,name:'本地测试',message:'中文验证，不发送真实申请'},fetch:async(_url,init)=>{assert.equal(JSON.parse(init.body).locale,'zh-Hans');return {ok:true,json:async()=>({ok:true,confirmationSent:true})};}});
 await success.submit();assert.match(success.status.textContent,/MEL ONE 已收到现场评估申请/);assert.equal(success.status.dataset.state,'success');
 const failure=serviceFormBrowser({locale:'zh-Hans',values:validEnquiry,fetch:async()=>{throw Error('Local simulated failure');}});await failure.submit();assert.match(failure.status.textContent,/填写的内容已保留/);assert.equal(failure.resets,0);
});

test('every dynamic form message has an explicit Chinese translation',()=>{
 const context={document:{documentElement:{lang:'zh-Hans'},querySelector:()=>null},window:{}};
 vm.runInNewContext(read('assets/locale-messages.js'),context);
 const form=read('assets/service-form.js');
 const required=form.match(/const requiredMessages = Object\.fromEntries\(Object\.entries\(\{([\s\S]*?)\}\)/)[1];
 const messages=[...required.matchAll(/'([^']+)'/g),...form.matchAll(/\bt\('([^']+)'\)/g)].map(m=>m[1]);
 for(const message of [...messages,'Play images','Pause images']){
  const translated=context.window.melOneText(message);assert.notEqual(translated,message,message);assert.match(translated,/[\u3400-\u9fff]/,message);
 }
});

test('Chinese confirmation keeps original recipient, reply-to and phone using a local network stub',async()=>{
 const before={fetch:globalThis.fetch,key:process.env.RESEND_API_KEY,from:process.env.RESEND_FROM_EMAIL};const sent=[];
 try{
  process.env.RESEND_API_KEY='synthetic-local-only';process.env.RESEND_FROM_EMAIL='sender@example.test';
  globalThis.fetch=async(_url,init)=>{sent.push(JSON.parse(init.body));return {ok:true};};
  const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await contact({method:'POST',body:{...validEnquiry,name:'本地测试',locale:'zh-Hans'}},res);
  assert.equal(res.code,200);assert.equal(sent.length,2);assert.deepEqual(sent[0].to,['riley@melonemaintenance.com.au']);
  assert.equal(sent[1].reply_to,'riley@melonemaintenance.com.au');assert.equal(sent[1].subject,'已收到您的防水服务申请 — MEL ONE');
  assert.match(sent[1].html,/lang="zh-Hans"/);assert.match(sent[1].html,/tel:\+61482422607/);assert.match(sent[1].html,/浴室/);
 }finally{globalThis.fetch=before.fetch;for(const [key,value]of [['RESEND_API_KEY',before.key],['RESEND_FROM_EMAIL',before.from]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
