// Internal editorial relationships, reviewed against actual bilingual page bodies.
// No URL, canonical, service identity or commercial query ownership is migrated.
export const services=[
 ['leaking-shower-repairs','Leaking shower repairs','淋浴漏水维修'],
 ['bathroom-waterproofing','Bathroom waterproofing & retiling','浴室防水与重新铺砖'],
 ['shower-resealing-regrouting','Shower resealing & regrouting','淋浴重新密封与填缝'],
 ['balcony-waterproofing','Balcony waterproofing & leak repairs','阳台防水与漏水维修'],
 ['kitchen-sealing','Kitchen sealing & resealing','厨房打胶与重新密封'],
 ['external-waterproofing','External waterproofing & water ingress repairs','外部防水与渗水维修'],
 ['laundry-waterproofing','Laundry waterproofing','洗衣房防水'],
 ['roof-waterproofing','Roof waterproofing & leak repairs','屋顶防水与漏水维修'],
 ['retaining-wall-waterproofing','Retaining wall waterproofing','挡土墙防水'],
 ['tile-regrouting','Tile regrouting','瓷砖重新填缝'],
 ['commercial-waterproofing','Commercial waterproofing','商业防水']
];
export const servicePath=id=>'/services/'+id+'/';
export const entries=[
 {path:'/',type:'home',labels:['Home','首页'],parent:null,owner:'/',reason:'Existing homepage retains the city-wide waterproofing role.'},
 ...services.map(([id,en,zh])=>({path:servicePath(id),type:'service',labels:[en,zh],parent:'/',owner:servicePath(id),group:id,reason:'Existing service page and service catalogue; actual service scope verified, not a new query page.'})),
 {path:'/services/',type:'collection',labels:['Waterproofing services','防水服务'],parent:'/',owner:'/',reason:'Existing useful service catalogue.'},
 {path:'/service-areas/',type:'collection',labels:['Service areas','服务区域'],parent:'/',owner:'/',reason:'Existing ACT service coverage directory.'},
 {path:'/about/',type:'company',labels:['About our team','关于我们'],parent:'/',owner:'/',reason:'Existing company information, not a service substitute.'},
 {path:'/contact/',type:'contact',labels:['Contact & assessment','联系与现场评估'],parent:'/',owner:'/',reason:'Existing enquiry form and phone route.'},
 {path:'/faq/',type:'company',labels:['Waterproofing FAQs','防水常见问题'],parent:'/',owner:'/',reason:'Multiple service topics retain the general navigation.'},
 {path:'/privacy-policy/',type:'legal',labels:['Privacy policy','隐私政策'],parent:'/',owner:'/',reason:'Existing public privacy information.'},
 {path:'/guides/',type:'collection',labels:['Waterproofing guides','防水指南'],parent:'/',owner:'/',reason:'Existing multi-service editorial directory.'},
 {path:'/case-studies/',type:'cases',labels:['Waterproofing projects','防水施工案例'],parent:'/',owner:'/',related:['bathroom-waterproofing','balcony-waterproofing','roof-waterproofing','tile-regrouting','commercial-waterproofing'],reason:'Collection includes several services, not a single-service child.'},
 {path:'/industry-news/',type:'collection',labels:['Waterproofing news','防水资讯'],parent:'/',owner:'/',reason:'Existing general news directory.'},
 ...[
  ['shower-plumbing-or-waterproofing','Shower leak assessment guide','淋浴漏水排查指南','leaking-shower-repairs'],
  ['regrouting-resealing-or-rewaterproofing','Shower grout, sealant & membrane guide','淋浴填缝、密封与防水层指南','shower-resealing-regrouting'],
  ['waterproofing-retiling-quote','Bathroom waterproofing quote guide','浴室防水与铺砖报价指南','bathroom-waterproofing'],
  ['balcony-leaking-room-below','Balcony leaks into the room below','阳台向楼下房间渗漏','balcony-waterproofing'],
  ['kitchen-sink-resealing-or-plumbing','Kitchen sink leak assessment guide','厨房水槽漏水排查指南','kitchen-sealing']
 ].map(([slug,en,zh,id])=>({path:'/guides/'+slug+'/',type:'guide',labels:[en,zh],parent:servicePath(id),owner:servicePath(id),group:id,reason:'The actual article explains this service problem; the service receives a reciprocal guide link.'})),
 {path:'/guides/waterproofing-or-drainage/',type:'guide',labels:['External water ingress & drainage guide','外部渗水与排水指南'],parent:'/guides/',owner:'/',related:['external-waterproofing','retaining-wall-waterproofing'],reason:'Article addresses drainage, walls and external joints; keep multi-service guide directory and link the relevant services separately.'},
 ...[
  ['preparing-for-wet-weather','Wet weather preparation','雨季防水准备'],
  ['understanding-repair-scopes','Waterproofing repair scopes','防水维修范围'],
  ['what-to-photograph-before-a-quote','Photos for a waterproofing assessment','防水评估照片准备']
 ].map(([slug,en,zh])=>({path:'/industry-news/'+slug+'/',type:'news',labels:[en,zh],parent:'/industry-news/',owner:'/',related:slug==='preparing-for-wet-weather'?['roof-waterproofing','external-waterproofing']:[],reason:'Multi-service article retains real news directory, without forcing a single-service parent.'})),
 ...[
  ['belconnen','Belconnen','Belconnen 区','bathroom-waterproofing'],
  ['gungahlin','Gungahlin','Gungahlin 区','bathroom-waterproofing'],
  ['inner-north-city','Inner North & City','内北区与市中心',null],
  ['inner-south','Inner South','内南区',null],
  ['woden-valley','Woden Valley','Woden Valley 区','bathroom-waterproofing'],
  ['tuggeranong','Tuggeranong','Tuggeranong 区','leaking-shower-repairs'],
  ['weston-creek-molonglo','Weston Creek & Molonglo','Weston Creek 与 Molonglo','external-waterproofing'],
  ['east-canberra','East Canberra','东堪培拉','external-waterproofing'],
  ['act-localities','Other ACT localities','其他 ACT 地区',null]
 ].map(([slug,en,zh,id])=>({path:'/waterproofing/'+slug+'/',type:'location',labels:[en,zh],parent:'/service-areas/',owner:id?servicePath(id):'/',group:id||'general-waterproofing',related:id?[id]:['leaking-shower-repairs','bathroom-waterproofing','balcony-waterproofing'],reason:'District body covers multiple repair types; retain service-area directory parent. Service support follows its actual opening scope.'}))
];
export const caseAnchors={'bathroom-waterproofing':'application-stage','balcony-waterproofing':'balcony-stages','roof-waterproofing':'isaacs-roof','tile-regrouting':'tile-joints','commercial-waterproofing':'commercial-roof'};
