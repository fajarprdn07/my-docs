# 📖 PANDUAN LENGKAP PENGGUNAAN
### Document Repository — fajarprdn07/my-docs

Simpan panduan ini! Ini adalah "buku manual" Anda untuk mengelola website dokumen sehari-hari.

---

## 📋 DAFTAR ISI

| No | Topik | Halaman |
|----|-------|---------|
| 1 | Menambahkan File Baru | ⬇️ di bawah |
| 2 | Menghapus File | ⬇️ di bawah |
| 3 | Mengganti / Update File | ⬇️ di bawah |
| 4 | Mengecek Status Build | ⬇️ di bawah |
| 5 | Menggunakan Fitur Search | ⬇️ di bawah |
| 6 | Mengakses File untuk AI | ⬇️ di bawah |
| 7 | Troubleshooting | ⬇️ di bawah |

---

## 1. ➕ MENAMBAHKAN FILE BARU

### Cara A: Via Laptop (Rekomendasi untuk banyak file)

**Langkah-langkah:**

1. Buka **File Explorer** di laptop Anda
2. Masuk ke folder **`D:\1\my-docs\docs`**
3. **Copy-paste** file-file baru ke dalam folder tersebut
   - ✅ Format yang didukung: `.pdf`, `.md`, `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`, `.webp`
   - ❌ Format yang TIDAK didukung: `.docx`, `.xlsx`, `.pptx`, `.zip`, `.mp4`

4. Buka **Command Prompt** (tekan `Windows + R`, ketik `cmd`, Enter)

5. Ketik 4 perintah ini satu per satu:

```
cd D:\1\my-docs
```
*(Enter — masuk ke folder project)*

```
git add docs/
```
*(Enter — tandai semua file baru)*

```
git commit -m "Tambah file baru"
```
*(Enter — simpan perubahan)*

```
git push origin main
```
*(Enter — upload ke GitHub)*

6. **Selesai!** Tunggu 3-7 menit, website otomatis update.

---

### Cara B: Via Website GitHub (Tanpa laptop, bisa dari HP)

**Langkah-langkah:**

1. Buka browser (bisa di HP), masuk ke:
   👉 **`https://github.com/fajarprdn07/my-docs`**

2. Klik folder **`docs`**

3. Klik tombol **"Add file"** (di kanan atas daftar file)

4. Pilih **"Upload files"**

5. **Drag & drop** file dari komputer Anda ke area upload
   - Atau klik **"choose your files"** untuk memilih file

6. Di bagian bawah, isi pesan commit, contoh: `Tambah laporan baru`

7. Klik tombol hijau **"Commit changes"**

8. **Selesai!** Tunggu 3-7 menit.

> ⚠️ **Keterbatasan Cara B:** Maksimal 100 file per upload, dan tidak bisa upload file >25MB via browser.

---

## 2. 🗑️ MENGHAPUS FILE

### Cara A: Via Laptop (Rekomendasi)

**Langkah-langkah:**

1. Buka **File Explorer**
2. Masuk ke folder **`D:\1\my-docs\docs`**
3. **Hapus file** yang tidak diinginkan (klik kanan → Delete, atau tekan tombol `Del`)

4. Buka **Command Prompt**, ketik:

```
cd D:\1\my-docs
```
*(Enter)*

```
git add -A
```
*(Enter — `-A` artinya "deteksi semua perubahan termasuk file yang dihapus")*

```
git commit -m "Hapus file lama"
```
*(Enter)*

```
git push origin main
```
*(Enter)*

5. **Selesai!** File akan hilang dari website setelah build selesai.

---

### Cara B: Via Website GitHub

1. Buka **`https://github.com/fajarprdn07/my-docs`**
2. Klik folder **`docs`**
3. **Klik nama file** yang ingin dihapus
4. Klik ikon **titik tiga (⋯)** di pojok kanan atas file
5. Pilih **"Delete file"**
6. Klik tombol hijau **"Commit changes"**
7. **Selesai!**

---

## 3. 🔄 MENGGANTI / UPDATE FILE

