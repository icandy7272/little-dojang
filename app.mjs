import {stepArt,stepPhoto,stepFigure} from './step-art.mjs';
import {lessons,statuses,VIDEO_ID,BILIBILI_ID,dayKey,parseTime,validRange,formatTime,readStore,writeStore,saveAttempt,summary} from './core.mjs';
import {LessonPlayer} from './player.mjs';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
let storage;try{storage=window.localStorage;}catch{storage=null;}
let pendingLocalFile=null,activeFileName='';
let data=readStore(storage),index=0,mode='watch',chosenStatus=null,source='bilibili',revealed=false,loaded=false,lastDay=dayKey();
const player=new LessonPlayer({message:text=>{$('#player-message').textContent=text;},onReady:ready=>{$('#replay').disabled=!ready;}});
const lesson=()=>lessons[index];
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){const ok=writeStore(storage,data);if(!ok)toast('浏览器无法保存记录，本次记录只会保留到页面关闭。');return ok;}
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
function getRange(){return data.ranges[`${source}:${lesson().id}`]??(source!=='local'?{start:lesson().start,end:lesson().end}:null);}
function renderProgress(){const s=summary(data);$('#progress-label').textContent=`${s.practiced} / 4 段已练`;$('#progress-bar').style.width=`${s.practiced/4*100}%`;$('#today-description').textContent=s.attempts?`今天练了 ${s.attempts} 次，${s.independent} 段最近一次可以独立完成。`:'今天还没有记录，从喜欢的一段开始吧。';
 const next=lessons.find(l=>s.latest[l.id]?.status!=='independent');$('#suggestion').textContent=next?`练练第 ${lessons.indexOf(next)+1} 段 →`:'再回顾一小段 →';
 $('#lesson-list').innerHTML=lessons.map((l,i)=>{const latest=s.latest[l.id];return `<button class="lesson-item ${i===index?'active':''}" data-lesson="${i}" aria-current="${i===index?'step':'false'}"><span class="lesson-number">${String(i+1).padStart(2,'0')}</span><span class="lesson-text"><strong>${l.name}</strong><small>${l.range} · ${l.subtitle.split(' · ')[0]}</small><span class="lesson-status ${latest?'':'empty'}">${latest?(latest.status==='independent'?'✓ ':'· ')+statuses[latest.status]:'今天还未练习'}</span></span></button>`;}).join('');
}
function renderLesson(){const l=lesson();loaded=false;player.hide();if('speechSynthesis' in window)window.speechSynthesis.cancel();
 $('#lesson-kicker').textContent=`小挑战 ${String(index+1).padStart(2,'0')} / 04 · ${l.subtitle}`;$('#lesson-title').textContent=l.name;$('#count-badge').textContent=l.range;
 $('#clip-description').textContent=`第 ${index+1} 段慢速连贯示范 · ${formatTime(l.start)}–${formatTime(l.end)}`;
 $('#chant').textContent=l.chant;$('#solo-goal').textContent=l.goal;$('#parent-focus').textContent=l.focus;$('#parent-help').textContent=l.help;$('#parent-praise').textContent=`“${l.praise}”`;
 $('#steps-list').innerHTML=l.steps.map(s=>`<li class="step-row ${stepArt[s.n]?'illustrated-step':''}"><span class="step-number">${s.n}</span>${stepFigure(s.n)}<div class="step-copy"><strong>${s.cue}</strong><small>${s.action}</small>${stepArt[s.n]?`<span class="step-movement">${stepArt[s.n].turn}</span>`:''}</div><span class="facing">面向${s.facing}方</span></li>`).join('');
 $('#step-art-note').hidden=index!==0;
 $('#previous').disabled=index===0;$('#next').disabled=index===lessons.length-1;$('#pagination-count').textContent=`${index+1} / 4 个小挑战`;
 $('#practice-note').value=data.notes[l.id]??'';$('#prompt-count').value='0';chosenStatus=null;renderStatus();$('#save-message').textContent='';revealed=false;renderProgress();renderMode();
}
function renderMode(){
 const intro={watch:'先一起看一遍。这一次，只找动作的顺序，不着急跟着做。',together:'站在孩子旁边，面向同一方向。每做完一小组，就暂停视频练一遍。',solo:'先把屏幕留给家长，让孩子自己回忆；忘了，再给一点点提示。'};
 $('#mode-intro').textContent=intro[mode];for(const b of $$('[data-mode]')){const active=b.dataset.mode===mode;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;}
 $('#training-panel').setAttribute('aria-labelledby',`mode-${mode}`);
 const solo=mode==='solo';$('#video-shell').hidden=solo;$('#player-toolbar').hidden=solo;$('#player-message').hidden=solo;$('#solo-panel').hidden=!solo;$('#cue-panel').hidden=solo&&!revealed;$('#steps-section').hidden=solo&&!revealed;
 $('#reveal-cues').textContent=revealed?'把提示收起来':'想不起来？给我一点提示';
 if(solo){player.pause();if(source==='bilibili')loaded=false;}
 if(!loaded){$('#video-cover').hidden=false;$('#local-player').hidden=true;const online=$('#online-player');if(online)online.hidden=true;}
 $('#video-cover').setAttribute('aria-label',`播放第 ${index+1} 段${source==='local'?'本地':source==='bilibili'?'B 站':'官方'}示范`);
 $('#load-video').textContent=source==='local'?'播放本地分段示范':source==='bilibili'?'播放 B 站分段示范':'播放 YouTube 官方示范';
 $('.video-footnote').textContent=source==='local'?'本机视频 · 不会上传':source==='bilibili'?'国技院教学 · B 站中文字幕版':'国技院官方视频 · YouTube 在线播放';
 $('#loop').closest('label').hidden=source==='bilibili';$('#speed').closest('label').hidden=source==='bilibili';$('#collapse-video').hidden=source!=='bilibili';
 const r=getRange();if(!loaded)$('#player-message').textContent=source==='bilibili'?`B 站在线播放 · 本段结束 ${formatTime(r.end)} 请手动暂停，倍速在视频中设置。`:source==='local'?'选择本机教学视频，不会上传。':'YouTube 在线示范；无法访问时，可切换 B 站。';
 if(typeof fallback!=='undefined')updateLink();
 const range=getRange();if(range)$('#clip-description').textContent=`第 ${index+1} 段 · ${formatTime(range.start)}–${formatTime(range.end)}`;
}
function selectLesson(i){if(i<0||i>=lessons.length)return;index=i;renderLesson();}
function renderStatus(){for(const b of $$('[data-status]'))b.setAttribute('aria-pressed',String(chosenStatus===b.dataset.status));$('#save-attempt').disabled=!chosenStatus;}
async function openVideo(){const range=getRange();if(!range||source==='local'&&!player.localURL){openSettings();toast('请先选择本地视频，并为当前一段设置时间。');return;}
 loaded=true;$('#video-cover').disabled=true;try{await player.open({source,range});}finally{$('#video-cover').disabled=false;}}
