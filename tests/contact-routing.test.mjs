import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/contact.mjs';

test('customer confirmation dials the unified phone while its displayed number is preserved', async () => {
  const before = { fetch: globalThis.fetch, key: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM_EMAIL };
  const payloads = [];
  try {
    process.env.RESEND_API_KEY = 'synthetic-not-valid';
    process.env.RESEND_FROM_EMAIL = 'sender@example.test';
    globalThis.fetch = async (_url, init) => { payloads.push(JSON.parse(init.body)); return { ok: true }; };
    const res = { setHeader() {}, status(code) { this.code=code; return this; }, json(body) { this.body=body; return this; } };
    await handler({ method:'POST', body:{ name:'Synthetic', email:'customer@example.test', phone:'', suburb:'Canberra', area:'Shower', message:'Routing check' } }, res);
    assert.equal(res.code, 200);
    assert.equal(payloads.length, 2);
    assert.match(payloads[1].html, /href="tel:\+611300838722">0482 422 607<\/a>/);
  } finally {
    globalThis.fetch=before.fetch;
    for (const [name,val] of [['RESEND_API_KEY',before.key],['RESEND_FROM_EMAIL',before.from]]) {
      if (val===undefined) delete process.env[name]; else process.env[name]=val;
    }
  }
});
