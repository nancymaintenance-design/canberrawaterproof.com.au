// Reviewed Canberra content. Queensland research supplies intent, not local facts.
export const headingRows = [
 ['balcony-waterproofing','Waterproofing repair and access arrangements','Balcony repair access, removal and curing','阳台维修的进场、拆除与固化安排'],
 ['external-waterproofing','Waterproofing repair and access arrangements','External leak repair access and work sequence','外部渗漏维修的进场与施工顺序'],
 ['kitchen-sealing','Waterproofing repair and access arrangements','Kitchen joint preparation and sink access','厨房接缝处理与水槽周边施工条件'],
 ['laundry-waterproofing','Waterproofing repair and access arrangements','Laundry waterproofing preparation and return to use','洗衣房防水准备与恢复使用安排'],
 ['leaking-shower-repairs','Waterproofing repair and access arrangements','Shower leak assessment, repair and bathroom access','淋浴漏水检查、维修与浴室使用安排'],
 ['retaining-wall-waterproofing','Waterproofing repair and access arrangements','Retaining wall access and waterproofing sequence','挡土墙防水的施工条件与顺序'],
 ['roof-waterproofing','Waterproofing repair and access arrangements','Roof waterproofing access, preparation and weather','屋面防水的进场、基层处理与天气条件'],
 ['shower-resealing-regrouting','Waterproofing repair and access arrangements','Shower joint preparation, curing and reuse','淋浴接缝处理、固化与恢复使用'],
 ['commercial-waterproofing','Waterproofing for all property types','Waterproofing for commercial and strata properties','商业及分契物业防水'],
 ['commercial-waterproofing','Waterproofing coverage across ACT districts','Commercial waterproofing enquiries across Canberra','Canberra 商业防水咨询范围'],
 ['tile-regrouting','Waterproofing coverage across ACT districts','Tile regrouting enquiries across Canberra','Canberra 瓷砖重新填缝咨询范围'],
];
const resources = [
 ['balcony-waterproofing','Balcony leak guides and waterproofing project photos','阳台渗漏指南与防水施工照片'],
 ['bathroom-waterproofing','Bathroom waterproofing guides and project photos','浴室防水指南与施工照片'],
 ['commercial-waterproofing','Commercial waterproofing project photos and enquiries','商业防水施工照片与咨询'],
 ['external-waterproofing','Rainwater ingress guides and waterproofing project photos','雨水渗入指南与防水施工照片'],
 ['kitchen-sealing','Kitchen sink leak guide and assessment','厨房水槽渗漏指南与检查预约'],
 ['leaking-shower-repairs','Shower leak guides and bathroom repair photos','淋浴漏水指南与浴室维修照片'],
 ['retaining-wall-waterproofing','Wall moisture guides and waterproofing project photos','墙体潮湿指南与防水施工照片'],
 ['roof-waterproofing','Roof leak guides and waterproofing project photos','屋顶漏水指南与防水施工照片'],
 ['shower-resealing-regrouting','Shower joint repair guides and project photos','淋浴接缝维修指南与施工照片'],
 ['tile-regrouting','Tile regrouting photos and repair enquiries','瓷砖重新填缝照片与维修咨询'],
];
for (const [slug,en,zh] of resources) headingRows.push([slug,'Waterproofing repair guides and project photographs',en,zh]);

