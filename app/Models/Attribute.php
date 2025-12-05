<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    protected $fillable = [
        'category_id',
        'name',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productValues()
    {
        return $this->hasOne(ProductAttributeValue::class, 'attribute_id');
    }
}
