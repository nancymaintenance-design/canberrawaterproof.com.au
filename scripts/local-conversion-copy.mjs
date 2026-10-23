// Local-only 23 October candidate. Keep existing service identities and enquiry payload.
const rows=[
 ['leaking-shower-repairs',
 'Canberra shower leak repairs for wet carpet, damp walls and water escaping the screen. Assess the source before choosing sealing or membrane work.',
 '为堪培拉淋浴间外地毯潮湿、墙体受潮及淋浴屏外渗水提供漏水评估与维修，先查水源，再确定接缝或防水层处理。',
 'Tell us whether water appears during showering or afterwards and which adjoining surface gets wet. The assessment establishes the likely water path and whether the quote should cover surface joints, opening up finishes or a wider membrane repair.',
 '请说明水是在淋浴时还是使用后出现，以及哪个相邻表面受潮。现场评估会查明可能的水路，再确定报价应包括表面接缝维修、拆检饰面，还是更大范围的防水层处理。'],
 ['bathroom-waterproofing',
 'Bathroom waterproofing and retiling in Canberra. Agree removal, substrate repairs, membrane work, finishes and bathroom downtime before work begins.',
 '堪培拉浴室防水与重新铺砖，开工前明确拆除、基层修补、防水层、饰面及浴室停用安排。',
 'Tell us whether you need a shower-only repair or a wider bathroom renewal, which finishes you hope to keep and whether this is your only bathroom. We confirm the assessed work, inclusions and return-to-use sequence in the written quote and work plan.',
 '请说明需要只修淋浴间还是更新较大范围的浴室、希望保留哪些饰面，以及这是否是家中唯一浴室。我们会在书面报价及施工计划中确认评估后的工作、包含项目和恢复使用顺序。'],
 ['shower-resealing-regrouting',
 'Shower silicone replacement and regrouting in Canberra. Check failed surface joints and distinguish them from concealed waterproofing or plumbing faults.',
 '堪培拉淋浴间旧胶更换与重新填缝，检查表面接缝，并区分隐蔽防水或管道问题。',
 'Describe the split silicone, missing grout or water escaping near the screen, including any previous resealing. We establish which surface joints are suitable for repair and explain any evidence that calls for further leak or membrane assessment.',
 '请说明硅胶开裂、填缝缺失或屏风附近外渗的情况，以及此前是否重新打过胶。我们会确定哪些表面接缝适合维修，并说明哪些现象需要继续排查水源或防水层。'],
 ['balcony-waterproofing',
 'Canberra balcony waterproofing for rainwater entry, ponding and damp rooms below. Assess falls, outlets, thresholds and membrane repair options.',
 '针对雨水渗入、积水和楼下房间受潮，提供堪培拉阳台防水评估，检查坡度、排水口、门槛与防水层维修方案。',
 'Tell us whether the leak follows rain, where water collects and whether a room below is affected. Include strata access requirements if relevant. We distinguish local junction repairs from broader membrane renewal and identify separate drainage or structural work in the scope.',
 '请说明漏水是否随下雨出现、哪里积水、楼下房间是否受影响；分层产权物业也请说明进场要求。我们会区分局部节点维修与较大范围防水层更新，并在范围中列明另需的排水或结构工程。'],
 ['kitchen-sealing',
 'Kitchen silicone replacement in Canberra for sink edges, benchtops and splashbacks. Identify a joint leak before agreeing caulking or separate plumbing work.',
 '为堪培拉厨房水槽边缘、台面与防溅板提供旧胶更换，先区分接缝渗水与另需处理的管道问题。',
 'Tell us where the cupboard first gets wet and whether this follows splashing, tap use or appliance use. The assessment separates suitable sink-edge or splashback resealing from plumbing faults and any cabinet restoration needed.',
 '请说明柜体最先在哪里受潮，以及是否发生在台面溅水、开水龙头或使用家电之后。现场评估会将适合的水槽边缘或防溅板打胶，与管道故障及所需柜体恢复分别说明。'],
 ['laundry-waterproofing',
 'Laundry silicone resealing and floor waterproofing in Canberra. Separate joint repairs, membrane renewal and appliance or plumbing leaks before quoting.',
 '堪培拉洗衣房打胶密封与地面防水，报价前区分接缝维修、防水层更新，以及家电或管道漏水。',
 'Tell us whether water appears while the washing machine runs, near the tub or along a tiled edge. For planned renovations, describe the floor finish and appliance access. We set out joint sealing, membrane work and any separate connection tasks before you arrange the next stage.',
 '请说明水是在洗衣机运行时、洗衣槽附近还是瓷砖边缘出现。计划翻新时，请说明地面饰面及家电进出条件。我们会先明确接缝密封、防水层和另需的连接工作，再安排后续工序。'],
 ['roof-waterproofing',
 'Roof membrane waterproofing and leak repairs in Canberra. Assess rainfall patterns, seams, outlets and penetrations with safe access and a written scope.',
 '堪培拉屋面卷材防水与渗漏维修，结合降雨现象、安全进场及接缝、排水口和穿管检查，确认书面施工范围。',
 'Describe the rain conditions, affected room and any earlier roof repair. Ground-level observations are enough to start the enquiry. We arrange safe inspection and clarify membrane details, access equipment and any separate roofing or drainage work in the quote.',
 '请说明下雨情况、受影响房间及既往屋面维修。初次咨询提供地面可见现象即可。我们会安排安全检查，并在报价中明确防水层节点、进场设备及另需的屋面或排水工作。'],
 ['retaining-wall-waterproofing',
 'Retaining wall waterproofing in Canberra for damp walls and adjoining garage water entry. Review access, drainage and treatment side before choosing a system.',
 '为墙体受潮及相邻车库进水提供堪培拉挡土墙防水评估，选材前检查施工通道、排水及处理侧。',
 'Tell us where water appears after rain and what is beside or behind the wall. We assess the accessible construction and drainage, then explain the treatment side, preparation and any specialist excavation or structural input needed for the proposed repair.',
 '请说明雨后哪里进水，以及墙旁和墙后是什么区域。我们会评估可检查的构造与排水，再说明拟定维修的处理侧、基层准备，以及是否需要专业开挖或结构意见。'],
 ['external-waterproofing',
 'External water ingress repairs in Canberra for walls, windows and thresholds. Investigate rainwater routes and separate sealing, drainage and building repairs.',
 '针对墙面、窗边及门槛进水提供堪培拉室外防水维修，排查雨水路径，并区分接缝密封、排水与建筑修复。',
 'Describe the rain direction, first wet point and whether nearby paving or gutters overflow. We compare the accessible wall, opening and ground details before defining the waterproofing repair and any separate drainage or building work.',
 '请说明来雨方向、最先受潮的位置，以及附近铺装或天沟是否溢水。我们会结合可检查的墙体、门窗和地面节点，明确防水维修及另需的排水或建筑工作。'],
 ['tile-regrouting',
 'Tile regrouting in Canberra for worn or missing grout. Compare cement-based and epoxy grout with flexible joint repairs after checking the tiled surface.',
 '为堪培拉磨损或缺失的瓷砖填缝提供重新填缝服务，检查表面后比较水泥基、环氧填缝与柔性接缝维修。',
 'Tell us which tiled area is affected, whether tiles are loose and whether water is escaping beyond it. We confirm whether grout renewal is suitable, discuss the joint material and identify any investigation needed before treating the finish.',
 '请说明哪一处瓷砖受影响、瓷砖是否松动，以及水是否向区域外渗出。我们会确认是否适合重新填缝、讨论接缝材料，并说明处理饰面前是否需要进一步检查。'],
 ['commercial-waterproofing',
 'Commercial and strata waterproofing in Canberra. Plan the affected area, tenant access, work stages and separate trade responsibilities in a written scope.',
 '堪培拉商业及分层产权物业防水，在书面范围中明确问题区域、租户进场、施工阶段和相关工种责任。',
 'Include the property use, affected area, access restrictions and your role as owner, manager or strata representative. We identify the waterproofing work, tenant impacts and related trade requirements so the written scope can support your approval process.',
 '请提供物业用途、问题区域、进场限制，以及您是业主、经理还是分层产权代表。我们会明确防水工作、对租户的影响和相关工种要求，便于以书面范围进行审批。'],
];
const homeIntro=['We repair leaking showers and waterproof bathrooms, balconies and other wet areas across Canberra. Tell us your suburb and where water appears; our team assesses the site and confirms the repair scope and written quote.','我们为堪培拉提供淋浴间漏水维修，以及浴室、阳台和其他湿区防水。请告诉我们所在区域和进水位置；团队会现场评估，再确认维修范围及书面报价。'];
const helper=['Describe where water appears, when it started and how soon you need help. For urgent repair assistance, call 0482 422 607. Visit timing is confirmed with our team.','请说明进水位置、开始时间及希望何时处理。需要紧急维修协助时，请致电 0482 422 607；到访时间由团队与您确认。'];
const choices=[
 ['leaking-shower-repairs','Water reaching carpet or walls after showers','淋浴后地毯或墙面受潮'],
 ['bathroom-waterproofing','Bathroom renovation or membrane renewal','浴室翻新或防水层更新'],
 ['balcony-waterproofing','Balcony ponding or a damp room below','阳台积水或楼下房间受潮'],
 ['kitchen-sealing','Water in the cupboard beneath a kitchen sink','厨房水槽下柜体进水'],
 ['roof-waterproofing','Roof or ceiling leaks during rain','雨天屋面或天花板漏水'],
 ['retaining-wall-waterproofing','Damp retaining wall or adjoining garage','挡土墙或相邻车库受潮'],
];
const labels=[
 ['Choose a waterproofing service by the problem','按问题选择防水服务'],
 ['Waterproofing problem navigation','按防水问题导航'],
 ['Choose the closest match below, then compare the full service scope. If you are unsure of the source, describe the visible problem in your enquiry.','先按接近的现象进入服务页，再核对完整范围。不确定水源时，在咨询中描述可见问题即可。'],
 ['Canberra Waterproofing & Leak Repairs | MEL ONE','堪培拉防水与漏水维修 | MEL ONE'],
 ['Request a Waterproofing Assessment in Canberra | MEL ONE','预约堪培拉防水现场评估 | MEL ONE'],
 ['Describe your Canberra waterproofing problem, suburb and preferred timing. MEL ONE will contact you about assessment and a written repair scope.','请说明堪培拉物业的防水问题、所在区域和希望处理的时间。MEL ONE 会联系您讨论现场评估及书面维修范围。'],
 ['Compare eleven Canberra waterproofing and leak repair services by the affected area, repair scope and next assessment step.','按问题部位、维修范围及后续评估步骤，比较堪培拉十一项防水与渗漏维修服务。'],
];
export const conversionTranslations=Object.fromEntries([...labels,homeIntro,helper,...choices.map(([,en,zh])=>[en,zh]),...rows.flatMap(([,en,zh,p,zp])=>[[en,zh],[p,zp]])]);
export const conversionServiceRows=rows;
const meta=(html,key,value)=>html.replace(new RegExp(`(<meta\\b[^>]*(?:name|property)="${key}"[^>]*content=")[^"]*(")`,'g'),(_,open,close)=>open+value.replaceAll('&','&amp;')+close);
export function applyLocalConversionCopy(html,file){
 if(file==='index.html'){
  html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>Canberra Waterproofing &amp; Leak Repairs | MEL ONE</title>');
  html=meta(html,'og:title',labels[3][0]);
  html=html.replace(/(<p class="home-hero-lede">)[\s\S]*?(<\/p>)/,()=>`<p class="home-hero-lede">${homeIntro[0]}</p>`);
 }
 if(file==='services/index.html'){
  html=meta(meta(html,'description',labels[6][0]),'og:description',labels[6][0]);
  const block=`<!-- conversion-problem-nav:start --><nav class="customer-paths wrap" aria-label="Waterproofing problem navigation"><h2>Choose a waterproofing service by the problem</h2><p>${labels[2][0]}</p><ul>${choices.map(([slug,label])=>`<li><a href="/services/${slug}/">${label}</a></li>`).join('')}</ul></nav><!-- conversion-problem-nav:end -->`;
  const managed=/<!-- conversion-problem-nav:start -->[\s\S]*?<!-- conversion-problem-nav:end -->/;
  html=managed.test(html)?html.replace(managed,block):html.replace(/<section class="section wrap" data-service-directory>/,block+'<section class="section wrap" data-service-directory>');
 }
 const row=rows.find(([slug])=>file===`services/${slug}/index.html`);
 if(row){
  html=meta(meta(html,'description',row[1]),'og:description',row[1]);
  const note=`<p class="service-enquiry-plan">${row[3]}</p>`;
  if(/<p class="service-enquiry-plan">/.test(html))html=html.replace(/<p class="service-enquiry-plan">[\s\S]*?<\/p>/,note);
  else html=html.replace(/(<section class="service-booking"[^>]*>[\s\S]*?<h2>[^<]*<\/h2>)/,'$1'+note);
 }
 if(file==='contact/index.html'){
  html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>Request a Waterproofing Assessment in Canberra | MEL ONE</title>');html=meta(meta(meta(html,'og:title',labels[4][0]),'description',labels[5][0]),'og:description',labels[5][0]);
  html=html.replace(/(<textarea\b[^>]*name="message"[^>]*)(>)/,(whole,tag,end)=>tag.replace(/aria-describedby="[^"]*"/,'aria-describedby="service-message-error service-message-help"')+end);
  const hint=`<p id="service-message-help">${helper[0]}</p>`;
  html=html.includes('id="service-message-help"')?html.replace(/<p id="service-message-help">[\s\S]*?<\/p>/,hint):html.replace(/(<textarea\b[^>]*name="message"[^>]*>[\s\S]*?<\/textarea>)/,'$1'+hint);
 }
 return html;
}
