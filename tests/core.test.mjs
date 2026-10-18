import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons, parseTime, validRange, readStore, writeStore, saveAttempt, dayKey, summary} from '../core.mjs';
test('four lessons cover all 18 counts without dropping kick-punch submovements',()=>{
 assert.deepEqual(lessons.flatMap(x=>x.steps.map(s=>s.n)),Array.from({length:18},(_,i)=>i+1));
 for(const n of [14,16]) assert.match(lessons.flatMap(x=>x.steps).find(s=>s.n===n).action,/前踢.*冲拳/);
});
test('accept seconds or mm:ss; reject empty, negative, invalid and non-finite times',()=>{
 assert.equal(parseTime('9:57'),597); assert.equal(parseTime('713'),713);
 for(const v of ['', '-2','1:65','abc','Infinity','  ','1:2:3']) assert.equal(parseTime(v),null);
 assert.equal(validRange('0:02','0:03'),true); assert.equal(validRange('2','2'),false); assert.equal(validRange('3','2'),false);
});
test('malformed storage does not break the app',()=>{
 for(const raw of ['bad','null','[]','{"attempts":null}','{"attempts":[{"lesson":"fake"}]}']) {
 const data=readStore({getItem:()=>raw}); assert.deepEqual(data.attempts,[]);
 }
 assert.deepEqual(readStore({getItem(){throw Error();}}).attempts,[]);
 assert.equal(writeStore({setItem(){throw Error();}}, {attempts:[]}),false);
});
test('attempts are immutable and summary is scoped to local date; latest status wins',()=>{
 const base={attempts:[]};
 const a=saveAttempt(base,{lesson:'part1',status:'prompted',prompts:2,note:'转身',date:'2026-10-18',id:'a'});
 const b=saveAttempt(a,{lesson:'part1',status:'independent',prompts:0,note:'',date:'2026-10-18',id:'b'});
 const c=saveAttempt(b,{lesson:'part2',status:'independent',prompts:0,note:'',date:'2026-10-17',id:'c'});
 assert.equal(base.attempts.length,0); assert.equal(summary(c,'2026-10-18').practiced,1); assert.equal(summary(c,'2026-10-18').independent,1); assert.equal(summary(c,'2026-10-18').attempts,2);
 assert.throws(()=>saveAttempt(base,{lesson:'fake',status:'independent'}));
 assert.equal(dayKey(new Date(2026,9,18,0,1)),'2026-10-18');
});
