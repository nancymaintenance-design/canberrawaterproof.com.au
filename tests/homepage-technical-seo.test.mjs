import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {load} from 'cheerio';
const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/site.css'),'utf8');
const $=load(html);

test('the static homepage prioritises its sole hero photograph without lazy loading it',()=>{
 const hero=$('.home-hero-photo img');
 assert.equal(hero.length,1);
 assert.equal(hero.attr('fetchpriority'),'high');
 assert.equal(hero.attr('loading'),undefined);
 assert.equal($('img[fetchpriority="high"]').length,1);
 assert.equal(hero.parents('[inert],[aria-hidden="true"]').length,0);
 assert.equal($('[data-hero-next],[data-hero-prev],[data-hero-toggle]').length,0);
});
test('supporting homepage images retain lazy async loading and descriptive alternative text',()=>{
 const images=$('main img[loading="lazy"]').toArray();
 assert.ok(images.length>2);
 for(const n of images){assert.equal($(n).attr('decoding'),'async');assert.ok($(n).attr('alt')?.trim());}
});
test('tablet widths retain the main navigation until the mobile fallback appears', () => {
  const tablet = css.split('@media(max-width:900px)')[1]?.split('@media(max-width:620px)')[0];
  const mobile = css.split('@media(max-width:620px)')[1]?.split('@media(')[0];
  assert.ok(tablet && mobile);
  assert.doesNotMatch(tablet, /\.nav\s*\{[^}]*display\s*:\s*none/);
  assert.match(tablet, /\.nav\s*\{[^}]*flex-wrap\s*:\s*wrap/);
  assert.match(mobile, /\.nav\s*\{[^}]*display\s*:\s*none/);
  assert.match(mobile, /\.mobile\s*\{[^}]*display\s*:\s*flex/);
});

test('the sole LocalBusiness links its existing images and visible social profiles', () => {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  assert.equal(jsonLd.length, 1);
  const graph = JSON.parse(jsonLd[0][1])['@graph'];
  const businesses = graph.filter((node) => node['@type'] === 'LocalBusiness');
  assert.equal(businesses.length, 1);
  assert.equal(businesses[0]['@id'], 'https://www.canberrawaterproof.com.au/#business');
  assert.equal(businesses[0].image, 'https://www.canberrawaterproof.com.au/assets/mel-one-hero-bathroom.jpg');
  assert.equal(businesses[0].logo, 'https://www.canberrawaterproof.com.au/assets/mel-one-logo.png');
  assert.deepEqual(businesses[0].sameAs, [
    'https://www.instagram.com/melone.maintenance1/',
    'https://www.youtube.com/@MelOneMaintenance',
    'https://www.tiktok.com/@melonemaintenance5/',
  ]);
});
