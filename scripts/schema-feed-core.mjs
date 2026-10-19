import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
export const HOST='https://www.canberrawaterproof.com.au';
const businessId=HOST+'/#business';
const schemaPattern=/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi;
const norm=value=>String(value||'').replace(/\s+/g,' ').trim();
export const hash=value=>createHash('sha256').update(value).digest('hex');
const json=value=>JSON.stringify(value,null,2)+'\n';
const scriptJson=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const xml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const validTimestamp=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)&&!Number.isNaN(Date.parse(value));
const articleTypes=new Set(['Article','BlogPosting','NewsArticle']);
function pageFiles(root){const out=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','assets','tests','docs','scripts','reports','data'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))out.push(path.relative(root,p).replaceAll('\\','/'));}}walk(root);return out.sort();}
export function extractPage(html,file){
 const $=load(html),url=$('link[rel="canonical"]').attr('href');
 if(!url?.startsWith(HOST+'/'))throw Error('Unexpected canonical '+file);
 const graphs=$('script[type="application/ld+json"]').map((_,n)=>JSON.parse($(n).text())).get();
 const nodes=graphs.flatMap(g=>g['@graph']||[g]);
 const main=$('main').first(),article=main.find('article').first();
 const articleNode=nodes.find(n=>articleTypes.has(n['@type']));
 const content=articleNode&&article.length?article:main;
 const summary=norm(content.find('p.lede,p.lead').first().text())||norm(content.find('p').filter((_,p)=>!/eyebrow|byline|meta|caption|kicker/.test($(p).attr('class')||'')).first().text());
 const clean=load(content.html()||'',null,false);
 clean('script,style,nav,form,iframe,object,embed').remove();
 clean('*').each((_,node)=>{for(const key of Object.keys(node.attribs||{}))if(/^on/i.test(key))clean(node).removeAttr(key);});
 clean('[href],[src],[srcset]').each((_,node)=>{for(const key of ['href','src']){const value=clean(node).attr(key);if(value&&/^(\/|#)/.test(value))clean(node).attr(key,new URL(value,url).href);}const set=clean(node).attr('srcset');if(set)clean(node).attr('srcset',set.split(',').map(part=>{const [src,width]=part.trim().split(/\s+/);return new URL(src,url).href+(width?' '+width:'');}).join(', '));});
 const headline=norm(main.find('h1').first().text())||norm($('title').text());
 const topics=[...new Set([headline,...content.find('h2,h3').map((_,n)=>norm($(n).text())).get().filter(t=>/waterproof|leak|grout|seal|membrane|drain|shower|balcony|防水|漏|填缝|密封|排水|淋浴|阳台/i.test(t))])].slice(0,8);
 const byline=content.find('[class*="byline"],[rel="author"],.content-author').text();
 const author=articleNode?.author&&byline.includes(articleNode.author.name)?structuredClone(articleNode.author):null;
 const linkMap=new Map();
 main.find('a[href]').each((_,a)=>{const item={url:new URL($(a).attr('href'),url).href,name:norm($(a).text())};if(!item.name||!item.url.startsWith(HOST+'/'))return;if(!linkMap.has(item.url)||$(a).closest('h2,h3').length)linkMap.set(item.url,item);});
 const links=[...linkMap.values()];
 const companyFacts=Object.fromEntries(main.find('dt').map((_,dt)=>({key:norm($(dt).text()),value:norm($(dt).next('dd').text())})).get().map(f=>[f.key,f.value]));
 const bodyHtml=clean.html();
 return {file,url,language:$('html').attr('lang')||'en-AU',title:norm($('title').text()),headline,summary,metaDescription:$('meta[name="description"]').attr('content')||'',robots:$('meta[name="robots"]').attr('content')||'',sourceHash:hash(html),originalHtml:html,schemas:graphs,bodyHtml,bodyText:norm(clean.text()),byline:norm(byline),author,published:articleNode?.datePublished||null,modified:articleNode?.dateModified||null,topics,links,companyFacts,feed_ids:{json:url,rss:url},legacyIds:nodes.filter(n=>n['@id']).map(n=>n['@id']),isArticle:!!articleNode,notes:[]};
}
export function enrich(page,pages){
 const graph={ '@context':'https://schema.org','@graph':structuredClone(page.schemas.flatMap(g=>g['@graph']||[g]))};
 const nodes=graph['@graph'],node=nodes.find(n=>['WebPage','CollectionPage','AboutPage','ContactPage'].includes(n['@type'])&&(!n.url||n.url===page.url));
 const upsert=value=>{const found=nodes.find(n=>n['@id']===value['@id']);if(found)Object.assign(found,value);else nodes.push(value);};
 if(!node)throw Error('No existing page entity '+page.file);
 node.url=page.url;node.name=page.headline;if(page.summary)node.description=page.summary;node.inLanguage=page.language;
 const languageRoot=HOST+(page.language.startsWith('zh')?'/zh':'');
 const rootPath=new URL(page.url).pathname.replace(/^\/zh(?=\/)/,'');
 const website=nodes.find(n=>n['@type']==='WebSite');
 if(website?.['@id'])node.isPartOf={'@id':website['@id']};
 else {const id=languageRoot+'/#website';nodes.push({'@type':'WebSite','@id':id,url:languageRoot+'/',name:'MEL ONE',inLanguage:page.language,publisher:{'@id':businessId}});node.isPartOf={'@id':id};}
 node.keywords=page.topics;
 if(rootPath==='/about/'){node['@type']='AboutPage';node.mainEntity={'@id':businessId};}
 if(rootPath==='/contact/'){node['@type']='ContactPage';node.about={'@id':businessId};}
 const service=nodes.find(n=>n['@type']==='Service');
 if(service){service.name=page.headline;service.url=page.url;service.description=page.summary;service.provider={'@id':businessId};service.serviceType||=page.headline;service.mainEntityOfPage={'@id':node['@id']};node.mainEntity={'@id':service['@id']};}
 const article=nodes.find(n=>articleTypes.has(n['@type']));
 if(article){article.headline=page.headline;article.description=page.summary;article.url=page.url;article.inLanguage=page.language;article.mainEntityOfPage={'@id':node['@id']};node.mainEntity={'@id':article['@id']};article.keywords=page.topics;article.articleBody=page.bodyText;if(page.author)article.author=page.author;else {delete article.author;page.notes.push('No visible matching byline: author omitted rather than invented.');}}
 const services=page.links.filter(link=>{const target=pages.find(p=>p.url===link.url);return target&&new URL(target.url).pathname.match(/\/services\/[^/]+\/$/);}).map(link=>{const target=pages.find(p=>p.url===link.url);return {name:link.name,url:link.url,id:target.schemas.flatMap(g=>g['@graph']||[g]).find(n=>n['@type']==='Service')?.['@id']};}).filter(s=>s.id);
 const business=nodes.find(n=>n['@id']===businessId);
 if(business&&(rootPath==='/'||rootPath==='/about/'||rootPath==='/services/')){
  if(page.summary)business.description=page.summary;
  business.knowsAbout=[...new Set(services.map(s=>s.name))];if(!business.knowsAbout.length)delete business.knowsAbout;
  if(services.length){const id=page.url+'#service-catalog';business.hasOfferCatalog={'@id':id};upsert({'@type':'OfferCatalog','@id':id,name:page.headline,itemListElement:services.map(s=>({'@type':'Offer',itemOffered:{'@id':s.id}}))});}
  if(rootPath==='/about/'){
   const legalName=page.companyFacts?.['Legal entity']||page.companyFacts?.['公司法定名称'];
   if(legalName)business.legalName=legalName;
   const identifiers=page.companyFacts?.['ABN / ACN'];
   if(identifiers){const [abn,acn]=identifiers.split('/').map(norm);business.identifier=[{'@type':'PropertyValue',propertyID:'ABN',value:abn},{'@type':'PropertyValue',propertyID:'ACN',value:acn}];}
  }
 }
 if(!service&&!article&&!['/about/','/contact/'].includes(rootPath))node.about||={'@id':businessId};
 if(['/services/','/guides/','/industry-news/','/service-areas/','/case-studies/'].includes(rootPath)){
  node['@type']='CollectionPage';
  const collections=page.links.filter(link=>pages.some(p=>p.url===link.url)&&link.url!==page.url);
  if(collections.length&&!node.mainEntity){const id=page.url+'#list';node.mainEntity={'@id':id};upsert({'@type':'ItemList','@id':id,itemListElement:collections.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:p.url}))});}
 }
 // Link only services actually linked in the visible article, never injected term pages.
 if(article&&services.length)article.about=services.map(s=>({'@id':s.id}));
 return graph;
}
export function patchHtml(html,graph,language){
 let first=true;
 let output=html.replace(schemaPattern,()=>{if(!first)return '';first=false;return '<script type="application/ld+json">'+scriptJson(graph)+'</script>';});
 if(first)throw Error('Missing schema replacement anchor');
 const prefix=language.startsWith('zh')?'/zh':'';
 const links=`<!-- schema-feed-v2:discovery:start --><link rel="alternate" type="application/rss+xml" title="MEL ONE ${language}" href="${HOST+prefix}/feed.xml"><link rel="alternate" type="application/feed+json" title="MEL ONE ${language}" href="${HOST+prefix}/feed.json"><!-- schema-feed-v2:discovery:end -->`;
 output=output.replace(/<!-- schema-feed-v2:discovery:start -->[\s\S]*?<!-- schema-feed-v2:discovery:end -->/g,'');
 return output.replace('</head>',links+'</head>');
}
export function feeds(pages,language){
 const prefix=language.startsWith('zh')?'/zh':'',home=HOST+prefix+'/guides/';
 const title=language.startsWith('zh')?'MEL ONE 防水与漏水维修指南':'MEL ONE Waterproofing and Leak Repair Guides';
 const description=language.startsWith('zh')?'现有防水指南及行业文章的完整正文。':'Full text of existing waterproofing guides and industry articles.';
 const feed={version:'https://jsonfeed.org/version/1.1',title,home_page_url:home,feed_url:HOST+prefix+'/feed.json',description,language,items:pages.map(p=>({id:p.feed_ids.json,url:p.url,title:p.headline,summary:p.summary,content_html:p.bodyHtml,tags:p.topics,...(p.author?{authors:[{name:p.author.name,url:p.author.url}]}:{}),...(validTimestamp(p.published)?{date_published:p.published}:{}),...(validTimestamp(p.modified)?{date_modified:p.modified}:{})}))};
 const rss='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>'+xml(title)+'</title><link>'+xml(home)+'</link><description>'+xml(description)+'</description><language>'+xml(language)+'</language><atom:link href="'+HOST+prefix+'/feed.xml" rel="self" type="application/rss+xml"/>'+pages.map(p=>'<item><title>'+xml(p.headline)+'</title><link>'+xml(p.url)+'</link><guid isPermaLink="false">'+xml(p.feed_ids.rss)+'</guid><description>'+xml(p.summary)+'</description>'+p.topics.map(t=>'<category>'+xml(t)+'</category>').join('')+(p.author?'<dc:creator>'+xml(p.author.name)+'</dc:creator>':'')+(validTimestamp(p.published)?'<pubDate>'+new Date(p.published).toUTCString()+'</pubDate>':'')+'<content:encoded>'+xml(p.bodyHtml)+'</content:encoded></item>').join('')+'</channel></rss>\n';
 return {json:feed,rss};
}
export function previousFeed(source,pages){
 for(const prefix of ['','zh/']){
  const jsonFile=path.join(source,prefix,'feed.json'),rssFile=path.join(source,prefix,'feed.xml');
  if(fs.existsSync(jsonFile)){const old=JSON.parse(fs.readFileSync(jsonFile,'utf8'));for(const item of old.items||[]){const page=pages.find(p=>p.url===item.url);if(!page)throw Error('Unmapped historic JSON feed entry '+item.id);page.feed_ids.json=item.id;}}
  if(fs.existsSync(rssFile)){const $=load(fs.readFileSync(rssFile,'utf8'),{xmlMode:true});$('item').each((_,item)=>{const url=$(item).find('link').text(),page=pages.find(p=>p.url===url);if(!page)throw Error('Unmapped historic RSS entry '+url);page.feed_ids.rss=$(item).find('guid').text()||url;});}
 }
 if(['atom.xml','atom','feed.atom','zh/atom.xml'].some(f=>fs.existsSync(path.join(source,f))))throw Error('Existing Atom requires explicit date/ID migration; no outputs written.');
}
