const pageNav={home:'nav-home',translate:'nav-translate',audiobook:'nav-audiobook',textgen:'nav-textgen',history:'nav-history',profile:'nav-profile'};
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  if(pageNav[id])document.getElementById(pageNav[id]).classList.add('active');
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
const sTexts={
  summary:'Muhtasari: Sheria ya Kwanza ya Newton inasema kwamba mwili utakuwa katika hali yake ya sasa mpaka nguvu ya nje isababishe mabadiliko. Hii inaitwa "Sheria ya Inertia." Sheria ya Pili: F = ma (Nguvu = Misa × Kasi ya Mabadiliko). Sheria ya Tatu: kwa kila kitendo, kuna kitendo kingine sawa na kinyume nacho.',
  explain:'Maelezo kwa Lugha Rahisi: Fikiria wewe uko ndani ya basi inayokwenda mbele kwa kasi kubwa. Ghafla basi inasimama. Mwili wako unaendelea kwenda mbele — hii ndio inertia. Hii inaonyesha jinsi Sheria ya Newton inavyofanya kazi katika maisha ya kila siku.',
  quiz:'❓ Maswali ya Mtihani — Fizikia:\n\n1. Eleza Sheria ya Kwanza ya Newton kwa maneno yako mwenyewe.\n\n2. Nguvu ya 20N inasababisha mwili wa 5kg kusogea. Kasi ni ngapi? (F = ma)\n\n3. Toa mfano wa Sheria ya Tatu katika maisha ya kila siku.\n\n4. Ni nini maana ya "inertia"?\n\n5. Kwa nini astronaut angepata shida kutembea angani?',
  essay:'Insha: Umuhimu wa Sheria za Newton katika Teknolojia ya Leo\n\nSheria za Newton za mwendo zimekuwa msingi wa uvumbuzi wa kisayansi kwa karne nyingi. Tangu Newton alipozieleza mwaka 1687, wanafikra wa sayansi na wahandisi wametumia sheria hizi kuunda magari, ndege, na hata roketi za kwenda angani...',
  notes:'📖 Madokezo Muhimu — Sheria za Newton:\n\n• Sheria ya 1: Inertia — mwili hauwezi kubadilika bila nguvu ya nje\n• Sheria ya 2: F = ma\n• Sheria ya 3: Kitendo na Majibu — nguvu mbili sawa na kinyume\n• Vitengo: Nguvu = Newton (N), Misa = kg, Kasi = m/s²',
  translate:'Tafsiri ya Kiswahili:\n\nNewton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n→ Kiswahili: Sheria ya Kwanza ya Newton inasema kwamba kitu kilichosimama kitabaki kimesimama, na kitu kinachosogea kitaendelea kusogea mpaka nguvu ya nje iisababishe kubadilika.'
};
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
    showToast(data.demo?'✅ Mfano wa AI uko tayari!':'✅ Maandishi yamekamilika!');
    result.scrollIntoView({behavior:'smooth'});
  }catch(error){
    text.textContent='Samahani, hatukuweza kutengeneza maandishi sasa. Hakikisha seva inaendelea kufanya kazi na jaribu tena.';
    showToast('⚠️ '+error.message);
  }
}
function toAudio(){showPage('audiobook');const t=document.getElementById('tg-text').textContent;document.getElementById('ab-input').value=t.substring(0,300)+'...';showToast('🎧 Maandishi yamehamishiwa kwenye Sauti!');}
function doPay(){showToast('🔄 Inashughulikia malipo...');setTimeout(()=>showModal('pay-success'),2000);}
