import test from 'node:test';
import assert from 'node:assert/strict';
import {presets,categories} from '../data.js';
import {getSpec,recommend,buildPrompt,formats,removeEdgeBackground} from '../engine.js';
const base={title:'Program Ujian',category:'anugerah',format:'a4',mode:'quick',target:'chatgpt'};
test('96 unique curated presets across 12 categories',()=>{assert.equal(presets.length,96);assert.equal(categories.length,12);assert.equal(new Set(presets.map(p=>p.id)).size,96);for(const c of categories)assert.equal(presets.filter(p=>p.category===c.id).length,8);});
test('real millimetre conversion, bleed and large format targets',()=>{const a=getSpec('a4');assert.deepEqual(a.px,[2480,3508]);assert.deepEqual(a.bleedPx,[2551,3579]);assert.deepEqual(getSpec('a3').px,[3508,4961]);assert.deepEqual(getSpec('banner').px,[21600,7200]);assert.deepEqual(getSpec('bunting').px,[3600,10800]);assert.deepEqual(getSpec('slide').px,[1920,1080]);});
test('custom dimensions, orientation and validation',()=>{assert.deepEqual(getSpec('custom',{width:210,height:297,dpi:300,orientation:'landscape'}).mm,[297,210]);for(const n of ['',0,-10,Infinity,20001,'bad'])assert.throws(()=>getSpec('custom',{width:n,height:297,dpi:300}));assert.throws(()=>getSpec('custom',{width:210,height:297,dpi:72}));});
test('assisted recommendations respect category, use event text and mood',()=>{assert.ok(recommend({category:'sukan',format:'social'}).every(p=>p.category==='sukan'));assert.equal(recommend({category:'penghargaan',format:'social',query:'Majlis Persaraan'})[0].name,'Jasamu Dikenang');});
test('every preset and output produces an honest prompt with mandatory QA',()=>{for(const preset of presets)for(const f of formats){const prompt=buildPrompt({...base,category:preset.category,format:f.id,width:210,height:297,dpi:300},{preset});for(const term of ['ejaan','tarikh','bendera','logo','dimensi piksel','kuota','jangan','SEMAKAN WAJIB'])assert.ok(prompt.toLowerCase().includes(term.toLowerCase()));if(f.mm)assert.match(prompt,/CMYK/);assert.match(prompt,/Jangan cipta logo/);}});
test('target, repair and flag instructions stay conditional without logo uploads',()=>{const p=buildPrompt({...base,target:'gemini',mode:'repair',repair:'Betulkan tajuk',flag:true,logoSpace:true});assert.match(p,/GEMINI/);assert.match(p,/SEDIAKAN RUANG LOGO BERSEPADU/);assert.match(p,/reka bentuk asal/);assert.match(p,/rujukan rasmi/);assert.throws(()=>buildPrompt({...base,title:''}));assert.throws(()=>buildPrompt({...base,mode:'repair',repair:''}));});
test('background-only excludes drawn text; unknown details are not invented',()=>{const p=buildPrompt({...base,textMode:'background'});assert.match(p,/LATAR SAHAJA/);assert.doesNotMatch(p,/Nama sekolah:/);assert.doesNotMatch(p,/Tarikh:/);});
test('flood fill preserves enclosed white logo region and existing alpha',()=>{const w=5,h=5,data=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;const border=x===0||y===0||x===4||y===4;const center=x===2&&y===2;data.set(border||center?[255,255,255,255]:[0,50,50,255],i);}const result=removeEdgeBackground(data,w,h,28);assert.equal(result[3],0);assert.equal(result[(2*w+2)*4+3],255);assert.equal(result[(1*w+1)*4+3],255);assert.equal(data[3],255);});
test('quick and repair modes do not inherit hidden custom colour or layout overrides',()=>{const p=buildPrompt({...base,palette:'stale-red',layout:'stale-layout',mood:'stale-mood'});assert.doesNotMatch(p,/stale-/);const c=buildPrompt({...base,mode:'custom',palette:'chosen-red',layout:'chosen-layout'});assert.match(c,/chosen-red/);assert.match(c,/chosen-layout/);});