function openSettings(){pendingLocalFile=null;$('#local-file').value='';$('#local-file-name').textContent=activeFileName?`正在使用：${activeFileName}（仅在本机播放）`:'尚未选择视频。刷新页面后需重新选择文件。';const l=lesson();$('#range-title').textContent=`第 ${index+1} 段：${l.name}`;$('#video-source').value=source;renderSettingsRange();$('#settings-dialog').showModal();}
function renderSettingsRange(){const selected=$('#video-source').value,l=lesson(),r=data.ranges[`${selected}:${l.id}`]??(selected!=='local'?{start:l.start,end:l.end}:null);$('#range-start').value=r?formatTime(r.start):'';$('#range-end').value=r?formatTime(r.end):'';$('#range-error').textContent='';$('#range-help').textContent=selected!=='local'?'可微调分段时间。B 站从开始时间起播，结束时请在播放器内暂停。':'本地文件的时间与官方视频不同，请为当前分段填写对应的起止位置。';$('#reset-range').hidden=selected==='local';}
$('#lesson-list').addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)selectLesson(Number(b.dataset.lesson));});
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;revealed=false;renderMode();}));
$('.mode-tabs').addEventListener('keydown',e=>{const modes=['watch','together','solo'];if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let i=modes.indexOf(mode);i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;mode=modes[i];revealed=false;renderMode();$(`#mode-${mode}`).focus();}});
$('#previous').addEventListener('click',()=>selectLesson(index-1));$('#next').addEventListener('click',()=>selectLesson(index+1));
$('#suggestion').addEventListener('click',()=>{const s=summary(data),i=lessons.findIndex(l=>s.latest[l.id]?.status!=='independent');selectLesson(i<0?0:i);$('#practice').scrollIntoView({behavior:'smooth'});});
$('#video-cover').addEventListener('click',openVideo);$('#collapse-video').addEventListener('click',()=>{player.pause();loaded=false;renderMode();});$('#replay').addEventListener('click',()=>player.replay());$('#loop').addEventListener('change',e=>{player.loop=e.target.checked;});$('#speed').addEventListener('change',e=>player.setSpeed(Number(e.target.value)));
$('#reveal-cues').addEventListener('click',()=>{revealed=!revealed;renderMode();});
$('#speak-cue').addEventListener('click',()=>{if(!('speechSynthesis' in window)){toast('此浏览器不支持朗读，可以直接念给孩子听。');return;}window.speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(lesson().chant);speech.lang='zh-CN';speech.rate=.8;speech.onerror=()=>toast('口令朗读暂不可用，可以由家长慢慢念给孩子听。');window.speechSynthesis.speak(speech);});
$$('[data-status]').forEach(b=>b.addEventListener('click',()=>{chosenStatus=b.dataset.status;if(chosenStatus==='independent')$('#prompt-count').value='0';if(chosenStatus==='prompted'&&Number($('#prompt-count').value)===0)$('#prompt-count').value='1';renderStatus();}));
let undoAttemptId=data.attempts.at(-1)?.id??null;
$('#undo-attempt').hidden=!undoAttemptId;
$('#save-attempt').addEventListener('click',()=>{if(!chosenStatus)return;const prompts=Number($('#prompt-count').value);if($('#prompt-count').value.trim()===''||!Number.isInteger(prompts)||prompts<0||prompts>99){toast('提示次数请填写 0–99 之间的整数。');$('#prompt-count').focus();return;}
 if(chosenStatus==='independent'&&prompts>0){toast('有提示的练习可以记录为「需要提示」；独立完成时提示次数应为 0。');return;}
 if(chosenStatus==='prompted'&&prompts===0){toast('「需要提示」请记录至少 1 次提示，或选择其他表现。');return;}
 const note=$('#practice-note').value.trim();data=saveAttempt(data,{id:crypto.randomUUID(),lesson:lesson().id,status:chosenStatus,prompts,note,date:dayKey(),time:new Date().toISOString()});data.notes[lesson().id]=note;undoAttemptId=data.attempts.at(-1).id;$('#undo-attempt').hidden=false;const saved=persist();$('#save-message').textContent=saved?'✓ 已记下这次小进步':'已记下；本次无法长期保存';chosenStatus=null;renderStatus();renderProgress();toast(saved?'记下啦！给孩子一个小小的击掌。':'已记录在本页；浏览器未允许长期保存。');});
