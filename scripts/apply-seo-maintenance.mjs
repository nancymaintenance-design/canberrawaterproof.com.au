import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyResponsiveImages } from './responsive-images.mjs';

const ownRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'https://www.canberrawaterproof.com.au';
const serviceNames = {
 'leaking-shower-repairs':'Leaking Shower Repairs',
 'bathroom-waterproofing':'Bathroom Waterproofing &amp; Retiling',
 'shower-resealing-regrouting':'Shower Resealing &amp; Regrouting',
 'balcony-waterproofing':'Balcony Waterproofing',
 'kitchen-sealing':'Kitchen Sealing',
 'external-waterproofing':'External Waterproofing',
 'laundry-waterproofing':'Laundry Waterproofing',
 'roof-waterproofing':'Roof Waterproofing',
 'retaining-wall-waterproofing':'Retaining Wall Waterproofing',
};
const guideServices = {
 'shower-plumbing-or-waterproofing':['leaking-shower-repairs','bathroom-waterproofing'],
 'regrouting-resealing-or-rewaterproofing':['shower-resealing-regrouting','bathroom-waterproofing'],
 'waterproofing-retiling-quote':['bathroom-waterproofing','leaking-shower-repairs'],
 'balcony-leaking-room-below':['balcony-waterproofing','external-waterproofing'],
 'kitchen-sink-resealing-or-plumbing':['kitchen-sealing','laundry-waterproofing'],
 'waterproofing-or-drainage':['external-waterproofing','retaining-wall-waterproofing'],
};

// Fixed content-change evidence: eight keyword additions in 5077296 (2026-10-10),
// plus four guides that gained related-reading content in this task. The quote
// and drainage guides already have two contextual services and a CTA; no date
// is inferred for their schema-only changes or for the retaining-wall service.
export const contentChanges = Object.fromEntries([
 ...Object.keys(serviceNames).filter(slug=>slug!=='retaining-wall-waterproofing').map(slug=>`${HOST}/services/${slug}/`),
 ...['shower-plumbing-or-waterproofing','regrouting-resealing-or-rewaterproofing','balcony-leaking-room-below','kitchen-sink-resealing-or-plumbing'].map(slug=>`${HOST}/guides/${slug}/`),
].map(url=>[url,'2026-10-10']));
const keywordPattern = /<!-- keyword-content-expansion:start -->[\s\S]*?<!-- keyword-content-expansion:end -->/g;
const relatedPattern = /<!-- seo-maintenance-related:start -->[\s\S]*?<!-- seo-maintenance-related:end -->/;