// Each question is an additional decision, not a synonym page or service promise.
export const rainFaq = [
 ['rain-roof-quote','My roof leaks only in wind-driven rain. What should the quote cover?','屋顶只在风雨交加时漏水，报价应说明什么？',
 'Record the affected room, wind direction if known, when the drip starts and whether it continues after rain. We use these details to plan an assessment of accessible roof waterproofing and junctions. The quote should distinguish the inspection from the repair, name the area and preparation included, and explain access and weather conditions. Roof-covering, plumbing or drainage work needs its own confirmed scope; the position of an indoor stain alone does not prove a membrane defect.',
 '请记录受影响的房间、已知的风向、开始滴水的时间，以及雨停后是否继续。我们会据此安排对可检查的屋面防水及连接部位进行评估。报价应区分检查与维修，列明施工部位、基层处理、进场要求及天气条件。屋面覆盖材料、管道或排水工程需另行确认范围；室内水渍的位置本身不能证明防水层有缺陷。'],
 ['rain-balcony-drainage','The balcony still leaks after the outlet is cleared. Does it need a new membrane?','阳台排水口清理后仍漏水，是否需要更换防水层？',
 'Clearing an outlet addresses one possible restriction, but does not establish the condition of the falls, thresholds, joints or concealed membrane. Note where water pools, how long it remains and where damp appears below. We assess the accessible details before comparing a local joint repair with opening the tiled area for membrane work. The written scope should explain any removal, preparation and retiling included. Keep photos of earlier repairs with your enquiry.',
 '清理排水口只能处理一种可能的排水受阻情况，无法据此判断排水坡度、门槛、接缝或隐蔽防水层的状况。请记录积水位置、持续时间及下方出现潮湿的部位。我们会先检查可见构造，再比较局部接缝维修与拆开瓷砖进行防水层维修的方案。书面范围应列明是否包含拆除、基层处理和重新铺砖。咨询时也可提供以往维修的照片。'],
 ['rain-window-entry','Rain comes in around a window only when it is windy. Is resealing enough?','窗边只在刮风下雨时进水，重新密封就够了吗？',
 'Resealing may suit an identified failed joint, but the window perimeter, wall junctions and drainage paths need to be considered together. Record which side becomes wet and whether the mark starts above, beside or below the frame. We assess the external waterproofing details within the agreed access; window replacement or other building work is a separate scope. Avoid covering drainage openings or adding another sealant layer before the entry path is understood.',
 '如果已确认某处接缝失效，重新密封可能适用；但仍需结合窗周、墙体连接及排水路径判断。请记录哪一侧先受潮，以及水渍是从窗框上方、侧边还是下方出现。我们在约定的进场条件下评估外部防水细节；更换窗户或其他建筑工程属于另行确认的范围。未查清进水路径前，不要堵住排水开口或直接再加一层密封胶。'],
 ['rain-musty-room','A room smells musty after rain. How should I describe the moisture problem?','雨后房间有霉味，应如何描述潮湿问题？',
 'Tell us when the smell appears, which room is affected, whether it follows rain or shower use, and any previous leak repairs. A dry-looking surface or an odour alone cannot identify the moisture source or a mould type. Our waterproofing enquiry can address suspected water-entry details; moisture testing, mould treatment and specialist carpet or structural drying need separately confirmed services. Describe any staining around windows, walls or ceilings without opening concealed areas yourself.',
 '请说明气味出现的时间、受影响的房间、是否在下雨或淋浴后出现，以及以往的漏水维修。仅凭表面看似干燥或存在气味，无法判断湿气来源或霉菌类型。我们的防水咨询可针对疑似进水构造；湿度检测、除霉、地毯或结构专业干燥服务需另行确认。可描述窗边、墙面或天花板的水渍，不要自行拆开隐蔽部位。'],
 ['rain-ceiling-stain','The roof leak has been repaired. Can I paint over the ceiling stain now?','屋顶漏点修好后，可以直接覆盖天花板水渍吗？',
 'Arrange confirmation that the water source has been addressed and the affected materials are ready for the proposed finish before cosmetic repairs. A remaining stain does not show whether the ceiling cavity is dry or the material is sound. Keep the leak findings and repair records for whoever assesses the ceiling. Plasterboard replacement, drying and painting are separate from a waterproofing repair unless expressly included. Keep clear of sagging ceilings and wet electrical fittings.',
 '进行表面修补前，应确认进水源已处理，受影响材料也已达到相应饰面施工条件。残留水渍本身无法说明天花板内部是否干燥、材料是否完好。请保留漏水检查及维修记录，交给后续评估天花板的人员。除非明确列入报价，石膏板更换、干燥和油漆不属于防水维修范围。请远离下垂的天花板及受潮电气配件。'],
 ['rain-retaining-wall','A retaining wall is damp and leaning after rain. Will waterproofing fix it?','挡土墙雨后潮湿并倾斜，做防水能解决吗？',
 'Waterproofing treats a water-entry detail; it does not establish or restore a leaning wall’s structural stability. Report movement, cracking and pooling when you enquire and arrange the appropriate structural assessment before agreeing to a waterproofing-only repair. Any quote needs to distinguish wall access, waterproofing, drainage work and structural work. We confirm the waterproofing scope after the relevant conditions and access are understood; do not excavate beside or lean against an unstable wall.',
 '防水针对的是进水构造，不能据此判断或恢复倾斜墙体的结构稳定性。咨询时请说明位移、裂缝及积水情况，在确定仅做防水的维修方案前安排相应的结构评估。报价应区分墙体施工条件、防水、排水工程和结构工程。我们在了解相关状况及进场条件后确认防水范围；不要在不稳定的墙边自行开挖或倚靠墙体。'],
];

