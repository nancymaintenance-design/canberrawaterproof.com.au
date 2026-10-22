import {applyResponsiveImages} from './responsive-images.mjs';
export const kitchenPhotoTranslations={
 'Kitchen Caulking & Silicone Replacement in Canberra':'堪培拉厨房台面与水槽打胶密封',
 'Kitchen Caulking & Silicone Replacement in Canberra | MEL ONE':'堪培拉厨房台面与水槽打胶密封 | MEL ONE',
 'Kitchen Caulking & Silicone Replacement':'厨房台面与水槽打胶密封',
 'Kitchen caulking & silicone replacement':'厨房台面与水槽打胶密封',
 'Kitchen caulking and silicone replacement':'厨房台面与水槽打胶密封',
 'Kitchen caulking and silicone replacement for sink edges, benchtops and splashback joints in Canberra. Book an on-site assessment with MEL ONE.':'为堪培拉厨房水槽边缘、台面与防溅板接缝提供打胶密封与旧胶更换。联系 MEL ONE 预约现场评估。',
 'Kitchen benchtop and splashback junction beside a glass cooktop':'玻璃灶台旁的厨房台面与防溅板接缝',
 'Benchtop, splashback and cabinet edge beside a cooktop':'灶台旁的台面、防溅板及橱柜边缘',
 'Kitchen and dining area with timber cabinetry and a sink benchtop':'带木质橱柜及水槽台面的厨房与用餐区',
 'Kitchen benchtop recess with tiled splashback and open cupboard':'带瓷砖防溅板及打开柜门的厨房台面区域',
 'Benchtop and splashback joint detail':'台面与防溅板接缝细节',
 'Cooktop and adjoining cabinet junctions':'灶台与相邻橱柜交界处',
 'Kitchen and sink area overview':'厨房与水槽区域整体实景',
 'Benchtop recess and cupboard detail':'台面区域与柜体细节',
 'Kitchen benchtop, splashback and cabinetry photographs':'厨房台面、防溅板与橱柜实景照片',
 'These photographs show the kitchen layout, benchtop edges, tiled splashback and accessible cabinetry. We assess the affected joints on site before confirming sealant removal, surface preparation and silicone replacement.':'这组照片展示厨房布局、台面边缘、瓷砖防溅板及可检查的柜体。我们现场评估问题接缝，再确认旧胶清除、表面处理及重新打胶的范围。',
};
const rows=[
 ['kitchen-cooktop-cabinet-junction','Benchtop, splashback and cabinet edge beside a cooktop','Cooktop and adjoining cabinet junctions',1280,1707],
 ['kitchen-benchtop-splashback-joint','Kitchen benchtop and splashback junction beside a glass cooktop','Benchtop and splashback joint detail',1280,1707],
 ['kitchen-dining-overview','Kitchen and dining area with timber cabinetry and a sink benchtop','Kitchen and sink area overview',1702,1276],
 ['kitchen-cabinet-benchtop-detail','Kitchen benchtop recess with tiled splashback and open cupboard','Benchtop recess and cupboard detail',960,1280],
];
const img=(i,hero=false)=>`<img src="/assets/${rows[i][0]}.jpg" alt="${rows[i][1]}" width="${rows[i][3]}" height="${rows[i][4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
export function applyKitchenProjectPhotos(html,file,images={}){
 html=html.replace(/(<a\b[^>]*href="\/services\/kitchen-sealing\/(?:#[^"]*)?"[^>]*>)([^<]*)(<\/a>)/g,(whole,open,text,close)=>/^(?:Kitchen Sealing(?: &(?:amp;)? Resealing)?|Kitchen sealing(?: &(?:amp;)? resealing)?|Kitchen Caulking &(?:amp;)? Silicone Replacement)$/.test(text.trim())?open+'Kitchen Caulking &amp; Silicone Replacement'+close:whole);
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,card=>card.includes('href="/services/kitchen-sealing/"')?card.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(1)):card);
  return applyResponsiveImages(html,images);
 }
 if(file!=='services/kitchen-sealing/index.html')return html;
 const title='Kitchen Caulking &amp; Silicone Replacement in Canberra';
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title} | MEL ONE</title>`).replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${title}</h1>`);
 const description='Kitchen caulking and silicone replacement for sink edges, benchtops and splashback joints in Canberra. Book an on-site assessment with MEL ONE.';
 html=html.replace(/(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/g,`$1${description}$2`);
 html=html.replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/g,`$1${title} | MEL ONE$2`);
 html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*(")/g,'$1https://www.canberrawaterproof.com.au/assets/kitchen-benchtop-splashback-joint.jpg$2');
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(1,true)}<figcaption>Benchtop and splashback joint detail</figcaption></figure>`);
 const gallery=`<!-- kitchen-project-photos:start --><section class="kitchen-photo-record" aria-labelledby="kitchen-photo-title"><h2 id="kitchen-photo-title">Kitchen benchtop, splashback and cabinetry photographs</h2><p>These photographs show the kitchen layout, benchtop edges, tiled splashback and accessible cabinetry. We assess the affected joints on site before confirming sealant removal, surface preparation and silicone replacement.</p><div class="kitchen-photo-grid">${rows.map((row,i)=>`<figure>${img(i)}<figcaption>${row[2]}</figcaption></figure>`).join('')}</div><div class="kitchen-photo-context"><span class="evidence-label">Kitchen sink and benchtop junctions</span><p>Sink-edge gaps and under-sink plumbing paths require different repairs.</p></div></section><!-- kitchen-project-photos:end -->`;
 const managed=/<!-- kitchen-project-photos:start -->[\s\S]*?<!-- kitchen-project-photos:end -->/;
 html=managed.test(html)?html.replace(managed,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const css='<link rel="stylesheet" href="/assets/kitchen-project-photos.css">';if(!html.includes(css))html=html.replace('</head>',css+'</head>');
 return applyResponsiveImages(html,images);
}
