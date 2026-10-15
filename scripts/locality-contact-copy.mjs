// Keep the full, qualified attendance statement in the locality hero and the
// full photo/contact instruction beside its form. Technical safety text stays.
export function applyLocalityContactCopy(html,path){
 if(!/^waterproofing\/[^/]+\/index\.html$/.test(path))return html;
 const answers=new Map();
 const urgentAnswer='Call 0482 422 607 to discuss urgent attendance for the property. Availability and safe access determine timing. We arrange the on-site assessment and confirm the repair scope and written quote; the enquiry section below explains contact and photo options.';
 html=html.replace(/(<p class="lede">[\s\S]*?For urgent jobs in [\s\S]*?as little as 30 minutes after contact), subject to availability, address and safe access\.<\/p>/,'$1. Arrival timing depends on current availability, the address and safe access.</p>');
 html=html.replace(/(<meta\b[^>]*")\)>/g,'$1>');
 html=html.replace('<strong>Licensed and insured:</strong>','<strong>Company and insurance:</strong>').replace('>View licence and insurance information</a>','>View company and insurance information</a>');
 html=html.replace(/<h2([^>]*)>[^<]* in ([^<]+) backed by proven experience\.<\/h2>/g,'<h2$1>Waterproofing experience in $2</h2>')
  .replace(/<h2>How the Ellis team carries out [^<]* in ([^<]+)<\/h2>/g,'<h2>Waterproofing assessment and repairs in $1</h2>');
 html=html.replace(/<p data-faq-answer>([\s\S]*?)<\/p>/g,(whole,text)=>{
  if(!/^For urgent jobs in /.test(text))return whole;
  const next=urgentAnswer;
  answers.set(text,next);return '<p data-faq-answer>'+next+'</p>';
 });
 html=html.replace(/<article><strong>As little as 30 minutes<\/strong><span>[\s\S]*?<\/span><\/article>/g,'<article><strong>Urgent waterproofing attendance</strong><span><a href="#booking">Discuss current availability and property access.</a></span></article>');
 html=html.replace(/(<p>More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services\.) For urgent jobs in [\s\S]*?Call 0482 422 607 to discuss availability\.<\/p>/g,'$1 <a href="#booking">Contact the team about your property.</a></p>');
 html=html.replace(/(<div class="callout"><strong>[^<]*<\/strong>)[\s\S]*?<\/div>/,'$1 <a href="#booking">Request an on-site assessment and written quote.</a></div>');
 html=html.replace(/<li>Photos are optional\. If available, email photos or video taken safely from a normal standing position, plus details of recent plumbing, renovation or maintenance work\.<\/li>/,'<li>Describe recent plumbing, renovation or maintenance work. The enquiry section below explains optional photo details.</li>');
 html=html.replace(/<p><strong>For urgent jobs in [\s\S]*?<\/strong> For planned waterproofing services,[\s\S]*?<\/p>/,'<p>Request an on-site assessment and written quote using the form. Photos are optional: email safely taken photos to riley@melonemaintenance.com.au or contact us without them. Use existing photographs or a safe standing position; do not approach hazards to take them.</p>');
 html=html.replace(/(<script[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(w,a,json,b)=>{
  const data=JSON.parse(json);
  const visit=value=>{if(!value||typeof value!=='object')return;
   if(value['@type']==='Question'&&/^How soon can the Ellis team attend an urgent waterproofing job/.test(value.name)&&value.acceptedAnswer)value.acceptedAnswer.text=urgentAnswer;
   for(const [key,item]of Object.entries(value)){if(key==='text'&&answers.has(item))value[key]=answers.get(item);else if(item&&typeof item==='object')visit(item);}};
  visit(data);return a+JSON.stringify(data).replace(/</g,'\\u003c')+b;
 });
 return html;
}
