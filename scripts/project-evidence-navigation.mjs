const contexts={
 'services/bathroom-waterproofing/index.html':['bathroom-work','Bathroom membrane and tiled-finish photographs'],
 'services/leaking-shower-repairs/index.html':['bathroom-work','Bathroom membrane and tiled-finish photographs'],
 'services/shower-resealing-regrouting/index.html':['tile-joints','Tile joint repair photographs'],
 'services/balcony-waterproofing/index.html':['balcony-stages','Balcony waterproofing stages'],
 'services/tile-regrouting/index.html':['tile-joints','Tile regrouting photographs'],
 'services/commercial-waterproofing/index.html':['commercial-roof','Commercial roof waterproofing photographs'],
 'services/roof-waterproofing/index.html':['isaacs-roof','Isaacs roof waterproofing scope'],
 'guides/balcony-leaking-room-below/index.html':['balcony-stages','Balcony waterproofing stages'],
 'guides/waterproofing-retiling-quote/index.html':['bathroom-work','Bathroom membrane and tiled-finish photographs'],
 'guides/regrouting-resealing-or-rewaterproofing/index.html':['tile-joints','Tile joint repair photographs'],
};
export function applyProjectEvidenceNavigation(html,path){
 const projectLink=`<a href="/case-studies/"${path==='case-studies/index.html'?' aria-current="page"':''}>Projects</a>`;
 html=html.replace(/<nav\b[^>]*class="nav"[\s\S]*?<\/nav>|<footer\b[\s\S]*?<\/footer>/g,region=>{
  if(region.includes('href="/case-studies/"'))return region;
  return region.replace(/(<a\b[^>]*href="\/guides\/"[^>]*>[\s\S]*?<\/a>)/,'$1'+projectLink);
 });
 if(path==='case-studies/index.html'){
  html=html.replaceAll('The assigned photographs show worn and open tile joints','The tile regrouting photographs show worn and open tile joints').replaceAll('The assigned roof photographs show waterproofing work','The roof photographs show waterproofing work');
  html=html.replaceAll('/services/tile-regrouting/#tile-regrouting-photos','/services/tile-regrouting/#tile-project-photos-heading').replaceAll('/services/commercial-waterproofing/#commercial-roof-photos','/services/commercial-waterproofing/#commercial-project-photos-heading');
  html=html.replace('These MEL ONE photographs show two useful views of bathroom waterproofing: membrane being applied at a shower floor and wall junction, and the finished tiled wet area. They help explain the work involved without standing in for an assessment of your property.','These bathroom work photographs show membrane application and a tiled wet area. They are not presented as a same-job before-and-after record. Each view illustrates a visible stage or finish; it does not establish a leak cause or prove the concealed membrane condition.');
  html=html.replace('<div class="field-notes-lead">','<div class="field-notes-lead" id="bathroom-work">');
  html=html.replace('id="case-photo-request-title"','id="balcony-stages"').replace('aria-labelledby="case-photo-request-title"','aria-labelledby="balcony-stages"');
  html=html.replace('>MEL ONE waterproofing case studies</h2>','>Balcony waterproofing stages</h2>');
  const balconyLink='<p class="case-service-links"><a href="/services/balcony-waterproofing/">Balcony repair and membrane renewal scope</a> · <a href="/guides/balcony-leaking-room-below/">Balcony leak assessment guide</a></p>';
  if(!html.includes(balconyLink))html=html.replace('<p class="case-photo-note">',balconyLink+'<p class="case-photo-note">');
  if(!html.includes('id="tile-joints"')){
   const sections='<section class="case-photo-request" aria-labelledby="tile-joints"><h2 id="tile-joints">Tile regrouting photographs</h2><p>The tile regrouting photographs show worn and open tile joints and the same tiled floor after regrouting. They document the visible joint finish, not a membrane repair or a leak test.</p><p><a href="/services/tile-regrouting/#tile-project-photos-heading">View the tile regrouting photographs and repair limits →</a></p></section><section class="case-photo-request" aria-labelledby="commercial-roof"><h2 id="commercial-roof">Commercial roof waterproofing photographs</h2><p>The roof photographs show waterproofing work around rooftop equipment and a roof junction. They show work locations; the photographs alone do not establish the original defect, selected material or subsequent leak performance.</p><p><a href="/services/commercial-waterproofing/#commercial-project-photos-heading">View the commercial roof work photographs →</a></p></section>';
   html=html.replace('<div class="field-notes-next">',sections+'<div class="field-notes-next">');
  }
  html=html.replace('<h1>Waterproofing Project Photos</h1>','<h1>Waterproofing Projects in Canberra</h1>');
  html=html.replace(/(<title>|<meta property="og:title" content=")Waterproofing Project Photos/g,'$1Waterproofing Projects in Canberra');
  html=html.replace(/"name":"Waterproofing Project Photos"/g,'"name":"Waterproofing Projects in Canberra"');
 }
 if(path==='services/tile-regrouting/index.html')html=html.replace('<h2>Tile regrouting: before and after</h2>','<h2 id="tile-project-photos-heading">Tile regrouting: before and after</h2>');
 if(path==='services/commercial-waterproofing/index.html')html=html.replace('<h2>Commercial roof waterproofing</h2>','<h2 id="commercial-project-photos-heading">Commercial roof waterproofing</h2>');
 const context=contexts[path];
 if(context&&!html.includes('class="project-evidence-link"')){
  const [id,label]=context,link=`<p class="project-evidence-link"><a href="/case-studies/#${id}">${label} →</a></p>`;
  // Only related project evidence is linked; no unrelated case is attached to an external or retaining-wall service.
  if(path.startsWith('guides/'))html=html.replace('<!-- seo-maintenance-related:end -->',link+'<!-- seo-maintenance-related:end -->');
  else html=html.replace(/(<section class="service-booking"[^>]*>)/,link+'$1');
 }
 return html;
}
