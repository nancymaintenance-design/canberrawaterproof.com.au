import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8');
const hero = html.match(/<div class="hero-slides"[^>]*>(.*?)<\/div>/s)?.[1];
const slides = [...(hero ?? '').matchAll(/<figure\b([^>]*)><img\b([^>]*)><\/figure>/g)];

test('only the initial hero image is high priority while inactive images defer loading', () => {
  assert.equal(slides.length, 3);
  assert.match(slides[0][2], /\bfetchpriority="high"/);
  assert.doesNotMatch(slides[0][2], /\bloading="lazy"/);
  for (const slide of slides.slice(1)) {
    assert.doesNotMatch(slide[2], /\bfetchpriority="high"/);
    assert.match(slide[2], /\bloading="lazy"/);
    assert.match(slide[2], /\bdecoding="async"/);
  }
});

test('only the initial hero slide is exposed to assistive technology', () => {
  assert.equal(slides.length, 3);
  assert.match(slides[0][1], /\baria-hidden="false"/);
  assert.doesNotMatch(slides[0][1], /\binert\b/);
  for (const slide of slides.slice(1)) {
    assert.match(slide[1], /\baria-hidden="true"/);
    assert.match(slide[1], /\binert\b/);
  }
});

test('carousel changes active and accessibility state together', () => {
  assert.equal(slides.length, 3);
  const elements = slides.map((_, index) => {
    const attributes = new Map(index === 0 ? [['aria-hidden', 'false']] : [['aria-hidden', 'true'], ['inert', '']]);
    let active = index === 0;
    return {
      attributes,
      classList: { toggle(name, enabled) { if (name === 'is-active') active = enabled; } },
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); },
      toggleAttribute(name, enabled) { if (enabled) attributes.set(name, ''); else attributes.delete(name); },
      get active() { return active; },
    };
  });
  const button = { textContent: '', setAttribute() {} };
  const script = [...html.matchAll(/<script>(.*?)<\/script>/gs)].at(-1)?.[1];
  assert.ok(script, 'homepage carousel script exists');
  const context = {
    document: {
      querySelectorAll: () => elements,
      querySelector: (selector) => selector === '.hero' ? { addEventListener() {} } : button,
    },
    matchMedia: () => ({ matches: true }),
    clearInterval() {},
    setInterval() { throw new Error('carousel should start paused in this test'); },
  };
  vm.runInNewContext(script, context);
  for (const selected of [1, 2, 0]) {
    vm.runInNewContext(`show(${selected})`, context);
    elements.forEach((element, index) => {
      assert.equal(element.active, index === selected);
      assert.equal(element.attributes.get('aria-hidden'), String(index !== selected));
      assert.equal(element.attributes.has('inert'), index !== selected);
    });
  }
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
    'https://www.tiktok.com/@melonemaintenance5',
  ]);
});
