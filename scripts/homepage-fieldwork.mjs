// The selected homepage composition; original photography remains the evidence source.
const picture=(name,alt,{hero=false}={})=>`<picture data-home-picture><source type="image/webp" srcset="/assets/responsive/${name}-480.webp 480w, /assets/responsive/${name}-800.webp 800w, /assets/responsive/${name}-1200.webp 1200w, /assets/responsive/${name}-1536.webp 1536w" sizes="(max-width: 900px) 100vw, 50vw"><img src="/assets/${name}.jpg" alt="${alt}" width="1536" height="1024" ${hero?'fetchpriority="high"':'loading="lazy" decoding="async"'}></picture>`;
export function applyHomepageFieldwork(html,file){
 if(file!=='index.html')return html;
 const entries=[
  ['leaking-shower-repairs','Leaking Shower Repairs','Shower leak assessment and repairs for wet carpet, damp adjoining walls and water escaping beyond the shower.'],
  ['bathroom-waterproofing','Bathroom Waterproofing','Removal, preparation, waterproofing and retiling can be planned as one agreed scope.'],
  ['balcony-waterproofing','Balcony Waterproofing','Leak investigation, waterproofing replacement and retiling where the agreed scope requires it.'],
 ];
 const opening=`<!-- homepage-fieldwork:start --><section class="hero"><div class="home-hero-grid"><div class="home-hero-copy"><p class="eyebrow">MEL ONE waterproofing</p><h1>Waterproofing &amp; Leak Repairs in Canberra</h1><p class="home-hero-lede">We repair leaking showers and waterproof bathrooms, balconies and other wet areas.</p><div class="actions"><a class="button primary" href="/contact/#service-form">Request assessment</a><a class="button secondary" href="tel:+61482422607">Call 0482 422 607</a></div><nav class="home-service-entries" aria-label="Main waterproofing services">${entries.map(([slug,title,copy])=>`<a class="home-service-entry" href="/services/${slug}/"><h2>${title}</h2><p>${copy}</p></a>`).join('')}</nav></div><figure class="home-hero-photo">${picture('mel-one-hero-bathroom','MEL ONE applying waterproofing membrane to a bathroom floor and wall junction',{hero:true})}<figcaption>Bathroom waterproofing membrane application</figcaption></figure></div></section><section class="home-service-band"><div class="wrap"><h2>Waterproofing, sealing &amp; regrouting</h2><p>We carry out waterproofing repairs for homeowners, landlords and property managers across bathrooms, showers, balconies, kitchens and external areas.</p></div></section><section class="field-notes section" aria-labelledby="field-notes-title"><div class="wrap"><div class="home-project-heading"><div><p class="eyebrow">Our waterproofing work</p><h2 id="field-notes-title">Waterproofing Project Photographs</h2></div><a class="button primary" href="/case-studies/">View project photographs</a></div><div class="home-project-grid"><figure class="field-notes-photo">${picture('service-shower','MEL ONE carrying out shower sealing work')}<figcaption><strong>Shower sealing work</strong><span>Sealing at accessible shower joints.</span></figcaption></figure><figure class="field-notes-photo">${picture('service-balcony','MEL ONE waterproofing an exterior balcony edge')}<figcaption><strong>Balcony waterproofing</strong><span>Waterproofing work at an exterior balcony edge.</span></figcaption></figure></div></div></section><section class="home-more-services section wrap" aria-labelledby="home-more-title"><h2 id="home-more-title">Sealing and other waterproofing services</h2><div class="home-secondary-links"><a href="/services/shower-resealing-regrouting/">Shower Resealing &amp; Regrouting</a><a href="/services/kitchen-sealing/">Kitchen Sealing &amp; Resealing</a><a href="/services/external-waterproofing/">External Waterproofing &amp; Water Ingress Repairs</a></div><div class="service-grid-more"><a class="button primary" href="/services/">View All 11 Waterproofing Services</a></div></section><!-- homepage-fieldwork:end -->`;
 const managed=/<!-- homepage-fieldwork:start -->[\s\S]*?<!-- homepage-fieldwork:end -->/;
 if(managed.test(html))html=html.replace(managed,opening);
 else {
  const old=/<section class="hero">[\s\S]*?(?=<section class="band section">)/;
  if(!old.test(html))throw Error('Homepage opening migration anchor missing');
  html=html.replace(old,opening);
 }
 // A static chosen photograph needs no autoplay, hidden slides or stale controls.
 html=html.replace(/<script>const slides=\[\.\.\.document\.querySelectorAll\('\.hero-slide'\)\][\s\S]*?<\/script>/,'');
 const asset='<link rel="stylesheet" href="/assets/homepage-fieldwork.css">';
 if(!html.includes(asset))html=html.replace('</head>',asset+'</head>');
 return html;
}
