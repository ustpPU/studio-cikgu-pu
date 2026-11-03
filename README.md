# PGBPU Studio

Pembantu kreatif digital pemimpin sekolah · USTP, PPD Petaling Utama.

Laman statik Bahasa Melayu tanpa akaun, kunci API, pemasangan pakej atau pangkalan data. Ia menjana **teks prompt**, bukan imej. Pengguna menampal prompt ke ChatGPT/Gemini milik sendiri.

## Ciri

Sentuhan visual: 9 gaya (abstrak, editorial, geometri, 3D, ilustrasi, kertas, sinematik, eksklusif, minimal) serta automatik; 4 rawatan warna serta automatik; 3 tahap perincian serta automatik. Pilihan diterjemahkan kepada arahan bentuk, komposisi, warna, bahan, pencahayaan, kemasan dan perkara yang dielakkan. Arahan pengguna mengatasi cadangan preset. Minimal + kaya perincian diselaraskan tanpa menambah hiasan berlebihan. Mod pembaikan automatik mengekalkan rupa asal.


- 96 preset terpilih, 8 bagi setiap 12 kategori, dengan palet, motif dan susun atur tersendiri.
- Buat Segera: cadangan berdasarkan kategori, kata program dan format. Ikut Citarasa: preset, suasana, warna dan susun atur. Baiki Reka Bentuk: arahan pembaikan khusus.
- Carian, penapis kategori, inspirasi rawak, contoh demo rekaan, simpan/buka/padam draf pada pelayar.
- 10 format: WhatsApp, Story, slaid 16:9, A4, A3, banner, bunting, backdrop, sijil dan saiz cetakan sendiri.
- Pengiraan dimensi piksel saiz akhir dan termasuk bleed, ruang selamat, sasaran PPI, sRGB/CMYK/ICC/PDF-X dan panduan kemasan.
- Prompt khusus ChatGPT/Gemini, salin dengan pilihan manual jika clipboard tidak tersedia, muat turun .txt dan pautan AI.
- Muat logo PNG/JPEG/WebP, pratonton, pembuangan latar warna seragam yang bersambung ke tepi, PNG alfa sebenar. Maksimum 8 MB / 16 megapiksel. Fail diproses setempat; tiada API atau penghantaran ke pelayan.
- Logo **tidak dibawa oleh teks prompt**. Pengguna perlu melampirkan fail di AI. Pembuangan latar boleh merosakkan lambang; semak hasil dan gunakan asal jika perlu.
- Senarai semak wajib untuk teks, tarikh, bendera dan logo dalam UI dan setiap prompt; arahan supaya AI mengulang senarai semak dalam balasannya.
- Tiada analitik, fon luaran, CDN atau panggilan AI. Draf hanya di pelayar dan tidak menyimpan logo.

## Jalankan setempat

Dengan Python 3, dari folder ini:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Buka http://127.0.0.1:4173/ . Jangan buka `index.html` terus dengan `file://` kerana ia menggunakan modul JavaScript. **Alternatif tanpa pelayan:** fail berasingan `PGBPU-Studio-Demo.html` dalam pakej serahan boleh dibuka terus; semua gaya dan skrip telah dibenamkan. Draf/clipboard bergantung pada kebenaran pelayar; muat turun .txt atau salin manual jika disekat.

## GitHub Pages: sasaran ustpPU/pgbpustudio

Repositori sasaran: https://github.com/ustpPU/pgbpustudio . Laman diterbitkan melalui GitHub Pages daripada `main / (root)` selepas konfigurasi pemilik disahkan. Rujuk status deployment GitHub dan laporan serahan untuk pengesahan URL.

Selepas log masuk sebagai `ustpPU` atau akaun dengan hak pemilik yang sesuai:

1. Cipta repositori **public** `pgbpustudio` di bawah `ustpPU`. Tiada fail peribadi diperlukan dalam repositori.
2. Muat naik **kandungan folder ini** ke akar branch `main`; `index.html` mesti berada pada akar, bukan `pgbpu-studio/index.html` dalam repositori. Sertakan `.nojekyll` jika menggunakan Git. Fail itu pilihan untuk laman ini; tiada laluan runtime bermula garis bawah.
3. Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/(root)** → Save. Memerlukan hak admin/maintainer.
4. Tunggu laporan deployment berjaya pada GitHub, kemudian lawati **https://ustppu.github.io/pgbpustudio/**. URL ini sasaran sahaja sehingga respons dan aset disahkan.
5. Uji “Cuba contoh demo” → “Jana master prompt” → “Salin prompt” di telefon sebelum berkongsi dengan peserta. Semak fail `data.js`, `engine.js`, `app.js` dan `styles.css` tidak 404.

Laman tidak memerlukan proses build. Semua aset menggunakan laluan relatif dan boleh dihos pada subfolder GitHub Pages.

Panduan rasmi: [publishing source GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Ujian

Dengan Node.js moden:

```sh
npm test
```

Tiada `npm install` diperlukan. Semakan enjin meliputi 960 kombinasi preset-format, ketepatan piksel/bleed, pengesahan ukuran, padanan kategori/program, mod AI/logo/pembaikan, dan pemeliharaan ruang putih tertutup dalam logo.

Semakan pelayar dilakukan pada lebar desktop dan 390 px. Lihat laporan serahan untuk skop dan had sebenar.

## Penyelenggaraan

`data.js`: kategori dan preset. `engine.js`: format, spesifikasi dan master prompt. `creative.js`: kontrak citarasa dan arahan seni. `app.js`: interaksi dan fail logo. `styles.css`: paparan. `index.html`: UI dan sumber rasmi. Tiada backend. Menambah model baharu tidak memerlukan API; semak sumber rasmi sebelum mengubah dakwaan keupayaan.

## Batasan model & cetakan

Dokumentasi rasmi disemak pada 3 November 2026. Aplikasi sembang dan API mempunyai kawalan/akses yang berbeza. Tiada ujian penjanaan imej sebenar dalam akaun pengguna dilakukan. Jangan menjanjikan CMYK, PDF/X, logo tepat, fail PPTX, ketelusan atau piksel cetakan penuh daripada prompt sahaja.

Panduan cetakan ialah sasaran aliran kerja yang mesti disahkan dengan pencetak, bukan spesifikasi pembekal AI. Mengubah metadata DPI tidak menambah butiran; fail AI mungkin perlu kemasan dalam alat reka bentuk. Alat latar logo ialah algoritma warna bersambung dari tepi, bukan model segmentasi pintar.

Sumber: [OpenAI Learn](https://learn.chatgpt.com/docs/image-generation), [OpenAI image API](https://developers.openai.com/api/docs/guides/image-generation), [Gemini Apps](https://support.google.com/gemini/answer/14286560?hl=en), [Gemini image API](https://ai.google.dev/gemini-api/docs/image-generation).
