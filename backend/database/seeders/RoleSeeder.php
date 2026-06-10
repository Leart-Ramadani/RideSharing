<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            ['name' => 'Passenger', 'normalized_name' => 'PASSENGER'],
            ['name' => 'Driver', 'normalized_name' => 'DRIVER'],
            ['name' => 'Admin', 'normalized_name' => 'ADMIN'],
        ]);
    }
}
