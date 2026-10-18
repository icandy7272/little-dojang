export const VIDEO_ID = 'WhkjRruCBTo';
const step = (n, action, cue, facing) => ({n, action, cue, facing});
export const lessons = [
 {id:'part1',name:'先挡，再出拳',subtitle:'下格挡 · 冲拳',range:'第 1–6 拍',emoji:'🌱',color:'green',start:597,end:615,explain:492,
 chant:'左边挡、走步打；转身挡、走步打；朝前挡、原地打。',
 goal:'记住「两边各一组，再朝前一组」。',
 focus:'第 5 拍转回起始朝向，第 6 拍脚不动，只出拳。',
 help:'转身忘了？先停下来，让孩子指一指要去的方向，再走脚、做手。不要拉着孩子转。',
 praise:'你刚才自己想起了下一步！',
 steps:[step(1,'左转 90°，左前行步，左手下格挡','左转，向下挡','左'),step(2,'右脚向前，右前行步，右手中位冲拳','走一步，打一拳','左'),step(3,'向右转 180°，右前行步，右手下格挡','转到另一边，向下挡','右'),step(4,'左脚向前，左前行步，左手中位冲拳','走一步，打一拳','右'),step(5,'左转 90°，左弓步，左手下格挡','朝前，向下挡','前'),step(6,'保持弓步，右手中位冲拳','脚不动，打一拳','前')]},
 {id:'part2',name:'换个方向，接着练',subtitle:'中格挡 · 冲拳',range:'第 7–12 拍',emoji:'🍃',color:'blue',start:713,end:728,explain:616,
 chant:'右边挡、走步打；转身挡、走步打；朝前挡、原地打。',
 goal:'分清中间挡和下面挡，记住第二次「脚不动」。',
 focus:'第 7、9 拍是中位内格挡；第 11 拍换回下格挡，第 12 拍原地冲拳。',
 help:'把第 7–8 拍先连起来练，再接第 9–10 拍。记不住时只提醒「这次挡哪里？」。',
 praise:'你注意到这次挡的位置变了，观察得真仔细！',
 steps:[step(7,'右转 90°，右前行步，左手中位内格挡','向右转，中间挡','右'),step(8,'左脚向前，左前行步，右手中位冲拳','走一步，打一拳','右'),step(9,'左转 180°，左前行步，右手中位内格挡','转到另一边，中间挡','左'),step(10,'右脚向前，右前行步，左手中位冲拳','走一步，打一拳','左'),step(11,'右转 90°，右弓步，右手下格挡','朝前，向下挡','前'),step(12,'保持弓步，左手中位冲拳','脚不动，打一拳','前')]},
 {id:'part3',name:'小屋顶，踢一脚',subtitle:'上格挡 · 前踢 · 冲拳',range:'第 13–16 拍',emoji:'☀️',color:'orange',start:796,end:812,explain:728,
 chant:'屋顶挡，踢、收、落、打；换一边，屋顶挡，踢、收、落、打。',
 goal:'记住每边都是「上格挡 → 前踢 → 落地冲拳」。',
 focus:'第 14、16 拍都包含前踢和落地后的冲拳，不要漏掉拳。先慢慢做，踢到能站稳的高度。',
 help:'把「踢、收、落、打」四个字慢慢念。先站稳再出拳；如果晃动，降低踢腿高度。',
 praise:'踢完还能记得出拳，你把它们连起来了！',
 steps:[step(13,'左转 90°，左前行步，左手上格挡','左边，撑起小屋顶','左'),step(14,'右腿前踢、收腿，向前落成右前行步，右手冲拳','右脚踢、收、落，右拳打','左'),step(15,'右转 180°，右前行步，右手上格挡','另一边，撑起小屋顶','右'),step(16,'左腿前踢、收腿，向前落成左前行步，左手冲拳','左脚踢、收、落，左拳打','右')]},
 {id:'part4',name:'站稳，漂亮地收尾',subtitle:'下格挡 · 弓步冲拳 · 发声',range:'第 17–18 拍',emoji:'⭐',color:'purple',start:877,end:887,explain:812,
 chant:'转身向下挡，向前一步打，哈！',
 goal:'记住最后转向起始朝向的后方，再向前走一步出拳。',
 focus:'第 17 拍右转 90°成左弓步；第 18 拍上右脚成右弓步冲拳，并发声。结束后按教练口令还原。',
 help:'先只练转向与两步路线，再加手。可以在地上放方向标记；熟悉后移走，检查是否真正记住。',
 praise:'你从开始坚持到了最后，我们击个掌！',
 steps:[step(17,'右转 90°，左弓步，左手下格挡','转向后方，向下挡','后'),step(18,'右脚向前成右弓步，右手中位冲拳，发声','上步，打一拳，哈！','后')]}
];
export const statuses={independent:'独立完成',prompted:'需要提示',retry:'再练一练'};
export const STORE_KEY='little-dojang-v1';
export function dayKey(date=new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function parseTime(value) {
 const text=String(value??'').trim();
 if(!text) return null;
 if(/^\d+:\d{2}$/.test(text)) {const [m,s]=text.split(':').map(Number);return s<60?m*60+s:null;}
 return /^\d+(\.\d+)?$/.test(text)&&Number.isFinite(Number(text))?Number(text):null;
}
export function validRange(start,end){const a=parseTime(start),b=parseTime(end);return a!==null&&b!==null&&a<b;}
export function formatTime(value){return `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;}
const empty=()=>({attempts:[],ranges:{},notes:{}});
function validAttempt(a){return a&&lessons.some(l=>l.id===a.lesson)&&Object.hasOwn(statuses,a.status)&&Number.isInteger(a.prompts)&&a.prompts>=0&&a.prompts<=99&&typeof a.note==='string'&&typeof a.id==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(a.date);}
export function readStore(storage){
 try {const d=JSON.parse(storage.getItem(STORE_KEY));if(!d||Array.isArray(d)||!Array.isArray(d.attempts))return empty();
 const result=empty();result.attempts=d.attempts.filter(validAttempt).slice(-500);
 for(const l of lessons){for(const source of ['online','local']){const key=`${source}:${l.id}`, r=d.ranges?.[key];if(r&&validRange(r.start,r.end))result.ranges[key]={start:parseTime(r.start),end:parseTime(r.end)};}if(typeof d.notes?.[l.id]==='string')result.notes[l.id]=d.notes[l.id].slice(0,1000);}
 return result;
 }catch{return empty();}
}
export function writeStore(storage,data){try{storage.setItem(STORE_KEY,JSON.stringify(data));return true;}catch{return false;}}
export function saveAttempt(data,attempt){if(!validAttempt(attempt))throw new Error('练习记录无效');return {...data,attempts:[...data.attempts,attempt].slice(-500)};}
export function summary(data,date=dayKey()){
 const today=data.attempts.filter(a=>a.date===date),latest={};for(const a of today)latest[a.lesson]=a;
 return {attempts:today.length,practiced:Object.keys(latest).length,independent:Object.values(latest).filter(a=>a.status==='independent').length,latest};
}
