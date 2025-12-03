<?php

namespace App\Support;

class Money
{
    protected $amount; // always base unit (rial_old)

    public function __construct($value)
    {
        $this->amount = floatval($value);
    }

    public function to(string $unit)
    {
        $config = config("currency.units.$unit");
        $factor = $config['factor'];

        $result = $this->amount / $factor;

        $decimals = $config['decimals'] ?? 0;

        return round($result, $decimals);
    }

    public function format(string $unit = null)
    {
        $unit = $unit ?? config('currency.display_unit');
        $value = $this->to($unit);
        $label = config("currency.units.$unit.label");

        return number_format($value, config("currency.units.$unit.decimals")) . " $label";
    }
}
