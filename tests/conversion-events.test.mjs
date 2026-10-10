import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { applySeoHtml } from '../scripts/apply-seo-maintenance.mjs';
const sourceUrl = new URL('../assets/conversion-events.js', import.meta.url);
const source = existsSync(sourceUrl) ? readFileSync(sourceUrl, 'utf8') : '';
function browser(hostname = 'www.canberrawaterproof.com.au', gtag) {
 const events = [], handlers = [];
 const window = { location: { hostname, origin: 'https://' + hostname }, gtag: gtag || ((...args) => events.push(JSON.parse(JSON.stringify(args)))) };
 const context = vm.createContext({ window, document: { addEventListener: (_, fn) => handlers.push(fn) }, URL, queueMicrotask });
 const init = () => vm.runInContext(source, context);
 init();
 return { window, events, handlers, init, async click(href, cancelled = false) {
  const event = { button: 0, defaultPrevented: false, target: { closest: () => href ? { getAttribute: () => href } : null } };
  handlers.forEach(fn => fn(event));
  event.defaultPrevented = cancelled;
  await Promise.resolve();
 } };
}
test('delegated intents emit fixed enums once and preserve navigation', async () => {
 const b = browser(); b.init();
 assert.equal(b.handlers.length, 1);
 for (const href of ['tel:+61482422607', 'mailto:private@example.test?body=secret', '/contact/?name=secret']) await b.click(href);
 assert.deepEqual(b.events, [['event','phone_click',{contact_type:'phone'}],['event','email_click',{contact_type:'email'}],['event','booking_click',{contact_type:'booking'}]]);
});
test('unrelated, external contact and cancelled clicks emit nothing', async () => {
 const b = browser();
 for (const href of [null, '/about/', 'https://other.test/contact/']) await b.click(href);
 await b.click('/contact/', true);
 assert.deepEqual(b.events, []);
});
test('same-origin booking fragments emit intent while unrelated external and cancelled fragments do not', async () => {
 const b = browser();
 for (const href of ['#booking', '/waterproofing/woden/#booking', 'https://www.canberrawaterproof.com.au/waterproofing/woden/?name=secret#booking']) await b.click(href);
 assert.deepEqual(b.events, Array.from({length:3}, () => ['event','booking_click',{contact_type:'booking'}]));
 for (const href of ['#other', '/waterproofing/woden/#other', 'https://other.test/waterproofing/woden/#booking']) await b.click(href);
 await b.click('#booking', true);
 assert.equal(b.events.length, 3);
});
test('loopback previews suppress all new events', async () => {
 for (const host of ['localhost','127.0.0.1','::1','[::1]']) {
  const b = browser(host); await b.click('tel:secret');
  assert.equal(typeof b.window.melOneTrackLead, 'function');
  b.window.melOneTrackLead({name:'secret'});
  assert.deepEqual(b.events, []);
 }
});
test('missing or throwing analytics never breaks click or lead hook', async () => {
 for (const gtag of [() => { throw new Error('analytics'); }, null]) {
  const b = browser(); b.window.gtag = gtag;
  await b.click('/contact/');
  assert.doesNotThrow(() => b.window.melOneTrackLead());
 }
});
async function submit(response, throwingHook = false) {
 let handler, leads = 0, resets = 0, requests = 0;
 const status = { dataset: {} }, button = {};
 const form = { addEventListener: (_, fn) => { handler = fn; }, reportValidity: () => true, querySelector: () => button, reset: () => resets++ };
 const context = { document: { querySelector: selector => selector === '[data-service-form]' ? form : status }, window: { melOneTrackLead: (...args) => { assert.deepEqual(args, []); leads++; if (throwingHook) throw Error('analytics'); } }, FormData: class { entries() { return [['name','secret'],['email','private@example.test']]; } }, fetch: async () => { requests++; return response; } };
 vm.runInNewContext(readFileSync(new URL('../assets/service-form.js',import.meta.url),'utf8'), context);
 await handler({preventDefault() {}});
 return {leads, resets, requests, state:status.dataset.state, disabled:button.disabled};
}
test('lead fires once only for accepted response including unconfirmed email', async () => {
 for (const confirmationSent of [true,false]) {
  const result = await submit({ok:true,json:async()=>({ok:true,confirmationSent})});
  assert.deepEqual(result, {leads:1,resets:1,requests:1,state:'success',disabled:false});
 }
 for (const body of [{}, {ok:false}, {ok:true}, {ok:true,confirmationSent:'yes'}]) {
  assert.equal((await submit({ok:true,json:async()=>body})).leads,0);
 }
 assert.equal((await submit({ok:false,json:async()=>({ok:true,confirmationSent:true})})).leads,0);
 assert.equal((await submit({ok:true,json:async()=>{throw Error('invalid JSON');}})).leads,0);
});
test('analytics failure leaves accepted form successful without retry', async () => {
 assert.deepEqual(await submit({ok:true,json:async()=>({ok:true,confirmationSent:false})},true), {leads:1,resets:1,requests:1,state:'success',disabled:false});
 const b = browser(); b.window.melOneTrackLead({name:'secret'});
 assert.deepEqual(b.events,[['event','generate_lead',{method:'contact_form'}]]);
});
test('maintenance installs one deferred conversion hook after regeneration', () => {
 const input = '<html><head></head><body><main>Original</main></body></html>';
 const output = applySeoHtml(input,'contact/index.html');
 assert.equal((output.match(/<script src="\/assets\/conversion-events.js" defer><\/script>/g)||[]).length,1);
 assert.equal(applySeoHtml(output,'contact/index.html'),output);
});