export function applySeoHtml(html, path, { keywords = {}, images = {} } = {}) {
 const source = keywords[path];
 if (source) {
  const present = [...html.matchAll(keywordPattern)];
  if (present.length > 1 || (present.length && present[0][0] !== source)) throw new Error(`Protected keyword section differs: ${path}`);
  if (!present.length) {
   if (!html.includes('</main>')) throw new Error(`Missing keyword insertion anchor: ${path}`);
   html = html.replace('</main>',`${source}</main>`);
  }
 }
 const slug = path.match(/^guides\/([^/]+)\/index\.html$/)?.[1];
 if (guideServices[slug] && !relatedPattern.test(html)) {
  const article = html.match(/<article\b[\s\S]*?<\/article>/)?.[0] || '';
  const links = new Set([...article.matchAll(/href="(\/services\/[^"#]+\/)"/g)].map(m=>m[1]));
  if (links.size < 2 || !/href="\/contact\/"/.test(article)) {
   if (!article) throw new Error(`Missing guide article: ${path}`);
   const services = guideServices[slug].map(s=>`<a href="/services/${s}/">${serviceNames[s]}</a>`).join(' · ');
   const cases = /bathroom|shower|balcony|regrouting|quote/.test(slug) ? ' · <a href="/case-studies/">Project Photos</a>' : '';
   const section = `<!-- seo-maintenance-related:start --><section class="guide-conclusion" aria-label="Related services"><h2>Related services</h2><p>${services}${cases}</p><p><a href="/contact/">Book Waterproofing Service</a></p></section><!-- seo-maintenance-related:end -->`;
   html = html.replace('</article>',`${section}</article>`);
  }
 }
 const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
 const visibleImage = html.match(/<(?:figure|div)\b[^>]*class="[^"]*(?:guide-cover|news-cover)[^"]*"[\s\S]*?<img\b[^>]*src="([^"]+)"/)?.[1];
 const logo = html.match(/<img\b[^>]*src="([^"<>]*mel-one-logo\.png)"/)?.[1];
 const socials = [...new Set([...html.matchAll(/href="(https:\/\/(?:www\.)?(?:instagram\.com|youtube\.com|tiktok\.com)\/[^"<>]+)"/g)].map(m=>m[1]))];
 html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (whole,open,json,close)=>{
  const data=JSON.parse(json), nodes=data['@graph'];
  if (!Array.isArray(nodes) || !canonical) return whole;
  const page=nodes.find(n=>n['@type']==='WebPage' && (!n.url || n.url===canonical));
  const service=nodes.find(n=>n['@type']==='Service' && (n['@id']===canonical+'#service' || (!n['@id'] && n.url===canonical)));
  const business=nodes.find(n=>n['@id']===HOST+'/#business');
  if(page && service) {
   service['@id'] ||= canonical+'#service';
   page.mainEntity={'@id':service['@id']};
   service.provider={'@id':HOST+'/#business'};
  }
  if(business) {
   if(logo) business.logo=HOST+logo;
   if(socials.length) {
    const seen=new Set();
    business.sameAs=[...(business.sameAs||[]),...socials].filter(url=>{
     const key=url.replace(/\/$/,'');
     if(seen.has(key)) return false;
     seen.add(key);return true;
    });
   }
  }
  for(const node of nodes.filter(n=>['Article','BlogPosting','NewsArticle'].includes(n['@type']))) {
   if(page?.['@id']) node.mainEntityOfPage={'@id':page['@id']};
   if(business) node.publisher={'@id':HOST+'/#business'};
   if(visibleImage) node.image=new URL(visibleImage,HOST).href;
  }
  const output=JSON.stringify(data);
  return output===JSON.stringify(JSON.parse(json)) ? whole : open+output.replace(/</g,'\\u003c')+close;
 });
 if (!/<script\b[^>]*src=["']\/assets\/conversion-events\.js["']/.test(html)) {
  html=html.replace('</head>','<script src="/assets/conversion-events.js" defer></script></head>');
 }
 return applyResponsiveImages(html,images);
}

export function applyLlms(text) {
 text=text.replaceAll('\r\n','\n');
 text=text.replaceAll('https://canberrawaterproof.com.au','https://www.canberrawaterproof.com.au');
 const missing=[...Object.keys(serviceNames).map(s=>`/services/${s}/`),'/case-studies/'].filter(p=>!text.includes(HOST+p));
 if(missing.length) text=text.trimEnd()+'\n\n## Additional services and project photos\n'+missing.map(p=>'- '+HOST+p).join('\n')+'\n';
 return text;
}

export function applySitemap(xml) {
 return xml.replace(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g,(whole,url,rest)=>{
  const date=contentChanges[url];
  if(!date) return whole;
  const old=rest.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if(old && old>date) return whole;
  return `<url><loc>${url}</loc><lastmod>${date}</lastmod>${rest.replace(/<lastmod>[^<]+<\/lastmod>/g,'')}</url>`;
 });
}

export function maintainSite(root = ownRoot) {
 root=resolve(root);
 const keywords=JSON.parse(readFileSync(resolve(root,'data/keyword-content-sections.json'),'utf8'));
 const images=JSON.parse(readFileSync(resolve(root,'data/responsive-images.json'),'utf8'));
 const changed=[];
 function update(path,transform) {
  const file=resolve(root,path), before=readFileSync(file,'utf8'), after=transform(before);
  if(before!==after) {writeFileSync(file,after);changed.push(path);}
 }
 function walk(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
   if(entry.name.startsWith('.') || ['node_modules','assets'].includes(entry.name)) continue;
   const file=resolve(dir,entry.name);
   if(entry.isDirectory()) walk(file);
   else if(entry.name.endsWith('.html')) {
    const path=relative(root,file).replaceAll('\\','/');
    update(path,html=>applySeoHtml(html,path,{keywords,images}));
   }
  }
 }
 walk(root);
 update('llms.txt',applyLlms);
 update('sitemap.xml',applySitemap);
 return {changed,keywordSections:Object.keys(keywords).length,contentChangePages:Object.keys(contentChanges).length};
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2);
 if(args.length && (args[0]!=='--root' || args.length!==2)) throw new Error('Usage: node scripts/apply-seo-maintenance.mjs [--root directory]');
 console.log(JSON.stringify(maintainSite(args[1]||ownRoot)));
}
