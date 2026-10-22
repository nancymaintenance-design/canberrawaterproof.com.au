import {serviceMaterialsRows} from '../data/service-materials-copy.mjs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function serviceMaterialsHtml(row){
 let html=esc(row.en);
 if(row.spans)for(const product of ['ARDEX WPM 185','ARDEX WPM 300'])html=html.replace(product,'<span>'+product+'</span>');
 if(row.link)html+=' <a href="/guides/waterproofing-materials-and-systems/">Waterproofing materials and installation guide</a>';
 return html;
}
export function applyServiceMaterialsCopy(html,file){
 const slug=file.match(/^services\/([^/]+)\/index\.html$/)?.[1],rows=serviceMaterialsRows.filter(r=>r.slug===slug);
 if(!rows.length)return html;
 return html.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/,(_,open,body,close)=>open+body.replace(/(<p\b[^>]*>)([\s\S]*?)(<\/p>)/g,(whole,start,inner,end)=>{
  const row=rows.find(r=>r.beforeHtml===inner);return row?start+serviceMaterialsHtml(row)+end:whole;
 })+close);
}
