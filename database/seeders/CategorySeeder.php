<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'قطعات کامپیوتر' => [
                'رم',
                'سی‌پی‌یو',
                'هارد و SSD',
                'پاور',
                'کارت گرافیک',
                'کیس',
            ],

            'سیستم‌های آماده' => [
                'سیستم رندر',
                'سیستم گیمینگ',
                'سیستم اداری',
            ],

            'تجهیزات جانبی' => [
                'موس',
                'کیبورد',
                'لوازم جانبی دیگر',
            ],

            'لپ‌تاپ' => [
                'لپ‌تاپ خانگی',
                'لپ‌تاپ اداری',
                'لپ‌تاپ صنعتی',
                'لپ‌تاپ گیمینگ',
            ],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create([
                'name_fa'     => $parentName,
                'slug'        => Str::slug($parentName, '-'),
                'description' => "دسته‌بندی {$parentName}",
                'is_active'   => true,
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name_fa'     => $childName,
                    'slug'        => Str::slug($childName, '-'),
                    'description' => "زیر دسته {$parentName}",
                    'is_active'   => true,
                    'parent_id'   => $parent->id,
                ]);
            }
        }
    }
}
