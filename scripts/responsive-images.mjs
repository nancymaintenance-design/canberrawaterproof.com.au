/** Retains the exact fallback img, including lazy/priority attributes. */
export function applyResponsiveImages(html, manifest) {
 return html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/gi, (tag, offset) => {
  if (/^<picture/i.test(tag)) return tag;
  const src=tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
  const entry=manifest[src];
  if (!entry?.candidates?.length) return tag;
  const context=html.slice(Math.max(0,offset-400),offset);
  const sizes=src.includes('logo') ? '58px' : /hero-slide[^<>]*>\s*$/.test(context) ? '100vw' : /service-card-image[^<>]*>\s*$/.test(context) ? '(max-width: 620px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 57px) / 2), (max-width: 1240px) calc((100vw - 74px) / 3), 389px' : '(max-width: 830px) calc(100vw - 40px), 790px';
  return `<picture data-responsive-image><source type="image/webp" srcset="${entry.candidates.map(c=>`${c.url} ${c.width}w`).join(', ')}" sizes="${sizes}">${tag}</picture>`;
 });
}
