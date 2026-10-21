import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyResponsiveImages } from './responsive-images.mjs';
import { applyMobileNavigation } from './mobile-navigation.mjs';
import { applyKeywordHeadings } from './keyword-headings.mjs';
import { applyDeclarativeContent } from './declarative-content.mjs';
import { applyFaqCategories } from './faq-categories.mjs';
import { applyAboutCompany } from './about-company.mjs';
import { applyRoofCaseStudy } from './case-study-project.mjs';
import { applyDeepGuide } from './deep-guides.mjs';
import { applyEnquiryFlow } from './enquiry-flow.mjs';
import { applyServiceRepairContent } from './service-repair-content.mjs';
import { applyProjectEvidenceNavigation } from './project-evidence-navigation.mjs';
import { applyEditorialPresentation } from './editorial-presentation.mjs';
import { applyLocalityContactCopy } from './locality-contact-copy.mjs';
import { applyHomepageFieldwork } from './homepage-fieldwork.mjs';
import { applyServiceDirectoryLayout } from './service-directory-layout.mjs';
import { applyExternalLinkPolicy } from './external-link-policy.mjs';
import { applyCustomerFirstCopy } from './customer-first-copy.mjs';
import {addRainFaq,applyPostRainContent} from './post-rain-content.mjs';
import { buildBilingual, decorateEnglish } from './bilingual-site.mjs';
import { authoredHtml } from './schema-feed-site.mjs';
import { renderLlms } from './llms-curation.mjs';
import {navigationMapping,applyCustomerNavigation} from './customer-navigation.mjs';
import { existsSync } from 'node:fs';

const ownRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'https://www.canberrawaterproof.com.au';
// User-confirmed office reception hours; site visits are arranged separately.
const receptionHours = 'Office reception: daily 09:00–21:00. On-site work by arrangement.';
const hoursMarkup = `<p class="office-hours">${receptionHours}</p>`;
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
 'tile-regrouting':'Tile Regrouting',
 'commercial-waterproofing':'Commercial Waterproofing',
};
const guideServices = {
 'shower-plumbing-or-waterproofing':['leaking-shower-repairs','bathroom-waterproofing'],
 'regrouting-resealing-or-rewaterproofing':['shower-resealing-regrouting','bathroom-waterproofing'],
 'waterproofing-retiling-quote':['bathroom-waterproofing','leaking-shower-repairs'],
 'balcony-leaking-room-below':['balcony-waterproofing','external-waterproofing'],
 'kitchen-sink-resealing-or-plumbing':['kitchen-sealing','laundry-waterproofing'],
 'waterproofing-or-drainage':['external-waterproofing','retaining-wall-waterproofing'],
};

// Fixed significant-content dates: guide expansion on 14 October, then the
// service/company/project editorial revision and collection semantics on 15 October.
// Shared navigation and contextual evidence links alone do not reset article dates.
export const contentChanges = Object.fromEntries([
 ...['faq','industry-news/preparing-for-wet-weather','industry-news/understanding-repair-scopes'].map(slug=>[`${HOST}/${slug}/`,'2026-10-21']),
 ...Object.keys(guideServices).map(slug=>[`${HOST}/guides/${slug}/`,'2026-10-14']),
 ...Object.keys(serviceNames).map(slug=>[`${HOST}/services/${slug}/`,'2026-10-15']),
 ...['services','guides','industry-news','about','case-studies'].map(slug=>[`${HOST}/${slug}/`,'2026-10-15']),
 ...['belconnen','gungahlin','inner-north-city','inner-south','woden-valley','weston-creek-molonglo','tuggeranong','east-canberra','act-localities'].map(slug=>[`${HOST}/waterproofing/${slug}/`,'2026-10-15']),
]);
const keywordPattern = /<!-- keyword-content-expansion:start -->[\s\S]*?<!-- keyword-content-expansion:end -->/g;
const relatedPattern = /<!-- seo-maintenance-related:start -->[\s\S]*?<!-- seo-maintenance-related:end -->/;

