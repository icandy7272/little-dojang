// Photos remain on their original host. Do not mirror: left/right refer to the athlete.
export const stepArt = {
  1:{hand:'左手下格挡',foot:'左脚在前',stance:'前行步',turn:'左转 90°',facing:'左',block:true},
  2:{hand:'右手冲拳',foot:'右脚在前',stance:'前行步',turn:'右脚向前走一步',facing:'左'},
  3:{hand:'右手下格挡',foot:'右脚在前',stance:'前行步',turn:'右转 180°',facing:'右',block:true},
  4:{hand:'左手冲拳',foot:'左脚在前',stance:'前行步',turn:'左脚向前走一步',facing:'右'},
  5:{hand:'左手下格挡',foot:'左脚在前',stance:'弓步',turn:'左转 90°',facing:'前',block:true,bow:true},
  6:{hand:'右手冲拳',foot:'左脚在前',stance:'保持弓步',turn:'脚不动，只出拳',facing:'前',bow:true}
};
export const PHOTO_SOURCE='https://snapkick.app/poomsae/taegeuk-il-jang';
const photos=[
 'infostill_il-jang_1.tOjf5bmM_1qk9nx.webp',
 'infostill_il-jang_2.Dt2wFADy_ZWTBac.webp',
 'infostill_il-jang_3.BWjsMeLd_iV8Vk.webp',
 'infostill_il-jang_4.CJGQW7JC_rwFxy.webp',
 'infostill_il-jang_5.B_8Ne7Xb_qYUOn.webp',
 'infostill_il-jang_6.Ddoke6G5_6S3Ne.webp'
];
for(const [i,photo] of photos.entries())stepArt[i+1].photo=`https://snapkick.app/_astro/${photo}`;
export function stepPhoto(n){
 const a=stepArt[n];if(!a)return '';
 return `<img class="step-photo" src="${a.photo}" width="480" height="600" alt="第 ${n} 拍：${a.hand}，${a.foot}，${a.stance}；Eva Sandersen 真人完成姿势，左右以练习者为准" decoding="async"><span class="photo-fallback">图片暂时无法加载，请查看下方动作说明或打开真人图解原页。</span>`;
}
export function stepFigure(n,{print=false}={}){
 const a=stepArt[n];if(!a)return '';
 const photo=stepPhoto(n);
 return print?`<div class="print-pose">${photo}<span>${a.hand} · ${a.foot}</span></div>`:`<button class="step-art-button" data-step-art="${n}" aria-label="放大第 ${n} 拍动作图：${a.hand}">${photo}<span class="art-caption">${a.hand}<span aria-hidden="true"> ⤢</span></span></button><span class="photo-foot-label">${a.foot} · ${a.stance}</span>`;
}
