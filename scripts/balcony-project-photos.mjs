import {applyResponsiveImages} from './responsive-images.mjs';
export const balconyPhotoTranslations={
 'Balcony, external wall and railing details.':'阳台、外墙与栏杆细节。',
 'Balcony front with timber railing and stone-faced external wall':'带木栏杆及石材饰面外墙的阳台正面',
 'Balcony edge and stone-faced wall':'阳台边缘与石材饰面墙',
 'Front view of the balcony and railing':'阳台与栏杆正面实景',
 'Stairs and adjoining balcony railing':'楼梯及相邻阳台栏杆',
 'Stone-faced wall beneath a balcony edge':'阳台边缘下方的石材饰面墙',
 'Exterior stairs leading to the balcony beside a stone-faced wall':'石材饰面墙旁通往阳台的室外楼梯',
 'Balcony and adjoining exterior photographs':'阳台与周边外部实景',
 'These photographs show the balcony edge, railing, stairs and adjoining external wall. The membrane, drainage connections and repair scope are checked separately during assessment.':'这组照片展示阳台边缘、栏杆、楼梯及相邻外墙。防水层、排水衔接及具体维修范围由现场评估时另行检查确认。',
};
const rows=[
 ['balcony-stone-wall-detail','Stone-faced wall beneath a balcony edge','Balcony edge and stone-faced wall',800,600],
 ['balcony-front-overview','Balcony front with timber railing and stone-faced external wall','Front view of the balcony and railing',2048,1536],
 ['balcony-stair-and-railing','Exterior stairs leading to the balcony beside a stone-faced wall','Stairs and adjoining balcony railing',2048,1536],
];
const img=(i,hero=false)=>`<img src="/assets/${rows[i][0]}.jpg" alt="${rows[i][1]}" width="${rows[i][3]}" height="${rows[i][4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'} style="border-radius:14px">`;
export function applyBalconyProjectPhotos(html,file,images={}){
 if(file==='index.html'){
  html=html.replace(/<figure class="field-notes-photo">[\s\S]*?<\/figure>/g,figure=>{
   if(!figure.includes('/assets/service-balcony.jpg')&&!figure.includes('/assets/balcony-front-overview.jpg'))return figure;
   return `<figure class="field-notes-photo">${img(1)}<figcaption><strong>Balcony waterproofing</strong><span>Balcony, external wall and railing details.</span></figcaption></figure>`;
  });
  return applyResponsiveImages(html,images);
 }
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>card.includes('href="/services/balcony-waterproofing/"')?card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(1)):card);
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/balcony-waterproofing/index.html')return html;
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(1,true)}<figcaption>Balcony surface and junction assessment.</figcaption></figure>`);
 const gallery=`<!-- balcony-photo-record:start --><section class="balcony-photo-record" aria-labelledby="balcony-photo-title"><h2 id="balcony-photo-title">Balcony and adjoining exterior photographs</h2><p>These photographs show the balcony edge, railing, stairs and adjoining external wall. The membrane, drainage connections and repair scope are checked separately during assessment.</p><div class="balcony-photo-grid">${rows.map((row,i)=>`<figure>${img(i)}<figcaption>${row[2]}</figcaption></figure>`).join('')}</div><div class="balcony-repair-context"><span class="evidence-label">Balcony surface and junction assessment</span><p>Balcony floor junctions, thresholds and drainage details are considered together when defining the repair.</p></div></section><!-- balcony-photo-record:end -->`;
 const managed=/<!-- balcony-photo-record:start -->[\s\S]*?<!-- balcony-photo-record:end -->/;
 html=managed.test(html)?html.replace(managed,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const css='<link rel="stylesheet" href="/assets/balcony-project-photos.css">';
 if(!html.includes(css))html=html.replace('</head>',css+'</head>');
 return applyResponsiveImages(html,images);
}
