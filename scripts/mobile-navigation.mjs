import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

// Enhance the existing links; without JavaScript the whole navigation is visible.
export function applyMobileNavigation(html) {
 if (!html.includes('class="nav"')) return html;
 if (!html.includes('data-navigation-toggle')) {
  html=html.replace('<nav class="nav"', '<button class="navigation-toggle" type="button" data-navigation-toggle aria-expanded="false" aria-controls="main-navigation" hidden>Menu</button><nav id="main-navigation" class="nav"');
 }
 if (!html.includes('src="/assets/mobile-navigation.js"')) {
  html=html.replace('</head>','<script src="/assets/mobile-navigation.js" defer></script></head>');
 }
 return html;
}

export function installMobileNavigation(root) {
 let changed=0;
 function walk(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
   if(entry.name.startsWith('.') || ['node_modules','assets'].includes(entry.name)) continue;
   const file=resolve(dir,entry.name);
   if(entry.isDirectory()) walk(file);
   else if(entry.name.endsWith('.html')) {
    const before=readFileSync(file,'utf8'), after=applyMobileNavigation(before);
    if(before!==after) {writeFileSync(file,after); changed++;}
   }
  }
 }
 walk(root);
 return changed;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 console.log(JSON.stringify({changed:installMobileNavigation(resolve(dirname(fileURLToPath(import.meta.url)),'..'))}));
}
