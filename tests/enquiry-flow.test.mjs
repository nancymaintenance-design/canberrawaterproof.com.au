import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applySeoHtml } from '../scripts/apply-seo-maintenance.mjs';
import { serviceFormBrowser, validEnquiry } from './helpers/service-form-browser.mjs';

const services = {
  'leaking-shower-repairs': 'Shower', 'bathroom-waterproofing': 'Bathroom',
  'shower-resealing-regrouting': 'Shower', 'balcony-waterproofing': 'Balcony',
  'kitchen-sealing': 'Kitchen', 'external-waterproofing': 'External',
  'laundry-waterproofing': 'Laundry', 'roof-waterproofing': 'Roof',
  'retaining-wall-waterproofing': 'Retaining wall', 'tile-regrouting': 'Tiled area',
  'commercial-waterproofing': 'Commercial property',
};

for (const [slug, area] of Object.entries(services)) {
  test(`${slug} hero leads directly to the form and prefills its visible affected area`, () => {
    const html = readFileSync(new URL(`../services/${slug}/index.html`, import.meta.url), 'utf8');
    const hero = html.match(/<section class="page-intro(?: service-hero)?">[\s\S]*?<\/section>/)?.[0];
    assert.ok(hero.includes(`href="/contact/?service=${slug}#service-form"`));
    assert.match(hero, /class="button primary"[^>]*>Request assessment/);
    assert.ok(html.includes('id="booking"'), 'legacy booking anchor survives');
    const browser = serviceFormBrowser({ search: `?service=${slug}` });
    assert.equal(browser.fields.get('area').value, area);
    const contact = readFileSync(new URL('../contact/index.html', import.meta.url), 'utf8');
    assert.ok(contact.includes(`<option>${area}</option>`));
  });
}

test('absent, unknown and malicious services require an explicit choice while safe suburb text is preserved', () => {
  for (const service of ['', 'unknown', '__proto__', 'constructor', '<img src=x onerror=alert(1)>']) {
    const browser = serviceFormBrowser({ search: `?service=${encodeURIComponent(service)}&suburb=${encodeURIComponent('<Aranda & City>')}` });
    assert.equal(browser.fields.get('area').value, '');
    assert.equal(browser.fields.get('suburb').value, '<Aranda & City>');
  }
});

test('five required fields have labels and associated error nodes, optional phone and server lengths remain compatible', () => {
  const html = readFileSync(new URL('../contact/index.html', import.meta.url), 'utf8');
  const form = html.match(/<form\b[\s\S]*?<\/form>/)[0];
  assert.match(form, /id="service-form"/); assert.match(form, /novalidate/);
  assert.equal((form.match(/<(?:input|select|textarea)\b[^>]*\brequired\b[^>]*>/g) || []).length, 5);
  assert.match(form, /<option value="">/); assert.match(form, /<option>Not sure \/ Other<\/option>/);
  const browser = serviceFormBrowser();
  for (const name of ['name', 'phone', 'email', 'suburb', 'message']) assert.equal(browser.fields.get(name).getAttribute('maxlength'), '4000');
  for (const name of ['name', 'phone', 'email', 'suburb', 'area', 'message']) {
    const field = browser.fields.get(name), errorId = `${field.id}-error`;
    assert.ok(form.includes(`for="${field.id}"`));
    assert.equal(field.getAttribute('aria-describedby'), errorId);
    assert.ok(browser.errors.has(errorId));
  }
  assert.equal(browser.fields.get('name').getAttribute('autocomplete'), 'name');
  assert.equal(browser.fields.get('phone').getAttribute('autocomplete'), 'tel');
  assert.equal(browser.fields.get('email').getAttribute('autocomplete'), 'email');
});

test('invalid input focuses the first field, associates guidance and preserves every value without requesting', async () => {
  const browser = serviceFormBrowser({ values: { ...validEnquiry, name: ' ', email: 'wrong', phone: '123', area: '' } });
  await browser.submit();
  assert.equal(browser.focused, 'name'); assert.equal(browser.status.dataset.state, 'error');
  for (const name of ['name', 'email', 'phone', 'area']) {
    const field = browser.fields.get(name), error = browser.errors.get(field.getAttribute('aria-describedby'));
    assert.equal(field.getAttribute('aria-invalid'), 'true'); assert.ok(error.textContent.length); assert.equal(error.hidden, false);
  }
  assert.equal(browser.fields.get('email').value, 'wrong'); assert.equal(browser.resets, 0);
  for (const field of browser.fields.values()) if (Object.hasOwn(validEnquiry, field.name)) field.value = validEnquiry[field.name];
  browser.fields.get('message').value = 'x'.repeat(4001);
  await browser.submit(); assert.equal(browser.focused, 'message');
});

test('native email type mismatches show linked guidance and preserve values without dispatch', async () => {
  for (const email of ['a,b@example.com', 'a@example..com', 'a@example.com,']) {
    let requests = 0, leads = 0;
    const browser = serviceFormBrowser({ values: { ...validEnquiry, email }, nativeValidity: { email: { typeMismatch: true } },
      hook: () => { leads++; }, fetch: async () => { requests++; return { ok: true, json: async () => ({ ok: true, confirmationSent: false }) }; } });
    await browser.submit();
    const field = browser.fields.get('email'), error = browser.errors.get(field.getAttribute('aria-describedby'));
    assert.equal(field.getAttribute('type'), 'email');
    assert.equal(requests, 0, email); assert.equal(leads, 0); assert.equal(browser.resets, 0);
    assert.equal(browser.status.dataset.state, 'error'); assert.equal(browser.focused, 'email');
    assert.equal(field.getAttribute('aria-invalid'), 'true'); assert.equal(error.hidden, false);
    assert.match(error.textContent, /email address.*name@example\.com/);
    assert.equal(field.value, email); assert.equal(browser.fields.get('message').value, validEnquiry.message);
  }
});

