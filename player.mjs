import {VIDEO_ID, BILIBILI_ID, formatTime} from './core.mjs';
export function bilibiliEmbedURL(start,autoplay=true){const u=new URL('https://player.bilibili.com/player.html');u.search=new URLSearchParams({bvid:BILIBILI_ID,p:'1',t:String(Math.max(0,Math.floor(start))),autoplay:autoplay?'1':'0',danmaku:'0'});return u.href;}
let apiPromise;
function loadApi(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';
  const timer=setTimeout(()=>reject(new Error('无法连接 YouTube。可以在原平台打开，或换成本地教学视频。')),12000);
  window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);resolve(window.YT);};
  script.onerror=()=>{clearTimeout(timer);reject(new Error('在线示范连接失败，请检查网络或换成本地教学视频。'));};
  document.head.append(script);
 }).catch(e=>{apiPromise=null;throw e;});return apiPromise;
}
export class LessonPlayer{
 constructor({message,onReady}){this.message=message;this.onReady=onReady;this.source='online';this.yt=null;this.range=null;this.loop=false;this.speed=1;this.localURL=null;this.generation=0;this.ready=false;this.endHandled=false;this.video=document.querySelector('#local-player');this.cover=document.querySelector('#video-cover');
 this.video.addEventListener('timeupdate',()=>this.checkEnd());
 this.video.addEventListener('play',()=>this.onLocalPlay());
 this.video.addEventListener('ended',()=>{if(this.source==='local'&&this.loop&&this.range){this.video.currentTime=this.range.start;this.play();}});
 this.video.addEventListener('error',()=>this.message('这个视频无法播放，请选择浏览器支持的 MP4、WebM 等视频。'));
 this.timer=setInterval(()=>this.checkEnd(),150);
 }
 pause(){this.allowAutoplay=false;try{this.yt?.pauseVideo?.();}catch{}this.video.pause();if(this.biliFrame){this.biliFrame.remove();this.biliFrame=null;this.ready=false;this.cover.hidden=false;this.onReady(false);}}
 stop(){this.generation++;this.pause();this.endHandled=false;}
 onLocalPlay(){if(this.source!=='local'||!this.range)return;this.endHandled=false;if(this.video.currentTime<this.range.start||this.video.currentTime>=this.range.end-.08)this.video.currentTime=this.range.start;}
 async open({source,range,autoplay=true}){
 this.stop();this.allowAutoplay=autoplay;this.source=source;this.range=range;this.ready=false;this.onReady(false);const generation=this.generation;
 this.video.hidden=source!=='local';document.querySelector('#online-player').hidden=source!=='online';
 this.message('正在准备示范…');
 if(source==='bilibili'){
  this.cover.hidden=true;const frame=document.createElement('iframe');this.biliFrame=frame;frame.id='bilibili-player';frame.title='B 站太极一章中文字幕示范';frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.src=bilibiliEmbedURL(range.start,autoplay);
  const notice=`B 站示范 · ${formatTime(range.start)}–${formatTime(range.end)}。到 ${formatTime(range.end)} 请在视频中暂停；倍速也在视频中设置。`;
  frame.addEventListener('load',()=>{if(generation!==this.generation||this.biliFrame!==frame)return;this.ready=true;this.onReady(true);this.message(notice+' 若无法播放，可在 B 站打开。');});
  this.message(notice);document.querySelector('#video-shell').prepend(frame);return;
 }
 if(source==='local'){
  if(!this.localURL){this.cover.hidden=false;this.message('请先选择本地教学视频，并为这一段设置开始、结束时间。');return;}
  this.cover.hidden=true;
  const ready=()=>{if(generation!==this.generation)return;if(range.end>this.video.duration||range.start>=this.video.duration){this.message('本段时间超出视频长度，请在视频设置中调整。');this.onReady(false);return;}
   this.ready=true;this.video.currentTime=range.start;this.video.playbackRate=this.speed;this.onReady(true);this.message(`本地视频 · ${formatTime(range.start)}–${formatTime(range.end)}`);if(this.allowAutoplay)this.play();};
  if(this.video.readyState>=1)ready();else this.video.addEventListener('loadedmetadata',ready,{once:true});return;
 }
 try{
  const YT=await loadApi();if(generation!==this.generation)return;
  if(this.yt){this.yt.destroy();this.yt=null;}
  // The API replaces its mount element with an iframe.
  if(!document.querySelector('#online-player')){const mount=document.createElement('div');mount.id='online-player';document.querySelector('#video-shell').prepend(mount);}
  this.cover.hidden=true;
  this.yt=new YT.Player('online-player',{videoId:VIDEO_ID,playerVars:{playsinline:1,rel:0,start:range.start,origin:location.origin,autoplay:autoplay?1:0},events:{
   onReady:event=>{if(generation!==this.generation)return;this.ready=true;event.target.seekTo(range.start,true);event.target.setPlaybackRate(this.speed);this.onReady(true);this.message(`国技院官方示范 · ${formatTime(range.start)}–${formatTime(range.end)} · 到结尾自动暂停`);if(this.allowAutoplay)event.target.playVideo();else event.target.pauseVideo();},
   onError:()=>{if(generation!==this.generation)return;this.ready=false;this.onReady(false);this.message('此环境无法嵌入播放。请用下方原视频链接打开，或换成本地视频。');},
   onStateChange:event=>{if(generation!==this.generation)return;if(event.data===1)this.onOnlinePlay(event.target);}
  }});
  setTimeout(()=>{if(generation===this.generation&&!this.ready)this.message('视频仍在加载。若长时间无画面，请在原平台打开或换成本地视频。');},15000);
 }catch(e){if(generation!==this.generation)return;this.cover.hidden=false;this.message(e.message);}
 }
 onOnlinePlay(target){const finished=this.endHandled;this.endHandled=false;const time=target.getCurrentTime();if(finished||time<this.range.start-.5||time>=this.range.end-.08)target.seekTo(this.range.start,true);}
 checkEnd(){if(!this.ready||!this.range||this.source==='bilibili')return;
 let t=0,playing=false;
 if(this.source==='local'){t=this.video.currentTime;playing=!this.video.paused;}else{try{t=this.yt?.getCurrentTime?.()??0;playing=this.yt?.getPlayerState?.()===1;}catch{return;}}
 if(!playing||this.endHandled)return;
 if(t>=this.range.end-.08){if(this.loop){this.replay();}else{this.endHandled=true;if(this.source==='local')this.video.pause();else this.yt?.pauseVideo();this.message('这一段看完啦。暂停一下，和孩子试着做一遍。');}}
 }
 replay(){if(!this.ready||!this.range)return;if(this.source==='bilibili'){this.open({source:this.source,range:this.range});return;}this.endHandled=false;if(this.source==='local'){this.video.currentTime=this.range.start;this.play();}else{this.yt.seekTo(this.range.start,true);this.yt.playVideo();}}
 play(){this.video.play().catch(()=>this.message('请点击视频中的播放按钮，开始本地示范。'));}
 setSpeed(speed){this.speed=speed;if(this.source==='local')this.video.playbackRate=speed;else if(this.ready){try{const available=this.yt.getAvailablePlaybackRates();if(available.includes(speed))this.yt.setPlaybackRate(speed);else this.message('此视频暂不支持这个速度，请使用播放器中的速度选项。');}catch{}}}
 setFile(file){this.stop();this.ready=false;this.onReady(false);if(this.localURL)URL.revokeObjectURL(this.localURL);this.localURL=URL.createObjectURL(file);this.video.src=this.localURL;this.video.load();}
 hide(){this.stop();this.ready=false;this.onReady(false);}
}
