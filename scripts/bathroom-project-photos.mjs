// User-supplied photographs replace only the bathroom page's three lower figures.
export const bathroomPhotoTranslations = {
 'Shower base and junctions':'淋浴底盘与接缝细节',
 'The photograph shows the shower base, drain and the junctions with the tiled walls and screen.':'照片展示淋浴底盘、地漏，以及底盘与瓷砖墙面和淋浴屏之间的接缝。',
 'Shower base, drain and tiled wall junctions':'淋浴底盘、地漏及瓷砖墙面接缝',
 'Close view of the shower base and drain beside tiled walls':'瓷砖墙面旁的淋浴底盘与地漏近景',
 'Shower base, threshold and screen viewed from above':'从上方查看淋浴底盘、门槛及淋浴屏',
 'Shower enclosure overview':'淋浴间整体实景',
 'Shower enclosure with tiled walls, screen and shower base':'带瓷砖墙面、淋浴屏和底盘的淋浴间',
 'This wider view shows the shower screen, tiled walls and base. We assess these details when defining the repair scope.':'这张整体照片展示淋浴屏、瓷砖墙面和底盘。我们会在确定维修范围时检查这些部位。',
 'These shower photographs show the base, drain, wall junctions and shower screen from several angles. The repair scope, materials and any concealed waterproofing work are confirmed by an on-site assessment.':'这组淋浴间照片从不同角度展示底盘、地漏、墙面接缝和淋浴屏。具体维修范围、材料选用及隐蔽防水层的处理方式，由现场评估后确认。',
};
const image=(name,alt,width,height,extra='')=>`<img src="/assets/${name}.jpg" alt="${alt}" loading="lazy" width="${width}" height="${height}"${extra}>`;
const first=`<figure class="detail-evidence">${image('bathroom-shower-base-junctions','Shower base, drain and tiled wall junctions',1706,1280)}<figcaption><span class="evidence-label">Shower base and junctions</span><p>The photograph shows the shower base, drain and the junctions with the tiled walls and screen.</p></figcaption></figure>`;
const pair=`<figure class="two">${image('bathroom-shower-base-close-view','Close view of the shower base and drain beside tiled walls',1280,1706)}${image('bathroom-shower-threshold-view','Shower base, threshold and screen viewed from above',1280,1706)}</figure>`;
const last=`<figure class="detail-evidence">${image('bathroom-shower-enclosure-overview','Shower enclosure with tiled walls, screen and shower base',1280,1706,' style="object-fit:contain"')}<figcaption><span class="evidence-label">Shower enclosure overview</span><p>This wider view shows the shower screen, tiled walls and base. We assess these details when defining the repair scope.</p></figcaption></figure>`;
export function applyBathroomProjectPhotos(html,path){
 if(path!=='services/bathroom-waterproofing/index.html')return html;
 const replacements=[['/assets/bathroom-membrane-application.png',first],['/assets/case-canberra-bathroom.jpg',pair],['/assets/bathroom-finished-wide.png',last]];
 html=html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/g,figure=>replacements.find(([src])=>figure.includes(`src="${src}"`))?.[1]??figure);
 return html.replace('These bathroom work images show preparation, membrane application and tiled finishes. The separate photographs in the project hub are not presented as a same-job before-and-after record. They illustrate visible work, while the cause, removal and reinstatement needed at your property require an on-site assessment.','These shower photographs show the base, drain, wall junctions and shower screen from several angles. The repair scope, materials and any concealed waterproofing work are confirmed by an on-site assessment.');
}
