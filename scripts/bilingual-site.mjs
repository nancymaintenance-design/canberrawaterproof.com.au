import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import editorial, {glossary} from '../data/i18n/zh-Hans-editorial.mjs';
import {authoredHtml,prepareMachineSite} from './schema-feed-site.mjs';
import {withoutCustomerNavigation,applyCustomerNavigation,navigationMapping} from './customer-navigation.mjs';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const HOST='https://www.canberrawaterproof.com.au';
const run=promisify(execFile);
const CATALOG='data/i18n/zh-Hans.json';
const OVERRIDES='data/i18n/zh-Hans-overrides.json';
const MANIFEST='data/i18n/manifest.json';
const skip=new Set(['zh','assets','node_modules','tests','reports','docs','.git','.vercel']);
const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',hellip:'…',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“',middot:'·',copy:'©',rarr:'→'};
export const decode=text=>text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi,(whole,name)=>name[0]==='#'?String.fromCodePoint(name[1].toLowerCase()==='x'?parseInt(name.slice(2),16):parseInt(name.slice(1),10)):(entities[name]??whole));
export const normalise=text=>decode(text).replace(/\s+/g,' ').trim();
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const hash=text=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
const proper=new Set(['MEL ONE','MEL ONE Canberra Waterproofing','Mel One Property Maintenance Pty Ltd','Chubb Insurance Australia Limited','Instagram','YouTube','TikTok','ABN / ACN','ACT','Australia','AU','en-AU','zh-Hans','Canberra','Belconnen','Gungahlin','Woden Valley','Tuggeranong','Weston Creek','Molonglo','Inner North & City','Inner South','East Canberra','ACT Localities','Amaroo','Aranda','Braddon','Bruce','Calwell','Canberra City','Casey','Coombs','Fyshwick','Griffith','Kambah','Kingston','Phillip','Weston','Woden','Isaacs','Barton','Weetangera']);
export const needsTranslation=value=>/[A-Za-z]/.test(value)&&!proper.has(value)&&!/^\/?(?:https?:|mailto:|tel:)/i.test(value)&&!/^\S+@\S+$/.test(value)&&!/^\d[^a-z]*$/i.test(value)&&!/^121 Marcus Clarke St/.test(value)&&!/^0482 422 607/.test(value)&&!/^G-[A-Z\d]+$/.test(value);
const copyKeys=new Set(['name','description','headline','alternativeHeadline','text','articleBody','caption','keywords','serviceType','title','question','answer','educational_topics','customer_scenarios','sub_categories','primary_category']);
const attrs=new Set(['alt','title','aria-label','placeholder']);

