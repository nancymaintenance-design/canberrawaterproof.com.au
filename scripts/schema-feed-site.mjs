import fs from 'node:fs';
import path from 'node:path';
import {extractPage,enrich,patchHtml,feeds,previousFeed,hash} from './schema-feed-core.mjs';

const STATE='.schema-feed-v2/base-schemas.json';
const BASELINES='.schema-feed-v2/editor-baselines.json';
const schemaPattern=/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi;
const discovery=/<!-- schema-feed-v2:discovery:start -->[\s\S]*?<!-- schema-feed-v2:discovery:end -->/g;
const json=value=>JSON.stringify(value,null,2)+'\n';
const read=(root,file,fallback)=>fs.existsSync(path.join(root,file))?JSON.parse(fs.readFileSync(path.join(root,file),'utf8')):fallback;
const markup=html=>[...html.matchAll(schemaPattern)].map(m=>m[0]).join('');
const graphHash=html=>hash(JSON.stringify([...html.matchAll(schemaPattern)].map(m=>JSON.parse(m[0].replace(/^<script[^>]*>|<\/script>$/gi,'')))));
export const withoutMachine=html=>html.replace(schemaPattern,'').replace(discovery,'');
export const editorContentHash=(english,chinese)=>hash(withoutMachine(english)+'\0'+withoutMachine(chinese));
export function editorBaseline(file,english,chinese,registry){
 const contentHash=editorContentHash(english,chinese),old=registry?.pages?.[file];
 return old?.contentHash===contentHash?old.legacyHash:contentHash;
}
export function editorRegistry(root){return read(root,BASELINES,{version:1,pages:{}});}

// Translate only authored metadata. Derived article bodies/topics are rebuilt from
// each locale's visible HTML, never sent back through the translation dictionary.
export function authoredHtml(root,file,html){
 if(!html.includes('<!-- schema-feed-v2:discovery:start -->'))return html;
 const stored=read(root,STATE,{pages:{}}).pages[file];
 if(!stored)throw Error('Missing authored schema baseline: '+file);
 if(stored.derivedHash!==graphHash(html))throw Error('Schema was edited outside its authored baseline: '+file+'. Review .schema-feed-v2/base-schemas.json before regenerating.');
 let first=true;
 return html.replace(schemaPattern,()=>{if(!first)return '';first=false;return stored.schemaMarkup;}).replace(discovery,'');
}

// Pure planning stage: all translation, graph and historical-ID checks complete
// before buildBilingual writes any output. --check uses exactly this same stage.
export function prepareMachineSite(root,htmlByFile){
 const pages=Object.entries(htmlByFile).map(([file,html])=>extractPage(html,file));
 if(new Set(pages.map(p=>p.url)).size!==pages.length)throw Error('Duplicate canonical URLs');
 previousFeed(root,pages);
 const state={version:2,pages:{}},baselines=editorRegistry(root),outputs={};
 for(const page of pages){
  const graph=enrich(page,pages),html=patchHtml(page.originalHtml,graph,page.language);
  outputs[page.file]=html;
  state.pages[page.file]={schemaMarkup:markup(page.originalHtml),derivedHash:graphHash(html)};
  if(!page.file.startsWith('zh/')&&!baselines.pages[page.file]){
   const enFile=path.join(root,page.file),zhFile=path.join(root,'zh',page.file);
   const english=fs.existsSync(enFile)?fs.readFileSync(enFile,'utf8'):page.originalHtml;
   const chinese=fs.existsSync(zhFile)?fs.readFileSync(zhFile,'utf8'):htmlByFile['zh/'+page.file];
   baselines.pages[page.file]={legacyHash:hash(english+'\0'+chinese),contentHash:editorContentHash(english,chinese)};
  }
 }
 for(const language of ['en-AU','zh-Hans']){
  const selected=pages.filter(p=>p.language===language&&p.isArticle&&!/noindex/i.test(p.robots));
  const result=feeds(selected,language),prefix=language==='zh-Hans'?'zh/':'';
  outputs[prefix+'feed.json']=json(result.json);outputs[prefix+'feed.xml']=result.rss;
 }
 const config=read(root,'vercel.json',{});config.headers||=[];
 for(const endpoint of ['/feed.json','/feed.xml','/zh/feed.json','/zh/feed.xml']){
  let rule=config.headers.find(r=>r.source===endpoint);
  if(!rule){rule={source:endpoint,headers:[]};config.headers.push(rule);}
  for(const [key,value]of [['Content-Type',endpoint.endsWith('.json')?'application/feed+json; charset=utf-8':'application/rss+xml; charset=utf-8'],['X-Content-Type-Options','nosniff']]){
   const old=rule.headers.find(h=>h.key.toLowerCase()===key.toLowerCase());if(old)old.value=value;else rule.headers.push({key,value});
  }
 }
 outputs['vercel.json']=json(config);
 outputs[STATE]=json(state);outputs[BASELINES]=json(baselines);
 outputs['.schema-feed-v2/content-record.json']=json({format_version:2,adapter:'canberra-waterproof-bilingual-visible-html',distribution:'full-text',atom_enabled:false,pages:pages.map(p=>({file:p.file,url:p.url,language:p.language,title:p.headline,summary:p.summary,body_html:p.bodyHtml,body_text:p.bodyText,topics:p.topics,author:p.author,datePublished:p.published,dateModified:p.modified,feed_ids:p.isArticle?p.feed_ids:null,inFeed:p.isArticle&&!/noindex/i.test(p.robots),preservedIds:p.legacyIds,notes:p.notes}))});
 return outputs;
}
