import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// The only substituted boundaries are the DOM and network; execute the shipped
// script against controls derived from the real contact markup.
export function serviceFormBrowser({ search = '', values = {}, fetch: request, hook } = {}) {
  const html = readFileSync(new URL('../../contact/index.html', import.meta.url), 'utf8');
  const fields = new Map(), errors = new Map();
  let focused, submit, resets = 0;
  for (const match of html.matchAll(/<(input|select|textarea)\b([^>]*\bname="([^"]+)"[^>]*)>/g)) {
    const [, tag, attrs, name] = match;
    const attributes = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    const initial = attributes.value || (tag === 'select' && !html.includes('<option value="">') ? 'Shower' : '');
    fields.set(name, { name, id: attributes.id, value: initial,
      getAttribute: key => attributes[key] ?? null,
      setAttribute: (key, value) => { attributes[key] = String(value); },
      removeAttribute: key => { delete attributes[key]; },
      focus: () => { focused = name; }, addEventListener() {},
      style: {}, scrollHeight: 180 });
  }
  for (const match of html.matchAll(/id="([^"]+-error)"/g)) errors.set(match[1], { textContent: '', hidden: true });
  const status = { textContent: '', dataset: {} }, attributes = {}, button = { disabled: false, textContent: 'Request assessment' };
  const form = {
    addEventListener: (event, fn) => { if (event === 'submit') submit = fn; },
    querySelector: selector => selector.includes('submit') ? button : fields.get(selector.match(/name="([^"]+)"/)?.[1]),
    setAttribute: (key, value) => { attributes[key] = value; }, removeAttribute: key => { delete attributes[key]; },
    reportValidity: () => true,
    reset: () => { resets++; for (const field of fields.values()) field.value = ''; },
  };
  const context = {
    document: { querySelector: selector => selector === '[data-service-form]' ? form : status,
      getElementById: id => errors.get(id) || [...fields.values()].find(field => field.id === id) },
    window: { location: { search }, melOneTrackLead: hook }, URLSearchParams, Object, AbortController, setTimeout, clearTimeout,
    FormData: class { entries() { return [...fields].map(([name, field]) => [name, field.value]); } },
    fetch: request || (async () => { throw Error('Unexpected network request'); }),
  };
  vm.runInNewContext(readFileSync(new URL('../../assets/service-form.js', import.meta.url), 'utf8'), context);
  for (const [name, value] of Object.entries(values)) fields.get(name).value = value;
  return { fields, errors, status, button, attributes, get focused() { return focused; }, get resets() { return resets; },
    submit: () => submit({ preventDefault() {} }) };
}

export const validEnquiry = { name: 'Local test', phone: '', email: 'test@example.test', suburb: 'Aranda', area: 'Bathroom', message: 'Local test enquiry only' };
