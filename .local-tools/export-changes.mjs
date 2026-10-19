import fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT,pages,readModel} from './content.mjs';
import {createStore} from './store.mjs';
const store=createStore(path.join(ROOT,'.local-editor')),changes=[];
for(const page of pages()){
 const model=readModel(page.file),draft=await store.read(model);
 if(!Object.keys(draft.values).length)continue;
 changes.push({file:page.file,revision:draft.revision,baseHash:draft.baseHash,stale:draft.baseHash!==model.baseHash,fields:Object.entries(draft.values).map(([id,value])=>({id,...value,original:model.fields.find(f=>f.id===id)}))});
}
console.log(JSON.stringify({project:'Canberra Waterproof',changes},null,2));
