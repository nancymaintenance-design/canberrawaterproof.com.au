import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyDistrictExplanation } from '../scripts/district-explanation.mjs';

test('district explanation removes only redundant symptom lead and links existing help idempotently', () => {
 const lead = 'Water-entry signs often appear after rain, shower use or routine cleaning. ';
 const input = '<h2>Common water-entry signs in Belconnen</h2><p>'+lead+'If water is actively entering a property, protect people and belongings first.</p><ul><li>Discolouration</li></ul>';
 const output = applyDistrictExplanation(input, {kind:'district',slug:'belconnen'});
 assert.ok(!output.includes(lead));
 assert.match(output, /If water is actively entering a property, protect people and belongings first\./);
 assert.match(output, /href="\/services\/bathroom-waterproofing\/"/);
 assert.match(output, /href="\/faq\/"/);
 assert.equal(applyDistrictExplanation(output,{kind:'district',slug:'belconnen'}),output);
 assert.equal(applyDistrictExplanation(input,{kind:'locality',slug:'aranda'}),input);
});

test('nine shipped hubs preserve headings and claims while linking help without unrelated project claims', () => {
 const slugs = ['belconnen','gungahlin','inner-north-city','inner-south','woden-valley','weston-creek-molonglo','tuggeranong','east-canberra','act-localities'];
 for (const slug of slugs) {
  const html = readFileSync(new URL('../waterproofing/'+slug+'/index.html',import.meta.url),'utf8');
  assert.match(html,/data-district-help/);
  assert.doesNotMatch(html,/Water-entry signs often appear/);
  assert.match(html,/10\+ years/);
  assert.match(html,/10,000\+ customers/);
  assert.match(html,/name="robots" content="index,follow"/);
  assert.match(html,/<h2>Waterproofing assessment and repairs in /);
  assert.doesNotMatch(html,/<h2>How the Ellis team carries out/);
  assert.match(html,/Office reception: daily 09:00–21:00/);
  if (slug === 'woden-valley') assert.match(html,/href="\/services\/roof-waterproofing\/#isaacs-roof"/);
  else assert.doesNotMatch(html,/Isaacs|April 2026/);
 }
});
