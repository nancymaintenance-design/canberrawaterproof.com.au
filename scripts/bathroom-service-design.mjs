import {load} from 'cheerio';
import {applyResponsiveImages} from './responsive-images.mjs';

export const bathroomDesignTranslations={
 'Shower details':'淋浴间细节',
 'Shower base close view':'淋浴底盘近景',
 'Threshold and shower screen':'门槛与淋浴屏',
};
const names=['bathroom-shower-enclosure-overview','bathroom-shower-base-junctions','bathroom-shower-base-close-view','bathroom-shower-threshold-view'];
const alts=['Shower enclosure with tiled walls, screen and shower base','Shower base, drain and tiled wall junctions','Close view of the shower base and drain beside tiled walls','Shower base, threshold and screen viewed from above'];
const img=(i,hero=false)=>`<img src="/assets/${names[i]}.jpg" alt="${alts[i]}" width="${i===1?1706:1280}" height="${i===1?1280:1706}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;

/** Existing content stays in the page; only its grouping and the approved imagery change. */
export function applyBathroomServiceDesign(html,file,images={}){
 if(file==='services/index.html'){
  // Only the bathroom entry, not other service cards or their layout.
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>{
   if(!card.includes('href="/services/bathroom-waterproofing/"'))return card;
   return card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(3));
  });
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/bathroom-waterproofing/index.html')return html;
 // Keep the authoring generator's protected content block byte-for-byte intact.
 const protectedBlock=html.match(/<!-- keyword-content-expansion:start -->[\s\S]*?<!-- keyword-content-expansion:end -->/)?.[0];
 const protectedPlaceholder='<div data-bathroom-protected></div>';
 const parseHtml=protectedBlock?html.replace(protectedBlock,protectedPlaceholder):html;
 const $=load(parseHtml),main=$('main');
 if(!main.attr('data-bathroom-design')){
  main.attr('data-bathroom-design','editorial');
  const story=$('article.service-story'),materials=main.children('section.service-story').last();
  materials.addClass('bathroom-materials');
  const caseSection=story.children('.case-study'),first=story.children('figure.detail-evidence').first(),last=story.children('figure.detail-evidence').last();
  const firstCaption=first.find('figcaption').html(),lastCaption=last.find('figcaption').html();
  const gallery=`<div class="bathroom-photo-grid"><figure class="bathroom-photo-overview">${img(0)}<figcaption>${lastCaption}</figcaption></figure><figure class="bathroom-photo-junctions">${img(1)}<figcaption>${firstCaption}</figcaption></figure><div class="bathroom-photo-details"><figure>${img(2)}<figcaption>Shower base close view</figcaption></figure><figure>${img(3)}<figcaption>Threshold and shower screen</figcaption></figure></div></div>`;
  caseSection.attr('id','bathroom-project-gallery').addClass('bathroom-project');
  caseSection.children('figure').remove();caseSection.append(gallery);
  first.remove();last.remove();
  // Retain every existing service paragraph and list, with a clear scope/process rhythm.
  story.children('ul.service-list').prev('p').addClass('bathroom-scope-intro');
  const booking=story.children('.service-booking').remove();
  // Existing authoring blocks retain their anchors and contents.
  materials.after(booking);
  booking.find('.card').each((index,node)=>$(node).prepend(img(index===0?3:2)));
  story.children('p.project-evidence-link').appendTo(caseSection.children('div').first());
  const hero=$('.service-hero-image');
  hero.children('picture,img').remove();
  hero.prepend(`<div class="bathroom-hero-photos">${img(0,true)}<div class="bathroom-hero-detail">${img(2)}<span>Shower details</span></div></div>`);
 }
 main.children('.service-booking').find('.card').each((_,node)=>{
  const card=$(node),href=card.find('h3 a').attr('href');
  if(href)card.children('picture,img').wrap(`<a class="bathroom-related-cover" href="${href}"></a>`);
  const original=href==='/services/leaking-shower-repairs/'?['service-shower','MEL ONE assessing a leaking shower area in Canberra']:href==='/services/shower-resealing-regrouting/'?['service-resealing','MEL ONE repairing shower grout and silicone joints in Canberra']:null;
  if(original)card.children('.bathroom-related-cover').html(`<img src="/assets/${original[0]}.jpg" alt="${original[1]}" width="1536" height="1024" loading="lazy" decoding="async">`);
 });
 main.find('.bathroom-photo-details').each((_,node)=>{
  const wrapper=$(node);wrapper.replaceWith(wrapper.html());
 });
 let mainHtml=$.html(main);
 if(protectedBlock)mainHtml=mainHtml.replace('<div data-bathroom-protected=""></div>',protectedBlock);
 let output=html.replace(/<main\b[\s\S]*?<\/main>/,mainHtml);
 const css='<link rel="stylesheet" href="/assets/bathroom-service.css">';
 if(!output.includes(css))output=output.replace('</head>',css+'</head>');
 return applyResponsiveImages(output,images);
}
