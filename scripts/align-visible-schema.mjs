import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'tests'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}

function plainText(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

walk(root);
let aligned = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const visibleAnswers = new Map();
  for (const match of before.matchAll(/<details\b[^>]*>[\s\S]*?<summary>([\s\S]*?)<\/summary>[\s\S]*?<p(?:\s+data-faq-answer)?[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi)) {
    visibleAnswers.set(plainText(match[1]), plainText(match[2]));
  }
  if (!visibleAnswers.size) continue;

  let after = before.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (script, raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return script; }
    const graph = data['@graph'] || [data];
    let changed = false;
    for (const item of graph) {
      if (item['@type'] !== 'FAQPage' || !Array.isArray(item.mainEntity)) continue;
      const matches = item.mainEntity.filter((qa) => visibleAnswers.has(plainText(qa.name)));
      if (matches.length !== item.mainEntity.length) changed = true;
      item.mainEntity = matches;
      for (const qa of matches) {
        const answer = visibleAnswers.get(plainText(qa.name));
        if (qa.acceptedAnswer?.text !== answer) changed = true;
        qa.acceptedAnswer = { ...qa.acceptedAnswer, '@type': 'Answer', text: answer };
      }
    }
    if (!changed) return script;
    aligned += 1;
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
  if (after !== before) writeFileSync(file, after);
}
console.log(`Aligned visible FAQ copy and FAQPage schema on ${aligned} pages.`);
