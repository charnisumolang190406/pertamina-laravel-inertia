<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Management Executive',
            'Manager BS',
            'Kepala Bisnis Planning & Budgeting',
            'Kepala HC',
            'Kepala Logistik',
            'Kepala Admin',
            'Admin Bisnis Planning and Budgeting',
            'Admin HC',
            'Admin Facility Management',
            'Admin ICT'
        ];

        foreach ($roles as $index => $roleName) {
            DB::table('roles')->updateOrInsert(
                ['id' => $index + 1],
                [
                    'role_name' => $roleName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
