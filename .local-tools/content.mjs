import {load} from 'cheerio';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,englishPages,routeFor} from '../scripts/bilingual-site.mjs';
import {editorBaseline,editorRegistry} from '../scripts/schema-feed-site.mjs';
export {ROOT};
const hash=value=>createHash('sha256').update(value).digest('hex');
const blocks=new Set(['p','li','h1','h2','h3','h4','h5','h6','summary','figcaption','dt','dd','td','th','button','label','option']);
const inline=new Set(['a','strong','em','b','i','span','small','br','sup','sub','u','s','mark','code','abbr','time']);
function slots($){
 const result=[];
 const add=(node,kind,attr)=>result.push({node,kind,attr});
 function walk(node){
  if(node.type==='text'){if(node.data.trim())add(node,'text-node');return;}
  if(!node.name||['script','style','svg','noscript','iframe','template'].includes(node.name))return;
  for(const attr of ['alt','title','aria-label','placeholder'])if(node.attribs?.[attr])add(node,'attribute',attr);
  const children=node.children||[];
  const safe=children.every(child=>child.type==='text'||child.type==='comment'||inline.has(child.name));
  if((blocks.has(node.name)||inline.has(node.name))&&safe&&$(node).text().trim()){add(node,'block');return;}
  children.forEach(walk);
 }
 $('body').each((_,node)=>walk(node));
 const title=$('title')[0];if(title)add(title,'metadata');
 $('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').each((_,node)=>add(node,'attribute','content'));
 return result;
}
const textOf=($,slot)=>slot.kind==='text-node'?slot.node.data.trim():slot.attr?$(slot.node).attr(slot.attr):$(slot.node).text().trim();
const valueOf=($,slot)=>slot.kind==='block'?$(slot.node).html():textOf($,slot);
export function modelFromHtml(file,english,chinese){
 const en=load(english),zh=load(chinese),ens=slots(en),zhs=slots(zh);
 if(ens.length!==zhs.length||ens.some((s,i)=>s.kind!==zhs[i].kind||s.attr!==zhs[i].attr))throw Object.assign(Error('中英文结构不一致，请通知助手核对：'+file),{status:409});
 return {file,route:routeFor(file),title:zh('h1').first().text()||zh('title').text(),baseHash:hash(english+'\0'+chinese),english,chinese,fields:zhs.map((s,i)=>({id:'field-'+i,kind:s.kind,attr:s.attr,tag:s.node.name||'text',english:textOf(en,ens[i]),zh:textOf(zh,s),html:valueOf(zh,s),sourceHtml:valueOf(en,ens[i]),scope:en(s.node).closest?.('header,footer,nav').length?'共用区域，应用时需全站核对':'本页位置'}))};
}
export function pages(){return englishPages().map(file=>{const html=fs.readFileSync(path.join(ROOT,'zh',file),'utf8');const $=load(html);return {file,url:routeFor(file),title:$('h1').first().text()||$('title').text()};});}
export function readModel(file){if(!englishPages().includes(file))throw Object.assign(Error('页面未登记'),{status:404});const model=modelFromHtml(file,fs.readFileSync(path.join(ROOT,file),'utf8'),fs.readFileSync(path.join(ROOT,'zh',file),'utf8'));model.baseHash=editorBaseline(file,model.english,model.chinese,editorRegistry(ROOT));return model;}
export function validateField(field,value){
 if(typeof value!=='string'||!value.trim()||value.length>100000)throw Object.assign(Error('内容不能为空，每段不超过 100000 字。'),{status:400});
 if(field.kind!=='block')return value;
 const original=load(field.html||'',null,false),candidate=load(value,null,false);
 const links=original('a').map((_,a)=>original(a).attr('href')).get();let index=0;
 candidate('*').each((_,node)=>{
  if(!inline.has(node.name))throw Object.assign(Error('不支持的内容标签或格式。请粘贴纯文本。'),{status:400});
  for(const [key,val]of Object.entries(node.attribs||{})){
   if(node.name==='a'&&key==='href'){if(val!==links[index])throw Object.assign(Error('原链接目标不能在文字编辑器中更改。'),{status:400});}
   else if(!['class','title','aria-label','lang','hreflang','rel','target','datetime'].includes(key))throw Object.assign(Error('不支持的内容格式。'),{status:400});
  }
  if(node.name==='a'){if(!node.attribs.href||node.attribs.href!==links[index++])throw Object.assign(Error('请保留原有链接。'),{status:400});}
 });
 if(index!==links.length)throw Object.assign(Error('请保留原有链接文字和链接位置。'),{status:400});
 return candidate.html();
}
export function previewHtml(model,values={},language='zh'){
 const $=load(language==='en'?model.english:model.chinese),all=slots($);
 all.forEach((slot,i)=>{
  const field=model.fields[i],entry=values[field.id];
  if(entry&&language==='zh'){
   const value=validateField(field,entry.zh);
   if(slot.attr)$(slot.node).attr(slot.attr,value);else if(slot.kind==='text-node')slot.node.data=value;else if(slot.kind==='block')$(slot.node).html(value);else $(slot.node).text(value);
  }
  if(slot.kind==='block')$(slot.node).attr('data-editor-field',field.id);
  else if(slot.kind==='text-node')$(slot.node).wrap(`<span data-editor-field="${field.id}"></span>`);
 });
 $('script,iframe,object,embed,base,meta[http-equiv="refresh"]').remove();
 $('*').each((_,node)=>{for(const key of Object.keys(node.attribs||{}))if(/^on/i.test(key))$(node).removeAttr(key);});
 $('form').attr('inert','');$('input,select,textarea').attr('disabled','');
 // Editing preview exposes disclosure copy so every FAQ answer can be selected.
 $('details').attr('open','');
 $('head').append('<meta name="robots" content="noindex,nofollow"><style>[data-editor-field]{cursor:text;outline-offset:3px}[data-editor-field]:hover{outline:2px dashed #007c7a}.editor-selected{outline:3px solid #007c7a!important}body{padding-bottom:40px}</style>');
 $('body').append('<script src="/__editor/preview.js"></script>');
 return $.html();
}
