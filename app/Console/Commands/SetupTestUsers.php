<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class SetupTestUsers extends Command
{
    protected $signature = 'setup:test-users';
    protected $description = 'Create test users with roles for development';

    public function handle()
    {
        $this->info("Creating test users...");

        $users = [
            'dev' => [
                'email' => 'dev@example.com',
                'password' => 'password',
                'role' => 'dev',
            ],
            'owner' => [
                'email' => 'owner@example.com',
                'password' => 'password',
                'role' => 'owner',
            ],
            'admin' => [
                'email' => 'admin@example.com',
                'password' => 'password',
                'role' => 'admin',
            ],
            'manager' => [
                'email' => 'manager@example.com',
                'password' => 'password',
                'role' => 'manager',
            ],
            'user' => [
                'email' => 'user@example.com',
                'password' => 'password',
                'role' => 'user',
            ],
        ];

        foreach ($users as $name => $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => ucfirst($name),
                    'password' => bcrypt($data['password']),
                ]
            );

            $role = Role::firstOrCreate(['name' => $data['role']]);

            $user->assignRole($role);

            $this->info("User {$name} created with role {$data['role']}.");
        }

        $this->info("All test users created successfully!");

        return Command::SUCCESS;
    }
}
