import test from 'node:test';
import assert from 'node:assert/strict';
import {stepArt,stepSVG,stepFigure} from '../step-art.mjs';
test('first six counts have correct hand, leading foot and final stance',()=>{
 assert.deepEqual(Object.values(stepArt).map(a=>a.hand),['左手下格挡','右手冲拳','右手下格挡','左手冲拳','左手下格挡','右手冲拳']);
 assert.deepEqual(Object.values(stepArt).map(a=>a.foot),['左脚在前','右脚在前','右脚在前','左脚在前','左脚在前','左脚在前']);
 assert.equal(stepArt[5].bow,true);assert.equal(stepArt[6].bow,true);
 assert.equal(stepArt[6].turn,'脚不动，只出拳');
 assert.deepEqual(Object.values(stepArt).map(a=>a.facing),['左','左','右','右','前','前']);
});
test('art is accessible and print uses the same poses without interactive buttons',()=>{
 for(let n=1;n<=6;n++){
  assert.match(stepSVG(n),new RegExp(`aria-label="第 ${n} 拍：`));
  assert.match(stepFigure(n),new RegExp(`data-step-art="${n}"`));
  assert.match(stepFigure(n,{print:true}),/<svg/);
  assert.doesNotMatch(stepFigure(n,{print:true}),/<button/);
 }
 assert.equal(stepFigure(7),'');
});
