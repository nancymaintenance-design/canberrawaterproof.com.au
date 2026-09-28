import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const pages = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile() && entry.name === 'index.html') pages.push(fullPath);
  }
};
walk(root);

test('published content images reserve layout space', () => {
  for (const page of pages) {
    const images = [...fs.readFileSync(page, 'utf8').matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    for (const image of images) {
      assert.match(image, /\bwidth="\d+"/i, `${page}: ${image}`);
      assert.match(image, /\bheight="\d+"/i, `${page}: ${image}`);
    }
  }
});
