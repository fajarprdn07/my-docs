# 📖 DOKUMENTASI LENGKAP
## Document Repository — GitHub Pages

### Panduan Penggunaan dari Nol Sampai Mahir

---

## 📋 DAFTAR ISI

| Bab | Topik |
|-----|-------|
| 1 | Persiapan Awal (Install Software) |
| 2 | Download Project dari GitHub |
| 3 | Struktur Folder Project |
| 4 | Menambah File Baru |
| 5 | Menambah Folder Baru |
| 6 | Menghapus File |
| 7 | Menghapus Folder |
| 8 | Mengganti / Update File |
| 9 | Memindahkan File ke Folder Lain |
| 10 | Memantau Proses Build |
| 11 | Menggunakan Fitur Search |
| 12 | Mengakses Website |
| 13 | Fitur AI Access |
| 14 | Cheat Sheet (Ringkasan Perintah) |
| 15 | Troubleshooting |

---

## BAB 1: PERSIAPAN AWAL

### 1.1 Software yang Dibutuhkan

| Software | Fungsi | Link Download |
|----------|--------|---------------|
| **Git** | Upload file ke GitHub | `git-scm.com` |
| **VS Code** | Edit kode (opsional) | `code.visualstudio.com` |
| **Browser** | Akses GitHub & website | Chrome / Edge / Firefox |

### 1.2 Akun yang Dibutuhkan

| Akun | Cara Daftar |
|------|-------------|
| **GitHub** | Buka `github.com` → klik "Sign up" → isi email, password, username |

### 1.3 Install Git di Windows

1. Buka browser → ketik `git-scm.com`
2. Klik **"Download for Windows"**
3. Klik 2x file `.exe` yang terdownload
4. Klik **Next → Next → Next → Install → Finish** (jangan ubah apapun)

### 1.4 Cek Apakah Git Sudah Terinstall

Buka **Command Prompt** (tekan `Windows + R`, ketik `cmd`, Enter), lalu ketik:

```
git --version
```

Jika muncul `git version 2.xx.x` → ✅ berhasil

---

## BAB 2: DOWNLOAD PROJECT DARI GITHUB

### 2.1 Jika Anda Belum Punya Project (Pertama Kali)

#### Langkah 1: Buka Command Prompt

```
Windows + R → ketik cmd → Enter
```

#### Langkah 2: Pilih lokasi penyimpanan

```
cd D:\1
```

> 💡 Ganti `D:\1` dengan lokasi folder yang Anda inginkan. Contoh: `cd Desktop` atau `cd Documents`

#### Langkah 3: Clone (download) dari GitHub

```
git clone https://github.com/fajarprdn07/my-docs.git
```

Tunggu sampai selesai. Akan muncul folder baru `my-docs`.

#### Langkah 4: Masuk ke folder project

```
cd my-docs
```

✅ Sekarang Anda sudah siap bekerja!

---

### 2.2 Jika Anda Sudah Punya Project (Sinkronisasi)

Jika Anda sudah pernah clone sebelumnya dan ingin **menyamakan isi laptop dengan GitHub**:

```
cd D:\1\my-docs
git pull origin main
```

> 💡 **Kapan pakai ini?** Setiap kali Anda edit file via website GitHub, atau menggunakan laptop lain.

---

### 2.3 Jika Anda Pindah Laptop / Install Ulang

Sama seperti langkah **2.1** — cukup clone ulang. Semua file Anda tersimpan aman di GitHub.

---

## BAB 3: STRUKTUR FOLDER PROJECT

```
D:\1\my-docs\
│
├── .github\workflows\    ← JANGAN DISENTUH (mesin otomatis)
├── scripts\              ← JANGAN DISENTUH (program pemroses)
├── docs\                 ← ✅ FOLDER KERJA ANDA
│   ├── file1.pdf
│   ├── file2.md
│   ├── gambar.png
│   ├── BSI\              ← subfolder
│   │   ├── BSI_2023.pdf
│   │   └── BSI_2024.pdf
│   └── Muamalat\         ← subfolder
│       ├── Muamalat_2023.pdf
│       └── Muamalat_2024.pdf
│
├── .gitignore            ← JANGAN DISENTUH
├── package.json          ← JANGAN DISENTUH
└── README.md
```

### ⚠️ ATURAN PENTING