export function applySeoHtml(html, path, { keywords = {}, images = {} } = {}) {
 if (path === 'services/index.html') {
  const covers = [
   ['tile-regrouting','tile-regrouting-after','Tiled floor after regrouting with renewed tile joints'],
   ['commercial-waterproofing','commercial-roof-waterproofing-work','Worker applying waterproofing on a commercial roof around rooftop equipment'],
  ];
  html = html.replace(/<article class="card">[\s\S]*?<\/article>/g, card => {
   if (/<img\b/.test(card)) return card;
   const cover = covers.find(([slug]) => card.includes(`href="/services/${slug}/"`));
   if (!cover) return card;
   const [,name,alt] = cover;
   const sizes = '(max-width: 620px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 57px) / 2), (max-width: 1240px) calc((100vw - 74px) / 3), 389px';
   const photo = `<figure class="service-card-image"><picture><source type="image/webp" srcset="${[480,800,1200].map(width=>`/assets/projects/${name}-${width}.webp ${width}w`).join(', ')}" sizes="${sizes}"><img src="/assets/projects/${name}.jpg" alt="${alt}" loading="lazy" decoding="async" width="1200" height="900"></picture></figure>`;
   return card.replace('<article class="card">','<article class="card">'+photo);
  });
 }
 html = html.replace(/<footer\b[\s\S]*?<\/footer>/, footer =>
  footer.includes('class="office-hours"') ? footer : footer.replace('<p>121 Marcus Clarke St, Canberra, ACT 2600</p>', '<p>121 Marcus Clarke St, Canberra, ACT 2600</p>'+hoursMarkup));
 if (path === 'contact/index.html') {
  html = html.replace(/<div class="contact-details">[\s\S]*?<\/div>/, block =>
   block.includes('class="office-hours"') ? block : block.replace('<p>121 Marcus Clarke St, Canberra, ACT 2600</p>', '<p>121 Marcus Clarke St, Canberra, ACT 2600</p>'+hoursMarkup));
 }
 html = html.replace(/<img\b[^>]*src="\/assets\/mel-one-logo\.png"[^>]*>/g, image => {
  if (/\bwidth="\d+"/.test(image) && /\bheight="\d+"/.test(image)) return image;
  return image.replace(/\s(?:width|height)="[^"]*"/g,'').replace(/>$/, ' width="1402" height="1122">');
 });
 html = html.replace(/<footer\b[\s\S]*?<\/footer>/, footer => footer.replace(/<img\b[^>]*src="\/assets\/mel-one-logo\.png"[^>]*>/g, image =>
  image.replace(/\s(?:loading|decoding)="[^"]*"/g,'').replace(/>$/, ' loading="lazy" decoding="async">')));
 if (path === 'case-studies/index.html') {
  html = html.replace('<p class="eyebrow">Real project photos to be added</p>', '');
 }
 const source = keywords[path];
 if (source) {
  const present = [...html.matchAll(keywordPattern)];
  const editorial = block => applyCustomerFirstCopy(applyDeclarativeContent(applyKeywordHeadings(block,path),path),path);
  if (present.length > 1 || (present.length && editorial(present[0][0]) !== editorial(source))) throw new Error(`Protected keyword section differs: ${path}`);
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
   business.openingHoursSpecification=[{
    '@type':'OpeningHoursSpecification',
    dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens:'09:00',closes:'21:00',
   }];
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
   if(business && node.author?.['@type']==='Organization' && node.author.name==='MEL ONE') {
    node.author={...node.author,'@id':HOST+'/#business',url:HOST+'/about/'};
   }
   if(visibleImage) node.image=new URL(visibleImage,HOST).href;
  }
  const output=JSON.stringify(data);
  return output===JSON.stringify(JSON.parse(json)) ? whole : open+output.replace(/</g,'\\u003c')+close;
 });
 if (!/<script\b[^>]*src=["']\/assets\/conversion-events\.js["']/.test(html)) {
  html=html.replace('</head>','<script src="/assets/conversion-events.js" defer></script></head>');
 }
 html = applyDeclarativeContent(applyKeywordHeadings(applyMobileNavigation(applyResponsiveImages(html,images)),path),path);
 if (path === 'about/index.html') html = applyAboutCompany(html);
 if (path === 'case-studies/index.html') html = applyRoofCaseStudy(html);
 if (path === 'faq/index.html') html = applyFaqCategories(addRainFaq(html));
 html = applyDeepGuide(html,path);
 html = applyServiceRepairContent(html,path);
 html = applyProjectEvidenceNavigation(html,path);
 if (['services/index.html','guides/index.html','industry-news/index.html'].includes(path)) {
  html=html.replace(/<article class="card[^"]*">[\s\S]*?<\/article>/g,card=>card.replace(/<h3\b/g,'<h2').replace(/<\/h3>/g,'</h2>'));
 }
 html = applyEditorialPresentation(html,path);
 html = applyLocalityContactCopy(html,path);
 return applyPostRainContent(applyCustomerFirstCopy(applyExternalLinkPolicy(applyServiceDirectoryLayout(applyHomepageFieldwork(applyEnquiryFlow(html,path),path),path)),path),path);
}

export function applyLlms(text) {
 text=text.replaceAll('\r\n','\n');
 text=text.replaceAll('https://canberrawaterproof.com.au','https://www.canberrawaterproof.com.au');
 if (!text.includes('- '+receptionHours)) {
  text=text.replace(/(- Address: 121 Marcus Clarke St, Canberra ACT 2600)(\n|$)/, '$1\n- '+receptionHours+'$2');
 }
 text=text.replace(/(## Scope\n)[\s\S]*?(\n\n## )/, '$1Bathroom waterproofing, leaking shower repairs, shower resealing and regrouting, tile regrouting, balcony waterproofing, kitchen sealing, laundry waterproofing, external waterproofing, roof waterproofing, retaining-wall waterproofing and commercial waterproofing. Scope and appropriate trade coordination are confirmed for each property.$2');
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
 const navigation=existsSync(resolve(root,'data/customer-navigation.mjs'))?navigationMapping(root,{allowPartial:!existsSync(resolve(root,'index.html'))}):null;
 function update(path,transform) {
  const file=resolve(root,path), before=readFileSync(file,'utf8'), after=transform(before);
  if(before!==after) {writeFileSync(file,after);changed.push(path);}
 }
 function walk(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
   if(entry.name.startsWith('.') || ['node_modules','assets','zh'].includes(entry.name)) continue;
   const file=resolve(dir,entry.name);
   if(entry.isDirectory()) walk(file);
   else if(entry.name.endsWith('.html')) {
    const path=relative(root,file).replaceAll('\\','/');
    update(path,html=>{
     const base=authoredHtml(root,path,html);
     let maintained=applySeoHtml(base,path,{keywords,images});
     if(navigation)maintained=applyCustomerNavigation(maintained,path,root,navigation);
     maintained=applyPostRainContent(maintained,path);
     const output=existsSync(resolve(root,'data/i18n/zh-Hans.json')) ? decorateEnglish(maintained,path) : maintained;
     return output===base ? html : output;
    });
   }
  }
 }
 walk(root);
 update('sitemap.xml',applySitemap);
 if (existsSync(resolve(root,'data/i18n/zh-Hans.json'))) changed.push(...buildBilingual(root).changed);
 update('llms.txt',existsSync(resolve(root,'vercel.json'))&&existsSync(resolve(root,'data/llms-curation.json')) ? ()=>renderLlms(root) : applyLlms);
 return {changed,keywordSections:Object.keys(keywords).length,contentChangePages:Object.keys(contentChanges).length};
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2);
 if(args.length && (args[0]!=='--root' || args.length!==2)) throw new Error('Usage: node scripts/apply-seo-maintenance.mjs [--root directory]');
 console.log(JSON.stringify(maintainSite(args[1]||ownRoot)));
}
