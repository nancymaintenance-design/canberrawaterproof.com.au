import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>process.env.CWP_COPY_BASELINE==='1'?execFileSync('git',['show','HEAD:'+p.replace(/\\/g,'/')],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,p),'utf8');
const visible=h=>h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ');
function pages(dir=root){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||e.name==='tests'||e.name==='docs'?[]:e.isDirectory()?pages(path.join(dir,e.name)):e.name.endsWith('.html')?[path.relative(root,path.join(dir,e.name))]:[]);}
test('public pages own qualified-trade arrangements and remove discussion-only next steps',()=>{
  for(const p of pages()) assert.doesNotMatch(read(p),/directed to the appropriate trade|directed through the appropriate scope|begin the service discussion|provides [^.<>]*plus [^.<>]*(?:waterproofing contractors|local waterproofer)|service service requests/i,p);
  assert.match(visible(read('services/index.html')),/MEL ONE[^.]*arranges[^.]*qualified/i);
});
test('contact and generated local forms explain assessment and optional email photos',()=>{
  for(const p of ['contact/index.html','waterproofing/inner-north-city/index.html','services/bathroom-waterproofing/index.html']){
    const text=visible(read(p));assert.match(text,/on-site assessment/i,p);assert.match(text,/written quote/i,p);assert.match(text,/optional[^.]*riley@melonemaintenance.com.au/i,p);
    assert.doesNotMatch(text,/safe photos through our|prepare the right service response|Add photos where available/i,p);
  }
});
test('photo-only diagnosis FAQ directly explains concealed limitations and consent',()=>{
  const text=visible(read('about/index.html'));assert.match(text,/do not confirm a concealed leak source/i);assert.match(text,/agree[^.]*access|access[^.]*agree/i);
});
test('all FAQ schema answers match the public rendered text',()=>{
  for(const p of pages()){const h=read(p),text=visible(h);for(const m of h.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)){const data=JSON.parse(m[1]);for(const item of data['@graph']||[data])if(item['@type']==='FAQPage')for(const qa of item.mainEntity){assert.ok(text.includes(qa.name),p+': '+qa.name);assert.ok(text.includes(qa.acceptedAnswer.text),p+': '+qa.name);}}}
});


test('all nine services and intent guides explain on-site service without photo or trade prerequisites',()=>{
  for(const p of pages().filter(p=>/^(services|guides)[\\/]/.test(p))){
    if(p.replace(/\\/g,'/')==='services/index.html'||p.replace(/\\/g,'/')==='guides/index.html') continue;
    const text=visible(read(p));
    assert.doesNotMatch(text,/safe photos through our|plumbing concerns directed|A plumber should address|Choose the trade by|before defining the next inspection step|send the affected area, timing, safe photos/i,p);
    assert.match(text,/on-site assessment/i,p);
    assert.match(text,/written quote/i,p);
    if(/photo/i.test(text))assert.match(text,/optional[^.]*riley@melonemaintenance.com.au/i,p);
  }
  for(const p of ['services/laundry-waterproofing/index.html','services/bathroom-waterproofing/index.html'])assert.match(visible(read(p)),/installation requirements|renovation requirements/i,p);
});
test('public copy and generators do not expose internal SEO or planned photo-upload copy',()=>{
  for(const p of pages())assert.doesNotMatch(visible(read(p)),/For Canberra searches|For searches such|If you are searching|Content is written for|Photo upload and storage will only be enabled/i,p);
  for(const p of ['scripts/build-bathroom-waterproofing-page.mjs','scripts/build-service-detail-pages.mjs','scripts/build-intent-guides.mjs','scripts/rewrite-intent-headings.mjs'])assert.doesNotMatch(read(p),/safe photos through our|For Canberra searches|For searches such|If you are searching|A plumber should address|plumbing concerns directed/i,p);
});
test('quote preparation accepts first contact without dimensions, photos or tile choices',()=>{
  const text=visible(read('guides/waterproofing-retiling-quote/index.html'));
  assert.match(text,/Measurements and photographs are not needed before first contact/i);
  assert.match(text,/do not need to collect every item/i);
  assert.match(text,/installation requirements/i);
  assert.match(text,/No\. Contact MEL ONE before choosing tiles/i);
});
