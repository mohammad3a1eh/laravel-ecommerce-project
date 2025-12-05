<?php

namespace App\Models;

use App\Casts\CurrencyCast;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name_fa',
        'description',
        'meta_description',
        'image',
        'is_visible',
        'price',
        'discount_price',
        'has_discount',
        'is_sellable',
        'category_id',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'has_discount' => 'boolean',
        'is_sellable' => 'boolean',
        'price' => CurrencyCast::class,
        'discount_price' => CurrencyCast::class,
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