| ✅ BOLEH | ❌ JANGAN |
|----------|----------|
| Tambah/hapus/edit file di folder `docs/` | Mengedit file di `scripts/` atau `.github/` |
| Buat subfolder di dalam `docs/` | Menghapus folder `scripts/` atau `.github/` |
| Upload PDF, MD, PNG, JPG | Upload DOCX, XLSX, ZIP, MP4 (tidak diproses) |
| Nama file dengan huruf, angka, strip, underscore | Nama file dengan simbol `? * : " < > \|` |

### Format File yang Didukung

| Format | Proses | Contoh |
|--------|--------|--------|
| `.pdf` (text-based) | Ekstrak teks otomatis | Laporan digital, jurnal |
| `.pdf` (scan/gambar) | OCR otomatis | Dokumen hasil scan |
| `.md` | Render ke HTML | Catatan markdown |
| `.png` `.jpg` `.jpeg` | OCR otomatis | Foto dokumen, screenshot |
| `.tiff` `.bmp` `.webp` | OCR otomatis | Gambar lainnya |

---

## BAB 4: MENAMBAH FILE BARU

### Cara A: Via Laptop + Command Prompt (Rekomendasi)

#### Langkah 1: Copy file ke folder `docs`

Buka **File Explorer**, masuk ke `D:\1\my-docs\docs\`, lalu **copy-paste** file yang ingin ditambah.

Contoh setelah copy:
```
docs\
├── laporan-baru.pdf     ← file baru
├── catatan.md           ← file baru
└── (file lama lainnya)
```

#### Langkah 2: Buka Command Prompt

```
cd D:\1\my-docs
```

#### Langkah 3: Jalankan 3 perintah ini

```
git add docs/
```
```
git commit -m "Tambah laporan-baru.pdf dan catatan.md"
```
```
git push origin main
```

#### Langkah 4: Selesai!
Tunggu **3-7 menit**, website otomatis update.

---

### Cara B: Via Website GitHub (Bisa dari HP)

1. Buka `https://github.com/fajarprdn07/my-docs`
2. Klik folder **`docs`**
3. Klik **"Add file"** → **"Upload files"**
4. Drag & drop file dari komputer/HP
5. Tulis pesan di kolom commit, contoh: `Tambah file baru`
6. Klik **"Commit changes"**
7. Tunggu 3-7 menit

> ⚠️ Setelah upload via website GitHub, jalankan `git pull origin main` di laptop agar tersinkron.

---

### Menambah Banyak File Sekaligus

Caranya sama persis! Copy-paste semua file ke `docs/`, lalu:

```
cd D:\1\my-docs
git add docs/
git commit -m "Tambah 10 file baru"
git push origin main
```

> 💡 Git otomatis mendeteksi semua file baru, tidak perlu satu per satu.

---

## BAB 5: MENAMBAH FOLDER BARU

### Langkah 1: Buat folder baru di dalam `docs`

Buka **File Explorer** → masuk ke `D:\1\my-docs\docs\`

Klik kanan → **New** → **Folder** → beri nama (contoh: `Laporan_BSI`)

### Langkah 2: Taruh file di dalam folder baru

Copy-paste file PDF ke dalam folder baru tersebut.

Struktur:
```
docs\
├── Laporan_BSI\           ← folder baru
│   ├── BSI_2023.pdf       ← file di dalam folder
│   └── BSI_2024.pdf
└── (file lama lainnya)
```

### Langkah 3: Upload ke GitHub

```
cd D:\1\my-docs
git add docs/
git commit -m "Buat folder Laporan_BSI"
git push origin main
```

### Langkah 4: Hasil di Website

Di website akan muncul:
```
📁 Home

📁 Laporan_BSI     ← klik untuk masuk
   2 file

📄 file-lama.pdf
```

Klik folder → masuk ke halaman baru:
```
📁 Home › 📂 Laporan_BSI

📄 BSI_2023.pdf
📄 BSI_2024.pdf
```

---

### Membuat Subfolder di Dalam Subfolder

Anda bisa membuat folder berlapis tanpa batas:

```
docs\
└── Bank\
    ├── BSI\
    │   ├── 2023\
    │   │   └── laporan.pdf
    │   └── 2024\
    │       └── laporan.pdf
    └── Muamalat\
        └── laporan.pdf
