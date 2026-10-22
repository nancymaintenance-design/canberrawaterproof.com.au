import {applyResponsiveImages} from './responsive-images.mjs';
export const balconyPhotoTranslations={
 'Balcony surfaces, perimeter details and drainage.':'阳台表面、周边节点与排水。',
 'Grey balcony surface with perimeter upturns and glass railing':'带周边上翻及玻璃栏杆的灰色阳台表面',
 'Balcony surface with worn finishes and visible cracks':'饰面磨损且可见裂缝的阳台表面',
 'Existing balcony surface beside a horizontal metal railing':'水平金属栏杆旁的原阳台表面',
 'Grey balcony surface beside a horizontal metal railing':'水平金属栏杆旁的灰色阳台表面',
 'Grey balcony surface and perimeter junctions':'灰色阳台表面与周边交接',
 'Worn balcony finish and visible surface cracks':'阳台饰面磨损与可见表面裂缝',
 'Existing surface beside metal railing':'金属栏杆旁的原表面',
 'Grey surface beside metal railing':'金属栏杆旁的灰色表面',
 'Balcony surface and perimeter photographs':'阳台防水表面与周边实景照片',
 'These photographs show balcony surfaces, visible cracks, perimeter junctions and railing edges. The repair scope and material system are confirmed from the site assessment and relevant job records.':'这组照片展示阳台表面、可见裂缝、周边交接及栏杆边缘。具体维修范围与材料系统，根据现场评估和相应工程记录确认。',
 'Wall waterproofing assessment: stone-faced wall photographs':'墙体防水评估参考：石材饰面墙与周边实景',
 'These exterior photographs show stone-faced walls, adjacent stairs and railings. The wall construction, retained ground, concealed waterproofing and drainage are checked separately during assessment.':'这组外部照片展示石材饰面墙、相邻楼梯与栏杆。墙体构造、挡土情况、隐蔽防水及排水，由现场评估时另行检查确认。',
 'Visible wall face and adjoining exterior details':'可见墙面及相邻外部细节',
 'Access, drainage and wall condition are assessed together.':'结合施工通道、排水与墙体状况一并评估。',
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
const previous=[
 ['balcony-stone-wall-detail','Stone-faced wall beneath a balcony edge','Balcony edge and stone-faced wall',800,600],
 ['balcony-front-overview','Balcony front with timber railing and stone-faced external wall','Front view of the balcony and railing',2048,1536],
 ['balcony-stair-and-railing','Exterior stairs leading to the balcony beside a stone-faced wall','Stairs and adjoining balcony railing',2048,1536],
];
const rows=[
 ['balcony-grey-surface-overview','Grey balcony surface with perimeter upturns and glass railing','Grey balcony surface and perimeter junctions',575,712,'png'],
 ['balcony-worn-surface-detail','Balcony surface with worn finishes and visible cracks','Worn balcony finish and visible surface cracks',557,720,'png'],
 ['balcony-existing-surface-railing','Existing balcony surface beside a horizontal metal railing','Existing surface beside metal railing',348,728,'png'],
 ['balcony-grey-surface-railing','Grey balcony surface beside a horizontal metal railing','Grey surface beside metal railing',647,276,'png'],
];
const image=(row,hero=false)=>`<img src="/assets/${row[0]}.${row[5]||'jpg'}" alt="${row[1]}" width="${row[3]}" height="${row[4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'} style="border-radius:14px">`;
const img=(i,hero=false)=>image(rows[i],hero);
export function applyBalconyProjectPhotos(html,file,images={}){
 if(file==='index.html'){
  html=html.replace(/<figure class="field-notes-photo">[\s\S]*?<\/figure>/g,figure=>{
   if(!figure.includes('/assets/service-balcony.jpg')&&!figure.includes('/assets/balcony-front-overview.jpg')&&!figure.includes('/assets/balcony-grey-surface-overview.png'))return figure;
   return `<figure class="field-notes-photo">${img(0)}<figcaption><strong>Balcony waterproofing</strong><span>Balcony surfaces, perimeter details and drainage.</span></figcaption></figure>`;
  });
  return applyResponsiveImages(html,images);
 }
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>{
   const row=card.includes('href="/services/balcony-waterproofing/"')?rows[0]:card.includes('href="/services/retaining-wall-waterproofing/"')?previous[0]:null;
   return row?card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>image(row)):card;
  });
  return applyResponsiveImages(html,images);
 }
 if(file==='services/retaining-wall-waterproofing/index.html'){
  html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*(")/g,'$1https://www.canberrawaterproof.com.au/assets/balcony-stone-wall-detail.jpg$2');
  html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${image(previous[0],true)}<figcaption>Visible wall face and adjoining exterior details</figcaption></figure>`);
  const gallery=`<!-- retaining-wall-photo-record:start --><section class="balcony-photo-record" aria-labelledby="retaining-wall-photo-title"><h2 id="retaining-wall-photo-title">Wall waterproofing assessment: stone-faced wall photographs</h2><p>These exterior photographs show stone-faced walls, adjacent stairs and railings. The wall construction, retained ground, concealed waterproofing and drainage are checked separately during assessment.</p><div class="balcony-photo-grid">${previous.map(r=>`<figure>${image(r)}<figcaption>${r[2]}</figcaption></figure>`).join('')}</div><div class="balcony-repair-context"><p>Access, drainage and wall condition are assessed together.</p></div></section><!-- retaining-wall-photo-record:end -->`;
  const managed=/<!-- retaining-wall-photo-record:start -->[\s\S]*?<!-- retaining-wall-photo-record:end -->/;html=managed.test(html)?html.replace(managed,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
  const css='<link rel="stylesheet" href="/assets/balcony-project-photos.css">';if(!html.includes(css))html=html.replace('</head>',css+'</head>');
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/balcony-waterproofing/index.html')return html;
 html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*(")/g,'$1https://www.canberrawaterproof.com.au/assets/balcony-grey-surface-overview.png$2');
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(0,true)}<figcaption>Balcony surface and junction assessment.</figcaption></figure>`);
 const gallery=`<!-- balcony-photo-record:start --><section class="balcony-photo-record" aria-labelledby="balcony-photo-title"><h2 id="balcony-photo-title">Balcony surface and perimeter photographs</h2><p>These photographs show balcony surfaces, visible cracks, perimeter junctions and railing edges. The repair scope and material system are confirmed from the site assessment and relevant job records.</p><div class="balcony-photo-grid" data-photo-count="4">${rows.map((row,i)=>`<figure>${img(i)}<figcaption>${row[2]}</figcaption></figure>`).join('')}</div><div class="balcony-repair-context"><span class="evidence-label">Balcony surface and junction assessment</span><p>Balcony floor junctions, thresholds and drainage details are considered together when defining the repair.</p></div></section><!-- balcony-photo-record:end -->`;
 const managed=/<!-- balcony-photo-record:start -->[\s\S]*?<!-- balcony-photo-record:end -->/;
 html=managed.test(html)?html.replace(managed,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const css='<link rel="stylesheet" href="/assets/balcony-project-photos.css">';
 if(!html.includes(css))html=html.replace('</head>',css+'</head>');
 return applyResponsiveImages(html,images);
}
