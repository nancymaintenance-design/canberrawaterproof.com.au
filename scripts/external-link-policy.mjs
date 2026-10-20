// Owner-approved clickable outbound policy. Resources (analytics/maps) are not links.
const ownHosts = new Set(['canberrawaterproof.com.au', 'www.canberrawaterproof.com.au']);
export function permittedLink(value) {
 if (!/^(?:https?:)?\/\//i.test(value)) return true;
 const host = new URL(value, 'https://www.canberrawaterproof.com.au').hostname.toLowerCase();
 return ownHosts.has(host) || ['youtube.com','www.youtube.com','tiktok.com','www.tiktok.com'].includes(host);
}
export function applyExternalLinkPolicy(html, locale='en') {
 const zh=locale==='zh',prefix=zh?'/zh':'';
 const contact=zh?'预约现场评估':'Request assessment';
 const services=zh?'服务项目':'Services';
 const projects=zh?'施工案例':'Projects';
 // Replace reference-only lists with useful existing site destinations, not empty slots.
 html=html.replace(/<section class="deep-guide-sources"[\s\S]*?<\/section>/g,
  `<section class="deep-guide-sources" aria-labelledby="guide-sources"><h2 id="guide-sources">${zh?'相关防水服务与施工案例':'Related waterproofing services and projects'}</h2><div class="deep-guide-copy"><ul><li><a href="${prefix}/services/">${services}</a></li><li><a href="${prefix}/case-studies/">${projects}</a></li><li><a href="${prefix}/contact/#service-form">${contact}</a></li></ul></div></section>`);
 html=html.replace(/<p\b[^>]*>\s*<a\b[^>]*href="https:\/\/abr\.business\.gov\.au[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi,'');
 html=html.replace(/<p class="faq-source-note">[\s\S]*?<\/p>/g,
  `<p class="faq-source-note"><a href="${prefix}/services/">${services}</a> · <a href="${prefix}/contact/#service-form">${contact}</a></p>`);
 html=html.replace(/<a\b([^>]*\bhref=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi,(whole,attrs,url,body)=>{
  if(permittedLink(url))return whole;
  if(/(?:^|\/)instagram\.com\//i.test(url)||/instagram\.com\//i.test(url))return '';
  // Keep the technical explanation and attribution as normal text, without arrows,
  // link styling, a misleading click affordance, or dead placeholder hrefs.
  return '<span>'+body.replace(/\s*[↗→]\s*$/,'')+'</span>';
 });
 html=html.replace(/<script\b([^>]*\btype="application\/ld\+json"[^>]*)>([\s\S]*?)<\/script>/gi,(whole,attrs,json)=>{
  const filter=value=>{
   if(Array.isArray(value))return value.map(filter);
   if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,key==='sameAs'&&Array.isArray(v)?v.filter(permittedLink):filter(v)]));
   return value;
  };
  return `<script${attrs}>${JSON.stringify(filter(JSON.parse(json))).replace(/</g,'\\u003c')}</script>`;
 });
 return html;
}