```

Website akan menampilkan navigasi breadcrumb:
```
📁 Home › 📂 Bank › 📂 BSI › 📂 2023
```

---

## BAB 6: MENGHAPUS FILE

### Cara A: Via Laptop (Rekomendasi)

#### Langkah 1: Hapus file dari folder `docs`

Buka File Explorer → `D:\1\my-docs\docs\` → klik kanan file → **Delete**

#### Langkah 2: Upload perubahan

```
cd D:\1\my-docs
git add -A
git commit -m "Hapus file lama"
git push origin main
```

> ⚠️ **PENTING:** Gunakan `git add -A` (bukan `git add docs/`) agar Git mendeteksi file yang dihapus.

---

### Cara B: Via Website GitHub

1. Buka `https://github.com/fajarprdn07/my-docs`
2. Klik folder **`docs`**
3. **Klik nama file** yang ingin dihapus
4. Klik ikon **titik tiga (⋯)** di pojok kanan atas
5. Pilih **"Delete file"**
6. Klik **"Commit changes"**

> ⚠️ Setelah hapus via web, jalankan `git pull origin main` di laptop.

---

### Menghapus Banyak File Sekaligus

Hapus semua file yang tidak diinginkan dari File Explorer, lalu:

```
cd D:\1\my-docs
git add -A
git commit -m "Hapus 5 file tidak terpakai"
git push origin main
```

---

## BAB 7: MENGHAPUS FOLDER

### Langkah 1: Hapus folder dari File Explorer

Buka `D:\1\my-docs\docs\` → klik kanan folder → **Delete**

### Langkah 2: Upload perubahan

```
cd D:\1\my-docs
git add -A
git commit -m "Hapus folder Laporan_BSI"
git push origin main
```

> 💡 Menghapus folder otomatis menghapus semua file di dalamnya juga.

---

## BAB 8: MENGGANTI / UPDATE FILE

Misalnya Anda sudah punya `laporan.pdf` dan ingin menggantinya dengan versi baru.

### Cara 1: Timpa Langsung (Nama File Sama)

1. Copy file baru `laporan.pdf` ke `D:\1\my-docs\docs\`
2. Windows akan tanya: **"Replace the file?"** → klik **Replace**
3. Upload:

```
cd D:\1\my-docs
git add docs/
git commit -m "Update laporan.pdf versi terbaru"
git push origin main
```

### Cara 2: Hapus Lama, Tambah Baru (Nama File Berbeda)

1. Hapus file lama dari folder `docs`
2. Copy file baru ke folder `docs`
3. Upload:

```
cd D:\1\my-docs
git add -A
git commit -m "Ganti laporan lama dengan versi baru"
git push origin main
```

---

## BAB 9: MEMINDAHKAN FILE KE FOLDER LAIN

Contoh: pindahkan `BSI_2023.pdf` dari `docs/` ke `docs/BSI/`

### Langkah 1: Buat folder tujuan (jika belum ada)

Di File Explorer, buat folder `BSI` di dalam `docs`

### Langkah 2: Pindahkan file

Drag file `BSI_2023.pdf` ke dalam folder `BSI/` (atau Cut → Paste)

### Langkah 3: Upload

```
cd D:\1\my-docs
git add -A
git commit -m "Pindahkan BSI_2023 ke folder BSI"
git push origin main
```

> 💡 `git add -A` mendeteksi bahwa file "dihapus" dari lokasi lama dan "ditambah" di lokasi baru. Git cukup pintar untuk tahu ini adalah pemindahan.

---

## BAB 10: MEMANTAU PROSES BUILD

Setiap kali Anda push, GitHub **otomatis** memproses file Anda.

### Cara Memantau:

1. Buka browser → `https://github.com/fajarprdn07/my-docs/actions`
2. Lihat baris paling atas (proses terbaru)

### Arti Status:

| Ikon | Arti | Yang Harus Dilakukan |
|------|------|---------------------|
| 🟡 Kuning berputar | Sedang diproses | Tunggu saja |
| ✅ Centang hijau | Berhasil | Website sudah update! |
| ❌ Silang merah | Gagal / Error | Klik untuk lihat detail error |

### Jika Gagal (❌):

1. Klik baris yang gagal
2. Klik **`build`** di sisi kiri
3. Klik langkah yang ada tanda ❌
4. Baca pesan error di bagian bawah
5. Screenshot dan kirim ke saya untuk bantuan

### Berapa Lama Build Berjalan?

| Kondisi | Estimasi Waktu |
|---------|---------------|
| 1-5 file PDF (text-based) | 2-3 menit |
| 10-30 file PDF (text-based) | 3-5 menit |
| File PDF scan (perlu OCR) | 5-15 menit |
| Gambar perlu OCR | 3-10 menit |

---

## BAB 11: MENGGUNAKAN FITUR SEARCH

### 11.1 Search di Halaman Utama (Global Search)

