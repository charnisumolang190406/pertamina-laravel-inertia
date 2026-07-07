<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // Managers / Heads
            [
                'username' => 'admin@lahendong.local', // Keeping original username for Management Exec
                'password' => Hash::make('adminLHD2026!'),
                'role' => 'Management Executive',
                'role_id' => 1,
                'fullName' => 'Management Executive (GM)',
                'initials' => 'ME',
            ],
            [
                'username' => 'manager_bs@lahendong.local',
                'password' => Hash::make('managerbsLHD2026!'),
                'role' => 'Manager BS',
                'role_id' => 2,
                'fullName' => 'Manager Business Support',
                'initials' => 'MB',
            ],
            [
                'username' => 'kepala_bpb@lahendong.local',
                'password' => Hash::make('kepalabpbLHD2026!'),
                'role' => 'Kepala Bisnis Planning & Budgeting',
                'role_id' => 3,
                'fullName' => 'Kepala BPB',
                'initials' => 'KB',
            ],
            [
                'username' => 'kepala_hc@lahendong.local',
                'password' => Hash::make('kepalahcLHD2026!'),
                'role' => 'Kepala HC',
                'role_id' => 4,
                'fullName' => 'Kepala Human Capital',
                'initials' => 'KH',
            ],
            [
                'username' => 'kepala_logistik@lahendong.local',
                'password' => Hash::make('kepalalogistikLHD2026!'),
                'role' => 'Kepala Logistik',
                'role_id' => 5,
                'fullName' => 'Kepala Logistik & Facility',
                'initials' => 'KL',
            ],
            [
                'username' => 'kepala_admin@lahendong.local',
                'password' => Hash::make('kepalaadminLHD2026!'),
                'role' => 'Kepala Admin',
                'role_id' => 6,
                'fullName' => 'Kepala Admin (Approval)',
                'initials' => 'KA',
            ],
            // Admins
            [
                'username' => 'admin_bpb@lahendong.local',
                'password' => Hash::make('adminbpbLHD2026!'),
                'role' => 'Admin Bisnis Planning and Budgeting',
                'role_id' => 7,
                'fullName' => 'Admin BPB',
                'initials' => 'AB',
            ],
            [
                'username' => 'admin_hc@lahendong.local',
                'password' => Hash::make('adminhcLHD2026!'),
                'role' => 'Admin HC',
                'role_id' => 8,
                'fullName' => 'Admin Human Capital',
                'initials' => 'AH',
            ],
            [
                'username' => 'admin_logistik@lahendong.local',
                'password' => Hash::make('adminlogistikLHD2026!'),
                'role' => 'Admin Facility Management',
                'role_id' => 9,
                'fullName' => 'Admin Facility Management',
                'initials' => 'AL',
            ],
            [
                'username' => 'admin_ict@lahendong.local',
                'password' => Hash::make('adminictLHD2026!'),
                'role' => 'Admin ICT',
                'role_id' => 10,
                'fullName' => 'Admin ICT',
                'initials' => 'AI',
            ],
        ];

        foreach ($users as $user) {
            $user['created_at'] = now();
            $user['updated_at'] = now();
            DB::table('users')->updateOrInsert(['username' => $user['username']], $user);
        }
    }
}
