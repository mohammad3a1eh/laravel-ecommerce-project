<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class CurrencyCast implements CastsAttributes
{
    protected int $precision = 3;

    public function get($model, $key, $value, $attributes)
    {
        if ($value === null) {
            return null;
        }

        $units = config("currency.units");
        $unit  = config("currency.display_unit");

        $factor = $units[$unit]['factor'];

        $price = bcdiv($value, $factor, $this->precision);

        return $price;
    }

    public function set($model, $key, $value, $attributes)
    {
        if ($value === null) {
            return null;
        }

        $units = config("currency.units");
        $unit  = config("currency.display_unit");

        $factor = $units[$unit]['factor'];

        $price = bcmul($value, $factor, 0);

        return $price;
    }
}
