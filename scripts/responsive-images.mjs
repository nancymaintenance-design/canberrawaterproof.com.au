/** Retains the exact fallback img, including lazy/priority attributes. */
export function applyResponsiveImages(html, manifest) {
 // Rebuild only our own sources from their exact fallback; authored pictures stay intact.
 html=html.replace(/<picture\b[^>]*\bdata-responsive-image[^>]*>\s*<source\b[^>]*>\s*(<img\b[^>]*>)\s*<\/picture>/gi,'$1');
 return html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/gi, (tag, offset) => {
  if (/^<picture/i.test(tag)) return tag;
  const src=tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
  const entry=manifest[src];
  if (!entry?.candidates?.length) return tag;
  const ancestors=[];
  for(const match of html.slice(0,offset).matchAll(/<(\/?)([a-z][\w-]*)\b([^>]*)>/gi)) {
   const name=match[2].toLowerCase();
   if(match[1]) {const i=ancestors.findLastIndex(a=>a.name===name);if(i>=0)ancestors.splice(i);}
   else if(!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(name)) ancestors.push({name,classes:match[3].match(/\bclass=["']([^"']*)["']/)?.[1].split(/\s+/)||[]});
  }
  const has=cls=>ancestors.some(a=>a.classes.includes(cls));
  const grid='(max-width: 620px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 57px) / 2), (max-width: 1240px) calc((100vw - 74px) / 3), 389px';
  let sizes='(max-width: 830px) calc(100vw - 40px), 790px';
  if(has('hero-slide')) sizes='100vw';
  else if(src.includes('logo')) sizes=has('footer')?'170px':'58px';
  else if(has('service-card-image')||has('process-image')||((has('guide-cover')||has('news-cover'))&&has('card'))) sizes=grid;
  else if(has('about-photo')) sizes='(max-width: 620px) calc(100vw - 42px), (max-width: 1020px) calc((100vw - 61px) / 2), 480px';
  else if(has('field-notes-photo')) sizes='(max-width: 800px) calc(100vw - 40px), (max-width: 1240px) calc((100vw - 40px - 6vw) * .55), 607px';
  return `<picture data-responsive-image><source type="image/webp" srcset="${entry.candidates.map(c=>`${c.url} ${c.width}w`).join(', ')}" sizes="${sizes}">${tag}</picture>`;
 });
}