1. Buka website: `https://fajarprdn07.github.io/my-docs/`
2. Ketik kata/kalimat di **kotak pencarian**
3. Minimal ketik **2 huruf**
4. Hasil muncul **langsung saat mengetik**:
   - Nama file yang cocok
   - Cuplikan teks yang mengandung kata tersebut
   - Lokasi folder file tersebut
5. Klik hasil untuk membuka dokumen

### 11.2 Search di Dalam PDF

1. Buka dokumen PDF di viewer
2. Tekan **`Ctrl + F`** di keyboard
3. Muncul kotak pencarian di toolbar atas viewer
4. Ketik kata yang dicari
5. Kata yang cocok akan di-**highlight kuning** di seluruh dokumen
6. Gunakan tombol panah atas/bawah untuk lompat ke hasil berikutnya

### 11.3 Tips Search yang Efektif

| Tips | Contoh |
|------|--------|
| Cari kata kunci utama | `laba bersih` |
| Cari tahun spesifik | `2024` |
| Cari nama perusahaan | `Bank Syariah Indonesia` |
| Cari bab/bagian | `kesimpulan` |
| Cari angka spesifik | `1.500.000` |

---

## BAB 12: MENGAKSES WEBSITE

### URL Utama

| Halaman | URL |
|---------|-----|
| **Beranda** | `https://fajarprdn07.github.io/my-docs/` |
| **Viewer dokumen** | `https://fajarprdn07.github.io/my-docs/view/nama_file.html` |
| **Plain text** | `https://fajarprdn07.github.io/my-docs/text/nama_file.txt` |
| **Daftar AI** | `https://fajarprdn07.github.io/my-docs/llms.txt` |
| **Sitemap** | `https://fajarprdn07.github.io/my-docs/sitemap.xml` |

### Navigasi Website

```
📚 Document Repository (Beranda)
│
├── 📁 Folder A          ← Klik untuk masuk
│   ├── 📄 file1.pdf     ← Klik untuk buka viewer
│   └── 📄 file2.pdf
│
├── 📁 Folder B
│   └── 📄 file3.pdf
│
└── 📄 file4.pdf          ← File di root/tanpa folder

Breadcrumb: 📁 Home › 📂 Folder A   ← Klik bagian manapun untuk navigasi
```

### Toolbar Viewer PDF

| Tombol | Fungsi |
|--------|--------|
| ⬇ Download | Download file PDF asli |
| 🌐 File Asli | Buka PDF di tab baru (viewer bawaan browser) |
| 📃 Text (AI) | Buka versi teks murni (untuk AI atau copy-paste) |
| ← Kembali | Kembali ke halaman daftar dokumen |
| 🔍 (di PDF viewer) | Cari kata di dalam dokumen PDF |

---

## BAB 13: FITUR AI ACCESS

Website Anda sudah otomatis menyediakan data untuk AI.

### 13.1 Cara Memberikan Akses ke AI (ChatGPT/Claude/dll)

Copy-paste URL ini ke AI:

```
Baca dokumen saya di: https://fajarprdn07.github.io/my-docs/llms.txt
```

AI akan membaca daftar lengkap semua dokumen beserta link plain text-nya.

### 13.2 Cara AI Membaca Isi Dokumen Spesifik

Berikan URL plain text:
```
Baca isi dokumen ini: https://fajarprdn07.github.io/my-docs/text/BSI_2023.txt
```

### 13.3 File yang Disediakan untuk AI

| File | Fungsi |
|------|--------|
| `llms.txt` | Daftar semua dokumen + link |
| `text/*.txt` | Isi lengkap setiap dokumen dalam format teks |
| `sitemap.xml` | Peta semua halaman untuk crawler |
| `robots.txt` | Izin akses untuk bot/crawler |

---

## BAB 14: CHEAT SHEET (Ringkasan Perintah)

### Perintah yang Paling Sering Dipakai

```
┌──────────────────────────────────────────────────────────────┐
│                    PERINTAH HARIAN                           │
│                                                              │
│  cd D:\1\my-docs              ← Masuk ke folder project     │
│  git add docs/                ← Tandai file baru/berubah    │
│  git add -A                   ← Tandai SEMUA (+ hapus)      │
│  git commit -m "pesan"        ← Simpan perubahan            │
│  git push origin main         ← Upload ke GitHub            │
│  git pull origin main         ← Download dari GitHub        │
│  git status                   ← Cek perubahan apa saja      │
└──────────────────────────────────────────────────────────────┘
```

### Tabel Cepat: Mau Ngapain → Ketik Apa

