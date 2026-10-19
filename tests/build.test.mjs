import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readdir,readFile} from 'node:fs/promises';
test('public build contains only website assets, excluding repository and development files',async()=>{
 execFileSync(process.execPath,['scripts/build.mjs']);
 assert.deepEqual((await readdir('dist')).sort(),['app.mjs','assets','chapter2.mjs','core.mjs','index.html','player.mjs','step-art.mjs','styles.css']);
 assert.deepEqual(await readdir('dist/assets'),['mark.svg']);
 assert.match(await readFile('dist/index.html','utf8'),/src="app.mjs"/);
});
