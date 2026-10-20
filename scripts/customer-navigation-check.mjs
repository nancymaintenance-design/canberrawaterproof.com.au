import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {load} from 'cheerio';
import {navigationMapping,breadcrumbItems} from './customer-navigation.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),HOST='https://www.canberrawaterproof.com.au';
export function checkCustomerNavigation(root=ROOT){
 const rows=navigationMapping(root);const pages=new Map(rows.map(p=>[p.path,load(fs.readFileSync(path.join(root,p.file),'utf8'))]));let checked=0;
 for(const p of rows){const $=pages.get(p.path),nav=$('main > nav.customer-breadcrumb'),nodes=$('script[type="application/ld+json"]').toArray().flatMap(n=>{const g=JSON.parse($(n).text());return g['@graph']||[g];}),crumbs=nodes.filter(n=>n['@type']==='BreadcrumbList');
  if(p.type==='home'){if(nav.length||crumbs.length)throw Error('Homepage must not have a breadcrumb '+p.path);continue;}
  const expected=breadcrumbItems(p,rows);if(nav.length!==1||crumbs.length!==1)throw Error('Missing/duplicate breadcrumb '+p.path);
  const items=nav.find('ol > li').toArray();if(items.length!==expected.length||nav.attr('aria-label')!==(p.locale==='zh'?'面包屑导航':'Breadcrumb'))throw Error('Wrong trail or landmark '+p.path);
  items.forEach((li,i)=>{const n=$(li),current=i===items.length-1,schema=crumbs[0].itemListElement[i];if(n.text().trim()!==expected[i].name||schema.position!==i+1||schema.name!==expected[i].name||schema.item!==expected[i].url||schema['@type']!=='ListItem')throw Error('Visible/schema disagreement '+p.path);
   if(current){if(n.attr('aria-current')!=='page'||n.find('a').length)throw Error('Current page is linked '+p.path);}
   else {const a=n.find('a');if(a.length!==1||a.attr('href')!==expected[i].url||a.attr('target')||a.attr('rel')||new URL(a.attr('href')).search)throw Error('Invalid ancestor '+p.path);}
  });
  if(!nodes.some(n=>n.breadcrumb?.['@id']===crumbs[0]['@id']))throw Error('No page breadcrumb relation '+p.path);
  const parent=pages.get(p.parent);if(!parent('a[href]').toArray().some(n=>new URL(parent(n).attr('href'),HOST+p.parent).pathname===p.path))throw Error('Parent has no reciprocal child link '+p.path);
  for(const a of $('nav.customer-breadcrumb a,.customer-paths a,.customer-service-shortcuts a').toArray()){
   const href=$(a).attr('href');if(href.startsWith('tel:')){if(href!=='tel:+61482422607')throw Error('Wrong phone');continue;}
   const u=new URL(href,p.url),target=pages.get(u.pathname);if(u.origin!==HOST||!target||/noindex/i.test(target('meta[name="robots"]').attr('content')||''))throw Error('Invalid content target '+href);
   if(p.locale!==rows.find(r=>r.path===u.pathname).locale)throw Error('Language mixed '+p.path);
   if(u.hash&&!target('[id]').toArray().some(n=>target(n).attr('id')===decodeURIComponent(u.hash.slice(1))))throw Error('Missing target fragment '+href);
  }
  checked++;
 }
 return {mapped:rows.length,applicable:checked,covered:checked,homepageExclusions:2,errors:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(checkCustomerNavigation()));