| Mau Ngapain | Perintah |
|-------------|----------|
| **Tambah file baru** | `git add docs/` → `git commit -m "Tambah file"` → `git push origin main` |
| **Hapus file** | Hapus di Explorer → `git add -A` → `git commit -m "Hapus file"` → `git push origin main` |
| **Update file** | Timpa di Explorer → `git add docs/` → `git commit -m "Update"` → `git push origin main` |
| **Tambah folder baru** | Buat folder + isi file → `git add docs/` → `git commit -m "Folder baru"` → `git push origin main` |
| **Hapus folder** | Hapus di Explorer → `git add -A` → `git commit -m "Hapus folder"` → `git push origin main` |
| **Pindah file** | Pindah di Explorer → `git add -A` → `git commit -m "Pindah"` → `git push origin main` |
| **Sinkron dari GitHub** | `git pull origin main` |
| **Cek ada perubahan apa** | `git status` |
| **Push ditolak** | `git pull origin main --rebase` → `git push origin main` |

---

## BAB 15: TROUBLESHOOTING

### Masalah 1: `git push` Ditolak (Rejected)

**Pesan error:**
```
! [rejected] main -> main (fetch first)
```

**Solusi:**
```
git pull origin main --rebase
git push origin main
```

---

### Masalah 2: Diminta Password Terus

**Solusi:**
1. Buka `github.com` → klik foto profil → **Settings**
2. Scroll bawah → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Centang ✅ `repo`
5. Klik **Generate token**
6. **Copy token** yang muncul (simpan di tempat aman!)
7. Gunakan token ini sebagai password saat git push

---

### Masalah 3: Website 404 Not Found

**Cek:**
1. Settings → Pages → Source harus **GitHub Actions**
2. Tunggu 1-2 menit setelah build selesai
3. URL harus huruf kecil: `https://fajarprdn07.github.io/my-docs/`

---

### Masalah 4: File Tidak Muncul di Website

**Cek:**
1. Tab **Actions** → build harus centang hijau ✅
2. File harus ada di dalam folder **`docs/`**
3. Format file harus `.pdf`, `.md`, `.png`, `.jpg`, dll
4. Refresh browser: **`Ctrl + Shift + R`**

---

### Masalah 5: Build Gagal (❌)

**Langkah:**
1. Buka `https://github.com/fajarprdn07/my-docs/actions`
2. Klik build yang gagal → klik **`build`** → klik langkah yang merah
3. Copy-paste pesan error
4. Kirim ke asisten / cari solusi berdasarkan pesan error

---

### Masalah 6: PDF Viewer Gelap / Kosong

**Solusi:**
1. Klik tombol **"🌐 File Asli"** di toolbar
2. Jika file asli bisa dibuka → masalah di PDF.js viewer
3. Coba refresh: `Ctrl + Shift + R`

---

### Masalah 7: Search Tidak Menemukan Kata

**Penyebab:**
1. PDF hasil scan → OCR tidak 100% akurat
2. Build belum selesai → tunggu centang hijau ✅
3. Cache browser → `Ctrl + Shift + R`
4. Kata terlalu pendek → minimal 2 huruf

---

### Masalah 8: `git add` Tidak Mendeteksi Folder Kosong

**Penjelasan:** Git tidak bisa melacak folder kosong. Folder baru harus berisi minimal 1 file.

**Solusi:** Selalu taruh file dulu di dalam folder baru sebelum push.

---

## 📌 TIPS PENTING

> 1. **Satu-satunya folder yang perlu Anda sentuh adalah `docs/`**. Jangan edit file lain.
>
> 2. **Selalu `git pull` dulu** jika Anda edit file dari website GitHub, sebelum push dari laptop.
>
> 3. **Ukuran file maksimal** yang disarankan: 50MB per file.
>
> 4. **Total ukuran repo** jangan lebih dari 1GB (100 file PDF rata-rata = 200-500MB, masih aman).
>
> 5. **Backup otomatis**: Semua file tersimpan di GitHub. Jika laptop rusak/hilang, cukup clone ulang.
>
> 6. **Pesan commit** sebaiknya deskriptif agar mudah dilacak nanti:
>    - ✅ `"Tambah laporan BSI 2024"`
>    - ✅ `"Hapus file duplikat Aladin"`
>    - ❌ `"update"` (terlalu umum)
>    - ❌ `"asdf"` (tidak bermakna)

---

*Dokumentasi ini berlaku untuk repository: `https://github.com/fajarprdn07/my-docs`*
*Website: `https://fajarprdn07.github.io/my-docs/`*
*Terakhir diperbarui: 2025*
