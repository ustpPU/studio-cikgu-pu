# Studio Cikgu PU

Pembantu kreatif digital guru PPD Petaling Utama · USTP, PPD Petaling Utama.

Laman: https://ustppu.github.io/studio-cikgu-pu/
Repositori: https://github.com/ustpPU/studio-cikgu-pu

## Aliran

Isi program → pilih idea → sesuaikan gaya jika perlu → jana → salin ke ChatGPT/Gemini sendiri.

96 preset dalam 12 kategori kekal dalam dropdown mengikut kategori dan enjin cadangan. Galeri awam dan empat kad mod telah dibuang. Pilihan tambahan berada dalam “Sesuaikan gaya”; pembaikan karya asal melalui pautan kecil. Panduan dan spesifikasi cetakan dilipat secara lalai.

Checkbox **Sediakan ruang untuk logo** menjana arahan ruang bersepadu dengan latar, tona, gradien atau tekstur yang sesuai dengan gaya. Tiada logo palsu, kotak putih, tanda tambah, label atau corak dam. Untuk gaya minimal, latar rata dikekalkan. Pengguna menambah logo asal dalam alat reka bentuk selepas imej dijana. Studio tidak menerima fail logo atau menghantarnya ke AI.

9 gaya, 4 rawatan warna dan 3 tahap perincian, bersama pilihan automatik. Pilihan mengatasi cadangan preset. 10 format mempunyai dimensi, PPI, bleed dan ruang selamat. Semakan teks, tarikh, bendera, logo dan saiz kekal dalam setiap prompt.

## Kaunter lawatan

Badge Hits.sh berkongsi kiraan paparan laman awam sejak integrasi ini diaktifkan. Ia bukan pengguna unik, orang sedang online atau kiraan prompt dijana. Muat semula, cache, sekatan penjejak dan ketersediaan pihak ketiga boleh mempengaruhi kiraan. Jika perkhidmatan gagal, laman memaparkan “tidak tersedia”, tanpa angka rekaan.

Pengenal kaunter Hits.sh menggunakan nama laluan asal `pgbpustudio` supaya kiraan lawatan sebelum pertukaran nama diteruskan.

Badge hanya diminta pada hos `ustppu.github.io` di laluan `/studio-cikgu-pu/`. Demo setempat tidak memintanya. Tiada kandungan borang atau prompt dihantar kepada kaunter. Seperti permintaan web lain, penyedia menerima metadata rangkaian permintaan. Sumber penyedia: https://github.com/silentsoft/hits dan https://hits.sh/privacy/ .

## Jalankan dan uji

Dari folder ini:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Buka http://127.0.0.1:4173/ . `index.html` menggunakan modul JavaScript, jadi gunakan pelayan HTTP. Fail serahan berasingan `Studio-Cikgu-PU-Demo.html` mempunyai semua kod dan gaya dibenamkan untuk demo tanpa pelayan.

```sh
npm test
```

Tiada `npm install` diperlukan. Ujian merangkumi 96 preset, 960 gabungan preset-format, 400 gabungan pemilih dua AI, spesifikasi cetakan, mod pembaikan dan ruang logo bersyarat.

## Penerbitan

GitHub Pages menggunakan `main / (root)`. Semua aset relatif kepada folder projek. Tiada proses build atau API AI. Draf berada dalam pelayar sahaja. Salin/muat turun prompt dilumpuhkan apabila butiran berubah sehingga prompt dijana semula.

`data.js`: preset. `creative.js`: arahan seni. `engine.js`: prompt dan format. `app.js`: interaksi. `index.html` dan `styles.css`: paparan.

## Had

Studio menjana teks prompt, bukan imej. Akses AI, kuota dan hasil bergantung pada akaun/model. PPI dan bleed ialah sasaran, bukan jaminan output. Sahkan fail sebenar serta CMYK/ICC/PDF-X dengan pencetak. Logo/bendera dan semua teks perlu semakan manusia. Sumber rasmi pembekal ada dalam panduan laman.
