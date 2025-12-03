<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsInboundAttributes;

class NormalizePhone implements CastsInboundAttributes
{
    public function set($model, string $key, $value, array $attributes)
    {
        if (!$value) {
            return null;
        }

        $phone = preg_replace('/\D/', '', (string) $value);

        if (str_starts_with($phone, '098')) {
            $phone = substr($phone, 3);
        }

        if (str_starts_with($phone, '0098')) {
            $phone = substr($phone, 4);
        }

        if (str_starts_with($phone, '98')) {
            $phone = substr($phone, 2);
        }

        if (strlen($phone) === 10 && $phone[0] !== '0') {
            $phone = '0' . $phone;
        }

        if (strlen($phone) === 11 && $phone[0] !== '0') {
            $phone = '0' . substr($phone, -10);
        }

        if (strlen($phone) !== 11) {
            return null;
        }

        return $phone;
    }
}
