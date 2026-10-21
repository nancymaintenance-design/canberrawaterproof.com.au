import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';
import {applyExternalLinkPolicy} from '../scripts/external-link-policy.mjs';
import {applyCustomerFirstCopy} from '../scripts/customer-first-copy.mjs';
import {deepGuides} from '../scripts/deep-guides.mjs';
import {rainFaq} from '../data/post-rain-content.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const plain=value=>value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

test('FAQ categories precede the long reading introduction without losing native questions',()=>{
 const before=read('faq/index.html'),after=applySeoHtml(before,'faq/index.html');
 assert.ok(after.indexOf('class="faq-navigation"')<after.indexOf('class="faq-introduction"'),'early category discovery');
 assert.equal((after.match(/<details\b/g)||[]).length,40+rainFaq.length);
 assert.match(after,/aria-label="Waterproofing Service Enquiries &amp; Quotes"/);
 assert.match(after,/<span>Enquiries &amp; quotes<\/span>/);
 assert.equal(applySeoHtml(after,'faq/index.html'),after);
});

test('FAQ offsets follow occupied sticky surfaces when the menu expands',()=>{
 let headerHeight=85,barHeight=68,position='sticky';
 const styles={},events={},attributes=[{}, {}, {}];
 const links=attributes.map((attrs,i)=>({hash:'#category-'+i,setAttribute:(key,value)=>attrs[key]=value,removeAttribute:key=>delete attrs[key]}));
 const navigation={querySelectorAll:()=>links,getBoundingClientRect:()=>({height:barHeight})};
 const header={getBoundingClientRect:()=>({height:headerHeight})};
 const context={document:{documentElement:{classList:{add(){}},style:{setProperty:(k,v)=>styles[k]=v}},querySelector:s=>s==='.faq-navigation'?navigation:header,getElementById:id=>({getBoundingClientRect:()=>({top:Number(id.at(-1))*300})})},matchMedia:()=>({matches:true}),getComputedStyle:()=>({position}),window:{},addEventListener:(type,fn)=>events[type]=fn,requestAnimationFrame:fn=>fn()};
 vm.runInNewContext(read('assets/faq-navigation.js'),context);
 assert.equal(styles['--faq-header-height'],'85px');
 assert.equal(styles['--faq-bar-height'],'68px');
 headerHeight=420;position='static';events.resize();
 assert.equal(styles['--faq-header-height'],'420px');
 assert.equal(styles['--faq-bar-height'],'0px','expanded menu releases the category sticky slot');
 headerHeight=85;position='sticky';barHeight=94;events.resize();
 assert.equal(styles['--faq-bar-height'],'94px','text zoom is measured rather than assumed');
 assert.equal(attributes[0]['aria-current'],'location');
});

test('short landscape FAQ reserves the compact category bar below the desktop header',()=>{
 const styles={},attributes=[{}, {}, {}];
 const links=attributes.map((attrs,i)=>({hash:'#category-'+i,setAttribute:(key,value)=>attrs[key]=value,removeAttribute:key=>delete attrs[key]}));
 const navigation={querySelectorAll:()=>links,getBoundingClientRect:()=>({height:68})};
 const header={getBoundingClientRect:()=>({height:85})};
 const context={document:{documentElement:{classList:{add(){}},style:{setProperty:(k,v)=>styles[k]=v}},querySelector:s=>s==='.faq-navigation'?navigation:header,getElementById:id=>({getBoundingClientRect:()=>({top:Number(id.at(-1))*300})})},matchMedia:query=>({matches:query.includes('max-height: 600px')}),getComputedStyle:()=>({position:'sticky'}),window:{},addEventListener(){},requestAnimationFrame:fn=>fn()};
 vm.runInNewContext(read('assets/faq-navigation.js'),context);
 assert.equal(styles['--faq-header-height'],'85px');
 assert.equal(styles['--faq-bar-height'],'68px','844×390 uses the compact bar rather than a tall sidebar');
 assert.equal(attributes[0]['aria-current'],'location');
});

