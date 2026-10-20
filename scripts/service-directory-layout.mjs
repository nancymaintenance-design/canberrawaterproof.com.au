// Scope the responsive remainder-row layout to the real service collection only.
export function applyServiceDirectoryLayout(html,file){
 if(file!=='services/index.html')return html;
 if(!html.includes('data-service-directory')){
  const anchor='<section class="section wrap"><div class="grid">';
  if(!html.includes(anchor))return html; // Partial authoring fragments are not the full collection.
  html=html.replace(anchor,'<section class="section wrap" data-service-directory><div class="grid">');
 }
 // The two larger ending cards need an accurate responsive image size hint.
 html=html.replace(/<article class="card">[\s\S]*?<\/article>/g,card=>{
  if(!/href="\/services\/(?:tile-regrouting|commercial-waterproofing)\/"/.test(card))return card;
  return card.replace(/\bsizes="[^"]*"/g,'sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 40px), (max-width: 1240px) calc((100vw - 57px) / 2), 592px"');
 });
 const asset='<link rel="stylesheet" href="/assets/service-directory-layout.css">';
 if(!html.includes(asset))html=html.replace('</head>',asset+'</head>');
 return html;
}
