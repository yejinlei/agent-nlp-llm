
document.addEventListener("DOMContentLoaded", function(){

// ===== Sine lab =====
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const DPR = window.devicePixelRatio||1;
const elF1=document.getElementById('f1'),elF2=document.getElementById('f2'),elF3=document.getElementById('f3');
const elA1=document.getElementById('a1'),elA2=document.getElementById('a2'),elA3=document.getElementById('a3');
const elF1v=document.getElementById('f1v'),elF2v=document.getElementById('f2v'),elF3v=document.getElementById('f3v');
const elA1v=document.getElementById('a1v'),elA2v=document.getElementById('a2v'),elA3v=document.getElementById('a3v');
const elFml=document.getElementById('fml');
function resizeCv(){
  const r = cv.getBoundingClientRect();
  cv.width = r.width*DPR; cv.height = r.height*DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  drawSine();
}
function drawSine(){
  const w = cv.clientWidth, h = cv.clientHeight;
  ctx.clearRect(0,0,w,h);
  const freq1=+elF1.value,amp1=+elA1.value/10, freq2=+elF2.value,amp2=+elA2.value/10, freq3=+elF3.value,amp3=+elA3.value/10;
  elF1v.textContent=freq1; elA1v.textContent=amp1.toFixed(1);
  elF2v.textContent=freq2; elA2v.textContent=amp2.toFixed(1);
  elF3v.textContent=freq3; elA3v.textContent=amp3.toFixed(1);
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  ctx.strokeStyle='#0ea5e9';ctx.lineWidth=2;
  ctx.beginPath();
  for(let x=0;x<w;x++){
    const t = x/w*2;
    const y = amp1*Math.sin(2*Math.PI*freq1*t)+amp2*Math.sin(2*Math.PI*freq2*t)+amp3*Math.sin(2*Math.PI*freq3*t);
    const py = h/2 - y*(h/2-20)/2.2;
    if(x===0) ctx.moveTo(x,py); else ctx.lineTo(x,py);
  }
  ctx.stroke();
  elFml.textContent = `f(t) = ${amp1.toFixed(1)}·sin(2π·${freq1}t) + ${amp2.toFixed(1)}·sin(2π·${freq2}t) + ${amp3.toFixed(1)}·sin(2π·${freq3}t)`;
}
['f1','a1','f2','a2','f3','a3'].forEach(id=>document.getElementById(id).addEventListener('input',drawSine));
window.addEventListener('resize', resizeCv);
resizeCv();

// ===== CTC demo =====
document.getElementById('ctc-run').addEventListener('click',()=>{
  const txt = document.getElementById('ctc-in').value||'ab';
  const out = document.getElementById('ctc-out');
  const vocab = ['ε',...txt.split('')];
  const T = 14;
  let raw = [];
  let prev = 'ε';
  for(let i=0;i<T;i++){
    let c;
    if(Math.random()<0.35) c='ε';
    else if(Math.random()<0.3 && prev!=='ε') c=prev;
    else c = vocab[Math.floor(Math.random()*vocab.length)];
    raw.push(c); prev=c;
  }
  let merged = '', last='ε';
  for(const c of raw){ if(c!==last && c!=='ε') merged+=c; last=c; }
  out.innerHTML = '<div style="margin-bottom:.4rem;color:#64748b">原始帧输出（T='+T+'）：</div>'+
    '<div style="display:flex;gap:2px;margin-bottom:.6rem;flex-wrap:wrap">'+raw.map(c=>`<span style="padding:2px 6px;background:${c==='ε'?'#f1f5f9':c===merged[0]?'#dbeafe':'#fed7aa'};border-radius:3px">${c}</span>`).join('')+'</div>'+
    '<div style="color:#64748b;margin-bottom:.4rem">合并规则：去重复 → 去 ε →</div>'+
    '<div style="font-size:1.1rem;font-weight:700;color:var(--sky-d)">"'+merged+'"' +
    (merged===txt?' <span style="color:#10b981;font-size:.85rem">✓ 正确对齐</span>':' <span style="color:#f59e0b;font-size:.85rem">→ 再跑一次</span>')+'</div>';
});
document.getElementById('ctc-run').click();

// ===== f0/fmt source-filter demo (interactive description) =====
const f0El=document.getElementById('f0'),fmtEl=document.getElementById('fmt');
const f0vEl=document.getElementById('f0v'),fmtvEl=document.getElementById('fmtv');
const sfDesc=document.getElementById('sf-desc');
function updSF(){
  f0vEl.textContent=f0El.value;fmtvEl.textContent=fmtEl.value;
  const f0=+f0El.value,fmt=+fmtEl.value;
  const voice=f0<150?'成年男声':f0<200?'童声/老年女声':'成年女声';
  let vowel='中央元音 /ə/';
  if(fmt<350)vowel='/i/ 衣（高前元音）';
  else if(fmt<550)vowel='/e/ 鹅（中元音）' + (fmt>450?' 偏开':'');
  else if(fmt<700)vowel='/o/ 哦（后中元音）';
  else vowel='/a/ 啊（低元音，嘴巴张大）';
  sfDesc.textContent=`${voice} + ${vowel}：基频 F0=${f0}Hz 决定音高，共振峰 F1=${fmt}Hz 决定元音音色。真实语音有 3-4 个共振峰共同决定音色。`;
}
f0El.addEventListener('input',updSF);fmtEl.addEventListener('input',updSF);
updSF();

});
