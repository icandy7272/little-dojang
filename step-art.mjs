import {secondSteps} from './chapter2.mjs';
// Photos remain on their original host. Do not mirror: left/right refer to the athlete.
export const stepArt = {
  1:{hand:'左手下格挡',foot:'左脚在前',stance:'前行步',turn:'左转 90°',facing:'左',block:true},
  2:{hand:'右手冲拳',foot:'右脚在前',stance:'前行步',turn:'右脚向前走一步',facing:'左'},
  3:{hand:'右手下格挡',foot:'右脚在前',stance:'前行步',turn:'右转 180°',facing:'右',block:true},
  4:{hand:'左手冲拳',foot:'左脚在前',stance:'前行步',turn:'左脚向前走一步',facing:'右'},
  5:{hand:'左手下格挡',foot:'左脚在前',stance:'弓步',turn:'左转 90°',facing:'前',block:true,bow:true},
  6:{hand:'右手冲拳',foot:'左脚在前',stance:'保持弓步',turn:'脚不动，只出拳',facing:'前',bow:true},
  7:{hand:'左手中位内格挡',foot:'右脚在前',stance:'前行步',turn:'右转 90°',facing:'右'},
  8:{hand:'右手冲拳',foot:'左脚在前',stance:'前行步',turn:'左脚向前走一步',facing:'右'},
  9:{hand:'右手中位内格挡',foot:'左脚在前',stance:'前行步',turn:'左转 180°',facing:'左'},
  10:{hand:'左手冲拳',foot:'右脚在前',stance:'前行步',turn:'右脚向前走一步',facing:'左'},
  11:{hand:'右手下格挡',foot:'右脚在前',stance:'弓步',turn:'右转 90°',facing:'前'},
  12:{hand:'左手冲拳',foot:'右脚在前',stance:'保持弓步',turn:'脚不动，只出拳',facing:'前'},
  13:{hand:'左手上格挡',foot:'左脚在前',stance:'前行步',turn:'左转 90°',facing:'左'},
  14:{hand:'右腿前踢 → 右手冲拳',foot:'落地后右脚在前',stance:'前行步',turn:'右脚踢、收、落，再出右拳',facing:'左'},
  15:{hand:'右手上格挡',foot:'右脚在前',stance:'前行步',turn:'右转 180°',facing:'右'},
  16:{hand:'左腿前踢 → 左手冲拳',foot:'落地后左脚在前',stance:'前行步',turn:'左脚踢、收、落，再出左拳',facing:'右'},
  17:{hand:'左手下格挡',foot:'左脚在前',stance:'弓步',turn:'右转 90°，转向后方',facing:'后'},
  18:{hand:'右手冲拳、发声',foot:'右脚在前',stance:'弓步',turn:'右脚向前走一步，发声',facing:'后'}
};
export const PHOTO_SOURCE='https://snapkick.app/poomsae/taegeuk-il-jang';
const photos=[
 'infostill_il-jang_1.tOjf5bmM_1qk9nx.webp',
 'infostill_il-jang_2.Dt2wFADy_ZWTBac.webp',
 'infostill_il-jang_3.BWjsMeLd_iV8Vk.webp',
 'infostill_il-jang_4.CJGQW7JC_rwFxy.webp',
 'infostill_il-jang_5.B_8Ne7Xb_qYUOn.webp',
 'infostill_il-jang_6.Ddoke6G5_6S3Ne.webp',
 'infostill_il-jang_7.DcQNAOv8_Z1Wo6sB.webp',
 'infostill_il-jang_8.0uGTS24b_1jLe5y.webp',
 'infostill_il-jang_9.jv99jHOE_Tf6l3.webp',
 'infostill_il-jang_10.CiVkBuzc_1vwQWB.webp',
 'infostill_il-jang_11.B4isRnZf_1o4NCP.webp',
 'infostill_il-jang_12.BMteofTh_ZFb4lm.webp',
 'infostill_il-jang_13.BJrzfTtk_Zw70Tw.webp',
 'infostill_il-jang_14.D1DkJ-WW_ZsOXzt.webp',
 'infostill_il-jang_15.nbP2DjgG_Z2hGy9R.webp',
 'infostill_il-jang_16.CpTrXXA8_Z1Qpop9.webp',
 'infostill_il-jang_17.BDtJFSDr_Z5LSWI.webp',
 'infostill_il-jang_18.4_3g2IXS_2mVHOv.webp',
 'infostill_il-jang_19.L4lwk3O8_Z2cXWbv.webp',
 'infostill_il-jang_20.BKfArJKZ_1hVcdc.webp'
];
const sourceIndices=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,19,20];
for(const [i,sourceIndex] of sourceIndices.entries()){
 const a=stepArt[i+1];a.photo=`https://snapkick.app/_astro/${photos[sourceIndex-1]}`;
 if([14,16].includes(i+1))a.sequence=[{photo:a.photo,label:i+1===14?'① 右腿前踢':'① 左腿前踢'},{photo:`https://snapkick.app/_astro/${photos[sourceIndex]}`,label:i+1===14?'② 收腿落地，右手冲拳':'② 收腿落地，左手冲拳'}];
}
export const secondStepArt=Object.fromEntries(secondSteps.map(s=>[s.n,{...s}]));
const secondPhotos=[
 "https://snapkick.app/_astro/infostill_ee-jang_1.ErwGsuFB_ZIviP4.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_2.6euakCpd_ZWW935.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_3.DIJh36ga_Z11B5F8.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_4.D2QGKyGu_ZIhr7j.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_5.CFobX0Pm_1b6Fqf.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_6.CNF2_c_x_1kutk0.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_7.CeNj4sD6_Z1fHYjw.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_8.CcwmkaNC_Z11EWR4.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_9.Cf9ouGXq_1e48fz.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_10.B_jrb4sQ_2vqfsa.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_11.Yzq2F-5q_2rQAi0.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_12.Cv4ikG3P_ZYtSTw.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_13.BIg0ZELD_1ecSQy.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_14.zXsGZRH8_Z27Gs31.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_15.epcgrKF-_Z1fRG66.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_16.DJj4tu1-_ZJL10l.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_17.BX_MKuC6_Qqhas.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_18.DLBCd2Kb_1jznmd.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_19.60Y-6j_K_Z2x5UeS.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_20.DlERusG7_ZtmgCg.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_21.iXqbe5G7_1qL8RU.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_22.CDPS8fiM_ZBJsH7.webp",
 "https://snapkick.app/_astro/infostill_ee-jang_23.vieOpzwO_HU5Xx.webp"
];
const secondIndices=[1,2,3,4,5,6,7,8,10,11,13,14,15,16,17,18,20,22];
for(const [i,sourceIndex] of secondIndices.entries()){
 const n=i+1,a=secondStepArt[n];a.photo=secondPhotos[sourceIndex-1];
 if([8,10,16,17,18].includes(n)){
  const side=[8,16,18].includes(n)?'右':'左',level=[8,10].includes(n)?'上段':'中位';
  a.sequence=[{photo:a.photo,label:`① ${side}腿前踢`},{photo:secondPhotos[sourceIndex],label:`② 收腿落地，${side}手${level}冲拳${n===18?'、发声':''}`}];
 }
}
export function getStepArt(n,chapterId='taegeuk1'){return (chapterId==='taegeuk2'?secondStepArt:stepArt)[n];}
function photoImage(n,a,photo,label){
 return `<img class="step-photo" src="${photo}" width="480" height="600" alt="第 ${n} 拍：${label||a.hand}，${label?'':a.foot+'，'+a.stance+'；'}Eva Sandersen 真人示范，左右以练习者为准" decoding="async"><span class="photo-fallback">图片暂时无法加载，请查看动作说明或打开真人图解原页。</span>`;
}
export function stepPhoto(n,chapterId='taegeuk1'){
 const a=getStepArt(n,chapterId);if(!a)return '';
 if(a.sequence)return `<span class="photo-sequence">${a.sequence.map(x=>`<span class="photo-stage">${photoImage(n,a,x.photo,x.label)}<span class="photo-stage-label">${x.label}</span></span>`).join('')}</span>`;
 return photoImage(n,a,a.photo);
}
export function stepFigure(n,{print=false,chapterId='taegeuk1'}={}){
 const a=getStepArt(n,chapterId);if(!a)return '';
 const photo=stepPhoto(n,chapterId);
 return print?`<div class="print-pose">${photo}<span>${a.hand} · ${a.foot}</span></div>`:`<button class="step-art-button" data-step-art="${n}" aria-label="放大第 ${n} 拍动作图：${a.hand}">${photo}<span class="art-caption">${a.hand}<span aria-hidden="true"> ⤢</span></span></button><span class="photo-foot-label">${a.foot} · ${a.stance}</span>`;
}
