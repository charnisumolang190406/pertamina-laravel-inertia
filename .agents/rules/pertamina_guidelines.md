# Pertamina Project Guidelines & Constraints

## Prinsip Utama: TIDAK MEMBUAT DARI NOL (Preserve Existing Work)
1. **DILARANG MEROMBAK / MEMBUAT DARI NOL**:
   - Project ini dibangun melalui diskusi intensif dan bimbingan mentor sejak **16 Juni 2026**.
   - Jangan pernah menyarankan atau mengeksekusi inisialisasi ulang project, penghapusan struktur secara masif, atau pembuatan arsitektur dari lembar kosong (scratch).
2. **Refactor & Penyesuaian Bertahap (Incremental Adjustment)**:
   - Apabila ada bagian kode atau alur yang belum sesuai dengan standarisasi Pertamina, lakukan perbaikan langsung di tempat (in-place refactor) secara bertahap pada komponen/controller terkait.
   - Pertahankan fitur, alur kerja, dan UI yang sudah berhasil dibuat dan disepakati.

## Standarisasi Teknologi Pertamina
- **Backend**: PHP 8.3.x (Laravel). Seluruh kalkulasi bisnis, pemrosesan file (Excel/CSV), dan agregasi data wajib diproses di backend PHP.
- **Frontend**: React (Inertia.js) + Tailwind CSS. Frontend difokuskan untuk UI/UX yang ringan, cepat, responsif, dan tidak membebani browser pengguna.
- **Inertia.js Protocol**: Controller form submission harus selalu mengembalikan redirect (`redirect()->back()` dengan flash message), tidak mengembalikan raw JSON ke Inertia page.
