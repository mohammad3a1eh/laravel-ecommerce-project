<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name_fa');
            $table->text('description')->nullable();
            $table->string('meta_description')->nullable();

            $table->string('image')->nullable();

            $table->boolean('is_visible')->default(true);

            $table->decimal('price', 15, 3);
            $table->decimal('discount_price', 15, 3)->nullable();

            $table->boolean('has_discount')->default(false);

            $table->boolean('is_sellable')->default(true);

            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
