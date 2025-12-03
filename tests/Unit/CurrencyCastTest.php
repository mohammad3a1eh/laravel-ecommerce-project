<?php

use App\Casts\CurrencyCast;

uses(Tests\TestCase::class);

beforeEach(function () {
    config()->set('currency.units', [
        'rial' => ['factor' => 1],
        'toman' => ['factor' => 0.1],
    ]);

    config()->set('currency.database_unit', 'rial');
    config()->set('currency.display_unit', 'toman');
});

test('currency cast converts from DB rial to display toman on get', function () {
    $converted = (new CurrencyCast())->get(null, 'price', 10000, []);
    expect($converted)->toBe(1000.0);
});

test('currency cast converts from display toman to DB rial on set', function () {
    $dbValue = (new CurrencyCast())->set(null, 'price', 10000, []);
    expect($dbValue)->toBe(100000.0);
});
