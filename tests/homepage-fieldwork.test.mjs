import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'cheerio';
import {applySeoHtml} from '../scripts/apply-seo-maintenance.mjs';
import {applyHomepageFieldwork} from '../scripts/homepage-fieldwork.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('home generation places three direct service entries beside one accessible priority photograph',()=>{
 const output=applySeoHtml(source,'index.html'),$=load(output);
 assert.equal($('.home-service-entry').length,3);
 for(const slug of ['leaking-shower-repairs','bathroom-waterproofing','balcony-waterproofing'])assert.ok($(`.home-service-entry[href="/services/${slug}/"]`).length);
 assert.equal($('.home-hero-photo img').length,1);
 assert.equal($('.home-hero-photo img').attr('fetchpriority'),'high');
 assert.ok(!$('.home-hero-photo img').attr('loading'));
 assert.equal($('.home-hero-photo [aria-hidden="true"]').length,0);
 assert.equal($('.hero-slides').length,0);
 assert.equal($('script').toArray().filter(n=>$(n).text().includes("querySelectorAll('.hero-slide')")).length,0,'retired carousel code must not run without its controls');
 assert.equal($('main h1').length,1);
 assert.ok($('.home-hero-copy a[href="/contact/#service-form"]').length);
 assert.ok($('.home-hero-copy a[href="tel:+61482422607"]').length);
});

test('home regeneration preserves useful downstream content and never alters another route',()=>{
 const output=applySeoHtml(source,'index.html');
 const $=load(output);
 assert.equal($('.field-notes-photo').length,2);
 assert.equal($('.home-hero-photo').length,1);
 for(const selector of ['.workflow-steps','.area-service-grid','.office-map','footer'])assert.ok($(selector).length,selector);
 for(const slug of ['shower-resealing-regrouting','kitchen-sealing','external-waterproofing'])assert.ok($(`main a[href="/services/${slug}/"]`).length);
 assert.equal(applySeoHtml(output,'index.html'),output,'regeneration must be stable');
 const other='<html><head></head><body><main><h1>Existing page</h1></main></body></html>';
 assert.equal(applyHomepageFieldwork(other,'unrelated/index.html'),other);
});
