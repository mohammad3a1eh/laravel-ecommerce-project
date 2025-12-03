<?php
// app/Support/Currency.php

if (! function_exists('currency_convert')) {
    /**
     * Convert amount from database unit (pure number) to target/display unit.
     *
     * @param float|int $amount  Amount stored in DB (pure number, e.g. rial)
     * @param string|null $to_unit  Unit to convert to (e.g. 'toman'), or null => display_unit
     * @return float
     */
    function currency_convert($amount, $to_unit = null)
    {
        $config = config('currency');

        $to_unit = $to_unit ?: $config['display_unit'];
        $units = $config['units'] ?? [];

        if (! isset($units[$to_unit])) {
            throw new \InvalidArgumentException("Currency unit {$to_unit} not defined in config/currency.php");
        }

        $factor = $units[$to_unit]['factor'];

        // amount is in Rial -> convert to target unit
        return round((float) $amount * (float) $factor, 3);
    }
}

if (! function_exists('currency_format')) {
    /**
     * Convert and format with label
     */
    function currency_format($amount, $unit = null)
    {
        $unit = $unit ?: config('currency.display_unit');
        $converted = currency_convert($amount, $unit);

        $label = config("currency.units.{$unit}.label") ?? $unit;
        $decimals = config("currency.units.{$unit}.decimals") ?? 3;

        return number_format($converted, $decimals) . ' ' . $label;
    }
}