test('native-valid email still observes the existing server address constraint', async () => {
  let requests = 0;
  const browser = serviceFormBrowser({ values: { ...validEnquiry, email: 'test@localhost' }, nativeValidity: { email: { typeMismatch: false } },
    fetch: async () => { requests++; return { ok: true, json: async () => ({ ok: true, confirmationSent: false }) }; } });
  await browser.submit();
  assert.equal(requests, 0); assert.equal(browser.focused, 'email');
  assert.equal(browser.fields.get('email').getAttribute('aria-invalid'), 'true');
});

test('native-valid email that meets the server constraint dispatches and succeeds', async () => {
  let requests = 0;
  const email = 'test+assessment@example.test';
  const browser = serviceFormBrowser({ values: { ...validEnquiry, email }, nativeValidity: { email: { typeMismatch: false } },
    fetch: async (_, init) => { requests++; assert.equal(JSON.parse(init.body).email, email); return { ok: true, json: async () => ({ ok: true, confirmationSent: false }) }; } });
  await browser.submit();
  assert.equal(requests, 1); assert.equal(browser.status.dataset.state, 'success'); assert.equal(browser.resets, 1);
});

test('pending locks duplicate dispatch, retains button label and announces received request without confirming a visit', async () => {
  let finish, requests = 0, leads = 0;
  const browser = serviceFormBrowser({ values: validEnquiry, hook: (...args) => { assert.deepEqual(args, []); leads++; },
    fetch: async (url, init) => {
      requests++; assert.equal(url, '/api/contact'); assert.equal(init.method, 'POST');
      assert.deepEqual(JSON.parse(init.body), { ...validEnquiry, website: '' });
      return new Promise(resolve => { finish = resolve; });
    } });
  const sending = browser.submit();
  assert.equal(browser.status.dataset.state, 'pending'); assert.equal(browser.button.disabled, true);
  assert.equal(browser.attributes['aria-busy'], 'true'); assert.equal(browser.button.textContent, 'Request assessment');
  await browser.submit(); assert.equal(requests, 1);
  finish({ ok: true, json: async () => ({ ok: true, confirmationSent: false }) }); await sending;
  assert.equal(browser.status.dataset.state, 'success'); assert.match(browser.status.textContent, /received/i);
  assert.match(browser.status.textContent, /visit time is not confirmed/i);
  assert.equal(browser.resets, 1); assert.equal(leads, 1); assert.equal(browser.button.disabled, false);
});

test('network, server and malformed responses preserve inputs and offer understandable phone recovery', async () => {
  for (const request of [
    async () => { throw new TypeError('Failed to fetch'); },
    async () => ({ ok: false, json: async () => ({ error: 'RESEND_API_KEY internal secret' }) }),
    async () => ({ ok: true, json: async () => ({ ok: false }) }),
    async () => ({ ok: true, json: async () => { throw Error('server details'); } }),
  ]) {
    const browser = serviceFormBrowser({ values: validEnquiry, fetch: request }); await browser.submit();
    assert.equal(browser.status.dataset.state, 'error'); assert.match(browser.status.textContent, /0482 422 607/);
    assert.doesNotMatch(browser.status.textContent, /Failed to fetch|RESEND|secret|server details/);
    assert.equal(browser.fields.get('message').value, validEnquiry.message); assert.equal(browser.resets, 0);
    assert.equal(browser.button.disabled, false);
  }
});

test('supported maintenance restores enquiry markup without changing content, imagery or legacy booking anchors', () => {
  const path = 'services/roof-waterproofing/index.html';
  const fixture = '<html><head></head><body><nav class="nav"><a class="button primary" href="#booking">Book</a></nav><main><section class="page-intro service-hero"><div class="actions"><a class="button primary" href="#booking">Book roof</a></div></section><article id="booking">Preserved facts<img src="/assets/original.jpg" alt="Original"></article></main></body></html>';
  const output = applySeoHtml(fixture, path);
  assert.ok(output.includes('href="/contact/?service=roof-waterproofing#service-form"'));
  assert.ok(output.includes('<article id="booking">Preserved facts<img src="/assets/original.jpg" alt="Original"></article>'));
  assert.equal(applySeoHtml(output, path), output);
  const contact = readFileSync(new URL('../contact/index.html', import.meta.url), 'utf8');
  const restored = applySeoHtml(contact.replace('id="service-form"', '').replace(' novalidate', ''), 'contact/index.html');
  assert.match(restored, /id="service-form"/); assert.match(restored, /novalidate/);
  assert.equal(applySeoHtml(restored, 'contact/index.html'), restored);
});

test('primary navigation interaction states retain dark-on-gold contrast, focus and reduced-motion rules', () => {
  const css = readFileSync(new URL('../assets/site.css', import.meta.url), 'utf8');
  for (const state of [':hover', ':focus', '[aria-current]']) {
    assert.ok(css.includes(`.nav .button.primary${state}`));
  }
  assert.match(css, /\.nav \.button\.primary:focus-visible\s*\{[^}]*outline:/);
  assert.match(css, /\.form button:disabled\s*\{[^}]*transform:none/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^]*?\.nav \.button[^}]*transition:none/);
});
