# Pertamina Project Guidelines & Constraints

## Prinsip Utama: TIDAK MEMBUAT DARI NOL (Preserve Existing Work)
1. **DILARANG MEROMBAK / MEMBUAT DARI NOL**:
   - Project ini dibangun melalui diskusi intensif dan bimbingan mentor sejak **16 Juni 2026**.
   - Jangan pernah menyarankan atau mengeksekusi inisialisasi ulang project, penghapusan struktur secara masif, atau pembuatan arsitektur dari lembar kosong (scratch).
2. **Refactor & Penyesuaian Bertahap (Incremental Adjustment)**:
   - Apabila ada bagian kode atau alur yang belum sesuai dengan standarisasi Pertamina, lakukan perbaikan langsung di tempat (in-place refactor) secara bertahap pada komponen/controller terkait.
   - Pertahankan fitur, alur kerja, dan UI yang sudah berhasil dibuat dan disepakati.

## Standarisasi Teknologi Pertamina
- **Backend**: PHP 8.2 / 8.3 (Laravel Framework). Seluruh kalkulasi bisnis, pemrosesan file (Excel/CSV), dan agregasi data wajib diproses di backend PHP dengan standar enterprise.
- **Frontend**: React (Inertia.js) + Tailwind CSS. Frontend difokuskan untuk UI/UX yang ringan, cepat, responsif, dan tidak membebani browser pengguna.
- **Inertia.js Protocol**: Controller form submission harus selalu mengembalikan redirect (`redirect()->back()` dengan flash message), tidak mengembalikan raw JSON ke Inertia page.

## Kesiapan Server Produksi (Enterprise Server Deployment Standards)
1. **PHP & Framework Invariants**:
   - Kode wajib kompatibel penuh pada PHP 8.2 & PHP 8.3 tanpa dependensi eksternal liar.
   - Mengikuti konvensi PSR-12 dan struktur MVC standar Laravel.
   - Hindari fungsi-fungsi usang (*deprecated*) atau pemanggilan shell langsung yang diblokir pada server korporat Pertamina.
2. **Pemrosesan Data & Excel Server-Side**:
   - Pembuatan dan pembacaan berkas Excel dilakukan via `PhpSpreadsheet` / `Laravel-Excel` resmi yang sudah terdaftar di `composer.json`.
   - Wajib menangani format tanggal lokal Indonesia (`DD/MM/YYYY`), serial date Excel, dan ISO `YYYY-MM-DD` secara defensif.
3. **Asset Build & Production Integrity**:
   - Setiap perubahan antarmuka harus divalidasi kebersihannya dengan `npm run build` sebelum diserahkan.
   - Menjamin tidak ada broken link, missing asset, atau unresolved dependency saat dideploy ke server internal Pertamina.

