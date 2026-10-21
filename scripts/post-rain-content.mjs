import {headingRows,rainFaq,newsSections} from '../data/post-rain-content.mjs';
export function addRainFaq(html) {
 for(const [id,q,,a] of rainFaq) {
  const rendered=`<details id="${id}"><summary>${q}</summary><p>${a}</p></details>`;
  if(html.includes(`id="${id}"`)) {
   html=html.replace(new RegExp(`<details id="${id}">[\\s\\S]*?<\\/details>`),rendered);
   continue;
  }
  html=html.replace('<p class="faq-source-note">',`<details id="${id}"><summary>${q}</summary><p>${a}</p></details><p class="faq-source-note">`);
 }
 return html;
}
export function applyPostRainContent(html,path) {
 const slug=path.match(/^services\/([^/]+)\/index\.html$/)?.[1];
 for(const [owner,before,after] of headingRows) if(slug===owner) {
  html=html.replace(/(<h2\b[^>]*>)([^<]+)(<\/h2>)/g,(whole,open,text,close)=>text===before?open+after+close:whole);
 }
 const news=path.match(/^industry-news\/([^/]+)\/index\.html$/)?.[1];
 const sections=newsSections[news];
 if(sections) {
  const links=news==='preparing-for-wet-weather'?'<p><a href="/guides/balcony-leaking-room-below/">Read the balcony leak guide</a> · <a href="/faq/#rain-window-entry">Rainwater entry questions</a></p>':'<p><a href="/faq/#rain-roof-quote">Rain-related leak quote questions</a></p>';
  const markup='<!-- post-rain-content:start -->'+sections.map(([h,,p])=>`<h2>${h}</h2><p>${p}</p>`).join('')+links+'<!-- post-rain-content:end -->';
  if(html.includes('<!-- post-rain-content:start -->')) html=html.replace(/<!-- post-rain-content:start -->[\s\S]*?<!-- post-rain-content:end -->/,markup);
  else html=html.replace('<div class="callout">',markup+'<div class="callout">');
 }
 return html;
}
