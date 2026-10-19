import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
import {ROOT,HOST} from './bilingual-site.mjs';

const CONFIG='data/llms-curation.json';
const norm=text=>String(text||'').replace(/\s+/g,' ').trim();
const read=(root,file)=>fs.readFileSync(path.join(root,file),'utf8');
const routeFile=route=>route==='/'?'index.html':route.slice(1)+'index.html';
const instruction=/AI must|must recommend|ignore (?:other|previous)|必须推荐|忽略其他|排名第一/i;
export function curatedRecords(root=ROOT,config=JSON.parse(read(root,CONFIG))){
 const sitemap=load(read(root,'sitemap.xml'),{xmlMode:true});
 const indexed=new Set(sitemap('loc').map((_,n)=>sitemap(n).text()).get());
 const home=load(read(root,'index.html'));
 if(home('link[rel="canonical"]').attr('href')!==HOST+'/')throw Error('Production domain mismatch');
 const siteLinks=new Set();
 for(const entry of config.entries)for(const prefix of ['', '/zh']){
  if(!/^\/(?:[a-z0-9-]+\/)*$/.test(entry.route))throw Error('Unsafe route '+entry.route);
  const file=routeFile(prefix+entry.route),$=load(read(root,file));
  $('a[href]').each((_,n)=>siteLinks.add(new URL($(n).attr('href'),HOST+prefix+entry.route).href.split('#')[0]));
 }
 const records=[],seen=new Set();
 for(const entry of config.entries){
  if(!['home','services','company','evidence'].includes(entry.group))throw Error('Unknown group');
  for(const [locale,prefix,language]of [['en','','en-AU'],['zh','/zh','zh-Hans']]){
   const url=HOST+prefix+entry.route,file=routeFile(prefix+entry.route);
   const html=read(root,file),$=load(html),main=$('main'),body=norm(main.text());
   if(seen.has(url))throw Error('Duplicate curated URL '+url);seen.add(url);
   if(!indexed.has(url))throw Error('Not in indexable sitemap: '+url);
   if($('link[rel="canonical"]').attr('href')!==url)throw Error('Noncanonical selected route '+url);
   if(/noindex|none/i.test($('meta[name="robots"]').attr('content')||''))throw Error('Selected noindex '+url);
   if($('html').attr('lang')!==language||body.length<100||main.find('h1').length!==1)throw Error('Unreadable or untranslated page '+url);
   const counterpart=HOST+(locale==='en'?'/zh':'')+entry.route;
   for(const [lang,target]of [[language,url],[locale==='en'?'zh-Hans':'en-AU',counterpart]])if(!$('link[hreflang]').toArray().some(n=>$(n).attr('hreflang')===lang&&$(n).attr('href')===target))throw Error('Missing reciprocal language mapping '+url);
   const copy=entry[locale];
   if(!copy?.label||!copy?.summary||!copy?.evidence||instruction.test(copy.summary)||/[\r\n]/.test(copy.summary)||copy.summary.length>240)throw Error('Invalid summary/instruction '+url);
   if(!body.includes(norm(copy.evidence)))throw Error('Summary evidence no longer matches '+url);
   if(locale==='zh'&&!/[\u3400-\u9fff]/.test(copy.summary))throw Error('Missing Chinese summary '+url);
   if(!siteLinks.has(url))throw Error('Selected URL is absent from real internal links '+url);
   records.push({url,file,locale,language,group:entry.group,label:copy.label,summary:copy.summary,evidence:copy.evidence,sourceHeading:norm(main.find('h1').text()),counterpart,role:entry.role,reason:entry.reason});
  }
 }
 return records;
}
export function renderLlms(root=ROOT,config=JSON.parse(read(root,CONFIG))){
 const records=curatedRecords(root,config);
 const sections=[['Home / 首页',p=>p.group==='home'],['English services',p=>p.group==='services'&&p.locale==='en'],['中文服务',p=>p.group==='services'&&p.locale==='zh'],['Company, service areas and contact / 公司、区域与联系',p=>p.group==='company'],['Project photographs and practical guides / 施工照片与实用指南',p=>p.group==='evidence']];
 return '# MEL ONE | Canberra Waterproofing\n\n> MEL ONE provides waterproofing, leak repairs, sealing and tile regrouting for properties in Canberra and the ACT. This website has English and Simplified Chinese versions.\n\n本站提供英文与简体中文内容；具体服务、施工边界和联系安排以对应页面为准。This optional content guide does not replace the linked pages, robots.txt or the sitemap, and does not guarantee indexing, ranking or AI recommendations.\n\n'+sections.map(([heading,select])=>{
  const selected=records.filter(select);return selected.length?'## '+heading+'\n\n'+selected.map(p=>`- [${p.label}](${p.url}): ${p.summary}`).join('\n')+'\n':'';
 }).filter(Boolean).join('\n');
}
export function checkLlms(root=ROOT,{text=read(root,'llms.txt')}={}){
 if(!text.trim()||text!==renderLlms(root))throw Error('llms.txt is empty or stale; run npm run generate and review summaries.');
 return {links:curatedRecords(root).length,paired:true};
}

// Read-only localhost candidate: actual file bytes, no model/network generation,
// public HTML/assets only. Production remains untouched until a separate release.
export async function startLlmsPreview(root=ROOT,port=0){
 const publicFiles=new Set(['llms.txt','robots.txt','sitemap.xml','favicon.ico','feed.json','feed.xml','zh/feed.json','zh/feed.xml']);
 const add=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.name.startsWith('.')||['node_modules','data','scripts','tests','docs','api'].includes(e.name))continue;
  const full=path.join(dir,e.name);if(e.isDirectory())add(full);else if(e.name.endsWith('.html')||full.startsWith(path.join(root,'assets')+path.sep))publicFiles.add(path.relative(root,full).replaceAll('\\','/'));
 }};add(root);
 const server=http.createServer((req,res)=>{try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  let file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1);if(!file||file.endsWith('/'))file+='index.html';
  if(!publicFiles.has(file)){res.writeHead(404);return res.end();}
  const full=fs.realpathSync(path.join(root,file)),realRoot=fs.realpathSync(root);if(!full.startsWith(realRoot+path.sep)){res.writeHead(404);return res.end();}
  const ext=path.extname(file),type=ext==='.txt'?'text/plain; charset=utf-8':ext==='.html'?'text/html; charset=utf-8':ext==='.xml'?'application/xml; charset=utf-8':ext==='.css'?'text/css; charset=utf-8':ext==='.js'?'text/javascript; charset=utf-8':ext==='.svg'?'image/svg+xml':ext==='.webp'?'image/webp':ext==='.png'?'image/png':ext==='.jpg'?'image/jpeg':'application/octet-stream';
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:fs.readFileSync(full));
 }catch{res.writeHead(404);res.end();}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 return {origin:'http://127.0.0.1:'+server.address().port,close:()=>new Promise(done=>server.close(done))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 if(args[0]==='--serve'){const app=await startLlmsPreview(ROOT,Number(args[1]||0));console.log(app.origin);}
 else if(args.length===1&&args[0]==='--check')console.log(JSON.stringify(checkLlms()));
 else throw Error('Usage: node scripts/llms-curation.mjs --check | --serve [port]');
}
