<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SetupRolesCommand extends Command
{
    protected $signature = 'setup:roles';
    protected $description = 'Create or update all roles and permissions';

    public function handle()
    {
        $this->info('Setting up roles & permissions...');

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions list
        $permissions = [
            'dev' => [
                "maintenance mode",
                "package management",
                "development settings",
            ],
            'owner' => [
                "site settings",
                "admins management",
            ],
            'admin' => [
                "manage user"
            ],
            'manager' => [
                "manage post",
                "manage product"
            ],
            'user' => [
                "manage profile"
            ]
        ];

        // Create permissions
        foreach (array_merge(...array_values($permissions)) as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Roles
        $devRole = Role::firstOrCreate(['name' => 'dev']);
        $devRole->givePermissionTo(Permission::all());

        $ownerRole = Role::firstOrCreate(['name' => 'owner']);
        $ownerRole->syncPermissions(
            array_merge(
                $permissions["owner"],
                $permissions["admin"],
                $permissions["manager"],
                $permissions["user"]
            )
        );

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(
            array_merge(
                $permissions["admin"],
                $permissions["manager"],
                $permissions["user"]
            )
        );

        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $managerRole->syncPermissions(
            array_merge(
                $permissions["manager"],
                $permissions["user"]
            )
        );

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->syncPermissions($permissions["user"]);

        $this->info('Roles & permissions updated successfully!');
        return Command::SUCCESS;
    }
}
