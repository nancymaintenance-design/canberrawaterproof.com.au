import {headingRows} from '../data/post-rain-content.mjs';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {load} from 'cheerio';
import {entries,services,servicePath,caseAnchors} from '../data/customer-navigation.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),HOST='https://www.canberrawaterproof.com.au';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const routeFile=p=>p==='/'?'index.html':p.slice(1)+'index.html';
export function validateMapping(rows){
 const byPath=new Map(rows.map(p=>[p.path,p]));if(byPath.size!==rows.length)throw Error('Duplicate path');
 for(const p of rows){if(p.parent===p.path)throw Error('Self parent cycle');let current=p;const seen=new Set([p.path]);
  while(current.parent){const parent=byPath.get(current.parent);if(!parent)throw Error('Missing parent '+current.parent);if(parent.locale!==p.locale)throw Error('Wrong parent language');if(seen.has(parent.path))throw Error('Parent cycle');seen.add(parent.path);current=parent;}
  if(!byPath.has(p.owner)||byPath.get(p.owner).locale!==p.locale)throw Error('Missing or wrong language owner');
  const pair=byPath.get(p.counterpart);if(!pair||pair.counterpart!==p.path||pair.locale===p.locale)throw Error('Missing language pair');
 }return rows;
}
export function navigationMapping(root=ROOT,{allowPartial=false}={}){
 const rows=entries.flatMap(entry=>['en','zh'].map((locale,i)=>{const prefix=i?'/zh':'',p=prefix+entry.path;return {...entry,page_id:locale+':'+entry.path,path:p,url:HOST+p,locale,label:entry.labels[i],parent:entry.parent?prefix+entry.parent:null,owner:prefix+entry.owner,counterpart:(i?'':'/zh')+entry.path,file:routeFile(p)};}));
 validateMapping(rows);
 for(const p of rows){if(allowPartial&&!fs.existsSync(path.join(root,p.file)))continue;const $=load(fs.readFileSync(path.join(root,p.file),'utf8'));if($('link[rel="canonical"]').attr('href')!==p.url||/noindex|none/i.test($('meta[name="robots"]').attr('content')||''))throw Error('Non-public canonical mapping '+p.file);}
 return rows;
}
export function breadcrumbItems(row,rows){const result=[row],byPath=new Map(rows.map(p=>[p.path,p]));while(result[0].parent)result.unshift(byPath.get(result[0].parent));return result.map(p=>({name:p.label,url:p.url}));}
const managed=/<!-- customer-navigation:(?:breadcrumb|paths|assets|home):start -->[\s\S]*?<!-- customer-navigation:(?:breadcrumb|paths|assets|home):end -->/g;
export const withoutCustomerNavigation=html=>html.replace(managed,'');
export function applyCustomerNavigation(input,file,root=ROOT,provided){
 const rows=provided||navigationMapping(root),row=rows.find(p=>p.file===file);if(!row)return input;
 let html=withoutCustomerNavigation(input),zh=row.locale==='zh',prefix=zh?'/zh':'',basePath=row.path.replace(/^\/zh(?=\/)/,''),mark=(name,s)=>`<!-- customer-navigation:${name}:start -->${s}<!-- customer-navigation:${name}:end -->`;
 // Retire the old unlabelled text trails, not other section/navigation landmarks.
 html=html.replace(/<(div|p)\b[^>]*class="[^"]*\bcrumbs\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g,'');
 if(row.type!=='home'){
  const items=breadcrumbItems(row,rows);const nav=`<nav class="customer-breadcrumb wrap" aria-label="${zh?'面包屑导航':'Breadcrumb'}" data-breadcrumb-owner="${esc(row.group||'general-waterproofing')}"><ol>${items.map((p,i)=>`<li data-breadcrumb-position="${i+1}"${i===items.length-1?' aria-current="page"':''}>${i===items.length-1?`<span>${esc(p.name)}</span>`:`<a href="${p.url}">${esc(p.name)}</a>`}</li>`).join('')}</ol></nav>`;
  html=html.replace(/(<main\b[^>]*>)/,'$1'+mark('breadcrumb',nav));
 }
 const link=(route,label)=>`<a href="${prefix+route}">${esc(label)}</a>`;
 const serviceLink=id=>{const s=services.find(s=>s[0]===id);return link(servicePath(id),s[zh?2:1]);};
 const form=`<a class="button primary" href="${prefix}/contact/#service-form">${zh?'预约现场评估':'Request assessment'}</a>`,call=`<a class="button secondary" href="tel:+61482422607">${zh?'致电':'Call'} 0482 422 607</a>`;
 if(row.type==='home'){
  const extra=services.slice(6).map(s=>serviceLink(s[0])).join('');
  const block=mark('home',`<nav class="customer-service-shortcuts" aria-label="${zh?'更多防水服务':'More waterproofing services'}">${extra}</nav>`);
  html=html.replace(/(<a\b[^>]*href="\/services\/"[^>]*>View All 11 Waterproofing Services<\/a>|<a\b[^>]*href="\/zh\/services\/"[^>]*>[^<]*11[^<]*<\/a>)/,'$1'+block);
 }else if(row.type==='service'){
  const children=rows.filter(p=>p.locale===row.locale&&p.parent===row.path),related=entries.filter(e=>e.type==='guide'&&e.related?.includes(row.group));
  const evidence=caseAnchors[row.group];const links=[...children.map(p=>link(p.path.replace(/^\/zh(?=\/)/,''),p.label)),...related.map(p=>link(p.path,p.labels[zh?1:0])),...(evidence?[link('/case-studies/#'+evidence,zh?'查看相关施工照片':'View related project photographs')]:[])];
  const resource=headingRows.find(([slug,before])=>row.path.replace(/^\/zh(?=\/)/,'')===`/services/${slug}/`&&before==='Waterproofing repair guides and project photographs');
  const resourceHeading=resource?resource[zh?3:2]:(zh?'防水维修指南与施工照片':'Waterproofing repair guides and project photographs');
  if(links.length)html=html.replace('</main>',mark('paths',`<section class="customer-paths wrap" data-customer-paths aria-labelledby="customer-resources"><h2 id="customer-resources">${resourceHeading}</h2><p>${zh?'了解维修选择，查看相关施工记录，再与我们确认适合您房产的工作。':'Explore the repair options and relevant work photographs, then talk with us about your property.'}</p><ul>${links.map(l=>'<li>'+l+'</li>').join('')}</ul><div class="actions">${form}${call}</div></section>` )+'</main>');
 }else if(['guide','location','news'].includes(row.type)){
  const ids=row.group&&services.some(s=>s[0]===row.group)?[row.group]:row.related||[];
  const links=ids.map(serviceLink);
  const text=zh?'我们会现场检查受影响区域，说明合适的维修工作，并确认书面报价。':'We inspect the affected area, explain the appropriate repair work and confirm a written quote.';
  const block=mark('paths',`<aside class="customer-paths customer-paths--compact" data-customer-paths aria-label="${zh?'服务与现场评估':'Service and assessment'}">${links.length?`<p class="customer-paths-links">${links.join(' · ')}</p>`:''}<p>${text}</p><div class="actions">${form}${call}</div></aside>`);
  html=html.replace(/(<p\b[^>]*class="[^"]*\blede\b[^"]*"[^>]*>[\s\S]*?<\/p>)/,'$1'+block);
 }
 const asset=mark('assets','<link rel="stylesheet" href="/assets/customer-navigation.css">');
 const anchor='<link rel="stylesheet" href="/assets/site.css">';
 html=html.includes(anchor)?html.replace(anchor,anchor+asset):html.replace('</head>',asset+'</head>');
 return html.replace(/^[\t ]+(?=\r?$)/gm,'');
}
