import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {ROOT,pages,readModel,previewHtml} from './content.mjs';
import {createStore} from './store.mjs';
const tools=path.dirname(fileURLToPath(import.meta.url));
export async function startEditor({port=4220,directory=path.join(ROOT,'.local-editor')}={}){
 const token=randomBytes(32).toString('hex'),store=createStore(directory),catalog=pages();
 let host;
 const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
 const server=http.createServer(async(req,res)=>{try{
  if(req.headers.host!==host)return json(res,403,{error:'后台只允许本机访问。'});
  const url=new URL(req.url,'http://'+host),pathname=decodeURIComponent(url.pathname);
  if(pathname==='/__editor/health'&&req.method==='GET')return json(res,200,{project:'Canberra Waterproof',root:ROOT,origin:'http://'+host});
  if(pathname.startsWith('/__editor/api/')){
   if(req.headers['x-editor-token']!==token||(req.headers.origin&&req.headers.origin!=='http://'+host))return json(res,403,{error:'会话已失效，请刷新后台。未保存文字请先复制。'});
   if(pathname==='/__editor/api/state'&&req.method==='GET')return json(res,200,{pages:catalog});
   const file=url.searchParams.get('file'),model=readModel(file);
   if(pathname==='/__editor/api/page'&&req.method==='GET'){
    const draft=await store.read(model);
    return json(res,200,{model:{...model,english:undefined,chinese:undefined},draft,stale:draft.baseHash!==model.baseHash});
   }
   if(pathname==='/__editor/api/history'&&req.method==='GET')return json(res,200,await store.history(model));
   if(req.method!=='POST'||req.headers.origin!=='http://'+host)return json(res,405,{error:'不支持的操作。'});
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>4000000)return json(res,413,{error:'草稿过大，请分批修改。'});}
   let data;try{data=JSON.parse(body);}catch{return json(res,400,{error:'草稿格式不正确。'});}
   if(pathname==='/__editor/api/save')return json(res,200,await store.save(model,data));
   if(pathname==='/__editor/api/restore')return json(res,200,await store.restore(model,data.version,data.revision));
   return json(res,404,{error:'未找到该操作。'});
  }
  if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'本地预览不发送询盘。'});
  if(pathname==='/__editor/'||pathname==='/__editor'){
   const html=(await fs.readFile(path.join(tools,'ui/index.template'),'utf8')).replace('EDITOR_SESSION_TOKEN',token);
   res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-frame-options':'DENY','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-src 'self'; object-src 'none'; base-uri 'none'"});return res.end(html);
  }
  const ui=pathname.match(/^\/__editor\/(editor\.(?:css|js)|preview\.js)$/);
  if(ui){res.writeHead(200,{'content-type':ui[1].endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','cache-control':'no-store'});return res.end(await fs.readFile(path.join(tools,'ui',ui[1])));}
  if(pathname.startsWith('/assets/')){
   const full=path.resolve(ROOT,'.'+pathname),assetRoot=path.join(ROOT,'assets');
   if(!full.startsWith(assetRoot+path.sep)||!['.css','.png','.jpg','.jpeg','.webp','.svg','.woff','.woff2','.ico'].includes(path.extname(full).toLowerCase()))return json(res,404,{error:'Not found'});
   const real=await fs.realpath(full);if(!real.startsWith(assetRoot+path.sep))return json(res,404,{error:'Not found'});
   const types={'.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2'};
   res.writeHead(200,{'content-type':types[path.extname(full)]||'application/octet-stream','x-content-type-options':'nosniff'});return res.end(await fs.readFile(full));
  }
  const chinese=pathname.startsWith('/zh/'),route=chinese?pathname.slice(3):pathname;
  const page=catalog.find(p=>p.url===route);
  if(!page)return json(res,404,{error:'页面未登记。'});
  const model=readModel(page.file),draft=await store.read(model);
  if(draft.baseHash!==model.baseHash)return json(res,409,{error:'源码已变化，旧草稿待助手合并。'});
  const html=previewHtml(model,draft.values,chinese?'zh':'en');
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-frame-options':'SAMEORIGIN','content-security-policy':"default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"});return res.end(html);
 }catch(error){json(res,error.status||(error.code==='ENOENT'?404:500),{error:error.status?error.message:'本地读取或保存失败，请保留输入后重试。'});}});
 for(let i=0;;i++){try{await new Promise((resolve,reject)=>{const onError=e=>{server.off('listening',onListen);reject(e);};const onListen=()=>{server.off('error',onError);resolve();};server.once('error',onError);server.once('listening',onListen);server.listen(port?port+i:0,'127.0.0.1');});break;}catch(e){if(e.code!=='EADDRINUSE'||i>=20)throw e;}}
 host='127.0.0.1:'+server.address().port;
 return {origin:'http://'+host,close:()=>new Promise(resolve=>server.close(resolve))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const app=await startEditor();await fs.mkdir(path.join(ROOT,'.local-editor'),{recursive:true});
 await fs.writeFile(path.join(ROOT,'.local-editor/state.json'),JSON.stringify({origin:app.origin,pid:process.pid,root:ROOT}));
 console.log('Canberra Waterproof 本地后台 '+app.origin+'/__editor/');
}
