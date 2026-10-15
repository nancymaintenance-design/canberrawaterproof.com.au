import copy from '../data/service-repair-copy.mjs';
const genericInspection='Visible damage can be a useful starting point, but the repair method should follow the affected detail and the accessible condition. The Ellis team inspects the affected area, considers when water enters and checks accessible junctions before defining the waterproofing scope.';
const genericLimits='That gives local property owners a direct service path rather than a generic repair promise. The agreed scope identifies what is included, whether separate licensed work is required and how the selected work will be completed.';
const genericScope='Your written scope is tailored to the location and condition found on site. Depending on the repair required, it can include the following clearly listed items:';
export function applyServiceRepairContent(html,path){
 const slug=path.match(/^services\/([^/]+)\/index\.html$/)?.[1],item=copy[slug];
 if(!item)return html;
 html=html.replace(/(<section class="page-intro service-hero">[\s\S]*?<p class="lede">)[\s\S]*?(<\/p>)/, '$1'+item.lede+'$2');
 html=html.replace(genericInspection,item.inspection).replace(genericLimits,item.limits).replace(genericScope,item.scope);
 html=html.replace(/<h2>[^<]+ warning signs and repair suitability<\/h2>/,`<h2>${item.heading}</h2>`)
  .replace(/<h2>[^<]+ assessment and completion<\/h2>/,'<h2>Waterproofing repair and access arrangements</h2>');
 html=html.replace(/<ol class="service-steps">[\s\S]*?<\/ol>/,`<ol class="service-steps">${item.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`);
 html=html.replace('MEL ONE begins with the affected area, visible signs and the repair scope required for the property.',item.caption+'.');
 html=html.replace('<span class="evidence-label">MEL ONE assessment process</span><strong>From the reported symptom to a defined repair scope</strong><p>We review the accessible details, identify the appropriate repair pathway and record the agreed work in clear stages.</p>',`<span class="evidence-label">${item.caption}</span><p>${item.detail}</p>`);
 // Hero carries the complete conditional urgent-attendance message. Booking owns
 // optional photos, direct contact and the location-specific safety information.
 html=html.replace(/(<section class="service-booking"[^>]*>[\s\S]*?<h2>[^<]*<\/h2>)<p>Call [\s\S]*?<\/p>/,`$1<p>Request an <a href="/contact/?service=${slug}#service-form">on-site assessment and written quote</a>, or call <a href="tel:+611300838722">0482 422 607</a>. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au or contact us without them.</p><p class="service-access">${item.access}</p>`);
 html=html.replace('<p>The Ellis team completes an on-site assessment, explains the likely water-entry cause or installation requirements, and confirms the repair plan and written quote.</p>','');
 html=html.replace('<p>No. A coating described as roof paint','<p>A coating described as roof paint');
 return html;
}
