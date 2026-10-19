import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export function attachAuthoringDependencies(root){
 fs.symlinkSync(path.join(source,'node_modules'),path.join(root,'node_modules'),'junction');
 fs.cpSync(path.join(source,'.schema-feed-v2'),path.join(root,'.schema-feed-v2'),{recursive:true});
}
