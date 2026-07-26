const pageNav={home:'nav-home',translate:'nav-translate',audiobook:'nav-audiobook',textgen:'nav-textgen',history:'nav-history',profile:'nav-profile'};
const historyKey='elimuai.studyHistory.v1';
const typeLabels={summary:'Muhtasari',explain:'Maelezo',quiz:'Maswali ya Mtihani',essay:'Insha',notes:'Madokezo',translate:'Tafsiri'};
const levelLabels={primary:'Msingi',secondary:'Sekondari',university:'Chuo Kikuu',adult:'Watu Wazima'};

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  if(pageNav[id])document.getElementById(pageNav[id]).classList.add('active');
  updateHistoryCount();
  if(id==='history')renderStudyHistory();
  window.scrollTo(0,0);
}
function switchTab(btn,ids,show){
  btn.closest('.tab-row').querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  ids.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display=id===show?'block':'none';});
}
function showModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function closeModalOut(e,id){if(e.target.classList.contains('modal-overlay'))closeModal(id);}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
function selectVoice(v){['amina','jabir','zuri','hassan'].forEach(n=>{const el=document.getElementById('vc-'+n);if(el)el.classList.toggle('selected',n===v);});showToast('🎙️ Sauti ya '+v.charAt(0).toUpperCase()+v.slice(1)+' imechaguliwa');}
function selPlan(p){['free','pro','school'].forEach(n=>{const el=document.getElementById('plan-'+n);if(el){el.classList.remove('selected');el.style.borderColor=n==='pro'?'var(--gold)':'var(--border)';}});const sel=document.getElementById('plan-'+p);if(sel){sel.classList.add('selected');sel.style.borderColor='var(--cyan)';}showToast('✅ Mpango wa '+(p==='free'?'Bure':p.charAt(0).toUpperCase()+p.slice(1))+' umechaguliwa');}
function selPay(m){['mpesa','tigo','airtel','card'].forEach(n=>{const el=document.getElementById('pm-'+n);if(el)el.classList.remove('selected');});document.getElementById('pm-'+m).classList.add('selected');document.getElementById('mobile-input').style.display=m==='card'?'none':'block';document.getElementById('card-fields').style.display=m==='card'?'block':'none';}
function selType(btn,type){document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');currentType=type;}
const steps=[{l:'Inabainisha sauti...',p:15},{l:'Inatafsiri maandishi...',p:35},{l:'Inatengeneza sauti ya Kiswahili...',p:60},{l:'Inaunganisha dubbing...',p:80},{l:'Inakamilisha...',p:95},{l:'Imekamilika! ✅',p:100}];
function runTranslation(){
  const url=document.getElementById('yt-url').value.trim();
  if(!url){showToast('⚠️ Tafadhali weka kiungo cha YouTube');return;}
  const prog=document.getElementById('tr-progress'),res=document.getElementById('tr-result');
  prog.style.display='block';res.style.display='none';
  let i=0;
  function tick(){
    if(i>=steps.length){setTimeout(()=>{prog.style.display='none';res.style.display='block';showToast('🎉 Tafsiri imekamilika!');res.scrollIntoView({behavior:'smooth'});},400);return;}
    document.getElementById('tr-bar').style.width=steps[i].p+'%';
    document.getElementById('tr-label').textContent=steps[i].l;
    document.getElementById('tr-pct').textContent=steps[i].p+'%';
    i++;setTimeout(tick,700);
  }tick();
}
function runAudiobook(){
  const txt=document.getElementById('ab-input').value.trim();
  if(!txt){showToast('⚠️ Tafadhali andika maandishi kwanza');return;}
  showToast('🎧 Inatengeneza sauti...');
  setTimeout(()=>{document.getElementById('ab-result').style.display='block';showToast('✅ Kitabu cha sauti kimekamilika!');document.getElementById('ab-result').scrollIntoView({behavior:'smooth'});},2500);
}
let currentType='summary';
function getStudyHistory(){
  try{return JSON.parse(localStorage.getItem(historyKey)||'[]');}catch(error){return [];}
}
function saveStudyHistory(item){
  const next=[item,...getStudyHistory()].slice(0,20);
  localStorage.setItem(historyKey,JSON.stringify(next));
  renderStudyHistory();
  updateHistoryCount();
}
function renderStudyHistory(){
  const history=getStudyHistory();
  const all=document.getElementById('generated-history-all');
  const txt=document.getElementById('generated-history-text');
  if(!all||!txt)return;
  const markup=history.map(item=>`<div class="history-item" onclick="openStudyHistory('${item.id}')"><div class="hi-icon green">✍️</div><div class="hi-info"><div class="hi-title">${escapeHtml(item.title)}</div><div class="hi-meta">${escapeHtml(item.typeLabel)} • ${escapeHtml(item.levelLabel)} • ${escapeHtml(item.date)}</div></div><span class="hi-badge done">✓ Tayari</span></div>`).join('');
  const empty='<div class="history-item"><div class="hi-icon green">✍️</div><div class="hi-info"><div class="hi-title">Hakuna maandishi mapya bado</div><div class="hi-meta">Tengeneza maandishi kwenye sehemu ya Andika ili yahifadhiwe hapa.</div></div><span class="hi-badge proc">Mpya</span></div>';
  all.innerHTML=history.length?markup:empty;
  txt.innerHTML=history.length?markup:empty;
}
function openStudyHistory(id){
  const item=getStudyHistory().find(entry=>entry.id===id);
  if(!item)return;
  showPage('textgen');
  document.getElementById('tg-input').value=item.input;
  document.getElementById('tg-text').textContent=item.result;
  document.getElementById('tg-result').style.display='block';
  showToast('📚 Kazi imefunguliwa kutoka Maktaba');
}
function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function updateHistoryCount(){
  const el=document.getElementById('history-count');
  if(!el)return;
  const count=getStudyHistory().length;
  el.textContent=count===1?'1 kazi':count+' kazi';
}
async function checkBackendStatus(){
  const el=document.getElementById('api-status');
  if(!el)return;

  try{
    const health=await ElimuApi.getHealth();
    el.textContent=health.aiProvider==='openai'?'Live AI tayari':'Demo AI tayari';
    el.className=health.aiProvider==='openai'?'ok':'warn';
  }catch(error){
    el.textContent='Seva haipatikani';
    el.className='err';
  }
}
function fillSampleTopic(){
  showPage('textgen');
  document.getElementById('tg-input').value='Eleza fotosinthesisi kwa mwanafunzi wa Form 2 kwa mifano ya mazingira ya Tanzania';
  document.getElementById('tg-level').value='secondary';
  document.getElementById('tg-length').value='medium';
  showToast('📝 Mada ya mfano imewekwa. Bonyeza Tengeneza Maandishi.');
}
async function copyGeneratedText(){
  const value=document.getElementById('tg-text').textContent.trim();
  if(!value){showToast('⚠️ Hakuna maandishi ya kunakili');return;}

  if(navigator.clipboard){
    await navigator.clipboard.writeText(value);
  }else{
    const area=document.createElement('textarea');
    area.value=value;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  showToast('📋 Maandishi yamenakiliwa!');
}

async function runTextGen(){
  const inp=document.getElementById('tg-input').value.trim();
  const level=document.getElementById('tg-level')?.value||'secondary';
  const length=document.getElementById('tg-length')?.value||'medium';
  const result=document.getElementById('tg-result');
  const text=document.getElementById('tg-text');

  if(!inp){showToast('⚠️ Tafadhali andika mada au maandishi');return;}

  showToast('✨ AI inatengeneza maandishi...');
  result.style.display='block';
  text.textContent='Tunasoma mada yako na kuandaa jibu la Kiswahili linalofaa kwa wanafunzi wa Tanzania...';

  try{
    const data=await ElimuApi.generateStudyContent({type:currentType,level,length,input:inp});
    text.textContent=data.result;
    saveStudyHistory({
      id:String(Date.now()),
      title:inp.length>54?inp.slice(0,54)+'...':inp,
      input:inp,
      result:data.result,
      type:currentType,
      typeLabel:typeLabels[currentType]||'Maandishi',
      level,
      levelLabel:levelLabels[level]||'Sekondari',
      date:new Date().toLocaleDateString('sw-TZ',{day:'numeric',month:'short',year:'numeric'}),
      demo:Boolean(data.demo),
    });
    showToast(data.demo?'✅ Mfano wa AI umehifadhiwa!':'✅ Maandishi yamehifadhiwa!');
    result.scrollIntoView({behavior:'smooth'});
  }catch(error){
    text.textContent='Samahani, hatukuweza kutengeneza maandishi sasa. Hakikisha seva inaendelea kufanya kazi na jaribu tena.';
    showToast('⚠️ '+error.message);
  }
}
function toAudio(){showPage('audiobook');const t=document.getElementById('tg-text').textContent;document.getElementById('ab-input').value=t.substring(0,300)+'...';showToast('🎧 Maandishi yamehamishiwa kwenye Sauti!');}
function doPay(){showToast('🔄 Inashughulikia malipo...');setTimeout(()=>showModal('pay-success'),2000);}
document.addEventListener('DOMContentLoaded',()=>{renderStudyHistory();updateHistoryCount();checkBackendStatus();});
