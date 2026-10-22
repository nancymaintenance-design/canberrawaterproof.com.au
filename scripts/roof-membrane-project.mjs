import {applyResponsiveImages} from './responsive-images.mjs';
const sections=[
 ['Sheet membrane benefits for suitable roofs','屋面防水卷材的选用优势',[
  ['For a suitable flat or low-pitched roof, factory-made sheet membranes provide a specified nominal thickness across each roll. Reinforced modified-bitumen sheets add tensile strength, while the planned sheet layout makes laps and terminations accessible for inspection. These features support consistent coverage over larger roof areas when the substrate, bonding and drainage details are properly prepared.','针对基层与构造适合的平屋面或低坡屋面，工厂预制卷材具有规定的公称厚度。增强型改性沥青卷材通过胎基增强抗拉性能；预先规划的铺设方向，也方便检查搭接与收口。这些特点配合适当的基层、粘结与排水节点处理，有助于形成较大面积且厚度一致的屋面防水层。'],
  ['For an exposed roof, we select the complete weathering system, including a cap sheet or protective finish documented for UV exposure. A mineral-faced APP modified-bitumen cap sheet is one option, with maintenance access suited to that system. Selection also considers roof movement, existing coatings, outlets and any need for a base sheet or vapour-control layer.','针对外露屋面，我们会选择完整的耐候系统，包括明确适合紫外线环境的面层卷材或保护饰面。矿物面 APP 改性沥青面层卷材是可考虑的方案之一，维护通行也按该系统的用途安排。选型同时考虑屋面变形、旧涂层、排水口，以及是否需要配套底层卷材或水汽控制层。'],
 ]],
 ['Roof sheet membrane preparation, laps and terminations','屋面防水卷材的基层处理、搭接与收口',[
  ['We assess the existing surface, remove loose material and agree repairs, moisture conditions and drainage falls before the specified primer and membrane build-up. The installation scope identifies the layer arrangement, lap layout, upstands, outlet connections and penetration flashings. For a suitable torch-applied bituminous system, controlled heating bonds the sheet and seals its laps, with specialist hot-work and fire precautions planned for the roof construction. Inspection covers the bonded areas, lap seals and terminations before handover and ongoing maintenance.','我们先评估原屋面，清除松动材料，确认修补、含水条件及排水坡度，再施工指定底涂与卷材系统。施工范围列明层次、搭接排布、上翻、排水口衔接及穿出屋面部位的泛水节点。针对适合热熔施工的沥青卷材系统，通过受控加热完成粘结与搭接密封，并按屋面构造安排专业动火及防火措施。交付前检查粘结部位、搭接密封与收口，并说明后续维护要求。'],
  ['PVC and TPO roof sheets are separate system options, commonly using hot-air-welded seams and their own fixing and detailing requirements. Where roof construction calls for a different installation method, we assess a suitable self-adhesive, mechanically fixed or liquid-applied system. The written quote records the selected product, installation method, protection and any agreed testing.','PVC 与 TPO 屋面卷材属于另外的系统选项，通常采用热风焊接接缝，并遵循各自的固定与节点要求。屋面构造需要其他施工方式时，我们会评估适用的自粘、机械固定或液态防水系统。书面报价记录最终产品、施工方法、保护及约定的测试。'],
 ]],
];
export const roofMembraneTranslations={
 'Roof Membrane Waterproofing & Leak Repairs in Canberra':'堪培拉屋面卷材防水与渗漏维修',
 'Roof Membrane Waterproofing & Leak Repairs in Canberra | MEL ONE':'堪培拉屋面卷材防水与渗漏维修 | MEL ONE',
 'Roof Membrane Waterproofing & Leak Repairs':'屋面卷材防水与渗漏维修',
 'Roof membrane waterproofing & leak repairs':'屋面卷材防水与渗漏维修',
 'Roof membrane waterproofing and leak repairs':'屋面卷材防水与渗漏维修',
 'Roof membrane waterproofing and leak repairs in Canberra, including assessment of sheet membranes, laps, upstands and outlets. Request a MEL ONE site assessment.':'为堪培拉提供屋面卷材防水与渗漏维修，评估卷材、搭接、上翻及排水口节点。联系 MEL ONE 预约现场评估。',
 'Existing roof surface with worn coating and a drainage opening':'可见旧涂层磨损及排水口的原屋面',
 'Torch application of a roof sheet membrane at a lap':'屋面卷材搭接部位的热熔施工',
 'Lapped sheet membrane across a roof with an outlet and perimeter upstands':'带排水口及周边上翻的屋面卷材搭接实景',
 'Light-coloured roof surface with a visible lap line and upstand':'可见接缝与上翻的浅色屋面表面',
 'Existing roof surface and outlet':'原屋面表面与排水口',
 'Torch-applied sheet membrane installation':'热熔卷材铺设施工',
 'Roof sheet layout, laps and drainage detail':'屋面卷材排布、搭接与排水节点',
 'Light-coloured roof surface and upstand':'浅色屋面表面与上翻部位',
 'Roof surfaces, sheet installation and waterproofing details':'屋面表面、卷材铺设与防水节点实景',
 'These roof photographs show an existing surface, torch-applied sheet installation, lapped sheets and a light-coloured roof finish. Product types, layer arrangements and finishes are confirmed from the relevant job records and agreed specification.':'这组屋面照片展示原表面、热熔卷材施工、卷材搭接及浅色屋面饰面。具体材料类型、层次与饰面按相应工程记录和约定方案确认。',
 ...Object.fromEntries(sections.flatMap(([en,zh,ps])=>[[en,zh],...ps])),
};
const rows=[
 ['roof-existing-surface-outlet','Existing roof surface with worn coating and a drainage opening','Existing roof surface and outlet',1280,1698],
 ['roof-torch-applied-sheet-installation','Torch application of a roof sheet membrane at a lap','Torch-applied sheet membrane installation',1280,1698],
 ['roof-lapped-sheet-membrane','Lapped sheet membrane across a roof with an outlet and perimeter upstands','Roof sheet layout, laps and drainage detail',1280,1698],
 ['roof-light-surface-upstand-detail','Light-coloured roof surface with a visible lap line and upstand','Light-coloured roof surface and upstand',1280,1707],
];
const img=(i,hero=false)=>`<img src="/assets/${rows[i][0]}.jpg" alt="${rows[i][1]}" width="${rows[i][3]}" height="${rows[i][4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
export function applyRoofMembraneProject(html,file,images={}){
 html=html.replace(/(<a\b[^>]*href="\/services\/roof-waterproofing\/(?:#[^"]*)?"[^>]*>)([^<]*)(<\/a>)/g,(whole,a,text,b)=>/^(?:Roof (?:Leaks &(?:amp;)? Waterproofing|Waterproofing(?: &(?:amp;)? Leak Repairs)?|waterproofing(?: and leak repairs)?|Membrane Waterproofing &(?:amp;)? Leak Repairs))$/.test(text.trim())?a+'Roof Membrane Waterproofing &amp; Leak Repairs'+b:whole);
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,c=>c.includes('href="/services/roof-waterproofing/"')?c.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(2)):c);return applyResponsiveImages(html,images);
 }
 if(file!=='services/roof-waterproofing/index.html')return html;
 const title='Roof Membrane Waterproofing &amp; Leak Repairs in Canberra';
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title} | MEL ONE</title>`).replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${title}</h1>`);
 html=html.replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/g,`$1${title} | MEL ONE$2`);
 const description='Roof membrane waterproofing and leak repairs in Canberra, including assessment of sheet membranes, laps, upstands and outlets. Request a MEL ONE site assessment.';
 html=html.replace(/(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/g,`$1${description}$2`);
 html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*(")/g,'$1https://www.canberrawaterproof.com.au/assets/roof-lapped-sheet-membrane.jpg$2');
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(2,true)}<figcaption>Roof sheet layout, laps and drainage detail</figcaption></figure>`);
 const gallery=`<!-- roof-membrane-photos:start --><section class="roof-membrane-photo-record" aria-labelledby="roof-membrane-photo-title"><h2 id="roof-membrane-photo-title">Roof surfaces, sheet installation and waterproofing details</h2><p>These roof photographs show an existing surface, torch-applied sheet installation, lapped sheets and a light-coloured roof finish. Product types, layer arrangements and finishes are confirmed from the relevant job records and agreed specification.</p><div class="roof-membrane-photo-grid">${rows.map((r,i)=>`<figure>${img(i)}<figcaption>${r[2]}</figcaption></figure>`).join('')}</div><div class="roof-membrane-context"><span class="evidence-label">Roof junction inspection and waterproofing work</span><p>Penetrations, seams and outlets require compatible detailing within the assessed roof system.</p></div></section><!-- roof-membrane-photos:end -->`;
 const photos=/<!-- roof-membrane-photos:start -->[\s\S]*?<!-- roof-membrane-photos:end -->/;html=photos.test(html)?html.replace(photos,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const block=`<!-- roof-sheet-explanation:start --><section class="roof-sheet-explanation">${sections.map(([en,,ps])=>`<h2>${en}</h2>${ps.map(([p])=>`<p>${p}</p>`).join('')}`).join('')}</section><!-- roof-sheet-explanation:end -->`;
 const managed=/<!-- roof-sheet-explanation:start -->[\s\S]*?<!-- roof-sheet-explanation:end -->/;html=managed.test(html)?html.replace(managed,block):html.replace('<h2>Roof leaks during heavy rain</h2>',block+'<h2>Roof leaks during heavy rain</h2>');
 const css='<link rel="stylesheet" href="/assets/roof-membrane-project.css">';if(!html.includes(css))html=html.replace('</head>',css+'</head>');return applyResponsiveImages(html,images);
}