test('Contact opening offers a direct form route while retaining controls and enquiry endpoint',()=>{
 const before=read('contact/index.html'),after=applySeoHtml(before,'contact/index.html');
 const opening=after.match(/<section class="page-intro">[\s\S]*?<\/section>/)[0];
 assert.match(opening,/href="#service-form"/);
 assert.match(opening,/href="tel:\+61482422607"/);
 assert.doesNotMatch(opening,/photos|riley@/i,'opening leaves the full photo instructions in their dedicated place');
 const safety=before.match(/<p class="wrap">Photos are optional:[\s\S]*?<\/p>/)[0];
 assert.ok(after.includes(safety),'retain the complete optional-photo and safety instructions');
 assert.equal(after.match(/<form\b[\s\S]*?<\/form>/)[0],before.match(/<form\b[\s\S]*?<\/form>/)[0]);
 assert.equal(applySeoHtml(after,'contact/index.html'),after);
});

test('home assessment action uses the direct form path while discovery actions retain their destinations',()=>{
 const before=read('index.html'),after=applySeoHtml(before,'index.html');
 const hero=after.match(/<section class="hero">[\s\S]*?<\/section>/)[0];
 assert.match(hero,/<a class="button primary" href="\/contact\/#service-form">Request assessment<\/a>/);
 assert.match(hero,/href="tel:\+61482422607"/);
 for(const href of ['/services/','/case-studies/','/service-areas/']){
  const action=before.match(new RegExp('<a class="button primary" href="'+href+'">[\\s\\S]*?<\\/a>'))[0];
  assert.ok(after.includes(action),'retain discovery action '+href);
 }
 assert.equal(applySeoHtml(after,'index.html'),after);
});

for(const guide of deepGuides)test(`${guide.slug} offers a reading column and sourced distinctions without removing depth`,()=>{
 const path=`guides/${guide.slug}/index.html`,before=read(path),after=applySeoHtml(before,path);
 assert.match(after,/class="deep-guide-layout"/);
 assert.match(after,/class="deep-guide-body"/);
 assert.match(after,/class="deep-guide-summary"/);
 assert.match(after,/class="deep-guide-distinctions"/);
 assert.ok(after.indexOf('class="deep-guide-toc"')<after.indexOf('class="guide-cover"'),'contents are available before the cover');
 const matrix=JSON.parse(after.match(/<script id="llm-entity-json" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(matrix.knowledge_matrix.sections.length,8);
 for(const section of guide.sections)assert.ok(after.includes(applyCustomerFirstCopy(applyExternalLinkPolicy(section.html),path)),`retained full section ${section.id}`);
 for(const section of matrix.knowledge_matrix.sections)assert.ok(plain(after).includes(section.content),'feed reflects visible full section');
 assert.deepEqual([...after.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]),[...before.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]));
 for(const section of guide.sections)for(const table of section.html.matchAll(/<table\b[\s\S]*?<\/table>/g))assert.ok(after.includes(table[0]),'authored full-context tables remain intact');
 assert.equal(applySeoHtml(after,path),after);
});

test('guide comparison rows state the practical material and quote boundaries',()=>{
 const quote=applySeoHtml(read('guides/waterproofing-retiling-quote/index.html'),'guides/waterproofing-retiling-quote/index.html');
 const quoteRow=quote.match(/<tr><th scope="row"><a href="#comparable-quotes">[\s\S]*?<\/tr>/)[0];
 assert.match(plain(quoteRow),/removal.*preparation.*waterproofing.*reinstatement/i,'a scope comparison names the work being compared');
 const shower=applySeoHtml(read('guides/regrouting-resealing-or-rewaterproofing/index.html'),'guides/regrouting-resealing-or-rewaterproofing/index.html');
 const materialRow=shower.match(/<tr><th scope="row"><a href="#grout-silicone-membrane">[\s\S]*?<\/tr>/)[0];
 assert.match(plain(materialRow),/grout.*silicone.*membrane/i,'the material comparison distinguishes all three roles');
});
