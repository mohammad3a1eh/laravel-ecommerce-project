<?php
namespace App\Models;

use App\Casts\CurrencyCast;
use App\Casts\NormalizePhone;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    protected $fillable = [
        "price",
        "phone_number",
    ];

    protected $casts = [
        "price" => CurrencyCast::class,
        "phone_number" => NormalizePhone::class,
    ];
}
