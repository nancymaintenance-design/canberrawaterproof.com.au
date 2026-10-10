import { readFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const args=process.argv.slice(2);
const option=name=>{const index=args.indexOf(name);const value=index>=0?args[index+1]:undefined;return value && !value.startsWith('--') ? value : undefined;};
if(!option('--root') || !(option('--sharp') || process.env.SHARP_MODULE_PATH)) throw new Error('Usage: node scripts/optimise-site-images.mjs --root <site> --sharp <module-directory>');
const root=path.resolve(option('--root'));
const sharp=createRequire(import.meta.url)(option('--sharp') ? path.resolve(option('--sharp')) : process.env.SHARP_MODULE_PATH);
async function htmlFiles(dir) {
 const out=[];
 for(const item of await readdir(dir,{withFileTypes:true})) {
  if(item.name.startsWith('.') || ['node_modules','docs','scripts','tests'].includes(item.name)) continue;
  const file=path.join(dir,item.name);
  if(item.isDirectory()) out.push(...await htmlFiles(file)); else if(item.name.endsWith('.html')) out.push(file);
 }
 return out;
}
const references=new Set();
for(const file of await htmlFiles(root)) {
 const html=await readFile(file,'utf8');
 for(const match of html.matchAll(/<img\b[^>]*\bsrc=["'](\/assets\/[^"']+\.(?:jpg|jpeg|png))["']/gi)) references.add(match[1]);
}
for(const css of ['site.css','site-v2.css']) {
 const text=await readFile(path.join(root,'assets',css),'utf8').catch(error=>{if(error.code==='ENOENT')return '';throw error;});
 for(const match of text.matchAll(/url\(['"]?(\/assets\/[^)'" ]+\.(?:jpg|png))['"]?\)/g)) references.add(match[1]);
}
await mkdir(path.join(root,'assets','responsive'),{recursive:true});
const manifest={};
for(const url of [...references].sort()) {
 const input=await readFile(path.join(root,url));
 const meta=await sharp(input).metadata();
 const logo=url.includes('logo');
 const widths=[...new Set((logo?[58,116,174]:[480,800,1200,meta.width]).filter(w=>w<=meta.width))].sort((a,b)=>a-b);
 const candidates=[];
 for(const width of widths) {
  const output=`/assets/responsive/${path.parse(url).name}-${width}.webp`;
  const result=await sharp(input).resize({width,withoutEnlargement:true}).webp(logo?{lossless:true}:{quality:82}).toFile(path.join(root,output));
  if(result.width!==width) throw new Error(`Unexpected width ${output}`);
  const verified=await sharp(path.join(root,output)).metadata();
  if(logo && meta.hasAlpha && !verified.hasAlpha) throw new Error('Logo alpha lost');
  candidates.push({width,height:result.height,url:output,bytes:result.size});
 }
 manifest[url]={width:meta.width,height:meta.height,bytes:input.length,sha256:createHash('sha256').update(input).digest('hex'),hasAlpha:!!meta.hasAlpha,lossless:logo,candidates};
}
console.log(JSON.stringify(manifest,null,2));
