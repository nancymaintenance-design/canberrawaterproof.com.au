import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
const implementation=await import('../scripts/customer-first-copy.mjs').catch(()=>({}));
test('reviewed service and quote copy explains our service without changing links or advantages',()=>{
 assert.equal(typeof implementation.applyCustomerFirstCopy,'function','customer-first source transform exists');
 const input='<p>External water ingress assessment around windows, doors and wall junctions. Rain exposure, adjoining ground levels and drainage inform the repair plan.</p><a href="/contact/?service=external-waterproofing#service-form">Request assessment</a><p>10+ years of waterproofing experience. Trusted by 10,000+ customers across Australia for property maintenance and repair services. For urgent jobs in Canberra, the Ellis team can be on site in as little as 30 minutes after contact. Arrival timing depends on current availability, the address and safe access.</p>';
 const output=implementation.applyCustomerFirstCopy(input,'services/external-waterproofing/index.html');
 assert.match(output,/We repair water entry around windows, doors and wall junctions/);
 assert.match(output,/href="\/contact\/\?service=external-waterproofing#service-form"/);
 assert.ok(output.includes(input.slice(input.indexOf('<p>10+'))),'qualified advantages remain verbatim');
 assert.equal(implementation.applyCustomerFirstCopy(output,'services/external-waterproofing/index.html'),output);
});
test('local candidate no longer describes a photo-upload form or legacy mailto success',()=>{
 const root=new URL('../',import.meta.url);
 const photo=fs.readFileSync(new URL('industry-news/what-to-photograph-before-a-quote/index.html',root),'utf8');
 const thanks=fs.readFileSync(new URL('thank-you/index.html',root),'utf8');
 assert.doesNotMatch(photo,/Send safe photos through the/);
 assert.doesNotMatch(thanks,/Your email application should now have opened/);
 assert.match(thanks,/confirmation shown on the form/);
});
test('Chinese preserves evidence limits, regrouting scope and balcony flood-test prohibition',()=>{
 const read=f=>fs.readFileSync(new URL('../zh/'+f,import.meta.url),'utf8');
 const balcony=read('guides/balcony-leaking-room-below/index.html');
 assert.ok(balcony.includes('也不要自行'),'balcony flood-test instruction is explicitly prohibited');
 assert.ok(read('services/tile-regrouting/index.html').includes('堪培拉瓷砖重新填缝'),'regrouting is not tile relaying');
 assert.ok(read('services/balcony-waterproofing/index.html').includes('不能据此确定缺陷或费用应由谁承担'),'evidence limit is not a liability disclaimer');
});
test('all core service introductions and locality source paragraphs retain reviewed first-person outcomes',()=>{
 const root=new URL('../',import.meta.url);
 for(const dir of fs.readdirSync(new URL('services/',root),{withFileTypes:true}).filter(e=>e.isDirectory())){
  const file=new URL('services/'+dir.name+'/index.html',root),$=load(fs.readFileSync(file,'utf8'));
  assert.match($('main .lede').first().text(),/^We\b/,dir.name+' service introduction');
 }
 for(const dir of fs.readdirSync(new URL('waterproofing/',root),{withFileTypes:true}).filter(e=>e.isDirectory())){
  const file=new URL('waterproofing/'+dir.name+'/index.html',root),$=load(fs.readFileSync(file,'utf8'));
  assert.match($('main article > p').first().text(),/^We provide\b/,dir.name+' locality introduction');
  assert.ok($.text().includes('10,000'),'retained Australia-wide customer advantage');
  assert.ok($.text().includes('30 minutes after contact'),'retained qualified urgent attendance');
 }
});
test('important quote and technical terms keep matched Chinese meanings',()=>{
 const read=f=>load(fs.readFileSync(new URL('../zh/'+f,import.meta.url),'utf8'))('main').text();
 assert.ok(read('faq/index.html').includes('两者都不能取代'));
 const quote=read('guides/waterproofing-retiling-quote/index.html');
 for(const term of ['基层与排水坡度','恢复施工','废料清运与现场保护','仅包含防水层施工的报价'])assert.ok(quote.includes(term),term);
 const roof=read('services/roof-waterproofing/index.html');
 assert.ok(roof.includes('不能确定防水层有无缺陷'));
 assert.ok(!roof.includes('观察结果并未发现膜缺陷'));
});

test('Chinese shower and roof advice names the actual building parts and retains repair limits',()=>{
 const text=f=>load(fs.readFileSync(new URL('../zh/'+f,import.meta.url),'utf8'))('main').text();
 const shower=text('services/shower-resealing-regrouting/index.html');
 assert.doesNotMatch(shower,/滤网|屏幕|筛网/,'screen means shower screen in this repair');
 assert.ok(shower.includes('淋浴屏风'));
 const roof=text('services/roof-waterproofing/index.html');
 assert.ok(roof.includes('泛水板、穿出部位或防水层'),'roof paint does not repair these distinct details');
 assert.ok(text('services/retaining-wall-waterproofing/index.html').includes('降雨后出现潮湿的时间'));
});

test('locality photo instructions retain the safety prohibition and customer-count scope',()=>{
 const text=f=>load(fs.readFileSync(new URL('../zh/'+f,import.meta.url),'utf8'))('main').text();
 for(const area of ['inner-north-city','weston-creek-molonglo']){
  const main=text('waterproofing/'+area+'/index.html');
  assert.ok(main.includes('不要为了拍照接近危险部位'));
  assert.doesNotMatch(main,/不要接近危险并采取措施/);
  const en=load(fs.readFileSync(new URL('../waterproofing/'+area+'/index.html',import.meta.url),'utf8'))('main').text();
  assert.ok(en.includes('trusted MEL ONE for property maintenance and repair services. For urgent'));
 }
});

test('our service scope paragraphs explain our quote rather than asking the customer to define it',()=>{
 const text=f=>load(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'))('main').text();
 assert.doesNotMatch(text('services/bathroom-waterproofing/index.html'),/Ask the quote to identify/);
 assert.doesNotMatch(text('services/roof-waterproofing/index.html'),/Ask the proposed scope to identify/);
 assert.doesNotMatch(text('industry-news/understanding-repair-scopes/index.html'),/the property owner should receive/);
 assert.doesNotMatch(text('zh/industry-news/preparing-for-wet-weather/index.html'),/contact MEL ONE with the location/);
 const page=load(fs.readFileSync(new URL('../zh/404.html',import.meta.url),'utf8'));
 assert.equal(page('main a').first().text(),'返回首页');
});
