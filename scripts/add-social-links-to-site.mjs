import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applySocialLinks } from './social-links.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const visit = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(path);
      continue;
    }
    if (entry.name !== 'index.html') continue;
    const before = readFileSync(path, 'utf8');
    const after = applySocialLinks(before);
    if (after !== before) writeFileSync(path, after);
  }
};

visit(root);
