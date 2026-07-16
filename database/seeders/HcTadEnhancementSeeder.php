<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HcTadEnhancementSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('employees')->count() === 0) {
            DB::table('employees')->insert([
                ['employee_id' => 'PGE-001', 'name' => 'Pegawai 01', 'gender' => 'Laki-laki', 'age' => 32, 'position' => 'Engineer MTC', 'department' => 'Maintenance', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-002', 'name' => 'Pegawai 02', 'gender' => 'Perempuan', 'age' => 28, 'position' => 'Finance Analyst', 'department' => 'Business Support', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-003', 'name' => 'Pegawai 03', 'gender' => 'Laki-laki', 'age' => 55, 'position' => 'Manager Area', 'department' => 'Management', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-004', 'name' => 'Pegawai 04', 'gender' => 'Perempuan', 'age' => 48, 'position' => 'Staff HR', 'department' => 'Human Capital', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-005', 'name' => 'Pegawai 05', 'gender' => 'Laki-laki', 'age' => 54, 'position' => 'Supervisor MTC', 'department' => 'Maintenance', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-006', 'name' => 'Pegawai 06', 'gender' => 'Perempuan', 'age' => 35, 'position' => 'Operator Control Room', 'department' => 'Operations', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-007', 'name' => 'Pegawai 07', 'gender' => 'Laki-laki', 'age' => 41, 'position' => 'Buyer SCM', 'department' => 'SCM', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-008', 'name' => 'Pegawai 08', 'gender' => 'Perempuan', 'age' => 38, 'position' => 'Staff Procurement', 'department' => 'SCM', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-009', 'name' => 'Pegawai 09', 'gender' => 'Laki-laki', 'age' => 52, 'position' => 'Operator Sumur', 'department' => 'Operations', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-010', 'name' => 'Pegawai 10', 'gender' => 'Perempuan', 'age' => 51, 'position' => 'Senior Staff Finance', 'department' => 'Business Support', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-011', 'name' => 'Pegawai 11', 'gender' => 'Laki-laki', 'age' => 50, 'position' => 'Engineer Well Service', 'department' => 'Operations', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-012', 'name' => 'Pegawai 12', 'gender' => 'Perempuan', 'age' => 49, 'position' => 'Senior Staff SCM', 'department' => 'SCM', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-013', 'name' => 'Pegawai 13', 'gender' => 'Laki-laki', 'age' => 53, 'position' => 'Supervisor Operasi', 'department' => 'Operations', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-014', 'name' => 'Pegawai 14', 'gender' => 'Perempuan', 'age' => 33, 'position' => 'Staff IT', 'department' => 'ICT', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-015', 'name' => 'Pegawai 15', 'gender' => 'Laki-laki', 'age' => 36, 'position' => 'Engineer Production', 'department' => 'Operations', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-016', 'name' => 'Pegawai 16', 'gender' => 'Perempuan', 'age' => 29, 'position' => 'Admin BS', 'department' => 'Business Support', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-017', 'name' => 'Pegawai 17', 'gender' => 'Laki-laki', 'age' => 44, 'position' => 'Supervisor Logistik', 'department' => 'Logistics', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-018', 'name' => 'Pegawai 18', 'gender' => 'Perempuan', 'age' => 31, 'position' => 'Staff Planning', 'department' => 'Planning', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-019', 'name' => 'Pegawai 19', 'gender' => 'Laki-laki', 'age' => 39, 'position' => 'Technician MTC', 'department' => 'Maintenance', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
                ['employee_id' => 'PGE-020', 'name' => 'Pegawai 20', 'gender' => 'Perempuan', 'age' => 42, 'position' => 'Staff HSE', 'department' => 'HSE', 'status' => 'Aktif', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        DB::table('hc_retired')->whereNull('umur_pensiun')->update(['umur_pensiun' => 56]);

        $currentYear = (int) date('Y');
        $existingRetiredYears = DB::table('hc_retired')->pluck('tahun')->toArray();

        $futureRetired = [
            ['id' => 101, 'nama' => 'Pegawai 10', 'jabatan' => 'Senior Staff Finance & Accounting', 'umur_pensiun' => 55, 'tahun' => 2027, 'tanggal' => '2027-03-01', 'keterangan' => 'Pensiun Normal'],
            ['id' => 102, 'nama' => 'Pegawai 04', 'jabatan' => 'Staff HR & General Affairs', 'umur_pensiun' => 55, 'tahun' => 2029, 'tanggal' => '2029-02-01', 'keterangan' => 'Pensiun Normal'],
            ['id' => 103, 'nama' => 'Pegawai 11', 'jabatan' => 'Engineer Well Service', 'umur_pensiun' => 56, 'tahun' => 2029, 'tanggal' => '2029-09-30', 'keterangan' => 'Pensiun Normal'],
        ];

        foreach ($futureRetired as $row) {
            if ($row['tahun'] >= $currentYear && $row['tahun'] <= $currentYear + 3 && ! in_array($row['tahun'], $existingRetiredYears)) {
                DB::table('hc_retired')->insert(array_merge($row, ['created_at' => now(), 'updated_at' => now()]));
            }
        }

        DB::table('hc_retired')->where('tahun', '<', $currentYear)->delete();
        DB::table('hc_retired')->where('tahun', '>', $currentYear + 3)->delete();

        if (DB::table('tad_mutations')->count() === 0) {
            DB::table('tad_mutations')->insert([
                ['id' => 1, 'bulan' => 'Mei 2026', 'nama' => 'TAD 01', 'jenis' => 'Masuk', 'peran' => 'Driver Operasional', 'vendor' => 'PT Kawanua Multi Mandiri', 'keterangan' => 'Pengganti kontrak baru', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 2, 'bulan' => 'Mei 2026', 'nama' => 'TAD 02', 'jenis' => 'Keluar', 'peran' => 'Security Guard', 'vendor' => 'PT Garda Utama Manado', 'keterangan' => 'Kontrak berakhir', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 3, 'bulan' => 'April 2026', 'nama' => 'TAD 03', 'jenis' => 'Masuk', 'peran' => 'Catering Service BS', 'vendor' => 'PT Minahasa Boga Rasa', 'keterangan' => 'Perpanjangan kontrak', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 4, 'bulan' => 'April 2026', 'nama' => 'TAD 04', 'jenis' => 'Keluar', 'peran' => 'Admin Support BS', 'vendor' => 'PT Trans Kawanua Rentcar', 'keterangan' => 'Mutasi ke vendor lain', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 5, 'bulan' => 'Maret 2026', 'nama' => 'TAD 05', 'jenis' => 'Masuk', 'peran' => 'Admin Support BS', 'vendor' => 'PT Trans Kawanua Rentcar', 'keterangan' => 'Rekrutmen baru', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 6, 'bulan' => 'Maret 2026', 'nama' => 'TAD 06', 'jenis' => 'Keluar', 'peran' => 'Driver Operasional', 'vendor' => 'PT Kawanua Multi Mandiri', 'keterangan' => 'Resign', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 7, 'bulan' => 'Juni 2026', 'nama' => 'TAD 07', 'jenis' => 'Masuk', 'peran' => 'Security Guard Cluster 4', 'vendor' => 'PT Garda Utama Manado', 'keterangan' => 'Rotasi pos security', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 8, 'bulan' => 'Juni 2026', 'nama' => 'TAD 08', 'jenis' => 'Keluar', 'peran' => 'Driver Operasional', 'vendor' => 'PT Kawanua Multi Mandiri', 'keterangan' => 'Pindah area Kamojang', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        if (DB::table('lembur_tad')->where('periode', '!=', 'Mei 2026')->count() === 0) {
            DB::table('lembur_tad')->insert([
                ['id' => 6, 'nopok' => 'M343-250720', 'nama' => 'Pegawai 03', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4300000, 'jamLembur' => 24.0, 'lemburVal' => 645000, 'periode' => 'April 2026', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 7, 'nopok' => 'M343-250721', 'nama' => 'TAD 14', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4280000, 'jamLembur' => 32.0, 'lemburVal' => 912000, 'periode' => 'April 2026', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 8, 'nopok' => 'M343-250722', 'nama' => 'TAD 15', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4200000, 'jamLembur' => 15.0, 'lemburVal' => 420000, 'periode' => 'Maret 2026', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 9, 'nopok' => 'M343-250723', 'nama' => 'TAD 16', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4350000, 'jamLembur' => 28.0, 'lemburVal' => 812000, 'periode' => 'Maret 2026', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 10, 'nopok' => 'M343-250724', 'nama' => 'TAD 17', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4400000, 'jamLembur' => 45.0, 'lemburVal' => 1320000, 'periode' => 'Juni 2026', 'created_at' => now(), 'updated_at' => now()],
                ['id' => 11, 'nopok' => 'M343-250725', 'nama' => 'TAD 18', 'jabatan' => 'Pembantu Wisma/Kantor', 'fungsi' => 'BUSINESS SUPPORT', 'upah' => 4380000, 'jamLembur' => 20.0, 'lemburVal' => 584000, 'periode' => 'Juni 2026', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }
}
