import {categories,presets} from './data.js?v=20261105-studio-cikgu-pu2';
import {visualStyles,colorTreatments,detailLevels,creativeDirection} from './creative.js?v=20261105-studio-cikgu-pu2';
import {formats,getSpec,recommend,buildPrompt} from './engine.js?v=20261105-studio-cikgu-pu2';
const $=id=>document.getElementById(id),form=$('prompt-form');
let mode='quick',previousMode='quick',selected=presets[0],lastPrompt='',toastTimer,manualPreset=false;
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),5000);}
function option(value,text){const o=document.createElement('option');o.value=value;o.textContent=text;return o;}
for(const c of categories)$('category').append(option(c.id,c.name));
for(const f of formats)$('format').append(option(f.id,f.name));
for(const [id,choices] of [['visual-style',visualStyles],['color-treatment',colorTreatments],['detail-level',detailLevels]])for(const c of choices)$(id).append(option(c.id,c.name));
function data(){return {...Object.fromEntries(new FormData(form)),mode,flag:$('flag').checked,logoSpace:$('logo-space').checked};}
function markStale(){if(lastPrompt){$('stale').hidden=false;$('copy').disabled=true;$('download-prompt').disabled=true;}}
function renderSpec(){try{const s=getSpec($('format').value,data());$('format-name').textContent=s.name;const dl=document.createElement('dl');const rows=s.mm?[
 ['Saiz akhir',s.mm.join(' × ')+' mm'],['Sasaran ketajaman',s.dpi+' PPI'],['Piksel saiz akhir',s.px.join(' × ')+' px'],['Bleed cadangan',s.bleed+' mm / sisi'],['Piksel termasuk bleed',s.bleedPx.join(' × ')+' px'],['Ruang selamat',s.safe+' mm ke dalam'],['Profil warna','sRGB → ikut pencetak']]:[['Dimensi sasaran',s.px.join(' × ')+' px'],['Nisbah',s.id==='story'?'9:16':s.id==='slide'?'16:9':'1:1'],['Ruang selamat',s.safe+' px'],['Profil warna','sRGB']];
 for(const [k,v] of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);}const note=document.createElement('p');note.className='spec-note';note.textContent=s.note;$('specs').replaceChildren(dl,note);
 }catch(e){$('format-name').textContent='Semak ukuran';$('specs').textContent=e.message;}}
