import fs from 'node:fs/promises';
import path from 'node:path';
import {validateField} from './content.mjs';
const failure=(status,message)=>Object.assign(Error(message),{status});
export function createStore(directory){
 let queue=Promise.resolve();
 const dir=model=>path.join(directory,'drafts',model.file.replaceAll('/','~'));
 const read=async model=>{try{return JSON.parse(await fs.readFile(path.join(dir(model),'draft.json'),'utf8'));}catch(e){if(e.code==='ENOENT')return {revision:0,baseHash:model.baseHash,values:{}};throw e;}};
 const atomic=async(file,value)=>{await fs.writeFile(file+'.tmp',JSON.stringify(value,null,2)+'\n');await fs.rename(file+'.tmp',file);};
 const exclusive=action=>{const result=queue.then(action);queue=result.catch(()=>{});return result;};
 async function commit(model,input){
  const current=await read(model);
  if(current.revision!==input.revision)throw failure(409,'其他窗口已保存新版本。请复制当前内容，重新载入后核对。');
  if(current.baseHash!==model.baseHash||input.baseHash!==model.baseHash)throw failure(409,'网站源码已变化，请通知助手合并草稿。旧草稿不会被覆盖。');
  if(!input.values||Array.isArray(input.values)||typeof input.values!=='object')throw failure(400,'草稿格式不正确。');
  const values={};
  for(const [id,entry]of Object.entries(input.values)){
   const field=model.fields.find(f=>f.id===id);if(!field)throw failure(400,'未知文字位置，请重新载入。');
   values[id]={zh:validateField(field,entry?.zh)};
  }
  const next={revision:current.revision+1,baseHash:model.baseHash,file:model.file,updatedAt:new Date().toISOString(),englishPending:true,values};
  const folder=dir(model);await fs.mkdir(path.join(folder,'history'),{recursive:true});
  await atomic(path.join(folder,'history',current.revision+'.json'),current);
  await atomic(path.join(folder,'draft.json'),next);
  await atomic(path.join(folder,'history',next.revision+'.json'),next);
  return next;
 }
 return {read,save:(model,input)=>exclusive(()=>commit(model,input)),history:async model=>{try{return (await fs.readdir(path.join(dir(model),'history'))).filter(f=>/^\d+\.json$/.test(f)).map(f=>Number.parseInt(f)).sort((a,b)=>b-a);}catch(e){if(e.code==='ENOENT')return [];throw e;}},restore:(model,version,revision)=>exclusive(async()=>{
  if(!Number.isSafeInteger(version)||version<0)throw failure(400,'历史版本无效。');
  const value=JSON.parse(await fs.readFile(path.join(dir(model),'history',version+'.json'),'utf8'));
  return commit(model,{...value,revision});
 })};
}