$('#undo-attempt').addEventListener('click',()=>{if(!undoAttemptId)return;data={...data,attempts:data.attempts.filter(a=>a.id!==undoAttemptId)};undoAttemptId=null;persist();$('#undo-attempt').hidden=true;$('#save-message').textContent='已撤销刚才的记录';renderProgress();});
function openHistory(){const rows=[...data.attempts].reverse();$('#history-content').innerHTML=rows.length?rows.map(a=>{const l=lessons.find(l=>l.id===a.lesson);return `<article class="history-row"><header><strong>${lessons.indexOf(l)+1}. ${escape(l.name)}</strong><span>${escape(statuses[a.status])}</span></header><small>${escape(a.date)} · 提示 ${a.prompts} 次</small>${a.note?`<p>${escape(a.note)}</p>`:''}</article>`;}).join(''):'<div class="empty-state">🌱<p>还没有练习记录。<br>陪孩子试一小段，再记录第一次进步吧。</p></div>';$('#history-dialog').showModal();}
$('#history-open').addEventListener('click',openHistory);$('#guide-open').addEventListener('click',()=>$('#guide-dialog').showModal());$('#sources-open').addEventListener('click',()=>$('#sources-dialog').showModal());
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});d.addEventListener('close',()=>$('#range-error').textContent='');});
$('#video-settings-open').addEventListener('click',openSettings);$('#video-source').addEventListener('change',renderSettingsRange);
$('#local-file').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;if(file.type&&!file.type.startsWith('video/')){toast('请选择视频文件。');return;}pendingLocalFile=file;$('#local-file-name').textContent=`待使用：${file.name}（点击保存并使用后生效）`;$('#video-source').value='local';renderSettingsRange();});
$('#range-form').addEventListener('submit',e=>{e.preventDefault();const a=$('#range-start').value,b=$('#range-end').value;if(!validRange(a,b)){$('#range-error').textContent='请填写有效时间：开始时间必须小于结束时间，秒数须小于 60。';return;}
 const selected=$('#video-source').value;if(selected==='local'&&!player.localURL&&!pendingLocalFile){$('#range-error').textContent='请先选择一个本地教学视频。';return;}
 const r={start:parseTime(a),end:parseTime(b)};if(selected==='local'&&!pendingLocalFile&&Number.isFinite(player.video.duration)&&r.end>player.video.duration){$('#range-error').textContent=`视频只有 ${formatTime(player.video.duration)}，请缩短结束时间。`;return;}
 if(selected==='local'&&pendingLocalFile){player.setFile(pendingLocalFile);activeFileName=pendingLocalFile.name;pendingLocalFile=null;}data.ranges[`${selected}:${lesson().id}`]=r;source=selected;persist();$('#settings-dialog').close();mode=mode==='solo'?'watch':mode;renderMode();openVideo();});
