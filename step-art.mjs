// Original schematic artwork, MIT. Side view shows the final pose, not a turn path.
export const stepArt = {
  1:{hand:'左手下格挡',foot:'左脚在前',stance:'前行步',turn:'左转 90°',facing:'左',block:true},
  2:{hand:'右手冲拳',foot:'右脚在前',stance:'前行步',turn:'右脚向前走一步',facing:'左'},
  3:{hand:'右手下格挡',foot:'右脚在前',stance:'前行步',turn:'右转 180°',facing:'右',block:true},
  4:{hand:'左手冲拳',foot:'左脚在前',stance:'前行步',turn:'左脚向前走一步',facing:'右'},
  5:{hand:'左手下格挡',foot:'左脚在前',stance:'弓步',turn:'左转 90°',facing:'前',block:true,bow:true},
  6:{hand:'右手冲拳',foot:'左脚在前',stance:'保持弓步',turn:'脚不动，只出拳',facing:'前',bow:true}
};
export function stepSVG(n){
 const a=stepArt[n];if(!a)return '';
 const front=a.bow?'M143 144 L177 174 L175 218':'M143 144 L163 180 L175 218';
 const back=a.bow?'M131 144 L106 178 L78 218':'M131 144 L120 181 L106 218';
 const arm=a.block?'M150 91 L174 121 L184 150':'M150 91 L186 96 L220 96';
 return `<svg class="pose-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 264" role="img" aria-label="第 ${n} 拍：${a.hand}，${a.foot}，${a.stance}，侧面终点姿势示意">
 <rect width="300" height="264" rx="16" fill="#f1f5ec"/>
 <path d="M45 230 H251" stroke="#d7dfcc" stroke-width="2"/>
 <ellipse cx="150" cy="232" rx="85" ry="7" fill="#e1e8d8"/>
 <path d="${back}" fill="none" stroke="#8f9a91" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="${front}" fill="none" stroke="#38574c" stroke-width="23" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M${a.bow?'75':'103'} 221 h24 M172 221 h25" stroke="#38574c" stroke-width="10" stroke-linecap="round"/>
 <path d="M119 82 Q137 75 154 85 L158 146 L120 146 Z" fill="#fffdf6" stroke="#38574c" stroke-width="3"/>
 <path d="M123 83 L138 108 L151 84 M137 106 V136" fill="none" stroke="#b8c5b2" stroke-width="3"/>
 <path d="M120 137 H158 M141 138 l-4 20 M146 138 l9 18" stroke="#d3ad56" stroke-width="7"/>
 <path d="M126 92 L108 121 L133 132" fill="none" stroke="#8f9a91" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="135" cy="132" r="8" fill="#e5be95" stroke="#38574c" stroke-width="2"/>
 <path d="${arm}" fill="none" stroke="#287a65" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="${a.block?184:222}" cy="${a.block?154:96}" r="9" fill="#e5be95" stroke="#287a65" stroke-width="2"/>
 <path d="M134 75 V83" stroke="#e5be95" stroke-width="12"/>
 <circle cx="138" cy="54" r="23" fill="#e5be95" stroke="#38574c" stroke-width="3"/>
 <path d="M116 51 Q115 24 140 29 Q160 29 160 48 Q144 39 127 44 L122 56" fill="#38574c"/>
 <path d="M159 53 l6 4 -6 3" fill="#e5be95" stroke="#38574c" stroke-width="2"/>
 <circle cx="153" cy="50" r="2" fill="#38574c"/>
 <text x="18" y="25" font-family="sans-serif" font-size="12" fill="#637765">侧面 · 完成姿势</text>
 <text x="150" y="254" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#38574c">${a.foot} · ${a.stance}</text>
 </svg>`;
}
export function stepFigure(n,{print=false}={}){
 const a=stepArt[n];if(!a)return '';
 const art=stepSVG(n);
 return print?`<div class="print-pose">${art}<span>${a.hand}</span></div>`:`<button class="step-art-button" data-step-art="${n}" aria-label="放大第 ${n} 拍动作图：${a.hand}">${art}<span class="art-caption">${a.hand}<span aria-hidden="true"> ⤢</span></span></button>`;
}
