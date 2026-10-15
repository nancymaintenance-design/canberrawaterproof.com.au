const labels={
 'Established waterproofing service':'Local waterproofing assessment',
 'Explore waterproofing services':'Waterproofing services',
 'MEL ONE field notes · Bathroom waterproofing':'Bathroom waterproofing photographs',
 'Documented MEL ONE waterproofing project':'Bathroom waterproofing photographs',
 'Waterproofing service information':'Waterproofing service coverage',
 'Waterproofing repair information':'Waterproofing guide topics',
};
export function applyEditorialPresentation(html,path){
 html=html.replace(/(<p class="eyebrow">)([^<]+)(<\/p>)/g,(w,a,text,b)=>a+(labels[text]||text)+b);
 html=html.replace(/<h2([^>]*)>(MEL ONE’s waterproofing experience and company background\.|Experienced waterproofing repairs with a clear scope\.|Bathroom waterproofing, shown on site\.|See bathroom waterproofing work on site\.)<\/h2>/g,(whole,attrs,text)=>{
  const terms={'MEL ONE’s waterproofing experience and company background.':'Waterproofing team and company background','Experienced waterproofing repairs with a clear scope.':'Waterproofing experience and direct service','Bathroom waterproofing, shown on site.':'Bathroom waterproofing work photographs','See bathroom waterproofing work on site.':'Bathroom waterproofing work photographs'};
  return `<h2${attrs}>${terms[text]}</h2>`;
 });
 if(path==='services/bathroom-waterproofing/index.html'){
  html=html.replace('This real MEL ONE project record shows a bathroom before work, during waterproofing preparation and after the tiled shower area was completed. Every property has its own condition and work scope, but the sequence shows how a full wet-area repair is managed from assessment through to the finished result.','These bathroom work images show preparation, membrane application and tiled finishes. The separate photographs in the project hub are not presented as a same-job before-and-after record. They illustrate visible work, while the cause, removal and reinstatement needed at your property require an on-site assessment.');
  html=html.replace('<a class="button secondary" href="/case-studies/">View Bathroom Case Studies</a>','<a class="button secondary" href="/case-studies/#bathroom-work">View bathroom work photographs</a>');
  html=html.replace('<span class="evidence-label">Waterproofing membrane application</span><strong>The wet area is prepared before the membrane work begins</strong>','<span class="evidence-label">Bathroom membrane application</span>');
  html=html.replace('This project image shows membrane application to the shower floor and wall junctions after the bathroom substrate has been prepared.','This photograph shows membrane application to the shower floor and wall junctions. Substrate preparation is specified separately in the repair scope.');
  html=html.replace('<span class="evidence-label">Completed bathroom result</span><strong>A finished tiled bathroom with a waterproofed shower area and floor drainage</strong>','<span class="evidence-label">Tiled bathroom finish</span>');
  html=html.replace('This completed bathroom shows the clean, practical finish achieved after the agreed wet-area waterproofing and tiling work.','The photograph shows tiled surfaces, a shower screen and drainage details. A finished surface does not verify the membrane concealed beneath it.');
  html=html.replace(/<p>Call <a href="tel:\+611300838722">0482 422 607<\/a> for a fast 30-minute response,[\s\S]*?<\/p>/,'<p>Request an <a href="/contact/?service=bathroom-waterproofing#service-form">on-site assessment and written quote</a> for a repair or renovation. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au or contact us without them. Do not remove finishes to investigate damage. Tell us if this is the only bathroom so downtime and access can be planned.</p>');
 }
 // A collection H1 and its metadata name describe the same collection.
 const collectionNames={
  'services/index.html':'Waterproofing and Leak Repair Services in Canberra',
  'guides/index.html':'Waterproofing and Leak Repair Guides in Canberra',
  'industry-news/index.html':'Waterproofing Industry News in Canberra',
 };
 const name=collectionNames[path];
 if(name){
  html=html.replace(/<h1>[^<]*<\/h1>/,`<h1>${name}</h1>`).replace(/<title>[^<]*<\/title>/,`<title>${name} | MEL ONE</title>`)
   .replace(/(<meta property="og:title" content=")[^"]*(")/,'$1'+name+' | MEL ONE$2');
  html=html.replace(/(<script[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(w,a,json,b)=>{
   const data=JSON.parse(json);for(const node of data['@graph']||[])if(node['@type']==='WebPage')node.name=name;
   return a+JSON.stringify(data).replace(/</g,'\\u003c')+b;
  });
 }
 return html;
}
