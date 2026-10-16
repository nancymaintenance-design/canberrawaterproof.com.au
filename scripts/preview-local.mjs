import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const port=Number(process.argv[2]||4192);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({error:'本地预览不发送申请。Local preview does not send enquiries.'}));return;}
 let route;try{route=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);res.end();return;}
 if(route.split(/[\\/]/).some(part=>part.startsWith('.'))||/^\/(?:api|scripts|tests|docs)(?:\/|$)/.test(route)||route.startsWith('/data/i18n/')){res.writeHead(404);res.end();return;}
 const fallback=route.startsWith('/zh/')?'zh/404.html':'404.html';
 try{
  let target=path.resolve(root,'.'+route);if(target!==root&&!target.startsWith(root+path.sep))throw Error('outside root');
  if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  const real=fs.realpathSync(target);if(!real.startsWith(root+path.sep)||!fs.statSync(real).isFile()||!mime[path.extname(real)])throw Error('not public');
  const content=fs.readFileSync(real);res.writeHead(200,{'Content-Type':mime[path.extname(real)],'Content-Length':content.length});res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:fs.readFileSync(path.join(root,fallback)));}
});
server.listen(port,'127.0.0.1',()=>console.log(`Bilingual local preview http://127.0.0.1:${port}/zh/ — no production writes or enquiries`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