Misalnya Anda punya file `laporan.pdf` yang sudah di-upload, lalu Anda revisi dan ingin menggantinya dengan versi baru.

### Caranya:

1. Buka folder **`D:\1\my-docs\docs`**
2. **Hapus** file `laporan.pdf` yang lama
3. **Copy-paste** file `laporan.pdf` yang baru (nama file harus SAMA PERSIS)
4. Buka Command Prompt, ketik:

```
cd D:\1\my-docs
```

```
git add -A
```

```
git commit -m "Update laporan.pdf"
```

```
git push origin main
```

5. **Selesai!** Website akan otomatis memproses versi baru.

> 💡 **Tips:** Jika nama file sama, Git akan otomatis mendeteksi bahwa file tersebut sudah berubah (modified). Anda tidak perlu hapus dulu, cukup **timpa (overwrite)** file lama dengan file baru, lalu jalankan `git add docs/` seperti biasa.

---

## 4. 🔍 MENGECEK STATUS BUILD

Setiap kali Anda push file, GitHub akan otomatis memproses. Berikut cara memantau:

### Langkah-langkah:

1. Buka browser: 👉 **`https://github.com/fajarprdn07/my-docs/actions`**

2. Anda akan melihat daftar proses (workflow runs):

| Ikon | Status | Arti |
|------|--------|------|
| 🟡 Berputar | In Progress | Sedang diproses, tunggu |
| ✅ Centang hijau | Success | Berhasil! Website sudah update |
| ❌ Silang merah | Failure | Ada error, perlu dicek |

3. **Klik** pada baris proses untuk melihat detailnya

4. Jika **gagal (❌)**:
   - Klik tombol **`build`** di sebelah kiri
   - Klik langkah yang ada tanda ❌
   - Lihat pesan error di bagian bawah
   - **Screenshot dan kirim ke saya**, saya akan bantu perbaiki!

---

## 5. 🔎 MENGGUNAKAN FITUR SEARCH

### Di Halaman Utama Website:

1. Buka website: 👉 **`https://fajarprdn07.github.io/my-docs/`**

2. Di bagian atas ada **kotak pencarian** (search bar)

3. **Ketik kata atau kalimat** yang ingin dicari, contoh:
   - `pendahuluan`
   - `hasil penelitian`
   - `kesimpulan dan saran`

4. Hasil pencarian akan muncul **secara langsung** saat Anda mengetik (minimal 2 huruf)

5. Setiap hasil akan menampilkan:
   - 📄 Nama file
   - 📊 Jumlah halaman
   - 📝 Cuplikan teks yang cocok (highlight kuning)

6. **Klik nama file** untuk membuka dokumen lengkap

### Di Dalam PDF Viewer:

1. Setelah membuka dokumen PDF
2. Tekan **`Ctrl + F`** di keyboard
3. Ketik kata yang dicari
4. PDF.js akan **highlight semua kata yang cocok** di dalam dokumen

---

## 6. 🤖 MENGAKSES FILE UNTUK AI

Website Anda sudah **AI-ready**. Berikut cara AI bisa membaca dokumen Anda:

### Untuk ChatGPT / Claude / LLM lainnya:

Berikan URL ini ke AI:
```
https://fajarprdn07.github.io/my-docs/llms.txt
```
AI akan membaca daftar semua dokumen Anda beserta link-nya.

### Untuk membaca isi dokumen tertentu:

Berikan URL plain text dokumen, contoh:
```
https://fajarprdn07.github.io/my-docs/text/0_A_Ibnudin_Fauzan_2025.txt
```
AI bisa membaca isi lengkap dokumen dalam format teks murni.

### Untuk crawler / bot:

File `sitemap.xml` dan `robots.txt` sudah otomatis tersedia:
```
https://fajarprdn07.github.io/my-docs/sitemap.xml
https://fajarprdn07.github.io/my-docs/robots.txt
```

---

## 7. 🛠️ TROUBLESHOOTING (Masalah Umum)

### Masalah 1: `git push` ditolak / minta password

**Solusi:**
```
git pull origin main --rebase
git push origin main
```
Jika masih minta password, gunakan **Personal Access Token** (bukan password biasa).