function renderCreative(){const c=creativeDirection(data(),selected);$('creative-summary').textContent=c.summary;$('creative-preview').dataset.style=$('visual-style').value;$('creative-preview').dataset.color=$('color-treatment').value;}
function fillPresets(){const arr=presets.filter(p=>p.category===$('category').value);$('preset').replaceChildren(...arr.map(p=>option(p.id,p.name+' — '+p.event)));}
function renderSelection(){$('preset').value=selected.id;renderCreative();}
function chooseRecommendation(){selected=recommend({category:$('category').value,format:$('format').value,mood:mode==='custom'?$('mood').value:'auto',query:$('title').value})[0];renderSelection();}
function setMode(next){mode=next;$('custom-options').hidden=mode==='repair';$('repair-options').hidden=mode!=='repair';$('repair').required=mode==='repair';$('toggle-repair').setAttribute('aria-pressed',String(mode==='repair'));$('toggle-repair').textContent=mode==='repair'?'← Kembali jana reka bentuk':'Baiki reka bentuk sedia ada ↗';renderCreative();markStale();}
$('toggle-repair').addEventListener('click',()=>{if(mode==='repair')setMode(previousMode);else{previousMode=mode;setMode('repair');}});
$('customize').addEventListener('toggle',()=>{if($('customize').open&&mode==='quick')setMode('custom');});
$('category').addEventListener('change',()=>{manualPreset=false;fillPresets();chooseRecommendation();});
$('format').addEventListener('change',()=>{$('custom-size').hidden=$('format').value!=='custom';if(!manualPreset&&mode!=='repair')chooseRecommendation();renderCreative();renderSpec();});
for(const id of ['visual-style','color-treatment','detail-level','palette','layout','mood'])$(id).addEventListener('input',()=>{if(mode==='quick')setMode('custom');renderCreative();});
$('title').addEventListener('change',()=>{if(!manualPreset&&mode!=='repair')chooseRecommendation();});
$('preset').addEventListener('change',()=>{selected=presets.find(p=>p.id===$('preset').value);manualPreset=true;if(mode==='quick')setMode('custom');renderSelection();});
for(const id of ['width','height','dpi','orientation'])$(id).addEventListener('input',renderSpec);
form.addEventListener('input',markStale);form.addEventListener('change',markStale);
form.addEventListener('submit',e=>{e.preventDefault();try{lastPrompt=buildPrompt(data(),{preset:selected});$('prompt-output').value=lastPrompt;$('generated').hidden=false;$('empty-output').hidden=true;$('stale').hidden=true;$('copy').disabled=false;$('download-prompt').disabled=false;$('logo-note').hidden=!$('logo-space').checked;$('repair-note').hidden=mode!=='repair';$('result').scrollIntoView({behavior:'smooth',block:'start'});toast('Prompt siap. Salin dan tampal di AI.');}catch(err){toast(err.message);}});
$('copy').addEventListener('click',async()=>{if(!lastPrompt||$('copy').disabled)return;try{await navigator.clipboard.writeText(lastPrompt);toast($('logo-space').checked?'Prompt disalin. Tambah logo asal selepas imej dijana.':'Prompt disalin. Tampal di AI pilihan anda.');}catch{$('prompt-output').focus();$('prompt-output').select();toast('Teks dipilih. Tekan Salin / Copy pada peranti anda.');}});
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
$('download-prompt').addEventListener('click',()=>{if(lastPrompt&&!$('download-prompt').disabled)download(new Blob([lastPrompt],{type:'text/plain;charset=utf-8'}),'studio-cikgu-pu-master-prompt.txt');});
const draftKey='pgbpu-studio-draft-v1';
$('save').addEventListener('click',()=>{try{localStorage.setItem(draftKey,JSON.stringify({version:1,values:data(),preset:selected.id,previousMode,customize:$('customize').open}));toast('Draf disimpan pada pelayar ini.');}catch{toast('Draf tidak dapat disimpan. Simpan prompt sebagai .txt.');}});
$('load').addEventListener('click',()=>{try{const raw=localStorage.getItem(draftKey);if(!raw){toast('Belum ada draf pada pelayar ini.');return;}const draft=JSON.parse(raw),d=draft.values;
 if(draft.version!==1||!d||!presets.some(p=>p.id===draft.preset&&p.category===d.category)||!categories.some(c=>c.id===d.category)||!formats.some(f=>f.id===d.format)||!['quick','custom','repair'].includes(d.mode))throw Error();
 for(const name of ['visualStyle','colorTreatment','detailLevel'])if(!d[name])d[name]='auto';
 // Old logo-upload choices are deliberately not migrated into a request for a logo space.
 d.logoSpace=d.logoSpace===true;
 for(const [k,v] of Object.entries(d)){const el=form.elements.namedItem(k);if(el){if(el.type==='checkbox')el.checked=v===true;else el.value=String(v);}}
 fillPresets();selected=presets.find(p=>p.id===draft.preset);previousMode=['quick','custom'].includes(draft.previousMode)?draft.previousMode:'quick';manualPreset=true;$('customize').open=Boolean(draft.customize||d.mode==='custom');setMode(d.mode);$('custom-size').hidden=d.format!=='custom';renderSelection();renderSpec();markStale();toast('Draf dibuka.');}catch{toast('Draf tidak dapat dibuka. Sila isi semula butiran.');}});
$('delete-draft').addEventListener('click',()=>{try{localStorage.removeItem(draftKey);toast('Draf tersimpan dipadam.');}catch{toast('Draf tidak dapat dipadam.');}});
$('demo').addEventListener('click',()=>{form.reset();manualPreset=false;$('customize').open=false;$('category').value='anugerah';$('format').value='banner';$('title').value='Majlis Anugerah Kecemerlangan';$('school').value='SK Seri Bestari (contoh rekaan)';$('date').value='2026-11-20';$('time').value='09:00';$('venue').value='Dewan Gemilang (contoh)';$('extra').value='Tema: Menggilap Potensi, Merai Kejayaan';$('custom-size').hidden=true;fillPresets();setMode('quick');chooseRecommendation();renderSpec();markStale();$('studio').scrollIntoView({behavior:'smooth'});toast('Contoh diisi. Tukar kepada butiran sebenar.');});
$('open-guide').addEventListener('click',()=>{$('panduan').open=true;});
// An external image-based shared counter, not a per-browser fake tally.
// Only the public deployment requests it; local/offline demos do not inflate it.
const badge=$('visit-badge'),fallback=$('visit-fallback');
if(location.hostname==='ustppu.github.io'&&location.pathname.startsWith('/studio-cikgu-pu/')){
 badge.addEventListener('load',()=>{badge.hidden=false;fallback.hidden=true;});
 badge.addEventListener('error',()=>{badge.hidden=true;fallback.hidden=false;fallback.textContent='Lawatan · tidak tersedia';});
 badge.src='https://hits.sh/ustppu.github.io/pgbpustudio.svg?label=Jumlah%20lawatan&color=163d35&labelColor=6d8451';
}else fallback.textContent='Lawatan · versi demo';
fillPresets();chooseRecommendation();renderSpec();
