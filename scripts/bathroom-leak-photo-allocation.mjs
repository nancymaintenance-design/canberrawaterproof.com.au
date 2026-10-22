import {applyResponsiveImages} from './responsive-images.mjs';
export const bathroomLeakTranslations={
 'Exposed bathroom floor and wall surfaces':'浴室地面与墙面外露表面',
 'Wall tiling in progress':'墙面铺砖过程',
 'Tiled floor and wall finishes':'地面与墙面瓷砖饰面',
 'Bathroom fixtures and shower screen':'卫浴设施与淋浴屏',
 'Bathroom with exposed floor, wall surfaces and drainage openings':'可见地面、墙面外露表面及排水口的浴室',
 'Wall tiles being laid around a bathroom window and recessed shelf':'浴室窗边与壁龛周围的墙砖铺贴',
 'Tiled bathroom floor and walls with a toilet and visible drainage openings':'带马桶及可见排水口的浴室墙地砖饰面',
 'Bathroom with vanity, toilet, tiled walls and glass shower screen':'带浴室柜、马桶、墙砖及玻璃淋浴屏的浴室',
 'These bathroom photographs show exposed surfaces, tiling in progress and fitted bathroom finishes. The repair scope, materials and concealed waterproofing details are confirmed by an on-site assessment.':'这组浴室照片展示外露表面、铺砖过程及安装后的卫浴饰面。具体维修范围、材料及隐蔽防水细节，由现场评估后确认。',
 'Shower base, drain and screen photographs':'淋浴底盘、地漏与淋浴屏照片',
 'These photographs show the shower base, drain, tiled wall junctions and screen from different angles. The leak source and suitable repair scope are established during assessment.':'这组照片从不同角度展示淋浴底盘、地漏、瓷砖墙面接缝及淋浴屏。漏水来源与适合的维修范围，由现场评估时确认。',
};
const latest=[
 ['bathroom-renovation-exposed-surfaces','Bathroom with exposed floor, wall surfaces and drainage openings','Exposed bathroom floor and wall surfaces',1280,1700],
 ['bathroom-renovation-wall-tiling','Wall tiles being laid around a bathroom window and recessed shelf','Wall tiling in progress',1280,1700],
 ['bathroom-renovation-tiled-finishes','Tiled bathroom floor and walls with a toilet and visible drainage openings','Tiled floor and wall finishes',1080,1920],
 ['bathroom-renovation-fixtures-overview','Bathroom with vanity, toilet, tiled walls and glass shower screen','Bathroom fixtures and shower screen',1280,1707],
];
const previous=[
 ['bathroom-shower-base-junctions','Shower base, drain and tiled wall junctions','Shower base and junctions',1706,1280],
 ['bathroom-shower-base-close-view','Close view of the shower base and drain beside tiled walls','Shower base close view',1280,1706],
 ['bathroom-shower-threshold-view','Shower base, threshold and screen viewed from above','Threshold and shower screen',1280,1706],
 ['bathroom-shower-enclosure-overview','Shower enclosure with tiled walls, screen and shower base','Shower enclosure overview',1280,1706],
];
const img=(row,hero=false)=>`<img src="/assets/${row[0]}.jpg" alt="${row[1]}" width="${row[3]}" height="${row[4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
const figures=rows=>rows.map(row=>`<figure>${img(row)}<figcaption>${row[2]}</figcaption></figure>`).join('');
export function applyBathroomLeakPhotoAllocation(html,file,images={}){
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>{
   const row=card.includes('href="/services/bathroom-waterproofing/"')?latest[3]:card.includes('href="/services/leaking-shower-repairs/"')?previous[3]:null;
   return row?card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(row)):card;
  });
  return applyResponsiveImages(html,images);
 }
 if(file==='services/bathroom-waterproofing/index.html'){
  html=html.replace(/<div class="bathroom-hero-photos">[\s\S]*?<\/div><\/div>/,`<div class="bathroom-hero-photos">${img(latest[3],true)}<div class="bathroom-hero-detail">${img(latest[1])}<span>Wall tiling in progress</span></div></div>`);
  html=html.replace(/<div class="bathroom-photo-grid">[\s\S]*?<\/div>/,`<div class="bathroom-photo-grid">${figures(latest)}</div>`);
  html=html.replace('These shower photographs show the base, drain, wall junctions and shower screen from several angles. The repair scope, materials and any concealed waterproofing work are confirmed by an on-site assessment.','These bathroom photographs show exposed surfaces, tiling in progress and fitted bathroom finishes. The repair scope, materials and concealed waterproofing details are confirmed by an on-site assessment.');
  html=html.replace(/(<a class="bathroom-related-cover" href="\/services\/leaking-shower-repairs\/">)[\s\S]*?(<\/a>)/,`$1${img(previous[3])}$2`);
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/leaking-shower-repairs/index.html')return html;
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(previous[3],true)}<figcaption>Shower assessment and repair preparation.</figcaption></figure>`);
 const gallery=`<!-- leaking-shower-photos:start --><section class="leaking-shower-photo-record" aria-labelledby="leaking-shower-photo-title"><h2 id="leaking-shower-photo-title">Shower base, drain and screen photographs</h2><p>These photographs show the shower base, drain, tiled wall junctions and screen from different angles. The leak source and suitable repair scope are established during assessment.</p><div class="leaking-shower-photo-grid">${figures(previous)}</div><div class="leaking-shower-context"><span class="evidence-label">Shower assessment and repair preparation</span><p>Accessible shower edges and adjoining finishes help establish which repair path needs further investigation.</p></div></section><!-- leaking-shower-photos:end -->`;
 const managed=/<!-- leaking-shower-photos:start -->[\s\S]*?<!-- leaking-shower-photos:end -->/;
 html=managed.test(html)?html.replace(managed,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const css='<link rel="stylesheet" href="/assets/leaking-shower-photos.css">';
 if(!html.includes(css))html=html.replace('</head>',css+'</head>');
 return applyResponsiveImages(html,images);
}
