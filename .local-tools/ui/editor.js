const $=id=>document.getElementById(id),token=document.querySelector('meta[name="editor-session"]').content;
let pages=[],model,draft,saved,current='index.html',selected,dirty=false,busy=false,language='zh',width=1440,generation=0,pendingNavigation,restoreVersion,pageGeneration=0;
const clone=value=>structuredClone(value),error=message=>{$('error').textContent=message;$('error').hidden=!message;};
function status(){ $('saveState').textContent=busy?'正在保存…':dirty?'有未保存修改':draft?.revision?`已保存本地 · 版本 ${draft.revision}`:'本地草稿 · 未修改';$('saveButton').disabled=busy||!dirty||!model;$('pending').textContent=draft?`${Object.keys(draft.values).length} 项本页文字待英文同步` :'';}
async function api(route,value){
 const response=await fetch('/__editor/api/'+route,{method:value===undefined?'GET':'POST',headers:{'x-editor-token':token,'content-type':'application/json'},...(value===undefined?{}:{body:JSON.stringify(value)}),signal:AbortSignal.timeout(15000)}).catch(()=>{throw Error('连接中断或超时，输入仍保留。保存结果可能已写入，请复制修改后重新载入核对版本。');});
 const data=await response.json();if(!response.ok)throw Error(data.error||'本地服务暂时不可用，请保留输入后重试。');return data;
}
function resize(){const box=$('frameViewport'),scale=Math.min(1,box.clientWidth/width);$('preview').style.width=width+'px';$('preview').style.height=Math.max(650,box.clientHeight/scale)+'px';$('preview').style.transform=`scale(${scale})`;}
new ResizeObserver(resize).observe($('frameViewport'));
function urlState(){const params=new URLSearchParams(location.search);params.set('page',current);for(const id of ['search','group']){const value=$(id).value;if(value&&value!=='all')params.set(id,value);else params.delete(id);}history.replaceState(null,'',location.pathname+'?'+params);}
function renderPages(){
 const query=$('search').value.trim().toLowerCase(),group=$('group').value;let filtered=pages.filter(p=>(group==='all'||(group==='main'?!/^\/(services|guides|waterproofing|industry-news|case-studies)\//.test(p.url):p.url.startsWith('/'+group+'/')))&&(!query||(p.title+' '+p.url).toLowerCase().includes(query)));
 $('count').textContent=`${filtered.length} / ${pages.length} 个页面`;$('clear').hidden=!query;$('pageList').replaceChildren();
 if(!filtered.length){const p=document.createElement('p');p.textContent='没有匹配页面，请清空筛选或换个词。';$('pageList').append(p);}
 for(const page of filtered){const button=document.createElement('button');button.type='button';button.textContent=page.title;button.setAttribute('aria-current',page.file===current?'page':'false');const small=document.createElement('small');small.textContent=page.url;button.append(small);button.onclick=()=>navigate(()=>openPage(page.file));$('pageList').append(button);}
 if(model)urlState();
}
const plain=value=>new DOMParser().parseFromString(value,'text/html').body.textContent;
function safeRich(value){
 const documentCopy=new DOMParser().parseFromString(value,'text/html');
 for(const node of [...documentCopy.body.querySelectorAll('*')]){
  if(!['A','STRONG','EM','B','I','SPAN','SMALL','BR','SUP','SUB','U','S','MARK','CODE','ABBR','TIME'].includes(node.tagName)){node.replaceWith(documentCopy.createTextNode(node.textContent));continue;}
  for(const attr of [...node.attributes])if(!['class','title','aria-label','lang','hreflang','rel','target','datetime','href'].includes(attr.name)||(attr.name==='href'&&!/^(\/|#|https?:|tel:|mailto:)/i.test(attr.value)))node.removeAttribute(attr.name);
 }
 return documentCopy.body.innerHTML;
}
function selectField(id){
 const field=model?.fields.find(f=>f.id===id);if(!field)return;selected=id;$('field').value=id;$('copyForm').hidden=false;
 $('fieldHeading').textContent=['metadata','attribute'].includes(field.kind)?'编辑说明文字':'编辑完整段落';
 $('scope').textContent=`${field.tag}${field.attr?' · '+field.attr:''} · ${field.scope}`;
 const value=draft.values[id]?.zh??field.html;
 $('richCopy').hidden=field.kind!=='block';$('plainCopy').hidden=field.kind==='block';
 $('copyLabel').htmlFor=field.kind==='block'?'richCopy':'plainCopy';
 if(field.kind==='block')$('richCopy').innerHTML=safeRich(value);else $('plainCopy').value=value;
 $('englishCopy').value=field.english;$('copyError').textContent='';$('plainCopy').removeAttribute('aria-invalid');$('richCopy').removeAttribute('aria-invalid');
 $('preview').contentWindow.postMessage({type:'editor-highlight',id},location.origin);
}
function updatePreview(){if(model)$('preview').contentWindow.postMessage({type:'editor-draft',values:draft.values,language},location.origin);}
function change(value){if(!selected||busy)return;draft.values[selected]={zh:value};dirty=true;generation++;const valid=plain(value).trim();const active=model.fields.find(f=>f.id===selected).kind==='block'?$('richCopy'):$('plainCopy');active.setAttribute('aria-invalid',String(!valid));$('copyError').textContent=valid?'':'内容不能为空。';status();updatePreview();}
function preview(){const route=model.route;const url=(language==='zh'?'/zh':'')+route;$('preview').src=url;$('openPreview').href=url;}
async function openPage(file){
 const ticket=++pageGeneration;error('');$('pageTitle').textContent='正在读取页面…';$('field').disabled=true;$('copyForm').hidden=true;
 try{const result=await api('page?file='+encodeURIComponent(file));if(ticket!==pageGeneration)return;
  if(result.stale)throw Error('正式源码已经变化，旧草稿需要助手合并。请勿覆盖现有草稿。');
  model=result.model;draft=result.draft;saved=clone(draft);current=file;dirty=false;selected=null;
  $('pageTitle').textContent=model.title;$('pagePath').textContent=model.route;document.title=model.title+' · 本地内容编辑';
  $('field').replaceChildren(new Option('请选择一段文字',''));
  for(const field of model.fields){const value=plain(draft.values[field.id]?.zh??field.html);$('field').add(new Option(`[${field.tag}${field.attr?':'+field.attr:''}] ${value.slice(0,70)}`,field.id));}
  $('field').disabled=false;$('coverage').textContent=`本页 ${model.fields.length} 个文字位置，含页眉页脚、完整段落及搜索信息。`;
  renderPages();preview();status();
 }catch(e){if(ticket===pageGeneration){error(e.message);$('pageTitle').textContent='页面未能载入';model=null;status();}}
}
async function save(){
 if(busy||!model)return false;
 for(const [id,value]of Object.entries(draft.values))if(!plain(value.zh).trim()){selectField(id);$('copyError').textContent='请补全内容后保存。';(model.fields.find(f=>f.id===id).kind==='block'?$('richCopy'):$('plainCopy')).focus();return false;}
 busy=true;status();error('');$('richCopy').contentEditable='false';$('plainCopy').disabled=true;
 const sent=generation;
 try{const result=await api('save?file='+encodeURIComponent(current),clone(draft));saved=clone(result);if(sent===generation){draft=result;dirty=false;}else draft.revision=result.revision;status();return !dirty;}
 catch(e){error(e.message);return false;}
 finally{busy=false;$('richCopy').contentEditable='true';$('plainCopy').disabled=false;status();}
}
function navigate(action){if(busy)return error('正在保存，请稍候。');if(!dirty)return action();pendingNavigation=action;$('navigationDialog').showModal();$('cancelNav').focus();}
$('cancelNav').onclick=()=>$('navigationDialog').close();
$('discardNav').onclick=()=>{draft=clone(saved);dirty=false;$('navigationDialog').close();status();pendingNavigation?.();};
$('saveNav').onclick=async()=>{if(await save()){$('navigationDialog').close();pendingNavigation?.();}};
$('saveButton').onclick=save;$('copyForm').onsubmit=e=>e.preventDefault();$('reload').onclick=()=>navigate(()=>openPage(current));
$('field').onchange=()=>selectField($('field').value);
$('richCopy').oninput=()=>change(safeRich($('richCopy').innerHTML));$('plainCopy').oninput=()=>{change($('plainCopy').value);$('plainCopy').style.height='auto';$('plainCopy').style.height=$('plainCopy').scrollHeight+'px';};
$('richCopy').addEventListener('paste',event=>{event.preventDefault();const selection=getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);if(!$('richCopy').contains(range.commonAncestorContainer))return;range.deleteContents();const node=document.createTextNode(event.clipboardData.getData('text/plain'));range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);change(safeRich($('richCopy').innerHTML));});
for(const [id,value]of [['desktop',1440],['mobile',390]])$(id).onclick=()=>{width=value;$('desktop').setAttribute('aria-pressed',String(value===1440));$('mobile').setAttribute('aria-pressed',String(value===390));resize();};
for(const [id,value]of [['chinese','zh'],['english','en']])$(id).onclick=()=>{language=value;$('chinese').setAttribute('aria-pressed',String(value==='zh'));$('english').setAttribute('aria-pressed',String(value==='en'));if(model)preview();};
$('preview').onload=updatePreview;
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===$('preview').contentWindow&&event.data?.type==='editor-select-copy')selectField(event.data.id);});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
let composing=false;$('search').addEventListener('compositionstart',()=>{composing=true;});$('search').addEventListener('compositionend',()=>{composing=false;renderPages();});$('search').oninput=()=>{if(!composing)renderPages();};$('group').onchange=renderPages;$('clear').onclick=()=>{$('search').value='';renderPages();$('search').focus();};
$('closeHistory').onclick=()=>$('historyDialog').close();
$('historyButton').onclick=()=>navigate(async()=>{if(!model)return;const dialog=$('historyDialog');dialog.showModal();$('historyStatus').textContent='正在读取…';$('historyList').replaceChildren();try{const versions=await api('history?file='+encodeURIComponent(current));$('historyStatus').textContent=versions.length?'':'尚无历史版本，首次保存后会显示。';for(const version of versions){const row=document.createElement('div');row.className='historyRow';const label=document.createElement('span');label.textContent='本页版本 '+version;const button=document.createElement('button');button.type='button';button.textContent=version===draft.revision?'当前版本':'恢复此版本';button.disabled=version===draft.revision;button.onclick=()=>{restoreVersion=version;$('restoreDialog').showModal();$('cancelRestore').focus();};row.append(label,button);$('historyList').append(row);}}catch(e){$('historyStatus').textContent=e.message;}});
$('cancelRestore').onclick=()=>$('restoreDialog').close();$('confirmRestore').onclick=async()=>{if(busy)return;busy=true;$('confirmRestore').disabled=true;try{await api('restore?file='+encodeURIComponent(current),{version:restoreVersion,revision:draft.revision});$('restoreDialog').close();$('historyDialog').close();await openPage(current);}catch(e){error(e.message);$('restoreDialog').close();}finally{busy=false;$('confirmRestore').disabled=false;status();}};
try{const state=await api('state');pages=state.pages;const params=new URLSearchParams(location.search);$('search').value=params.get('search')||'';if([...$('group').options].some(o=>o.value===params.get('group')))$('group').value=params.get('group');const requested=params.get('page');await openPage(pages.some(p=>p.file===requested)?requested:'index.html');}catch(e){error(e.message);$('saveState').textContent='连接失败，请保留输入并重新打开后台';}
