import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const slugs = [
  'leaking-shower-repairs', 'bathroom-waterproofing',
  'shower-resealing-regrouting', 'balcony-waterproofing',
  'kitchen-sealing', 'external-waterproofing',
];

for (const slug of slugs) {
  const file = resolve('services', slug, 'index.html');
  const before = readFileSync(file, 'utf8');
  const after = before.replace(
    /<script type="application\/ld\+json">(?=[^<]*#service-faq)[\s\S]*?<\/script>/g,
    '',
  );
  if (after !== before) writeFileSync(file, after);
}
