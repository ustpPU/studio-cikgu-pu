import {presets} from './data.js?v=20261105-studio-cikgu-pu';
import {creativeDirection} from './creative.js?v=20261105-studio-cikgu-pu';
export const formats = [
{id:'social',name:'Media sosial / WhatsApp',px:[1080,1080],safe:60,note:'Nisbah 1:1. PNG/JPEG sRGB. Saiz piksel lebih penting daripada metadata DPI untuk skrin.'},
{id:'story',name:'Story / Status menegak',px:[1080,1920],safe:90,note:'Nisbah 9:16. Simpan teks utama sekurang-kurangnya 250 px dari atas dan bawah untuk mengelak kawalan aplikasi.'},
{id:'slide',name:'Slaid pembentangan 16:9',px:[1920,1080],safe:80,note:'Satu visual slaid, bukan fail PPTX atau dek automatik. Tambah teks yang boleh disunting dalam PowerPoint/Slides.'},
{id:'a4',name:'Poster A4',mm:[210,297],dpi:300,bleed:3,safe:10,note:'Saiz akhir sebelum bleed. Cetakan dekat: sasaran 300 PPI. Sahkan spesifikasi pencetak.'},
{id:'a3',name:'Poster A3',mm:[297,420],dpi:300,bleed:3,safe:10,note:'Saiz akhir sebelum bleed. Cetakan dekat: sasaran 300 PPI. Sahkan spesifikasi pencetak.'},
{id:'banner',name:'Banner 12 × 4 kaki',mm:[3657.6,1219.2],dpi:150,bleed:25,safe:75,note:'Cadangan 150 PPI pada saiz akhir. Sahkan jarak pandangan, lipatan, jahitan dan lubang mata dengan pencetak.'},
{id:'bunting',name:'Bunting 2 × 6 kaki',mm:[609.6,1828.8],dpi:150,bleed:10,safe:30,note:'Untuk roll-up, ruang masuk tapak boleh memerlukan tambahan 100–150 mm di bawah; ikut templat pembekal.'},
{id:'backdrop',name:'Backdrop 16 × 8 kaki',mm:[4876.8,2438.4],dpi:150,bleed:25,safe:100,note:'Fail sasaran sangat besar. AI mungkin hanya memberi visual konsep; bina semula teks dan logo dalam alat susun atur.'},
{id:'certificate',name:'Sijil A4 melintang',mm:[297,210],dpi:300,bleed:3,safe:15,note:'Sediakan ruang nama, nombor sijil dan tandatangan sebenar; jangan reka tandatangan atau cap rasmi.'},
{id:'custom',name:'Cetakan saiz sendiri',mm:[210,297],dpi:300,bleed:3,safe:10,note:'Ukuran dalam mm pada saiz akhir. Untuk cetakan besar, sahkan bleed dan ruang kemasan dengan pencetak.'}
];
export const qa = `SEMAKAN WAJIB SEBELUM BERKONGSI ATAU MENCETAK\n1. Semak ejaan, nama sekolah, nama individu dan semua teks satu persatu.\n2. Sahkan tarikh, hari, masa, tempat dan maklumat program. Jangan anggap tarikh demo ialah tarikh sebenar.\n3. Jika ada bendera, sahkan bentuk, warna, bilangan jalur dan lambang dengan rujukan rasmi.\n4. Semak logo sekolah: perkadaran, tulisan, warna, lambang, tepi dan ketelusan. Jangan terima logo yang diubah.\n5. Semak dimensi piksel fail sebenar, keterbacaan, bleed dan ruang selamat. Dapatkan semakan pencetak sebelum produksi.`;
export function getSpec(id,options={}) {
 const base=formats.find(f=>f.id===id);if(!base)throw Error('Format tidak sah');
 const s={...base,mm:base.mm?.slice(),px:base.px?.slice()};
 if(id==='custom'){
  const w=Number(options.width),h=Number(options.height),d=Number(options.dpi);
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<10||h<10||w>20000||h>20000||![150,300].includes(d))throw Error('Saiz perlu antara 10–20,000 mm dan resolusi 150 atau 300 PPI.');
  s.mm=options.orientation==='landscape'?[Math.max(w,h),Math.min(w,h)]:[Math.min(w,h),Math.max(w,h)];s.dpi=d;
  if(Math.max(...s.mm)>1000){s.bleed=10;s.safe=30;}
 }
 if(s.mm){s.px=s.mm.map(x=>Math.round(x/25.4*s.dpi));s.bleedPx=s.mm.map(x=>Math.round((x+2*s.bleed)/25.4*s.dpi));}
 s.ratio=(s.px[0]/s.px[1]).toFixed(3)+':1';
 return s;
}
export function recommend({category,format,mood='auto',query=''}){
 const words=query.toLocaleLowerCase('ms').split(/\s+/).filter(Boolean);
 return presets.filter(p=>p.category===category).map((p,i)=>({p,i,score:(p.formats.includes(format)?4:0)+(mood===p.mood?6:0)+words.reduce((n,w)=>n+((p.event+' '+p.name).toLocaleLowerCase('ms').includes(w)?2:0),0)})).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.p);
}
export function specText(s){
 if(!s.mm)return `${s.name}: ${s.px.join(' × ')} px, nisbah lebar/tinggi ${s.ratio}, sRGB. Ruang selamat sekurang-kurangnya ${s.safe} px dari tepi. ${s.note}`;
 return `${s.name}: saiz akhir ${s.mm.join(' × ')} mm; sasaran ${s.dpi} PPI (sering disebut DPI). Sasaran piksel saiz akhir ${s.px.join(' × ')} px. Bleed cadangan ${s.bleed} mm setiap sisi, kanvas termasuk bleed ${s.mm.map(v=>+(v+2*s.bleed).toFixed(1)).join(' × ')} mm / ${s.bleedPx.join(' × ')} px. Ruang selamat ${s.safe} mm ke dalam dari garis potong. Nisbah saiz akhir ${s.ratio}. Jangan jana tanda potong sebagai unsur grafik. ${s.note}`;
}
export function buildPrompt(d,{preset}={}){
 const title=String(d.title||'').trim();if(!title)throw Error('Sila isi nama program.');
 if(d.mode==='repair'&&!String(d.repair||'').trim())throw Error('Nyatakan perkara yang perlu dibaiki.');
 const p=preset||recommend(d)[0];if(!p)throw Error('Pilih kategori dan preset yang sah.');
 const spec=getSpec(d.format,d);
 const custom=d.mode==='custom';
 const creative=creativeDirection(d,p);
 const date=d.date?new Intl.DateTimeFormat('ms-MY',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(d.date+'T00:00:00Z')):'';
 const content=[['Tajuk',title],['Nama sekolah',d.school],['Tarikh',date],['Masa',d.time],['Tempat',d.venue],['Teks tambahan',d.extra]].filter(x=>String(x[1]||'').trim()).map(([k,v])=>`${k}: ${JSON.stringify(String(v).trim())}`).join('\n');
 const logoSpace=d.logoSpace===true||d.logoSpace==='on';
 const logoLocation=['banner','backdrop'].includes(d.format)?'di salah satu hujung komposisi melintang, seimbang dengan tajuk':d.format==='story'||d.format==='bunting'?'di bahagian atas dalam kawasan selamat, tanpa bertindih dengan kawalan aplikasi atau kemasan fizikal':'di penjuru atau kawasan kepala reka bentuk yang seimbang dengan hierarki tajuk';
 const logoText=logoSpace?`SEDIAKAN RUANG LOGO BERSEPADU. Letakkan kawasan simpanan logo ${logoLocation}. Saiz dan perkadarannya mesti sesuai dengan format, hierarki dan keseimbangan visual. Ruang itu sebahagian daripada latar, bukan objek placeholder yang kelihatan. Sambungkan warna, gradien, tekstur atau pencahayaan latar secara semula jadi; pilih tona lebih tenang jika perlu agar logo sebenar nanti mudah dibaca. Jika gaya minimal atau latar rata dipilih, kekalkan latar rata; jangan tambah gradien secara paksa. Kurangkan corak dan perincian hanya dalam kawasan logo, sambil mengekalkan aliran reka bentuk di sekelilingnya. Jangan cipta logo, lambang generik, crest, cap, kotak putih keras, bingkai putus-putus, simbol tambah, teks "LOGO", "placeholder" atau "logo di sini". Jangan lukis corak dam ketelusan. Saya akan menampal logo sekolah asal dalam alat reka bentuk selepas imej dijana; anda tidak perlu meminta fail logo untuk menjana ruang ini. ${d.mode==='repair'?'Jika karya asal mempunyai logo rasmi, kekalkan logo itu dan jangan gantikan dengan ruang kosong kecuali pembaikan saya memintanya.':''}`:`Jangan cipta logo, cap atau lambang sekolah. Tiada ruang logo khas diminta; gunakan komposisi penuh tanpa kotak atau label placeholder. ${d.mode==='repair'?'Kekalkan logo rasmi yang sudah ada dalam karya asal kecuali saya meminta perubahan.':''}`;
 const prompt=`MASTER PROMPT STUDIO CIKGU PU · ${d.target==='gemini'?'GEMINI':'CHATGPT'}\n${d.mode==='repair'?'BAIKI REKA BENTUK YANG DILAMPIRKAN':'HASILKAN VISUAL PROGRAM SEKOLAH'}\n\n${d.target==='gemini'?'Gunakan keupayaan penjanaan/suntingan imej Gemini jika tersedia pada akaun ini. Jika alat tidak tersedia atau kuota tamat, jelaskan had dan berikan arahan susun atur yang boleh saya gunakan dalam alat reka bentuk.':'Gunakan alat penjanaan/suntingan imej ChatGPT jika tersedia dalam sembang ini. Jika tidak tersedia atau kuota tamat, jelaskan had dan berikan arahan susun atur yang boleh saya gunakan dalam alat reka bentuk.'} Jangan mendakwa telah membuat imej atau fail jika tiada fail sebenar.\n\nBUTIRAN TEPAT\n${content}\nButiran yang tidak diisi: jangan reka. Kekalkan teks Bahasa Melayu tepat; jangan terjemah atau tambah penaja, angka, hari, alamat, kod QR atau maklumat rasmi.\n\nARAH KREATIF\n${d.mode==='repair'?'Rujukan preset sahaja: '+p.name+'. Jangan guna motif, palet atau susun atur preset untuk menggantikan karya asal.':`Preset tema: ${p.name}.\nPalet asas: ${(custom&&d.palette?.trim())||p.palette}.\nInspirasi tema: ${p.motif}.\nSuasana: ${custom&&d.mood&&d.mood!=='auto'?d.mood:p.mood}. Sesuaikan tema kepada gaya pilihan di bawah. Kekalkan hierarki teks yang jelas.`}\n\n${creative.text}\n${d.textMode==='background'?'Hasilkan LATAR SAHAJA tanpa sebarang teks, huruf atau nombor. Simpan ruang kosong untuk teks program dan logo ditambah dalam alat susun atur. Butiran di atas ialah konteks, bukan teks untuk dilukis.':'Gunakan hanya teks tepat dalam butiran di atas. Pastikan ejaan, susunan dan tanda baca betul. Jika teks terlalu padat atau tidak dapat dihasilkan dengan tepat, beritahu saya dan cadangkan latar tanpa teks untuk kemasan manual.'}\n\nSPESIFIKASI SASARAN\n${specText(spec)}\n${spec.mm?'Ini sasaran cetakan, BUKAN jaminan output model. Beritahu jika saiz atau nisbah tidak disokong. Gunakan nisbah tersedia yang paling hampir tanpa memotong teks penting; nyatakan perubahan. Jangan mendakwa imej sedia cetak berdasarkan prompt atau metadata DPI sahaja. Jangan dakwa fail CMYK, ICC, PDF/X, bleed tepat atau resolusi sasaran telah disahkan. Berikan ukuran sebenar hanya jika boleh diperiksa. Kekalkan sRGB untuk pratonton; penukaran CMYK, profil ICC, PDF/X, teks vektor dan tanda potong disiapkan dalam alat susun atur mengikut spesifikasi pencetak.':'Fail digital sRGB. DPI metadata tidak menentukan ketajaman skrin. Nyatakan jika dimensi diminta tidak boleh dipenuhi; jangan dakwa ukuran tanpa pemeriksaan.'}\n${d.format==='slide'?'Sediakan satu visual pembentangan 16:9. Jangan dakwa ia dek PPTX atau teks boleh disunting. Cadangkan teks berasingan untuk ditambah dalam PowerPoint atau Google Slides.':''}\n\nLOGO DAN RUJUKAN\n${logoText}\n${d.flag?'Bendera diperlukan: gunakan hanya rujukan rasmi yang saya lampirkan. Jika tiada rujukan atau ketepatan tidak dapat dijamin, sediakan ruang untuk bendera rasmi ditampal kemudian. Jangan reka bilangan jalur, bintang, warna atau bentuk lambang.':'Jangan masukkan bendera tanpa diminta. Jika terdapat bendera dalam reka bentuk asal, semak ketepatannya dengan rujukan rasmi.'}\n${d.mode==='repair'?`\nPEMBAIKAN DIMINTA\n${d.repair}\nMinta saya lampirkan reka bentuk asal jika belum ada. Ubah hanya perkara diminta. Kekalkan kandungan lain dan identiti logo. Jika ini penyesuaian kepada format baharu, susun semula komposisi mengikut spesifikasi sasaran tanpa meregangkan atau memotong maklumat penting.\n`:''}${d.instructions?.trim()?`\nARAHAN TAMBAHAN PENGGUNA\n${d.instructions.trim()}\n`:''}\n${qa}\n\nSelepas menghasilkan visual, ulang senarai semak wajib ini dalam balasan anda. Nyatakan batasan dan langkah kemasan manual yang masih diperlukan. Minta saya menyemak hasil sebelum digunakan; jangan meluluskan cetakan secara automatik.`;
 return prompt.replace(/\n{3,}/g,'\n\n');
}
// Edge-connected colour removal only, preserving interior areas not connected to the border.
export function removeEdgeBackground(source,width,height,tolerance=28){
 const out=new Uint8ClampedArray(source);const seen=new Uint8Array(width*height);const queue=new Int32Array(width*height);let head=0,tail=0;
 const corners=[0,width-1,(height-1)*width,width*height-1];
 const colors=corners.filter(i=>source[i*4+3]>0).map(i=>[source[i*4],source[i*4+1],source[i*4+2]]);
 if(!colors.length)return out;
 function add(i){if(seen[i])return;seen[i]=1;const k=i*4;const match=source[k+3]===0||colors.some(c=>Math.max(Math.abs(source[k]-c[0]),Math.abs(source[k+1]-c[1]),Math.abs(source[k+2]-c[2]))<=tolerance);if(match){out[k+3]=0;queue[tail++]=i;}}
 for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
 while(head<tail){const i=queue[head++],x=i%width;if(x>0)add(i-1);if(x<width-1)add(i+1);if(i>=width)add(i-width);if(i<width*(height-1))add(i+width);}
 return out;
}
