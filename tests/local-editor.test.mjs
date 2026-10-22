import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const editor=await import('../.local-tools/content.mjs').catch(()=>null);
test('all current bilingual pages expose every nonempty paragraph as one field and preserve existing inline formats',async()=>{
 assert.ok(editor,'local editor implementation must exist');
 const {createRequire}=await import('node:module');
 const {load}=createRequire(new URL('../.local-tools/package.json',import.meta.url))('cheerio');
 const pages=editor.pages();assert.equal(pages.length,57);
 for(const page of pages){
  const model=editor.readModel(page.file),$=load(model.chinese);
  const count=$('body p').filter((_,p)=>$(p).text().trim().length>0).length;
  assert.equal(model.fields.filter(field=>field.tag==='p'&&field.kind==='block').length,count,page.file+' paragraph coverage');
  for(const field of model.fields)if(field.kind==='block')assert.doesNotThrow(()=>editor.validateField(field,field.html),page.file+' '+field.id);
 }
});
test('whole paragraphs including inline links, navigation and footer are editable without exposing scripts',()=>{
 assert.ok(editor,'local editor implementation must exist');
 const en='<html><head><title>Repair</title></head><body><nav><a href="/">Home</a></nav><main><h1>Repair</h1><p>Read <a href="/guide/">our guide</a> before repair.</p><details><summary>Leak?</summary><p>Assess it.</p></details></main><footer><p>Call 0482 422 607</p></footer><script>privateCode()</script></body></html>';
 const zh=en.replaceAll('Repair','维修').replace('Read ','阅读 ').replace('our guide','我们的指南').replace(' before repair.',' 再维修。');
 const model=editor.modelFromHtml('index.html',en,zh);
 assert.ok(model.fields.some(f=>f.english==='Read our guide before repair.'));
 assert.ok(model.fields.some(f=>f.english==='Home'));
 assert.ok(model.fields.some(f=>f.english==='Call 0482 422 607'));
 assert.ok(!model.fields.some(f=>f.english.includes('privateCode')));
 const paragraph=model.fields.find(f=>f.english==='Read our guide before repair.');
 const output=editor.previewHtml(model,{[paragraph.id]:{zh:'阅读 <a href="/guide/">完整指南</a> 后安排维修。'}},'zh');
 assert.match(output,/<a href="\/guide\/">完整指南<\/a>/);
 assert.doesNotMatch(output,/<script>privateCode/);
 assert.throws(()=>editor.validateField(paragraph,'<img src=x onerror=alert(1)>'),/格式|标签/);
 assert.throws(()=>editor.validateField(paragraph,'<a href="https://evil.test">坏链接</a>'),/链接|格式/);
});
test('saved revisions survive restart and reject stale, unknown and changed-source drafts',async()=>{
 assert.ok(editor,'local editor implementation must exist');
 const {createStore}=await import('../.local-tools/store.mjs');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'waterproof-editor-'));
 try{
  const field={id:'body-0',zh:'原文',english:'Original',kind:'text',html:'原文'};
  const model={file:'index.html',baseHash:'base',fields:[field]};
  const store=createStore(dir);
  const next=await store.save(model,{revision:0,baseHash:'base',values:{'body-0':{zh:'修改整段'}}});
  assert.equal(next.revision,1);
  assert.equal((await createStore(dir).read(model)).values['body-0'].zh,'修改整段');
  await assert.rejects(()=>store.save(model,{revision:0,baseHash:'base',values:{}}),/其他窗口/);
  await assert.rejects(()=>store.save(model,{revision:1,baseHash:'other',values:{}}),/源码/);
  await assert.rejects(()=>store.save(model,{revision:1,baseHash:'base',values:{unknown:{zh:'不存在'}}}),/未知/);
  const restored=await store.restore(model,0,1);
  assert.equal(restored.revision,2);assert.deepEqual(restored.values,{});
  assert.equal((await store.history(model)).length,3);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('server rejects foreign requests and serves only registered previews and assets',async()=>{
 assert.ok(editor,'local editor implementation must exist');
 const {startEditor}=await import('../.local-tools/server.mjs');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'waterproof-editor-http-'));
 const app=await startEditor({port:0,directory:dir});
 try{
  const html=await (await fetch(app.origin+'/__editor/')).text();
  assert.match(html,/Canberra Waterproof/);
  const token=html.match(/name="editor-session" content="([^"]+)"/)[1];
  assert.equal((await fetch(app.origin+'/__editor/api/state')).status,403);
  const headers={'x-editor-token':token};
  const state=await (await fetch(app.origin+'/__editor/api/state',{headers})).json();
  assert.equal(state.pages.length,57);
  assert.equal((await fetch(app.origin+'/.git/config')).status,404);
  assert.equal((await fetch(app.origin+'/api/contact',{method:'POST'})).status,405);
  const foreign=await fetch(app.origin+'/__editor/api/save',{method:'POST',headers:{...headers,origin:'https://evil.test','content-type':'application/json'},body:'{}'});
  assert.equal(foreign.status,403);
  const preview=await (await fetch(app.origin+'/zh/services/leaking-shower-repairs/')).text();
  assert.match(preview,/data-editor-field/);assert.doesNotMatch(preview,/<iframe/);
 }finally{await app.close();await fs.rm(dir,{recursive:true,force:true});}
});
