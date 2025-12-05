<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            $table->string('name_fa')->unique();
            $table->string('slug')->unique();
            $table->string('color', 20)->nullable();
            $table->text('description')->nullable();

            $table->string('image')->nullable();
            $table->string('banner')->nullable();

            $table->boolean('is_active')->default(true);

            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
