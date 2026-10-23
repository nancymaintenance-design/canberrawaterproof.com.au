import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import{execFileSync}from'node:child_process';import{load}from'cheerio';import{applyLocalConversionCopy,conversionServiceRows}from'../scripts/local-conversion-copy.mjs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
test('local conversion candidate keeps real enquiry fields and safe canonical service paths',()=>{
 const $=load(read('services/index.html'));assert.equal($('[aria-label="Waterproofing problem navigation"] a').length,6);
 for(const a of $('[aria-label="Waterproofing problem navigation"] a').toArray()){const href=$(a).attr('href');assert.ok(fs.existsSync(new URL('..'+href+'index.html',import.meta.url)));}
 const form=load(read('contact/index.html'));assert.equal(form('form [name="urgency"]').length,0);assert.ok(form('#service-message-help').text().includes('how soon'));
 assert.match(form('[name="message"]').attr('aria-describedby'),/service-message-error service-message-help/);assert.equal(form('[name="phone"]').attr('required'),undefined);
 for(const [slug]of conversionServiceRows){const p=load(read(`services/${slug}/index.html`));assert.equal(p('.service-booking .service-enquiry-plan').length,1,slug);assert.equal(p('h1').length,1);const before=load(execFileSync('git',['show',`HEAD:services/${slug}/index.html`],{encoding:'utf8'}));assert.equal(p('.service-steps li').length,before('.service-steps li').length,slug);assert.deepEqual(p('h2,h3').map((_,e)=>p(e).text()).get(),before('h2,h3').map((_,e)=>before(e).text()).get(),slug);}
});
test('copy transformation preserves metadata markup, enquiry controls and repeatability',()=>{
 const input='<html><head><meta name="description" content="Old"><meta property="og:description" content="Old"></head><body><section class="service-booking"><h2>Kitchen sealing</h2><p>Keep original scope.</p></section></body></html>';
 const out=applyLocalConversionCopy(input,'services/kitchen-sealing/index.html');assert.doesNotMatch(out,/<meta[^>]*>>/);assert.match(out,/<p>Keep original scope\.<\/p>/);assert.equal(applyLocalConversionCopy(out,'services/kitchen-sealing/index.html'),out);
 assert.equal(applyLocalConversionCopy(input,'unrelated.html'),input);
});
