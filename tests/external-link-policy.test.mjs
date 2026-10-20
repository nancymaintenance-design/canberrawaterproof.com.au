import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyExternalLinkPolicy,permittedLink} from '../scripts/external-link-policy.mjs';
import fs from 'node:fs';
import {load} from 'cheerio';
import {englishPages} from '../scripts/bilingual-site.mjs';
test('only our site, YouTube and TikTok remain clickable; phone/email stay',()=>{
 for(const url of ['/services/','tel:+61482422607','mailto:riley@melonemaintenance.com.au','https://www.youtube.com/@MelOneMaintenance','https://www.tiktok.com/@melonemaintenance5'])assert.ok(permittedLink(url));
 for(const url of ['https://ardexaustralia.com/product/','https://abr.business.gov.au/ABN/','https://www.instagram.com/test','https://www.google.com/maps','https://youtube.com.evil.example/'])assert.equal(permittedLink(url),false);
 const html=applyExternalLinkPolicy('<p>Read <a href="https://ardexaustralia.com/product/">product guidance ↗</a>.</p><a href="https://www.instagram.com/test">Instagram</a>');
 assert.equal(html,'<p>Read <span>product guidance</span>.</p>');
});
test('reference sections become complete same-language internal paths; resources are preserved',()=>{
 const input='<section class="deep-guide-sources"><h2>References</h2></section><iframe src="https://www.google.com/maps?output=embed"></iframe>';
 const html=applyExternalLinkPolicy(input,'zh');
 assert.ok(html.includes('href="/zh/services/"'));
 assert.ok(html.includes('href="/zh/contact/#service-form"'));
 assert.ok(html.includes('<iframe src="https://www.google.com/maps?output=embed">'));
 assert.equal(applyExternalLinkPolicy(html,'zh'),html);
});
test('all bilingual outputs and full-text feeds obey the clickable-link policy',()=>{
 const root=new URL('../',import.meta.url);
 const verify=(html,file)=>{
  const $=load(html);
  $('a[href],area[href],form[action]').each((_,node)=>assert.ok(permittedLink($(node).attr('href')||$(node).attr('action')),file+': '+$.html(node)));
 };
 for(const file of englishPages().flatMap(file=>[file,'zh/'+file]))verify(fs.readFileSync(new URL(file,root),'utf8'),file);
 for(const file of ['feed.json','zh/feed.json'])for(const item of JSON.parse(fs.readFileSync(new URL(file,root),'utf8')).items)verify(item.content_html,file);
});
