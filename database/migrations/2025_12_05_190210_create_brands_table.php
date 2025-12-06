<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name_fa')->unique();         // اسم فارسی
            $table->string('name_en')->unique(); // اسم انگلیسی
            $table->string('slug')->unique();  // اسلاگ
            $table->string('image')->nullable(); // عکس
            $table->string('website')->nullable(); // لینک سایت برند
            $table->boolean('is_active')->default(true); // وضعیت فعال/غیرفعال
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
