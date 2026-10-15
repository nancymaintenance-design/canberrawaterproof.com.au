import shower from '../data/deep-guides-shower.mjs';
import exterior from '../data/deep-guides-exterior.mjs';
import planning from '../data/deep-guides-planning.mjs';
import reading from '../data/deep-guide-reading.mjs';
export const deepGuides=[...shower,...exterior,...planning];
const host='https://www.canberrawaterproof.com.au';
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const label=slug=>slug.split('-').join(' ');
const leadSentence=html=>html.match(/<p>([\s\S]*?)<\/p>/)[1].replace(/<[^>]*>/g,'').split(/(?<=\.)\s/)[0];

function renderReading(guide,cover) {
 const aid=reading[guide.slug];
 const contents=`<nav class="deep-guide-toc" aria-label="Article contents"><h2>Waterproofing guide contents</h2><ol>${guide.sections.map(s=>`<li><a href="#${s.id}">${escape(s.title)}</a></li>`).join('')}</ol><p><a href="#guide-questions">Related questions</a> · <a href="#guide-sources">Sources</a></p></nav>`;
 const distinctions=`<section class="deep-guide-distinctions" aria-labelledby="guide-distinctions"><h2 id="guide-distinctions">Waterproofing repair distinctions</h2><div class="deep-guide-copy"><table><caption>Selected distinctions from this guide</caption><thead><tr><th scope="col">Consideration</th><th scope="col">Starting point for assessment</th></tr></thead><tbody>${aid.distinctions.map(([id,title])=>{
  const section=guide.sections.find(s=>s.id===id);
  if(!section)throw new Error(`Unknown reading section ${guide.slug}#${id}`);
  return `<tr><th scope="row"><a href="#${id}">${escape(title)}</a></th><td>${leadSentence(section.html)}</td></tr>`;
 }).join('')}</tbody></table><p class="deep-guide-caption">Read the linked sections for context, limitations and supporting references.</p></div></section>`;
 return `<div class="deep-guide-layout">${contents}<div class="deep-guide-overview"><section class="deep-guide-summary" aria-labelledby="guide-summary"><h2 id="guide-summary">${escape(aid.title)}</h2><p>${escape(guide.intro)}</p></section>${cover}</div></div><div class="deep-guide-body">${guide.sections.map((s,index)=>`<section class="deep-guide-section" aria-labelledby="${s.id}"><h2 id="${s.id}">${escape(s.title)}</h2><div class="deep-guide-copy">${s.html}</div></section>${index===0?distinctions:''}`).join('')}</div>`;
}

export function applyDeepGuide(html,path) {
 const guide=deepGuides.find(item=>path===`guides/${item.slug}/index.html`);
 if(path==='guides/index.html') {
  for(const item of deepGuides) html=html.replace(new RegExp(`(<h[23]><a href="/guides/${item.slug}/">)[^<]*(</a></h[23]>)`,'g'),'$1'+escape(item.title.replace(/ in Canberra$/,''))+'$2');
  return html;
 }
 if(!guide)return html;
 const url=`${host}/guides/${guide.slug}/`;
 const oldArticle=html.match(/<article\b[\s\S]*?<\/article>/)?.[0];
 if(!oldArticle)throw new Error(`Missing guide article: ${path}`);
 const originalCover=oldArticle.match(/<figure\b[^>]*class="[^"]*guide-cover[^"\n]*"[\s\S]*?<\/figure>/)?.[0]||'';
 const cover=originalCover.replace(/alt="MEL ONE\s+/g,'alt="').replace(/<figcaption>[\s\S]*?<\/figcaption>/,'<figcaption>Guide image · Waterproofing and repair planning</figcaption>');
 const body=`<article class="section wrap article deep-guide"><header class="deep-guide-heading"><p class="eyebrow">MEL ONE waterproofing guide</p><h1>${escape(guide.title)}</h1><p class="lede">${escape(reading[guide.slug].summary)}</p><p class="deep-guide-byline">By <a href="/about/">MEL ONE</a> · Updated <time datetime="2026-10-14">14 October 2026</time></p></header>${renderReading(guide,cover)}<section class="deep-guide-questions" aria-labelledby="guide-questions"><h2 id="guide-questions">Related waterproofing questions</h2><div class="deep-guide-copy">${guide.faqs.map(q=>`<details><summary>${escape(q.question)}</summary><p>${escape(q.answer)}</p></details>`).join('')}</div></section><section class="deep-guide-sources" aria-labelledby="guide-sources"><h2 id="guide-sources">Waterproofing references and further reading</h2><div class="deep-guide-copy"><ul>${guide.sources.map(s=>`<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a></li>`).join('')}</ul><p>Manufacturer references explain particular systems and are not a record of the products used on a MEL ONE project. Product suitability and project requirements need site-specific confirmation.</p></div></section><section class="guide-conclusion" aria-label="Related services"><h2>Related waterproofing and leak repair services</h2><p>${guide.relatedServices.map(s=>`<a href="/services/${s}/">${escape(label(s))}</a>`).join(' · ')}</p><p>${guide.relatedGuides.map(slug=>`<a href="/guides/${slug}/">${escape(deepGuides.find(g=>g.slug===slug)?.title||label(slug))}</a>`).join(' · ')}</p><p>For a property in Belconnen, Gungahlin, Woden Valley or elsewhere in the ACT, <a href="/contact/">book a waterproofing assessment</a> or call <a href="tel:+61482422607">0482 422 607</a>. Photos are optional; contact us without them.</p></section></article>`;
 const finalBody=body.replace('<section class="guide-conclusion"','<!-- seo-maintenance-related:start --><section class="guide-conclusion"').replace('</section></article>','</section><!-- seo-maintenance-related:end --></article>');
 html=html.replace(oldArticle,finalBody);
 html=html.replace(/<div class="wrap crumbs">[\s\S]*?<\/div>/,`<div class="wrap crumbs"><a href="/">Home</a> / <a href="/guides/">Guides</a> / ${escape(guide.title)}</div>`);
 html=html.replace('Photos are optional; contact us without them.','Photos are optional: email safely taken photos to riley@melonemaintenance.com.au or contact us without them. The Ellis team completes an on-site assessment and confirms the repair plan and written quote.');
 if(guide.slug==='waterproofing-retiling-quote')html=html.replace('<p class="wrap">Photos are optional: email safely taken photos to riley@melonemaintenance.com.au. You can contact us without photos. Do not remove finishes, climb onto roofs or approach hazards to take them.</p>','<p class="wrap">For enquiry details, <a href="/contact/#service-form">request a waterproofing assessment</a>. Do not remove finishes, climb onto roofs or approach hazards to take photographs.</p>');
 if(guide.slug==='waterproofing-retiling-quote')html=html.replace(/(<section class="deep-guide-summary" aria-labelledby="guide-summary"><h2 id="guide-summary">[^<]*<\/h2>)/,'$1<p>Measurements and photographs are not needed before first contact. You do not need to collect every item before asking about repair or installation requirements. Tile selection can wait: contact MEL ONE before choosing tiles.</p>');
 // Sources and the knowledge matrix reflect visible content, not hidden marketing claims.
 html=html.replace(/<script id="llm-entity-json" type="application\/json">[\s\S]*?<\/script>/g,'');
 const entity={brand_name:'MEL ONE',official_website:host,service_scope:{primary_category:'Waterproofing & Leak Repair Services',sub_categories:guide.relatedServices.map(label),coverage_cities:['Canberra'],coverage_region:'ACT'}};
 const matrix={entity_metadata:entity,article_metadata:{title:guide.title,url,language:'en-AU',date_modified:'2026-10-14'},knowledge_matrix:{sections:guide.sections.map(s=>({id:s.id,title:s.title,content:s.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()})),educational_topics:guide.keywords.educational,customer_scenarios:guide.keywords.scenarios,questions:guide.faqs,sources:guide.sources,related_services:guide.relatedServices.map(s=>`${host}/services/${s}/`)}};
 html=html.replace('</head>',`<script id="llm-entity-json" type="application/json">${json(matrix)}</script></head>`);
 const title=escape(guide.title+' | MEL ONE');
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title}</title>`)
  .replace(/(<meta[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/g,'$1'+escape(guide.description)+'$2')
  .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/g,'$1'+title+'$2');
 html=html.replace(/(<script[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(whole,start,text,end)=>{
  const data=JSON.parse(text);if(!Array.isArray(data['@graph']))return whole;
  const graph=data['@graph'].filter(n=>n['@type']!=='FAQPage'&&n['@id']!==host+'/#organization');
  const business=graph.find(n=>n['@id']===host+'/#business');
  const org={'@type':'Organization','@id':host+'/#organization',name:'MEL ONE',url:host,logo:host+'/assets/mel-one-logo.png',sameAs:business?.sameAs||[],areaServed:{'@type':'AdministrativeArea',name:'Australian Capital Territory'},knowsAbout:guide.relatedServices.map(label)};
  graph.push(org);
  let article=graph.find(n=>['Article','BlogPosting'].includes(n['@type']));
  if(!article){article={'@type':'Article','@id':url+'#article'};graph.push(article);}
  Object.assign(article,{'@type':'Article',headline:guide.title,description:guide.description,url,inLanguage:'en-AU',dateModified:'2026-10-14',author:{'@id':host+'/#business',name:'MEL ONE','@type':'Organization',url:host+'/about/'},publisher:{'@id':host+'/#business'},mainEntityOfPage:{'@id':url+'#webpage'},citation:guide.sources.map(s=>s.url)});
  for(const n of graph){if(n['@type']==='WebPage')Object.assign(n,{name:guide.title,description:guide.description,mainEntity:{'@id':article['@id']}});if(n['@type']==='BreadcrumbList') {const last=n.itemListElement?.at(-1);if(last)last.name=guide.title;}}
  graph.push({'@type':'FAQPage','@id':url+'#faq',mainEntity:guide.faqs.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))});
  return start+json({...data,'@graph':graph})+end;
 });
 if(!html.includes('href="/assets/deep-guides.css"'))html=html.replace('</head>','<link rel="stylesheet" href="/assets/deep-guides.css"></head>');
 return html;
}
