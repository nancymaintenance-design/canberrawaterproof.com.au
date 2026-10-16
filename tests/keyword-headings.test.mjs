import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {applyKeywordHeadings} from '../scripts/keyword-headings.mjs';
const keyword=/waterproof|leak|grout|reseal|seal(?:ing|ant)|membrane|til(?:e|ing)|drain|moisture|damp|bathroom|shower|balcon|retaining.wall|roof|kitchen|laundry|water.ingress|wet.area|防水|漏水|泄漏|进水|雨水|渗|填缝|密封|硅|膜|排水|潮湿|湿气|湿纹|低湿|水分|浴室|卫生间|淋浴|阳台|挡土墙|屋顶|厨房|洗衣|水泥浆|积水|水管|瓷砖|铺砖/i;
function pages(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||['node_modules','scripts','tests','assets'].includes(e.name)?[]:e.isDirectory()?pages(resolve(dir,e.name)):e.name.endsWith('.html')?[resolve(dir,e.name)]:[]);}
test('every shipped page title and H1–H6 describes a waterproofing service, issue or scenario',()=>{
 const failures=[];
 for(const file of pages('.'))for(const m of readFileSync(file,'utf8').matchAll(/<(title|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)){
  const text=m[2].replace(/<[^>]*>/g,'').trim();if(!keyword.test(text))failures.push(file+': '+text);
 }
 assert.deepEqual(failures,[]);
});
test('heading edits preserve nested links, body copy and IDs, match question schema and are repeatable',()=>{
 const before='<h2 id="scope"><a href="/services/">A repair scope that matches the problem.</a></h2><p>A repair scope that matches the problem.</p><details data-faq-question="Where is the Canberra office?"><summary>Where is the Canberra office?</summary><p>121 Marcus Clarke St</p></details><script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Canberra office?","acceptedAnswer":{"@type":"Answer","text":"121 Marcus Clarke St"}}]}</script>';
 const after=applyKeywordHeadings(before,'index.html');
 assert.match(after,/<h2 id="scope"><a href="\/services\/">Waterproofing and Leak Repair Services in Canberra<\/a><\/h2>/);
 assert.match(after,/<p>A repair scope that matches the problem\.<\/p>/);
 assert.match(after,/<summary>Where is the Canberra waterproofing office\?<\/summary>/);
 const schema=JSON.parse(after.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema.mainEntity[0].name,'Where is the Canberra waterproofing office?');
 assert.equal(schema.mainEntity[0].acceptedAnswer.text,'121 Marcus Clarke St');
 assert.equal(applyKeywordHeadings(after,'index.html'),after);
});
test('FAQ headings and section eyebrows also contain topical terms, not just document metadata',()=>{
 const missing=[];
 for(const file of pages('.'))for(const m of readFileSync(file,'utf8').matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>|<p class="eyebrow">([\s\S]*?)<\/p>/gi)){
  const text=(m[1]||m[2]).replace(/<[^>]*>/g,'').trim();if(!keyword.test(text))missing.push(file+': '+text);
 }
 assert.deepEqual(missing,[]);
});