---

### Masalah 2: Website tidak muncul (404 Not Found)

**Cek:**
1. Buka Settings → Pages → pastikan Source = **GitHub Actions**
2. Tunggu 1-2 menit setelah build selesai
3. Pastikan alamat URL benar: `https://fajarprdn07.github.io/my-docs/` (pakai huruf kecil semua)

---

### Masalah 3: File tidak muncul di website setelah push

**Cek:**
1. Buka tab **Actions**, pastikan build **berhasil (✅)**
2. Pastikan file ada di dalam folder **`docs/`** (bukan di luar folder tersebut)
3. Pastikan format file didukung (`.pdf`, `.md`, `.png`, `.jpg`, dll)
4. Refresh browser dengan **`Ctrl + Shift + R`** (hard refresh)

---

### Masalah 4: Build gagal (❌)

**Langkah:**
1. Buka tab **Actions** → klik build yang gagal
2. Klik **`build`** → klik langkah yang merah
3. **Copy-paste pesan error-nya ke saya**
4. Saya akan perbaiki kodenya untuk Anda

---

### Masalah 5: PDF viewer gelap / kosong

**Cek:**
1. Coba klik tombol **"🌐 Buka File Asli"** di toolbar atas
2. Jika file asli bisa dibuka, berarti masalah di PDF.js viewer
3. Kirim screenshot ke saya untuk investigasi lebih lanjut

---

### Masalah 6: Search tidak menemukan kata yang seharusnya ada

**Penyebab mungkin:**
1. File PDF adalah hasil scan gambar (bukan teks) → OCR mungkin tidak 100% akurat
2. Build belum selesai → tunggu sampai centang hijau ✅
3. Cache browser → tekan **`Ctrl + Shift + R`** untuk hard refresh

---

## 📌 RINGKASAN PERINTAH GIT (Cheat Sheet)

Simpan daftar ini! Ini semua perintah yang Anda butuhkan:

| Perintah | Fungsi |
|----------|--------|
| `cd D:\1\my-docs` | Masuk ke folder project |
| `git add docs/` | Tandai file baru/berubah di folder docs |
| `git add -A` | Tandai SEMUA perubahan (termasuk file dihapus) |
| `git commit -m "pesan"` | Simpan perubahan dengan pesan |
| `git push origin main` | Upload ke GitHub |
| `git pull origin main --rebase` | Download perubahan dari GitHub |
| `git status` | Lihat file apa saja yang berubah |

---

## 🔄 WORKFLOW HARIAN (Ringkasan)

```
┌─────────────────────────────────────────────┐
│          WORKFLOW HARIAN ANDA               │
│                                             │
│  1. Taruh file di folder D:\1\my-docs\docs  │
│              ↓                              │
│  2. Buka Command Prompt                     │
│              ↓                              │
│  3. cd D:\1\my-docs                         │
│     git add docs/                           │
│     git commit -m "pesan"                   │
│     git push origin main                    │
│              ↓                              │
│  4. Tunggu 3-7 menit                        │
│              ↓                              │
│  5. Buka fajarprdn07.github.io/my-docs      │
│     → File baru sudah ada! ✅               │
└─────────────────────────────────────────────┘
```

---

## 💡 TIPS PENTING

1. **Jangan edit file di folder `scripts/` atau `.github/`** kecuali saya yang menyuruh. Folder tersebut adalah "mesin" website Anda.

2. **Folder `docs/` adalah satu-satunya folder yang perlu Anda sentuh** untuk menambah/menghapus dokumen.

3. **Nama file sebaiknya tidak terlalu panjang** dan hindari simbol aneh. Contoh bagus: `skripsi-bab1.pdf`, `laporan-keuangan-2024.pdf`.

4. **Ukuran file maksimal** yang disarankan: 50MB per file. Di atas itu bisa menyebabkan build sangat lambat.

5. **Backup:** Semua file Anda tersimpan aman di GitHub. Jika laptop rusak, Anda bisa download ulang semua file dari `https://github.com/fajarprdn07/my-docs`.

---