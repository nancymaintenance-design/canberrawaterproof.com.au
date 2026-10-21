import catalog from './local-waterproofing-services.json' with {type:'json'};
// Explicit existing locality-card templates; not a global brand substitution.
const cards=[
 ['MEL ONE assesses shower bases, screens, tiled wall-floor junctions and visible water escape points before planning leaking shower repairs for {area} properties.','We inspect shower bases, screens, tiled wall-floor junctions to plan leaking shower repairs for your property.','我们检查淋浴底部、屏风和瓷砖接缝，确定适合您物业的淋浴间漏水维修方案。'],
 ['MEL ONE plans bathroom waterproofing for {area} bathrooms, ensuites and wet areas, with the affected surface and repair scope clearly identified.','We provide bathroom waterproofing for bathrooms, ensuites and wet areas, with the surfaces and repair scope clearly identified.','我们为浴室、套间卫浴及其他湿区提供防水服务，并明确处理的表面和维修范围。'],
 ['MEL ONE checks grout, silicone, shower-screen edges and tiled joints before planning shower resealing and regrouting for {area} properties.','We check grout, silicone, shower-screen edges and tiled joints, then define the joints to include in your shower resealing and regrouting work.','我们检查填缝剂、密封胶及屏风边缘，再明确淋浴间重新密封与填缝需要处理的接缝。'],
 ['MEL ONE assesses balcony thresholds, drainage points, tiled surfaces and exposed junctions before planning balcony waterproofing for {area} properties.','We inspect balcony thresholds, drainage points, tiled surfaces and exposed junctions before planning the waterproofing repair.','我们检查阳台门槛、排水点、瓷砖表面和外露接缝，再制定防水维修方案。'],
 ['MEL ONE checks sink edges, splashbacks, benchtop junctions and cabinet-adjacent moisture before planning kitchen sealing for {area} properties.','We check sink edges, splashbacks, benchtop junctions and nearby moisture before confirming your kitchen sealing work.','我们检查水槽边缘、防溅板、台面接缝及附近潮湿情况，再确认厨房密封维修内容。'],
 ['MEL ONE checks external wall junctions, window edges, roofline details and weather-related water-entry points before planning external waterproofing for {area} properties.','We inspect external wall junctions, window edges, roofline details and rainwater entry points before planning external waterproofing.','我们检查外墙接缝、窗边、屋面连接及雨水进入部位，再制定外部防水方案。'],
];
export const localityCopy=catalog.localities.flatMap(item=>[
 ...cards.map(([before,en,zh])=>[before.replace('{area}',item.locality),en,zh,'A']),
 [`MEL ONE brings more than 10 years of waterproofing industry experience to ${item.locality}. Our standardised repair team checks the affected area, confirms the repair service required and prepares a practical plan before work begins.`,
  `Our team brings more than 10 years of waterproofing experience to ${item.locality}. We inspect the affected area and explain the repair plan before work begins, so you know which work your property needs.`,
  `我们的团队为 ${item.locality} 提供拥有10年以上经验的防水服务。施工前，我们检查受影响部位并说明维修方案，让您清楚了解物业需要进行的工作。`,'A'],
]);