export function englishPages(root=ROOT){
 const pages=[];
 const walk=folder=>{for(const e of fs.readdirSync(folder,{withFileTypes:true})){
  if(e.name.startsWith('.')||skip.has(e.name))continue;
  const full=path.join(folder,e.name);
  if(e.isDirectory())walk(full);else if(e.name.endsWith('.html'))pages.push(path.relative(root,full).replaceAll('\\','/'));
 }};
 walk(root);return pages.sort();
}
export const routeFor=file=>'/'+file.replace(/index\.html$/,'');
export const chineseRoute=file=>'/zh'+routeFor(file);
const tokens=html=>html.match(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]*>|[^<]+/gi)||[];
function mapSchema(value,fn,key=''){
 if(Array.isArray(value))return value.map(v=>mapSchema(v,fn,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,mapSchema(v,fn,k)]));
 return typeof value==='string'&&copyKeys.has(key)?fn(value):value;
}
export function extract(html){
 const values=new Set();const add=text=>{const value=normalise(text);if(needsTranslation(value))values.add(value);return text;};
 for(const token of tokens(html)){
  if(/^<script/i.test(token)){
   if(/type="application\/(?:ld\+)?json"/i.test(token))mapSchema(JSON.parse(token.replace(/^<script[^>]*>|<\/script>$/gi,'')),add);
   continue;
  }
  if(/^<(?:style|!--)/i.test(token))continue;
  if(token[0]==='<'){
   const meta=token.match(/^<meta\b/i)&&/\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"/i.test(token);
   token.replace(/([\w:-]+)="([^"]*)"/g,(_,key,value)=>{if(attrs.has(key)||(meta&&key==='content'))add(value);return '';});
  }else add(token);
 }
 return [...values];
}
function readJson(root,file,fallback){const full=path.join(root,file);return fs.existsSync(full)?JSON.parse(fs.readFileSync(full,'utf8')):fallback;}
export function dictionaries(root=ROOT){
 const dictionary={...readJson(root,CATALOG,{}),...readJson(root,OVERRIDES,{}),...editorial};
 return Object.fromEntries(Object.entries(dictionary).map(([en,zh])=>[en,glossary.reduce((text,[from,to])=>text.replaceAll(from,to),zh)]));
}
function translator(dictionary){return raw=>{
 const key=normalise(raw);if(!needsTranslation(key))return raw;
 if(!Object.hasOwn(dictionary,key)||!dictionary[key]?.trim())throw Error('Missing Chinese translation: '+key);
 return raw.replace(/\S[\s\S]*\S|\S/,()=>dictionary[key]);
};}
export function decorateEnglish(html,file){
 html=html.replace(/<!-- bilingual:start -->[\s\S]*?<!-- bilingual:end -->/g,'').replace(/<a\b[^>]*data-language-switch[^>]*>[\s\S]*?<\/a>/g,'');
 const en=HOST+routeFor(file),zh=HOST+chineseRoute(file);
 const tags=`<!-- bilingual:start --><link rel="alternate" hreflang="en-AU" href="${en}"><link rel="alternate" hreflang="zh-Hans" href="${zh}"><link rel="alternate" hreflang="x-default" href="${en}"><meta property="og:locale" content="en_AU"><meta property="og:locale:alternate" content="zh_CN"><link rel="stylesheet" href="/assets/bilingual.css"><script src="/assets/locale-messages.js" defer></script><!-- bilingual:end -->`;
 html=html.replace('</head>',tags+'</head>');
 html=html.replace(/(<nav\b[^>]*id="main-navigation"[^>]*>)([\s\S]*?)(<\/nav>)/,(whole,open,content,close)=>open+content.replace(/(<a\b[^>]*href="\/contact\/"[^>]*>Contact<\/a>)/,'$1'+`<a class="language-switch" data-language-switch href="${chineseRoute(file)}" lang="zh-Hans" hreflang="zh-Hans">中文服务</a>`)+close);
 return html;
}
export function renderChinese(english,file,dictionary,root=ROOT){
 english=authoredHtml(root,file,english);
 const translate=translator(dictionary);
 // Preserve option submission values so service prefill and the existing API contract work in both languages.
 english=english.replace(/<option>([^<]+)<\/option>/g,(_,value)=>`<option value="${value}">${value}</option>`);
 let html=tokens(english).map(token=>{
  if(/^<script/i.test(token)){
   if(/type="application\/(?:ld\+)?json"/i.test(token)){
    const data=mapSchema(JSON.parse(token.replace(/^<script[^>]*>|<\/script>$/gi,'')),translate);
    const localise=(value,key='')=>{
     if(Array.isArray(value))return value.map(v=>localise(v,key));
     if(value&&typeof value==='object'){
      if(['WebPage','Article','BlogPosting','NewsArticle'].includes(value['@type']))value.inLanguage='zh-Hans';
      return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localise(v,k)]));
     }
     if(value==='en-AU'&&['inLanguage','language'].includes(key))return 'zh-Hans';
     if(typeof value==='string'&&value.startsWith(HOST)&&['url','@id','item','related_services'].includes(key)){
      const u=new URL(value);if(u.pathname.startsWith('/assets/')||u.hash==='#business')return value;
      if(!u.pathname.startsWith('/zh/'))u.pathname='/zh'+u.pathname;
      return u.href;
     }
     return value;
    };
    const opening=token.match(/^<script[^>]*>/i)[0];
    return opening+JSON.stringify(localise(data)).replaceAll('<','\\u003c')+'</script>';
   }
   // The shared inline carousel keeps localised controls after interaction.
   return token.replaceAll("'Play images'","(window.melOneText?.('Play images') || 'Play images')").replaceAll("'Pause images'","(window.melOneText?.('Pause images') || 'Pause images')");
  }
  if(/^<(?:style|!--)/i.test(token))return token;
  if(token[0]!=='<')return escape(translate(decode(token)));
  const isMeta=/^<meta\b/i.test(token)&&/\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"/i.test(token);
  return token.replace(/([\w:-]+)="([^"]*)"/g,(whole,key,value)=>{
   if(attrs.has(key)||(isMeta&&key==='content'))return `${key}="${escape(translate(decode(value)))}"`;
   return whole;
  });
 }).join('');
 html=html.replace('<html lang="en-AU">','<html lang="zh-Hans">');
 html=html.replace(/(<form\b[^>]*data-service-form[^>]*>)/g,'$1<input type="hidden" name="locale" value="zh-Hans">');
 html=html.replace(/(<a\b[^>]*data-language-switch[^>]*>)[\s\S]*?<\/a>/,`<a class="language-switch" data-language-switch href="${routeFor(file)}" lang="en-AU" hreflang="en-AU">English</a>`);
 // Internal content links stay in Chinese; shared assets/API/telephone/email/external citations remain shared.
 html=html.replace(/(<(?:a|form)\b[^>]*\b(?:href|action)=")([^"]+)(")/g,(whole,start,value,end)=>{
  if(start.includes('data-language-switch'))return whole;
  if(value.startsWith(HOST+'/'))value=value.slice(HOST.length);
  if(!value.startsWith('/')||value.startsWith('//')||/^\/(?:zh|assets|api|data)\//.test(value))return whole;
  if(/\.(?:xml|json|txt|ico|png|jpg|webp)(?:[?#]|$)/i.test(value))return whole;
  return start+'/zh'+value+end;
 });
 const en=HOST+routeFor(file),zh=HOST+chineseRoute(file);
 html=html.replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]+("[^>]*>)/,`$1${zh}$2`)
 .replace(/(<meta\b[^>]*property="og:url"[^>]*content=")[^"]+("[^>]*>)/,`$1${zh}$2`)
 .replace('property="og:locale" content="en_AU"','property="og:locale" content="zh_CN"')
 .replace('property="og:locale:alternate" content="zh_CN"','property="og:locale:alternate" content="en_AU"');
 // Reapply alternates unchanged: the same reciprocal set exists on both pages.
 html=html.replace(/(<link rel="alternate" hreflang="en-AU" href=")[^"]+(">)/,`$1${en}$2`);
 const visible=content=>normalise(content.replace(/<[^>]+>/g,' '));
 const questions=[...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)].map(m=>{
  const summary=m[1].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/);
  return summary?{question:visible(summary[1]),answer:visible(m[1].slice(summary.index+summary[0].length))}:null;
 }).filter(Boolean);
 html=html.replace(/(<script\b[^>]*type="application\/(?:ld\+)?json"[^>]*>)([\s\S]*?)(<\/script>)/g,(whole,open,json,close)=>{
  const data=JSON.parse(json);
  for(const node of data['@graph']||[data])if(node['@type']==='FAQPage')for(const qa of node.mainEntity||[]){
   const rendered=questions.find(q=>q.question===normalise(qa.name));
   if(!rendered)throw Error(`Chinese FAQ schema has no rendered question: ${file}: ${qa.name}`);
   qa.acceptedAnswer.text=rendered.answer;
  }
  if(data.knowledge_matrix){
   for(const section of data.knowledge_matrix.sections){
    const rendered=html.match(new RegExp(`<section class="deep-guide-section" aria-labelledby="${section.id}">([\\s\\S]*?)<\\/section>`));
    if(!rendered)throw Error('Missing localised feed section '+section.id);
    section.content=visible(rendered[1].replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/,''));
   }
   data.knowledge_matrix.questions=questions;
  }
  return open+JSON.stringify(data).replaceAll('<','\\u003c')+close;
 });
 return html;
}
function chineseSitemap(root,pages){
 const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').replace(/<!-- bilingual-sitemap:start -->[\s\S]*?<!-- bilingual-sitemap:end -->/g,'');
 const mapped=new Set(pages.map(routeFor));
 const additions=[...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)].filter(m=>mapped.has(m[1].replace(HOST,''))).map(m=>`<url><loc>${m[1].replace(HOST,HOST+'/zh')}</loc>${m[2]}</url>`).join('\n');
 return xml.replace('</urlset>',`<!-- bilingual-sitemap:start -->\n${additions}\n<!-- bilingual-sitemap:end --></urlset>`);
}
export function buildBilingual(root=ROOT,{check=false}={}){
 const dictionary=dictionaries(root),pages=englishPages(root),missing=new Set();
 const authored=Object.fromEntries(pages.map(file=>[file,withoutCustomerNavigation(authoredHtml(root,file,fs.readFileSync(path.join(root,file),'utf8')))]));
 for(const file of pages)for(const value of extract(authored[file]))if(!dictionary[value])missing.add(value);
 if(missing.size)throw Error(`${missing.size} untranslated strings. Update ${CATALOG} and reviewed overrides before building. First: ${[...missing][0]}`);
 const changes=[],manifest={version:1,languages:['en-AU','zh-Hans'],pages:{}};
 const update=(file,output)=>{const full=path.join(root,file),old=fs.existsSync(full)?fs.readFileSync(full,'utf8'):null;if(old!==output){changes.push(file);if(!check){fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,output);}}};
 const localised={};
 const navigation=fs.existsSync(path.join(root,'data/customer-navigation.mjs'))?navigationMapping(root,{allowPartial:!fs.existsSync(path.join(root,'index.html'))}):null;
 for(const file of pages){
  const en=decorateEnglish(authored[file],file);
  const zh=renderChinese(en,file,dictionary,root);
  localised[file]=navigation?applyCustomerNavigation(en,file,root,navigation):en;
  localised['zh/'+file]=navigation?applyCustomerNavigation(zh,'zh/'+file,root,navigation):zh;
 }
 // Standalone locale-only content roots retain the bilingual-only contract;
 // complete website roots additionally generate their deployment metadata/feeds.
 const outputs=fs.existsSync(path.join(root,'vercel.json'))?prepareMachineSite(root,localised):localised;
 for(const [file,output]of Object.entries(outputs))update(file,output);
 for(const file of pages)manifest.pages[file]={en:routeFor(file),zh:chineseRoute(file),sourceHash:hash(outputs[file]),translationHash:hash(outputs['zh/'+file])};
 update('sitemap.xml',chineseSitemap(root,pages));
 update(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
 if(check&&changes.length)throw Error(`Bilingual pages are out of sync: ${changes.join(', ')}. Run node scripts/bilingual-site.mjs, then review both languages.`);
 return {pages:pages.length,languages:2,missing:0,changed:changes};
}
const cleanChinese=text=>text.replaceAll('重新布线','重新填缝').replaceAll('重新灌浆','重新填缝').replaceAll('灌浆','填缝').replaceAll('防水卷材','防水层').replaceAll('湿润区域','湿区').replaceAll('湿润地区','湿区').replaceAll('筛网边缘','淋浴屏风边缘').replaceAll('埃利斯','Ellis').replaceAll('梅尔一号','MEL ONE').replaceAll('梅尔·1','MEL ONE');
async function translateMissing(root){
 const dictionary=readJson(root,CATALOG,{}),overrides=readJson(root,OVERRIDES,{}),values=new Set();
 for(const file of englishPages(root))for(const value of extract(authoredHtml(root,file,fs.readFileSync(path.join(root,file),'utf8'))))if(!dictionary[value]&&!overrides[value])values.add(value);
 const batches=[];let current=[],size=0;
 for(const value of values){if(size+value.length>3200&&current.length){batches.push(current);current=[];size=0;}current.push(value);size+=value.length+1;}if(current.length)batches.push(current);
 const translate=async values=>{
  const url=new URL('https://translate.googleapis.com/translate_a/single');
  for(const[k,v]of Object.entries({client:'gtx',sl:'en',tl:'zh-CN',dt:'t',q:values.join('\n')}))url.searchParams.set(k,v);
  const args=['--silent','--show-error','--fail','--max-time','35','--retry','2'];
  if(process.env.BILINGUAL_TRANSLATION_PROXY)args.push('--proxy',process.env.BILINGUAL_TRANSLATION_PROXY);
  args.push(url.href);
  const {stdout}=await run('curl.exe',args,{maxBuffer:1024*1024});
  const data=JSON.parse(stdout),translated=data[0].map(x=>x[0]||'').join('').split('\n').map(x=>x.trim());
  if(translated.length!==values.length){if(values.length===1)throw Error('Unexpected translation response');const items=[];for(const value of values)items.push(...await translate([value]));return items;}
  return translated.map(cleanChinese);
 };
 let cursor=0,complete=0;
 await Promise.all(Array.from({length:2},async()=>{while(cursor<batches.length){const index=cursor++,batch=batches[index],translated=await translate(batch);for(let i=0;i<batch.length;i++)dictionary[batch[i]]=translated[i];fs.mkdirSync(path.join(root,'data/i18n'),{recursive:true});fs.writeFileSync(path.join(root,CATALOG),JSON.stringify(dictionary,null,2)+'\n');console.log(`Translation batch ${++complete}/${batches.length}; ${Object.keys(dictionary).length} cached strings`);}}));
 return {newStrings:values.size,batches:batches.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);if(args.includes('--translate'))console.log(await translateMissing(ROOT));
 else console.log(JSON.stringify(buildBilingual(ROOT,{check:args.includes('--check')})));
}
