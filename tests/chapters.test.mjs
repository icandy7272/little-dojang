import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,allLessons,readStore,saveAttempt,summary,STORE_KEY} from '../core.mjs';
import {getStepArt,stepPhoto,stepFigure} from '../step-art.mjs';
import {bilibiliEmbedURL,LessonPlayer} from '../player.mjs';
test('each chapter covers 18 distinct counts in four groups with separate lesson and video identities',()=>{
 assert.equal(chapters.length,2);assert.equal(new Set(allLessons.map(l=>l.id)).size,8);
 assert.deepEqual(chapters[0].lessons.map(l=>l.id),['part1','part2','part3','part4']);
 for(const c of chapters){
  assert.equal(c.lessons.length,4);
  assert.deepEqual(c.lessons.flatMap(l=>l.steps.map(s=>s.n)),Array.from({length:18},(_,i)=>i+1));
  assert.ok(c.lessons.every(l=>l.start<l.end));
  assert.equal(new URL(bilibiliEmbedURL(150,false,c.bilibiliId)).searchParams.get('bvid'),c.bilibiliId);
 }
 assert.notEqual(chapters[0].videoId,chapters[1].videoId);
});
test('both chapters have complete correctly numbered photo sequences without merging compound movements',()=>{
 for(const [i,c] of chapters.entries()){
  let total=0;
  for(const s of c.lessons.flatMap(l=>l.steps)){
   const a=getStepArt(s.n,c.id);assert.ok(a,`${c.name} ${s.n}`);assert.equal(a.facing,s.facing);
   const expected=(i===0?[14,16]:[8,10,16,17,18]).includes(s.n)?2:1;
   assert.equal((stepPhoto(s.n,c.id).match(/<img /g)||[]).length,expected);
   assert.equal((stepFigure(s.n,{print:true,chapterId:c.id}).match(/<img /g)||[]).length,expected);
   total+=expected;
   assert.match(a.photo,i===0?/infostill_il-jang_/:/infostill_ee-jang_/);
  }
  assert.equal(total,i===0?20:23);
 }
 const c=chapters[1];for(const n of [8,10])assert.match(c.lessons.flatMap(l=>l.steps).find(s=>s.n===n).action,/前踢.*弓步.*上段冲拳/);
 for(const n of [16,17,18])assert.match(c.lessons.flatMap(l=>l.steps).find(s=>s.n===n).action,/前踢.*前行步.*中位冲拳/);
 assert.match(getStepArt(15,'taegeuk2').photo,/ee-jang_17\./);assert.match(getStepArt(18,'taegeuk2').sequence[1].photo,/ee-jang_23\./);
});
test('existing records notes and custom ranges survive together with new chapter records and progress stays scoped',()=>{
 const date='2026-10-19',make=(id,lesson)=>({id,lesson,status:'independent',prompts:0,note:'陪练笔记',date});
 const before={attempts:[make('old','part1')],notes:{part1:'旧笔记','t2-part1':'二章笔记'},ranges:{'bilibili:part1':{start:598,end:614},'bilibili:t2-part1':{start:151,end:249}}};
 const withSecond=saveAttempt(before,make('new','t2-part1'));
 const restored=readStore({getItem:key=>{assert.equal(key,STORE_KEY);return JSON.stringify(withSecond);}});
 assert.equal(restored.attempts.length,2);assert.equal(restored.notes.part1,'旧笔记');assert.equal(restored.notes['t2-part1'],'二章笔记');
 assert.deepEqual(restored.ranges,before.ranges);
 for(const c of chapters){const s=summary(restored,date,c.lessons.map(l=>l.id));assert.equal(s.practiced,1);assert.equal(s.attempts,1);assert.ok(!s.latest[c.id==='taegeuk1'?'t2-part1':'part1']);}
 assert.equal(before.attempts.length,1);
});
test('switching player content stops previous loading and selects the new chapter media',()=>{
 let stopped=0;const p=Object.create(LessonPlayer.prototype);p.hide=()=>{stopped++;};p.setContent(chapters[1]);
 assert.equal(stopped,1);assert.equal(p.videoId,'tGlrUplKHh8');assert.equal(p.bilibiliId,'BV1zu4m1M7Jg');assert.equal(p.contentName,'太极二章');
 p.setContent(chapters[0]);assert.equal(stopped,2);assert.equal(p.bilibiliId,'BV1u2421M7EE');
});

test('clearing a chapter-specific local selection removes its media source before the next chapter',()=>{
 const calls=[];const p=Object.create(LessonPlayer.prototype);p.hide=()=>calls.push('stop');p.localURL=null;p.video={removeAttribute:name=>calls.push(name),load:()=>calls.push('load')};
 p.clearFile();assert.deepEqual(calls,['stop','src','load']);assert.equal(p.localURL,null);
});

test('Taegeuk E Jang groups match the actual four video parts: 6, 6, 2, 4 counts',()=>{
 const actual=chapters[1].lessons.map(l=>l.steps.map(s=>s.n));
 assert.deepEqual(actual,[[1,2,3,4,5,6],[7,8,9,10,11,12],[13,14],[15,16,17,18]]);
 assert.deepEqual(chapters[1].lessons.map(l=>l.range),['第 1–6 拍','第 7–12 拍','第 13–14 拍','第 15–18 拍']);
 assert.deepEqual(chapters[1].lessons.map(l=>[l.start,l.end]),[[150,250],[250,341],[341,405],[405,466]]);
});