$('#reset-range').addEventListener('click',()=>{$('#range-start').value=formatTime(lesson().start);$('#range-end').value=formatTime(lesson().end);$('#range-error').textContent='';});
$('#whole-video').addEventListener('click',()=>window.open(sourceURL(896),'_blank','noopener'));
$('#explain-video').addEventListener('click',()=>window.open(sourceURL(lesson().explain),'_blank','noopener'));
async function printLessons(all){const selected=all?lessons:[lesson()];$('#print-area').innerHTML=selected.map(l=>`<section class="print-sheet"><p>小小道馆 · 太极一章亲子陪练</p><h1>${escape(l.name)}</h1><p>${escape(l.range)} · ${escape(l.subtitle)}</p><p class="print-chant">${escape(l.chant)}</p><h2>动作分解</h2><ol>${l.steps.map(s=>`<li value="${s.n}" class="${stepArt[s.n]?'print-illustrated-step':''}">${stepFigure(s.n,{print:true})}<strong>${escape(s.cue)}</strong><br>${escape(s.action)}。面向起始朝向的${escape(s.facing)}方。</li>`).join('')}</ol><h2>家长只盯一个重点</h2><p>${escape(l.focus)}</p><p>${escape(l.help)}</p><p>鼓励孩子：${escape(l.praise)}</p><p>全部方向以起始朝向为参照，左右以练习者自己为准。真人照片展示完成姿势；镜头视角会变化，行进方向请看文字。图片来源：Snapkick / Eva Sandersen，https://snapkick.app/poomsae/taegeuk-il-jang。先记顺序，技术细节由教练确认。</p><p class="print-check">日期：____________　□ 独立完成　□ 需要提示　□ 再练一练<br><br>提示次数：______　陪练小记：________________________________</p><p class="print-source">示范来源：${sourceURL(l.start)} （${formatTime(l.start)}–${formatTime(l.end)}）<br>中文口令为记忆辅助，非官方技术译文。</p></section>`).join('');await Promise.all([...$('#print-area').querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{const timer=setTimeout(resolve,6000);const done=()=>{clearTimeout(timer);resolve();};img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});})));window.print();}
$('#print-card').addEventListener('click',()=>printLessons(false));$('#print-guide').addEventListener('click',()=>printLessons(true));
// A visible link remains usable if an embed is blocked by the platform or network.
const fallback=document.createElement('a');fallback.id='original-video';fallback.target='_blank';fallback.rel='noopener';fallback.className='text-button';fallback.style.fontSize='10px';fallback.textContent='在原平台打开本段 ↗';$('#player-toolbar').append(fallback);
function sourceURL(start){return source==='online'?`https://www.youtube.com/watch?v=${VIDEO_ID}&t=${start}s`:`https://www.bilibili.com/video/${BILIBILI_ID}/?t=${start}`;}
function updateLink(){fallback.href=sourceURL(getRange()?.start??lesson().start);}
$('#lesson-list').addEventListener('click',updateLink);$('#previous').addEventListener('click',updateLink);$('#next').addEventListener('click',updateLink);$('#suggestion').addEventListener('click',updateLink);
window.addEventListener('focus',()=>{if(lastDay!==dayKey()){lastDay=dayKey();renderProgress();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){player.pause();if('speechSynthesis'in window)window.speechSynthesis.cancel();}});
renderLesson();updateLink();

$('#steps-list').addEventListener('click',e=>{const b=e.target.closest('[data-step-art]');if(!b)return;const n=Number(b.dataset.stepArt),a=stepArt[n];if(!a)return;$('#step-art-title').textContent=`第 ${n} 拍 · ${a.hand}`;$('#step-art-content').innerHTML=stepPhoto(n);$('#step-art-detail').textContent=`${a.turn}；${a.foot}，${a.stance}。面向起始朝向的${a.facing}方。`;$('#step-art-dialog').showModal();});

document.addEventListener('error',e=>{if(e.target.matches?.('img.step-photo')){e.target.hidden=true;e.target.parentElement.classList.add('photo-unavailable');}},true);
