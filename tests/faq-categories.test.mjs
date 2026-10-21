import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const original = execFileSync('git', ['show', 'HEAD:faq/index.html'], { encoding: 'utf8', cwd: new URL('..', import.meta.url) });
const load = async () => {
  try { return await import('../scripts/faq-categories.mjs'); }
  catch (error) { if (error.code === 'ERR_MODULE_NOT_FOUND') return {}; throw error; }
};
const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const questions = html => [...html.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/g)].map(m => ({
  name: plain(m[0].match(/<summary>([\s\S]*?)<\/summary>/)[1]),
  text: [...m[0].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(p => plain(p[1])).join(' '),
}));

test('FAQ groups retained questions in three navigable categories without losing answer links', async () => {
  const { applyFaqCategories } = await load();
  assert.equal(typeof applyFaqCategories, 'function', 'FAQ category helper must exist');
  const output = applyFaqCategories(original);
  const categories = [...output.matchAll(/<section class="faq-category" aria-labelledby="([^"]+)">/g)].map(m => m[1]);
  assert.deepEqual(categories, ['service-enquiries-quotes', 'leak-symptoms-repair-scenarios', 'waterproofing-knowledge-materials']);
  const before = questions(original), after = questions(output);
  assert.equal(after.length, before.length, 'classification retains every authored question');
  assert.deepEqual([...after].sort((a,b) => a.name.localeCompare(b.name)), [...before].sort((a,b) => a.name.localeCompare(b.name)));
  for (const id of categories) assert.ok(output.includes(`href="#${id}"`));
  for (const id of ['areas', 'bathrooms', 'tile-joints', 'balconies', 'kitchen-laundry', 'roof-external', 'quotes', 'safety']) {
    assert.equal([...output.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1, `preserve inbound #${id} once`);
  }
  for (const link of original.matchAll(/<details>[\s\S]*?<\/details>/g)) {
    for (const href of link[0].matchAll(/href="([^"]+)"/g)) assert.ok(output.includes(`href="${href[1]}"`));
  }
});

test('FAQ schema follows rendered question order and complete visible answer text', async () => {
  const { applyFaqCategories } = await load();
  assert.equal(typeof applyFaqCategories, 'function');
  const output = applyFaqCategories(original);
  const graph = JSON.parse(output.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const faq = graph.find(n => n['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map(q => ({ name: q.name, text: q.acceptedAnswer.text })), questions(output));
  assert.equal(applyFaqCategories(output), output, 'maintenance can safely run twice');
  assert.equal(output.match(/<header[\s\S]*?<\/header>/)[0], original.match(/<header[\s\S]*?<\/header>/)[0]);
  assert.equal(output.match(/<footer[\s\S]*?<\/footer>/)[0], original.match(/<footer[\s\S]*?<\/footer>/)[0]);
});

test('unrelated pages pass through and unsupported FAQ shapes fail without dropping content', async () => {
  const { applyFaqCategories } = await load();
  assert.equal(typeof applyFaqCategories, 'function');
  assert.equal(applyFaqCategories('<main><p>Unrelated page</p></main>'), '<main><p>Unrelated page</p></main>');
  assert.throws(() => applyFaqCategories(original.replaceAll('What is a bond breaker, and is it tile grout?', 'Unclassified new question?')), /Unclassified FAQ question/);
});
