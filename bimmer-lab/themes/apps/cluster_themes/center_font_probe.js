'use strict';
// Optional Settings extra sheet. No filesystem, socket, signal or renderer restart.
const rec=require('./kit/record'),bitmap=require('./hud_text');
const CPU_ID=0x43543231;
function sheet(){
 let mode=0,focus=0;
 return {title:'CT21 Center Font Check',rows:['REUSE20 + EXTRA24','CPU IMAGE ONLY','OLD21 ATLAS - TEST LAST','DONE'],
 draw(r,t){
  r.clear('#10151c');r.text('CT21-20261116-R1  /  CENTER ONLY',44,82,26,'#ffffff',{literal:true});
  r.text('ABC 0123456789  km/h  [Latin control]',44,125,24,'#90caff',{literal:true});
  const cpu=bitmap.drawText(650,36,'設定 機油 水溫 車速',{font:'head',color:[255,255,255,255],align:'left'});
  rec.setImage(CPU_ID,650,36,cpu);
  r.text('CPU RGBA CONTROL:',44,165,20,'#aabbcc',{literal:true});
  if(r.image)r.image(CPU_ID,320,140,650,36);else if(r.drawImage)r.drawImage(cpu,650,36,320,140,650,36);
  r.text(this.rows[mode],44,220,24,'#ffffff',{literal:true});
  if(mode!==1){
   r.text('A: COMMON GLYPHS',44,260,20,'#aabbcc',{literal:true});
   r.text('設定機油水溫車速',420,265,36,'#ffffff',{literal:true,ct21Original:mode===2});
   r.text('B: CT21 EXTRA GLYPHS',44,310,20,'#aabbcc',{literal:true});
   r.text('攝控監馬計',420,315,36,'#ffffff',{literal:true,ct21Original:mode===2});
  }else r.text('No CJK GPU atlas requested by this probe mode.',44,280,23,'#ffffff',{literal:true});
  r.text('Old21 adds a full 1159-row atlas. Test it LAST; no automatic GPU reset.',44,360,20,'#ffcc77',{literal:true});
  const targets=[];
  this.rows.forEach((label,i)=>{const x=44+i*385,y=405,w=365,h=58;r.roundRect(x,y,w,h,12,focus===i?'#2456a0':'#26303d');r.text(label,x+w/2,y+36,19,'#ffffff',{literal:true,align:'center'});targets.push({x,y,w,h,act:()=>{focus=i;return this.press();}});});
  return targets;
 },move(d){focus=Math.max(0,Math.min(3,focus+d));},press(){if(focus===3)return 'close';mode=focus;return null;},back(){return 'close';},top(){return false;}};
}
function install(ctx,Page){
 const originalSettings=Page.prototype.settingsTab,originalRender=Page.prototype.render;
 Page.prototype.settingsTab=function(r,bottom){
  originalSettings.call(this,r,bottom);
  r.roundRect(1040,44,360,36,12,'#2456a0');
  r.text('FONT CHECK CT21-R1',1220,69,19,'#ffffff',{literal:true,align:'center'});
  r.target(1040,44,360,36,()=>{this._ctCenterProbe=sheet();this.kick();},'ct21:probe',12);
 };
 // This kit has no settingsRow API. Use the App's own page/targets, including software playback.
 Page.prototype.render=function(){
  if(!this._ctCenterProbe)return originalRender.call(this);
  const r=this.ctx.canvas(1600,520),p=this._ctCenterProbe;
  p.draw(r,this.theme()).forEach((q,i)=>r.target(q.x,q.y,q.w,q.h,()=>{if(q.act()==='close')this._ctCenterProbe=null;this.kick();},'ct21:probe:'+i,12));
  return this.ctx.ui.image('MAIN_GFX',r);
 };
}
module.exports={install,sheet};