test('every selectable art direction changes concrete visual instructions for both AI targets',async()=>{
 const {visualStyles,colorTreatments,detailLevels}=await import('../creative.js');
 for(const target of ['chatgpt','gemini'])for(const style of visualStyles)for(const color of colorTreatments)for(const detail of detailLevels){
  const p=buildPrompt({...base,target,visualStyle:style.id,colorTreatment:color.id,detailLevel:detail.id});
  assert.match(p,/KONTRAK CITARASA PENGGUNA/);assert.match(p,/SEMAKAN ARAH SENI/);assert.match(p,/SEMAKAN WAJIB/);
  if(style.id!=='auto')assert.ok(p.includes(style.direction));
  if(color.id!=='auto')assert.ok(p.includes(color.direction));
  if(detail.id!=='auto'&&style.id!=='minimal')assert.ok(p.includes(detail.direction));
 }
});
test('abstract colourful brief does not default to a generic plain design',()=>{
 const p=buildPrompt({...base,visualStyle:'abstract',colorTreatment:'vibrant',detailLevel:'rich'});
 for(const term of ['bentuk organik','warna kaya dan tepu','lapisan besar','lapisan pertengahan','kawasan teks','mengatasi cadangan preset'])assert.ok(p.includes(term),term);
 assert.doesNotMatch(p,/Elakkan hiasan berlebihan/);
});
test('minimal plus rich is reconciled explicitly and repair auto preserves original styling',()=>{
 const minimal=buildPrompt({...base,visualStyle:'minimal',colorTreatment:'pastel',detailLevel:'rich'});assert.match(minimal,/gaya minimal diutamakan/);
 const repair=buildPrompt({...base,mode:'repair',repair:'Betulkan tarikh'});assert.match(repair,/PEMELIHARAAN GAYA ASAL/);assert.doesNotMatch(repair,/Gunakan bingkai halus/);
 const restyle=buildPrompt({...base,mode:'repair',repair:'Jadikan abstrak meriah',visualStyle:'abstract',colorTreatment:'vibrant'});assert.match(restyle,/bentuk organik/);assert.match(restyle,/warna kaya dan tepu/);
});
test('unknown style controls fail safely instead of ignoring user preferences',()=>{
 for(const field of ['visualStyle','colorTreatment','detailLevel'])assert.throws(()=>buildPrompt({...base,[field]:'not-a-choice'}),/tidak sah/);
});
test('repair colour-only preference preserves original style and layout',()=>{
 const p=buildPrompt({...base,mode:'repair',repair:'Meriahkan warna sahaja',colorTreatment:'vibrant'});
 assert.match(p,/Kekalkan gaya asal/);assert.match(p,/Kekalkan susun atur asal/);assert.match(p,/Kekalkan perincian asal/);assert.match(p,/warna kaya dan tepu/);assert.doesNotMatch(p,/Gunakan bingkai halus/);
});

test('logo checkbox reserves an integrated space, never asks for an upload or draws a fake logo',()=>{
 for(const target of ['chatgpt','gemini'])for(const format of ['social','banner','bunting','slide','a4']){
  const p=buildPrompt({...base,target,format,logoSpace:true,visualStyle:'minimal'});
  assert.match(p,/SEDIAKAN RUANG LOGO BERSEPADU/);assert.match(p,/menyambung|Sambungkan warna/);assert.match(p,/jangan tambah gradien secara paksa/);assert.match(p,/bukan objek placeholder yang kelihatan/);assert.match(p,/tidak perlu meminta fail logo/);assert.match(p,/menampal logo sekolah asal/);assert.doesNotMatch(p,/TIDAK dihantar|buang latar luar sahaja|pembuangan latar setempat/i);
 }
 const p=buildPrompt({...base,logoSpace:false});assert.match(p,/Tiada ruang logo khas diminta/);assert.doesNotMatch(p,/SEDIAKAN RUANG LOGO BERSEPADU/);
});
