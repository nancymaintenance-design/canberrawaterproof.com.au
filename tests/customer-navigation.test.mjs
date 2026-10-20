import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {load} from 'cheerio';import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import path from 'node:path';import os from 'node:os';
const root=new URL('../',import.meta.url);
const html=file=>fs.readFileSync(new URL(file,root),'utf8');
test('single-service guide starts with a real service breadcrumb and supports a quote',()=>{
 const $=load(html('guides/shower-plumbing-or-waterproofing/index.html')),nav=$('main > nav.customer-breadcrumb');
 assert.equal(nav.length,1,'Missing shared visible breadcrumb');assert.equal(nav.attr('aria-label'),'Breadcrumb');
 assert.deepEqual(nav.find('a').map((_,n)=>$(n).attr('href')).get(),['https://www.canberrawaterproof.com.au/','https://www.canberrawaterproof.com.au/services/leaking-shower-repairs/']);
 assert.equal(nav.find('[aria-current="page"]').length,1);assert.equal(nav.find('[aria-current="page"] a').length,0);
 assert.ok($('[data-customer-paths] a[href*="/contact/#service-form"]').length);
});
test('Chinese hierarchy stays Chinese and is identical to the one BreadcrumbList',()=>{
 const $=load(html('zh/guides/regrouting-resealing-or-rewaterproofing/index.html')),nav=$('nav.customer-breadcrumb');
 assert.equal(nav.length,1);assert.equal(nav.attr('aria-label'),'面包屑导航');
 assert.deepEqual(nav.find('a').map((_,n)=>$(n).attr('href')).get(),['https://www.canberrawaterproof.com.au/zh/','https://www.canberrawaterproof.com.au/zh/services/shower-resealing-regrouting/']);
 const nodes=$('script[type="application/ld+json"]').toArray().flatMap(n=>JSON.parse($(n).text())['@graph']||[]),crumb=nodes.filter(n=>n['@type']==='BreadcrumbList');
 assert.equal(crumb.length,1);assert.deepEqual(crumb[0].itemListElement.map(n=>n.name),nav.find('li').map((_,n)=>$(n).text().trim()).get());
 assert.equal(nodes.find(n=>n['@type']==='WebPage').breadcrumb['@id'],crumb[0]['@id']);
});
test('existing service pages link back to relevant guides and all eleven services are one click from both homes',()=>{
 const guide='/guides/shower-plumbing-or-waterproofing/';
 for(const prefix of ['','zh/']){const $=load(html(prefix+'services/leaking-shower-repairs/index.html'));assert.ok($('a[href$="'+guide+'"]').length);assert.ok($('[data-customer-paths]').text().includes(prefix?'淋浴':'Shower'));}
 for(const prefix of ['','zh/']){const $=load(html(prefix+'index.html'));for(const file of fs.readdirSync(new URL('services/',root),{withFileTypes:true}).filter(e=>e.isDirectory()))assert.ok($('main a').toArray().some(n=>new URL($(n).attr('href'),'https://www.canberrawaterproof.com.au').pathname==='/'+prefix+'services/'+file.name+'/'),'home lacks '+prefix+file.name);assert.equal($('nav.customer-breadcrumb').length,0);}
});
test('mapping rejects cycles, cross-language parents and hidden ancestors; multi-topic content retains its collection',async()=>{
 assert.ok(fs.existsSync(new URL('scripts/customer-navigation.mjs',root)),'Mapping implementation missing');
 const {navigationMapping,validateMapping,applyCustomerNavigation}=await import('../scripts/customer-navigation.mjs');const map=navigationMapping(fileURLToPath(root));
 assert.equal(map.find(p=>p.path==='/guides/waterproofing-or-drainage/').parent,'/guides/');
 const bad=structuredClone(map);bad.find(p=>p.path==='/services/').parent='/services/';assert.throws(()=>validateMapping(bad),/cycle|self/i);
 const mixed=structuredClone(map);mixed.find(p=>p.path==='/zh/services/').parent='/';assert.throws(()=>validateMapping(mixed),/language/i);
 const missing=structuredClone(map);missing.find(p=>p.path==='/services/').parent='/missing/';assert.throws(()=>validateMapping(missing),/parent/i);
 const out=applyCustomerNavigation(html('guides/shower-plumbing-or-waterproofing/index.html'),'guides/shower-plumbing-or-waterproofing/index.html');assert.equal(applyCustomerNavigation(out,'guides/shower-plumbing-or-waterproofing/index.html'),out);
});
test('breadcrumb click reuses tracking once, omits query data and never counts as a lead',()=>{
 const events=[],listeners=[];const win={location:{hostname:'www.canberrawaterproof.com.au',origin:'https://www.canberrawaterproof.com.au',pathname:'/zh/guides/shower-plumbing-or-waterproofing/',search:'?private=secret'},gtag:(...args)=>events.push(args)};
 const document={addEventListener:(type,fn)=>listeners.push(fn)};const script=html('assets/conversion-events.js');const context={window:win,document,URL,queueMicrotask:fn=>fn()};vm.runInNewContext(script,context);vm.runInNewContext(script,context);assert.equal(listeners.length,1);
 const attrs={href:'https://www.canberrawaterproof.com.au/zh/services/leaking-shower-repairs/','data-breadcrumb-position':'2','data-breadcrumb-owner':'leaking-shower-repairs'};
 const link={getAttribute:key=>attrs[key]||'',closest:selector=>['nav.customer-breadcrumb','li'].includes(selector)?{getAttribute:key=>attrs[key]||''}:null};listeners[0]({button:0,defaultPrevented:false,target:{closest:()=>link}});
 assert.equal(events.length,1);assert.equal(events[0][1],'breadcrumb_click');assert.equal(events[0][2].locale,'zh-Hans');assert.equal(events[0][2].position,2);assert.equal(events[0][2].target_path,'/zh/services/leaking-shower-repairs/');assert.ok(!JSON.stringify(events).includes('secret'));
});
test('all mapped pages pass reciprocity checks and non-indexable ancestors are rejected',async()=>{
 const {navigationMapping}=await import('../scripts/customer-navigation.mjs');const {checkCustomerNavigation}=await import('../scripts/customer-navigation-check.mjs');
 const result=checkCustomerNavigation(fileURLToPath(root));assert.equal(result.covered,76);assert.equal(result.errors,0);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'cwp-navigation-'));try{
  for(const p of navigationMapping()){const target=path.join(temp,p.file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(new URL(p.file,root),target);}
  const target=path.join(temp,'about/index.html');fs.writeFileSync(target,fs.readFileSync(target,'utf8').replace('name="robots" content="index,follow"','name="robots" content="noindex,follow"'));
  assert.throws(()=>navigationMapping(temp),/Non-public canonical/);
 }finally{assert.equal(path.dirname(temp),os.tmpdir());fs.rmSync(temp,{recursive:true,force:true});}
});
test('quoted and script-like breadcrumb labels remain text in HTML and safely serialized JSON-LD',async()=>{
 const {navigationMapping,applyCustomerNavigation}=await import('../scripts/customer-navigation.mjs');const {extractPage,enrich,patchHtml}=await import('../scripts/schema-feed-core.mjs');
 const rows=navigationMapping(),file='guides/shower-plumbing-or-waterproofing/index.html',label='Shower " & </script><script>alert(1)</script>';
 rows.find(p=>p.file===file).label=label;const output=applyCustomerNavigation(html(file),file,fileURLToPath(root),rows),d=load(output);assert.equal(d('nav.customer-breadcrumb [aria-current]').text(),label);
 const page=extractPage(output,file),final=patchHtml(output,enrich(page,[]),'en-AU'),parsed=load(final);
 assert.equal(parsed('script[type="application/ld+json"]').length,1);assert.equal(parsed('script').filter((_,n)=>parsed(n).text()==='alert(1)').length,0);
 const node=JSON.parse(parsed('script[type="application/ld+json"]').text())['@graph'].find(n=>n['@type']==='BreadcrumbList');assert.equal(node.itemListElement.at(-1).name,label);
});
