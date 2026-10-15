import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const serviceSlugs = new Set(['leaking-shower-repairs', 'bathroom-waterproofing', 'shower-resealing-regrouting', 'balcony-waterproofing', 'kitchen-sealing', 'external-waterproofing', 'laundry-waterproofing', 'roof-waterproofing', 'retaining-wall-waterproofing', 'tile-regrouting', 'commercial-waterproofing']);
const areas = ['Shower', 'Bathroom', 'Balcony', 'Kitchen', 'Laundry', 'External', 'Roof', 'Retaining wall', 'Tiled area', 'Commercial property', 'Not sure / Other'];
const labels = { name: 'Name (required)', phone: 'Phone (optional)', email: 'Email (required)', suburb: 'Suburb or postcode (required)', area: 'Affected area (required)', message: 'Tell us about the repair needed (required)' };
const autocomplete = { name: 'name', phone: 'tel', email: 'email' };

export function applyEnquiryFlow(html, path) {
  // Only assessment destinations are normalised; service/project discovery links retain their labels.
  html = html.replace(/<a\b([^>]*class="button primary"[^>]*)>[\s\S]*?<\/a>/g, (whole, attributes) =>
    /href="\/contact\/(?:#service-form)?"/.test(attributes) ? `<a${attributes.replace(/href="[^"]*"/, 'href="/contact/#service-form"')}>Request assessment</a>` : whole);
  html = html.replace(/<nav\b[^>]*class="mobile"[\s\S]*?<\/nav>/g, nav => nav.replace(
    /<a\b[^>]*href="(?:\/contact\/(?:#service-form)?|#(?:booking|service-form))"[^>]*>[\s\S]*?<\/a>/g,
    '<a href="/contact/#service-form">Request assessment</a>',
  ));
  html = html.replace(/<nav\b[^>]*class="nav"[\s\S]*?<\/nav>/g, nav => nav.replace(
    /<a\b[^>]*class="button primary"[^>]*>[\s\S]*?<\/a>/g,
    `<a class="button primary" href="/contact/#service-form"${path === 'contact/index.html' ? ' aria-current="page"' : ''}>Request assessment</a>`,
  ));
  const slug = path.match(/^services\/([^/]+)\/index\.html$/)?.[1];
  if (serviceSlugs.has(slug)) {
    html = html.replace(/<section class="page-intro(?: service-hero)?">[\s\S]*?<\/section>/, hero => hero.replace(
      /<a\b[^>]*class="button primary"[^>]*>[\s\S]*?<\/a>/,
      `<a class="button primary" href="/contact/?service=${slug}#service-form">Request assessment</a>`,
    ));
  }
  if (path === 'contact/index.html') {
    html = html.replace(/<section class="page-intro">[\s\S]*?<\/section>/, opening => {
      opening = opening.replace(' You can submit this form without photos. If you have photos taken safely, email them to riley@melonemaintenance.com.au.', '');
      return opening.includes('href="#service-form"') ? opening : opening.replace('</div></section>', '<div class="actions"><a class="button primary" href="#service-form">Describe the repair</a><a class="button secondary" href="tel:+61482422607">Call 0482 422 607</a></div></div></section>');
    });
  }
  html = html.replace(/<form\b[^>]*data-service-form[^>]*>[\s\S]*?<\/form>/g, form => {
    form = form.replace(/<form\b([^>]*)>/, (_, attributes) => `<form${attributes.replace(/\s(?:id="[^"]*"|novalidate)/g, '')} id="service-form" novalidate>`);
    if (!form.includes('data-enquiry-fields')) {
      form = form.replace(/<label\b[^>]*>[\s\S]*?<\/label>/g, label => {
        const name = label.match(/\bname="([^"]+)"/)?.[1];
        if (!labels[name]) return label;
        const id = name === 'suburb' ? 'suburb' : `service-${name}`;
        let control = label.match(/<(?:input|select|textarea)\b[\s\S]*/)?.[0].replace(/<\/label>$/, '');
        control = control.replace(/^(<(?:input|select|textarea)\b)([^>]*)(>)/, (_, tag, attrs, end) =>
          tag + attrs.replace(/\s(?:id|autocomplete|aria-describedby|maxlength)="[^"]*"/g, '') + ` id="${id}" aria-describedby="${id}-error"` +
          (name === 'area' ? '' : ' maxlength="4000"') + (autocomplete[name] ? ` autocomplete="${autocomplete[name]}"` : '') + end);
        if (name === 'area') control = control.replace(/(<select\b[^>]*>)[\s\S]*?<\/select>/, '$1<option value="">Select affected area</option>' + areas.map(area => `<option>${area}</option>`).join('') + '</select>');
        return `<div class="form-field" data-enquiry-fields><label for="${id}">${labels[name]}</label>${control}<span class="field-error" id="${id}-error" hidden></span></div>`;
      });
    }
    return form.replace(/(<button\b[^>]*type="submit"[^>]*>)[\s\S]*?<\/button>/, '$1Request assessment</button>');
  });
  // The shared script owns both safe prefills, including locality defaults.
  return html.replace(/<script>const q=new URLSearchParams\(location\.search\)\.get\('suburb'\);if\(q\)document\.getElementById\('suburb'\)\.value=q;<\/script>/g, '');
}

export function installEnquiryFlow(root) {
  const changed = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', 'assets'].includes(entry.name)) continue;
      const file = resolve(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) {
        const path = relative(root, file).replaceAll('\\', '/');
        const before = readFileSync(file, 'utf8'), after = applyEnquiryFlow(before, path);
        if (before !== after) { writeFileSync(file, after); changed.push(path); }
      }
    }
  }
  walk(root);
  return { changed };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(installEnquiryFlow(resolve(dirname(fileURLToPath(import.meta.url)), '..'))));
}
