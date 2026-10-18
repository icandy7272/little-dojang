import {mkdir,copyFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=join(root,'dist');
await rm(out,{recursive:true,force:true});
await mkdir(join(out,'assets'),{recursive:true});
// Publish an explicit allowlist, never the repository directory.
for(const file of ['index.html','styles.css','app.mjs','core.mjs','player.mjs','step-art.mjs','assets/mark.svg']){
 await copyFile(join(root,file),join(out,file));
}
console.log('Static site ready in dist/');
