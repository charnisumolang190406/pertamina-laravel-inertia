# 🌐 Pertamina Laravel Inertia

---

## 👥 Tim Pengembang & Pembagian Branch

| No | Nama | Branch |
|---|---|---|
| 1 | Imanuel | `Imanuel` |
| 2 | Charni | `charni` |

> Setiap anggota bekerja pada branch masing-masing. Branch `main` digunakan sebagai branch utama yang berisi versi terbaru project.

---

## ⚙️ Setup Lokal

```bash
# 1.Install Dependency Backend
composer install

# 2. Install Dependency Frontend
npm install

# 3. Copy File Environment
Windows:
copy .env.example .env

Linux / macOS:
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate

# 5. Konfigurasi Database
Atur konfigurasi database pada file .env.

Contoh:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=

# 6. Jalankan Migrasi
php artisan migrate

# 7. Jalankan Laravel
php artisan serve

# 8. Jalankan Vite
Buka terminal baru:
npm run dev
```

--- 

## 🌿 Git Workflow — Wajib Diikuti Semua Developer

Setiap anggota bekerja pada branch masing-masing dan wajib mengambil update terbaru dari main sebelum mulai bekerja.

```bash
# 1. Cek Branch Aktif
git branch --show-current

Pastikan berada pada branch pribadi masing-masing.

JIKA BELUM GUNAKAN:
git switch charni

# 2. Ambil Update Terbaru dari GitHub
git fetch origin

# 3. Update Branch dari main
git merge origin/main

Setelah menjalankan command tersebut, branch pribadi sudah memiliki update terbaru dari main.
```

---

## 💻 Mengerjakan Fitur

Setelah branch berhasil diperbarui dari main, developer dapat mulai mengerjakan bagian masing-masing.

--- 

## ✅ Setelah Selesai Mengerjakan

```bash
# 1. Cek Perubahan
git status

# 2. Jalankan Build
npm run build

# 3. Stage Perubahan
git add .

# 4. Commit Perubahan
git commit -m "Terserah dpe isi apa"

# 5. Push ke Branch Pribadi
Genza: git push origin Imanuel
Karni: git push origin charni

```

---

## 🔄 Memasukkan Perubahan ke main

Karena workflow tim dilakukan secara bergantian, setelah pekerjaan selesai branch pribadi dapat digabungkan ke main.

```bash
# 1. Pindah ke main
git switch main

# 2. Update main
git pull origin main

# 3. Merge Branch Pribadi
Genza: git merge Imanuel
Karni: git merge charni

# 4. Push main
git push origin main

```

### SELESAI YAY:)
