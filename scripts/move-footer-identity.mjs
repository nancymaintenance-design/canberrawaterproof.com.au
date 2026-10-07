import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const files = execFileSync('rg', ['--files', '-g', '*.html'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/);
const identity = '<div class="footer-identity"><p>Waterproofing and leak repair services across Canberra.</p><p>121 Marcus Clarke St, Canberra, ACT 2600</p></div>';

for (const relativeFile of files) {
  const file = resolve(root, relativeFile);
  let html = readFileSync(file, 'utf8');
  // Remove the old copy only from the logo column. Never remove the copy
  // already placed in the contact column when this script runs again.
  html = html.replace(/(<footer class="footer"><div class="wrap footer-grid"><div><img[^>]*>)<p>Waterproofing and leak repair services across Canberra.<\/p><p>121 Marcus Clarke St, Canberra, ACT 2600<\/p>/, '$1');
  if (html.includes('class="footer-identity"')) {
    html = html.replace(/<div class="footer-identity">[\s\S]*?<\/div>/, identity);
  } else {
    html = html.replace('<a href="/privacy-policy/">Privacy Policy</a></div></div></footer>', `<a href="/privacy-policy/">Privacy Policy</a>${identity}</div></div></footer>`);
  }
  writeFileSync(file, html);
}