export const newsSections = {
 'preparing-for-wet-weather': [
  ['Leaks that appear only in wind-driven rain','只在风雨交加时出现的渗漏',
   'An intermittent leak still needs a clear record. Note when rain starts, which direction it reaches the building from if known, and when the indoor mark or drip appears. A roof-to-wall junction, window perimeter and balcony threshold present different inspection questions. We use the reported pattern to plan the accessible waterproofing assessment, rather than assuming the stain sits directly below the entry point. Share previous repair records as well as current photographs.',
   '间歇性渗漏也需要清晰记录。请记下开始下雨的时间、已知的迎雨方向，以及室内出现水渍或滴水的时间。屋面与墙体交接处、窗周和阳台门槛需要考虑的检查问题各不相同。我们会依据这些规律安排可进行的防水检查，不会仅凭水渍位置就认定进水点在正上方。咨询时也请提供以往维修记录和当前照片。'],
  ['Balcony ponding after the outlet is cleared','阳台排水口清理后仍有积水',
   'If water still collects or appears in the room below, record the ponding position and how long it remains. An outlet, the falls towards it, tiled joints and the concealed membrane are separate details. Clearing an outlet does not by itself establish which repair is needed. Compare the existing balcony leak guide with the inspection findings before choosing local sealing or a scope that opens the tiled area for membrane replacement and reinstatement.',
   '如果阳台仍积水或楼下房间出现潮湿，请记录积水位置与持续时间。排水口、通向排水口的坡度、瓷砖接缝和隐蔽防水层是不同的构造。仅清理排水口，无法判断下一步该如何维修。可结合本站阳台漏水指南与现场检查结果，再比较局部密封和拆开瓷砖更换防水层、恢复饰面的方案。'],
  ['Lingering dampness and the next repair trade','持续潮湿与后续维修工种',
   'A surface that looks dry is not proof that the layers behind it are ready for painting or reinstatement. Record recurring odours, stains and any change after rain for the assessment. Waterproofing, specialist drying, mould treatment and ceiling repairs are different scopes. Confirm who will check the affected materials and arrange any separate work before covering the damage. Our existing FAQ explains rain-related symptoms and the limits of surface repairs.',
   '表面看起来干燥，并不代表其背后的材料已经适合油漆或恢复饰面。请记录反复出现的气味、水渍及雨后的变化，供评估参考。防水、专业干燥、除霉和天花板维修是不同的施工范围。覆盖受损部位之前，应确认由谁检查材料状况及安排其他工程。本站 FAQ 也说明了雨后渗漏症状与表面维修的局限。'],
 ],
 'understanding-repair-scopes': [
  ['Comparing quotes for a leak that follows rain','比较雨后渗漏维修报价',
   'Ask whether the price covers an inspection, a defined repair, or both. Compare the affected area, safe access, removal, preparation, selected waterproofing system, reinstatement and any return visit actually included. A proposal to reseal an accessible joint differs from removing tiles to repair a balcony membrane. If the entry point remains concealed, the quote should explain the investigation allowed for and how further findings or changes will be approved before extra work.',
   '请先确认价格涵盖检查、已确定的维修，还是两者都有。比较受影响部位、安全进场、拆除、基层处理、所选防水系统、饰面恢复及实际包含的回访。重新密封可见接缝，与拆除瓷砖维修阳台防水层，是不同的方案。如果进水点仍在隐蔽部位，报价应说明已计入哪些排查，以及进一步发现问题或调整范围时，如何在追加施工前取得同意。'],
  ['Keep leak records separate from insurance decisions','区分漏水维修记录与保险决定',
   'Keep dated photographs taken safely, the location and timing of the leak, previous maintenance records, the inspection findings and the agreed repair scope together. These records help explain what was observed and repaired. Ask your insurer what information it requires and whether any work needs prior approval. A waterproofing quote is not a decision about the cause of an insured event, policy coverage or payment; do not delay urgent safety assistance to collect documents.',
   '请将安全拍摄并注明日期的照片、漏水位置及时间、以往维护记录、检查结果和约定维修范围一并保存，便于说明发现的问题及已完成的维修。请向保险公司确认所需资料，以及相关工程是否需事先同意。防水报价不等于对保险事故成因、承保范围或赔付的认定；不要为了收集文件而延误紧急安全协助。'],
 ],
};
export const rainTranslations = Object.fromEntries([
 ['Read the balcony leak guide','阅读阳台漏水指南'],
 ['Rainwater entry questions','雨水渗入问题解答'],
 ['Rain-related leak quote questions','雨后渗漏报价问题解答'],
 ...headingRows.map(([, ,en,zh])=>[en,zh]),
 ...rainFaq.flatMap(([,q,zq,a,za])=>[[q,zq],[a,za]]),
 ...Object.values(newsSections).flat().flatMap(([h,zh,p,zp])=>[[h,zh],[p,zp]]),
 ['24 waterproofing questions','24 个防水问题'],['24 questions','24 个问题'],
]);
