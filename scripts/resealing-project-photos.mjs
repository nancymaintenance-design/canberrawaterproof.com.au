import {applyResponsiveImages} from './responsive-images.mjs';

export const resealingPhotoTranslations={
 'Shower waterproofing detail':'淋浴间防水施工细节',
 'Waterproofing visible at the wall and floor junction.':'墙面及墙地交接处可见的防水层施工。',
 'Shower wall and floor with blue waterproofing and an exposed wall opening':'带蓝色防水层及墙面开口的淋浴墙地面',
 'Waterproofing detail for a separately scoped membrane repair.':'另行确定施工范围的防水层维修细节。',
 'Waterproofing details when a wider repair is needed':'需要扩大维修范围时的防水施工细节',
 'These photographs show exposed substrates, membrane coverage and junction details. They illustrate broader waterproofing work, assessed and quoted separately from surface resealing or regrouting.':'这些照片展示外露基层、防水层覆盖及接缝细节，用于说明需要另行评估与报价的防水层施工。表面重新密封或填缝仍按本页说明确定接缝维修范围。',
 'Wall junction and recessed detail':'墙面接缝与凹槽细节',
 'Membrane coverage around the shower area':'淋浴区域的防水层覆盖',
 'Prepared wall joints and pipe openings':'墙面接缝与管口准备',
 'Wet-area floor and wall overview':'湿区地面与墙面实景',
 'Blue waterproofing at a wall junction and recessed shower detail':'墙面接缝及淋浴凹槽处的蓝色防水层',
 'Shower walls and floor with blue waterproofing beside an exposed wall opening':'墙面开口旁覆盖蓝色防水层的淋浴墙面与地面',
 'Wall joints and pipe openings with blue waterproofing preparation':'带蓝色防水处理的墙面接缝及管口',
 'Wet-area floor and wall waterproofing with visible drainage openings':'可见排水口的湿区墙地面防水层',
};
const rows=[
 ['shower-membrane-recess-detail','Blue waterproofing at a wall junction and recessed shower detail','Wall junction and recessed detail',1080,1440],
 ['shower-membrane-area-coverage','Shower walls and floor with blue waterproofing beside an exposed wall opening','Membrane coverage around the shower area',1080,1440],
 ['shower-wall-joint-preparation','Wall joints and pipe openings with blue waterproofing preparation','Prepared wall joints and pipe openings',1440,1080],
 ['shower-membrane-room-overview','Wet-area floor and wall waterproofing with visible drainage openings','Wet-area floor and wall overview',1080,1440],
];
const img=(row,hero=false)=>`<img src="/assets/${row[0]}.jpg" alt="${row[1]}" width="${row[3]}" height="${row[4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
const homeRow=['shower-waterproofing-home-detail','Shower wall and floor with blue waterproofing and an exposed wall opening','',1080,1440];

export function applyResealingProjectPhotos(html,file,images={}){
 if(file==='index.html'){
  html=html.replace(/<figure class="field-notes-photo">[\s\S]*?<\/figure>/g,figure=>{
   if(!figure.includes('/assets/service-shower.jpg')&&!figure.includes('/assets/shower-waterproofing-home-detail.jpg'))return figure;
   return `<figure class="field-notes-photo">${img(homeRow).replace('>',' style="object-position:center bottom;border-radius:14px">')}<figcaption><strong>Shower waterproofing detail</strong><span>Waterproofing visible at the wall and floor junction.</span></figcaption></figure>`;
  });
  return applyResponsiveImages(html,images);
 }
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>{
   if(!card.includes('href="/services/shower-resealing-regrouting/"'))return card;
   return card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(rows[1]));
  });
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/shower-resealing-regrouting/index.html')return html;
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(rows[1],true)}<figcaption>Waterproofing detail for a separately scoped membrane repair.</figcaption></figure>`);
 const gallery=`<!-- resealing-photo-record:start --><section class="resealing-photo-record" aria-labelledby="resealing-photo-title"><h2 id="resealing-photo-title">Waterproofing details when a wider repair is needed</h2><p>These photographs show exposed substrates, membrane coverage and junction details. They illustrate broader waterproofing work, assessed and quoted separately from surface resealing or regrouting.</p><div class="resealing-photo-grid">${rows.map(row=>`<figure>${img(row)}<figcaption>${row[2]}</figcaption></figure>`).join('')}</div><div class="resealing-joint-context"><span class="evidence-label">Shower joint preparation and finishing</span><p>Grout lines and flexible junctions need different preparation and replacement materials.</p></div></section><!-- resealing-photo-record:end -->`;
 const managed=/<!-- resealing-photo-record:start -->[\s\S]*?<!-- resealing-photo-record:end -->/;
 if(managed.test(html))html=html.replace(managed,gallery);
 else html=html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const css='<link rel="stylesheet" href="/assets/resealing-project-photos.css">';
 if(!html.includes(css))html=html.replace('</head>',css+'</head>');
 return applyResponsiveImages(html,images);
}
