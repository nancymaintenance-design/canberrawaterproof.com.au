import {applyResponsiveImages} from './responsive-images.mjs';
const sections=[
 ['Laundry silicone selection: mould resistance, water sealing and durability','洗衣房密封胶选用：防霉、耐水与耐老化',[
  ['For suitable laundry tub edges, tiled corners and perimeter joints, we usually consider a mould-resistant, sanitary-grade silicone sealant compatible with the adjoining surfaces. A suitable neutral-cure formulation can provide flexible adhesion to common wet-area finishes. We confirm the particular product against the tile, metal, painted surface or other substrate before specifying it.','针对适合打胶维修的洗衣槽边缘、瓷砖转角及周边接缝，通常考虑与相邻表面相容的防霉型湿区硅酮密封胶。适用的中性固化配方可与常见湿区饰面形成柔性粘结。选型前会核对具体产品与瓷砖、金属、涂装表面或其他基层的相容性。'],
  ['Mould-resistant formulations help resist fungal growth on the sealant in humid areas. Ventilation, drying and regular cleaning support that performance by limiting retained moisture and residue. We also investigate recurring dampness so the source of moisture is addressed alongside the joint repair.','防霉配方有助于抵抗潮湿环境中胶缝表面的霉菌生长。通风、干燥及定期清洁可减少积湿与污垢，帮助维持防霉性能。反复潮湿的部位也会检查水源，让接缝维修与潮湿原因一并得到处理。'],
  ['Once fully cured, a correctly prepared and bonded silicone joint provides a flexible water seal at the treated junction. Elasticity helps accommodate normal movement between adjoining finishes. For joints exposed to sunlight or outdoor conditions, we check the product’s documented UV, weathering and ageing resistance, as well as its adhesion and movement capability, to suit the exposure.','充分固化后，经适当处理并粘结良好的硅酮胶缝，可在所处理接缝处形成柔性防水密封。弹性有助于适应相邻饰面之间的正常位移。接缝受日晒或室外环境影响时，会进一步核对产品资料中的抗紫外线、耐候与耐老化性能，以及粘结和位移能力，按实际暴露条件选用。'],
 ]],
 ['Laundry joint preparation, silicone replacement and care','洗衣房防水接缝处理、旧胶更换与养护',[
  ['The agreed resealing scope identifies the joints, old sealant removal, cleaning, drying and any specified primer or backing material. We apply and tool the selected sealant to suit the joint geometry, then allow the product-specific cure before water exposure and normal use. Accessible floor-waste edges are checked while keeping the drainage opening clear. Surface resealing and renewal of the concealed floor membrane are recorded as separate tasks; plumbing leaks and damaged substrates are assessed for their own repair scope.','约定的重新密封范围会明确接缝位置、旧胶清除、清洁、干燥，以及产品要求的底涂或背衬材料。按接缝构造施工并修整所选密封胶，达到产品要求的固化条件后再接触水和恢复使用。检查可接触的地漏边缘时，保持排水口通畅。表面重新打胶与隐蔽地面防水层更新分别列项；管道漏水和基层损坏也按各自问题确认维修范围。'],
 ]],
];
export const laundrySealantTranslations={
 'Laundry Silicone Resealing & Waterproofing in Canberra':'堪培拉洗衣房打胶密封与防水',
 'Laundry Silicone Resealing & Waterproofing in Canberra | MEL ONE':'堪培拉洗衣房打胶密封与防水 | MEL ONE',
 'Laundry Silicone Resealing & Waterproofing':'洗衣房打胶密封与防水',
 'Laundry silicone resealing & waterproofing':'洗衣房打胶密封与防水',
 'Laundry silicone resealing and waterproofing':'洗衣房打胶密封与防水',
 'Laundry silicone resealing and waterproofing in Canberra. Assess tiled junctions, sealant condition and floor waterproofing with MEL ONE.':'为堪培拉提供洗衣房打胶密封与防水，检查瓷砖接缝、密封胶状况及地面防水。联系 MEL ONE 安排评估。',
 'Sealant along the junction between a tiled floor and wall skirting':'瓷砖地面与墙裙交接处的密封胶',
 'Floor waste grate beside tiled joints and a perimeter seal':'瓷砖接缝及周边胶缝旁的地漏盖',
 'Sealant bead along a laundry floor edge below a painted wall':'涂装墙面下方洗衣房地面边缘的胶缝',
 'Sealant at a tiled corner and adjoining wall junctions':'瓷砖转角及相邻墙面交接处的密封胶',
 'Tiled floor and wall junction seal':'瓷砖地面与墙面交接密封',
 'Floor waste and adjoining tile joints':'地漏与相邻瓷砖接缝',
 'Perimeter floor-edge sealant':'地面周边胶缝',
 'Corner and wall-junction sealant':'转角与墙面交接胶缝',
 'Laundry joint sealing and floor-waste details':'洗衣房接缝密封与地漏细节',
 'These close-up photographs show visible perimeter seals, tiled corners and a floor waste. The sealant product, joint preparation and suitable repair scope are confirmed during assessment.':'这组近景照片展示可见的周边胶缝、瓷砖转角及地漏。密封胶产品、接缝处理与适合的维修范围，由现场评估确认。',
 ...Object.fromEntries(sections.flatMap(([en,zh,ps])=>[[en,zh],...ps])),
};
const rows=[
 ['laundry-tiled-floor-wall-seal','Sealant along the junction between a tiled floor and wall skirting','Tiled floor and wall junction seal',1366,1024],
 ['laundry-floor-waste-junction','Floor waste grate beside tiled joints and a perimeter seal','Floor waste and adjoining tile joints',1280,1707],
 ['laundry-floor-edge-sealant','Sealant bead along a laundry floor edge below a painted wall','Perimeter floor-edge sealant',1707,1280],
 ['laundry-corner-joint-sealant','Sealant at a tiled corner and adjoining wall junctions','Corner and wall-junction sealant',960,1280],
];
const img=(i,hero=false)=>`<img src="/assets/${rows[i][0]}.jpg" alt="${rows[i][1]}" width="${rows[i][3]}" height="${rows[i][4]}" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
export function applyLaundrySealantProject(html,file,images={}){
 html=html.replace(/(<a\b[^>]*href="\/services\/laundry-waterproofing\/(?:#[^"]*)?"[^>]*>)([^<]*)(<\/a>)/g,(whole,a,text,b)=>/^(?:Laundry [Ww]aterproofing|Laundry Silicone Resealing &(?:amp;)? Waterproofing)$/.test(text.trim())?a+'Laundry Silicone Resealing &amp; Waterproofing'+b:whole);
 if(file==='services/index.html'){
  html=html.replace(/<article class="card"[^>]*>[\s\S]*?<\/article>/g,c=>c.includes('href="/services/laundry-waterproofing/"')?c.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>/,()=>img(0)):c);return applyResponsiveImages(html,images);
 }
 if(file!=='services/laundry-waterproofing/index.html')return html;
 const title='Laundry Silicone Resealing &amp; Waterproofing in Canberra';
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${title} | MEL ONE</title>`).replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${title}</h1>`);
 html=html.replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/g,`$1${title} | MEL ONE$2`);
 const description='Laundry silicone resealing and waterproofing in Canberra. Assess tiled junctions, sealant condition and floor waterproofing with MEL ONE.';
 html=html.replace(/(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*(")/g,`$1${description}$2`);
 html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*(")/g,'$1https://www.canberrawaterproof.com.au/assets/laundry-tiled-floor-wall-seal.jpg$2');
 html=html.replace(/<figure class="service-hero-image">[\s\S]*?<\/figure>/,`<figure class="service-hero-image">${img(0,true)}<figcaption>Tiled floor and wall junction seal</figcaption></figure>`);
 const gallery=`<!-- laundry-sealant-photos:start --><section class="laundry-sealant-photo-record" aria-labelledby="laundry-sealant-photo-title"><h2 id="laundry-sealant-photo-title">Laundry joint sealing and floor-waste details</h2><p>These close-up photographs show visible perimeter seals, tiled corners and a floor waste. The sealant product, joint preparation and suitable repair scope are confirmed during assessment.</p><div class="laundry-sealant-photo-grid">${rows.map((r,i)=>`<figure>${img(i)}<figcaption>${r[2]}</figcaption></figure>`).join('')}</div><div class="laundry-sealant-context"><span class="evidence-label">Laundry floor preparation and waterproofing</span><p>Floor edges, waste details and appliance access affect laundry preparation and reinstatement.</p></div></section><!-- laundry-sealant-photos:end -->`;
 const photos=/<!-- laundry-sealant-photos:start -->[\s\S]*?<!-- laundry-sealant-photos:end -->/;html=photos.test(html)?html.replace(photos,gallery):html.replace(/<figure class="detail-evidence">[\s\S]*?<\/figure>/,gallery);
 const block=`<!-- laundry-sealant-explanation:start --><section class="laundry-sealant-explanation">${sections.map(([en,,ps])=>`<h2>${en}</h2>${ps.map(([p])=>`<p>${p}</p>`).join('')}`).join('')}</section><!-- laundry-sealant-explanation:end -->`;
 const managed=/<!-- laundry-sealant-explanation:start -->[\s\S]*?<!-- laundry-sealant-explanation:end -->/;html=managed.test(html)?html.replace(managed,block):html.replace('<h2>Laundry floor moisture and plumbing leak assessment</h2>',block+'<h2>Laundry floor moisture and plumbing leak assessment</h2>');
 const css='<link rel="stylesheet" href="/assets/laundry-sealant-project.css">';if(!html.includes(css))html=html.replace('</head>',css+'</head>');return applyResponsiveImages(html,images);
}
