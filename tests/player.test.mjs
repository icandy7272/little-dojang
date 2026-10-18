import test from 'node:test';
import assert from 'node:assert/strict';
import {LessonPlayer} from '../player.mjs';
function fixture(){const p=Object.create(LessonPlayer.prototype);let pauses=0,replays=0,message='';Object.assign(p,{ready:true,source:'local',range:{start:2,end:5},loop:false,endHandled:false,video:{currentTime:5,paused:false,pause(){pauses++;}},message:t=>message=t,replay(){replays++;}});return {p,result:()=>({pauses,replays,message})};}
test('clip stops at its end once, instead of running into the next lesson',()=>{const {p,result}=fixture();p.checkEnd();p.checkEnd();assert.equal(result().pauses,1);assert.match(result().message,/看完/);});
test('loop replays the selected range instead of stopping',()=>{const {p,result}=fixture();p.loop=true;p.checkEnd();assert.equal(result().replays,1);assert.equal(result().pauses,0);});
test('paused playback and times before the clip end are left alone',()=>{const {p,result}=fixture();p.video.currentTime=3;p.checkEnd();p.video.currentTime=6;p.video.paused=true;p.checkEnd();assert.equal(result().pauses,0);assert.equal(result().replays,0);});
test('online playback uses the same clip boundary',()=>{const {p,result}=fixture();p.source='online';let paused=false;p.yt={getCurrentTime:()=>5,getPlayerState:()=>1,pauseVideo:()=>paused=true};p.checkEnd();assert.equal(paused,true);assert.match(result().message,/看完/);});
test('ordinary pause keeps current loading callbacks valid and cancels delayed autoplay',()=>{const {p}=fixture();p.generation=7;p.allowAutoplay=true;p.pause();assert.equal(p.generation,7);assert.equal(p.allowAutoplay,false);});
test('native local play after clip end restarts the selected segment and restores end guard',()=>{const {p}=fixture();p.endHandled=true;p.video.currentTime=5;p.onLocalPlay();assert.equal(p.endHandled,false);assert.equal(p.video.currentTime,2);p.checkEnd();assert.equal(p.endHandled,false);});
test('native online replay at the stopping tolerance restarts instead of immediately pausing',()=>{const {p}=fixture();let seek=null;p.endHandled=true;p.onOnlinePlay({getCurrentTime:()=>4.96,seekTo:t=>seek=t});assert.equal(seek,2);assert.equal(p.endHandled,false);});
