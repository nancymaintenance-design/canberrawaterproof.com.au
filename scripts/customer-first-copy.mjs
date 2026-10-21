import {customerCopy} from '../data/customer-first-copy.mjs';
const escaped=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function reviseCustomerText(text){
 for(const [before,after] of customerCopy)text=text.replaceAll(before,after);
 return text;
}
export function applyCustomerFirstCopy(html,path=''){
 if(path==='privacy-policy/index.html')return html;
 // Script data is parsed and serialized safely; executable code is never edited.
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|[^<]+|<[^>]+>/gi,token=>{
  if(/^<script/i.test(token)){
   if(!/type=["']application\/(?:ld\+)?json["']/i.test(token))return token;
   const open=token.match(/^<script[^>]*>/)[0];
   const visit=v=>typeof v==='string'?reviseCustomerText(v):Array.isArray(v)?v.map(visit):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,visit(x)])):v;
   return open+JSON.stringify(visit(JSON.parse(token.slice(open.length,-9)))).replace(/</g,'\\u003c')+'</script>';
  }
  // Only title/description content attributes, not URLs, alt, IDs or controls.
  if(token.startsWith('<'))return /^<meta\b/i.test(token)&&/\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"/i.test(token)?token.replace(/content="([^"]*)"/,(_,v)=>'content="'+customerCopy.reduce((s,[a,b])=>s.replaceAll(escaped(a),escaped(b)),v)+'"'):token;
  for(const [before,after]of customerCopy)token=token.replaceAll(escaped(before),escaped(after)).replaceAll(before,escaped(after));
  return token;
 });
}
