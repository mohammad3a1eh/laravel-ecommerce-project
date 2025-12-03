<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Morilog\Jalali\Jalalian;
use Carbon\Carbon;

class JalaliDate implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        if (!$value) return null;

        return Jalalian::fromCarbon(Carbon::parse($value))
            ->format('Y-m-d H:i:s');
    }

    public function set($model, string $key, $value, array $attributes)
    {
        if (!$value) return null;

        try {
            return Jalalian::fromFormat('Y-m-d H:i:s', $value)->toCarbon();
        } catch (\Exception $e) {}

        try {
            return Jalalian::fromFormat('Y-m-d', $value)->toCarbon();
        } catch (\Exception $e) {}

        throw new \InvalidArgumentException("Invalid Jalali datetime format: $value");
    }
}
