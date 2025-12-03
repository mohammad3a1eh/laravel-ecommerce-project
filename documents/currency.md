# Using the CurrencyCast in Your Laravel Project
This guide explains how to use the custom CurrencyCast to automatically convert money values between your **database unit** (e.g., rial) and your **display unit** (e.g., toman) using the configuration in `config/currency.php`

## 1-Add the Cast to your Eloquent Model
**Example:**
```php
use \App\Casts\CurrencyCast;

class Product extends Model
{
    protected $casts = [
        'price' => CurrencyCast::class,
    ];
}
```

**What this does:**

- When reading from the database:

The value is converted from the database unit (e.g., `rial`) → display unit (e.g., `toman`).

- When writing to the database:

The value you pass in (in display unit) is converted back to the database unit

## 2- Configure Your Units (`config/currency.php`)

**Your config file defines:**

- The unit stored in the database
- The unit used when displaying values
- Conversion factors between units

**Example:**
```php
return [
    'database_unit' => 'rial',
    'display_unit'  => 'toman',

    'units' => [
        'rial' => [
            'label'  => 'ریال',
            'factor' => 1,
        ],
        'toman' => [
            'label'  => 'تومان',
            'factor' => 0.1,
        ],
        'new_toman' => [
            'label'  => 'تومان جدید',
            'factor' => 0.001,
        ],
        'new_rial' => [
            'label'  => 'ریال جدید',
            'factor' => 0.0001,
        ],
    ],
];
```

### How `factor` works:

| Unit       | Factor  | Meaning                       |
|-----------|---------|--------------------------------|
| rial      | 1       | Base unit                      |
| toman     | 0.1     | 1 toman = 10 rial              |
| new_toman | 0.001   | 1 new toman = 1000 rial        |
| new_rial  | 0.0001  | 1 new rial = 10000 rial        |

## 3- Using it in Code
**Storing:**
```php
Product::create([
    'price' => 350, // user writes toman
]);
```
**Reading:**
```php
$product->price;  
// returns a converted value: 350.000
```

## 4- Changing the Display Unit
You can globally change the display unit in `config/currency.php`
```php
'display_unit' => 'new_toman'
```

## 5- Supported Features

- [x] Automatic conversion
- [x] Works on any model/field
- [x] No need to manually convert prices
- [x] All math done using bc* functions for precision
- [x] Supports unlimited custom units via config

## 6- Example: Full Flow
```php
$product = Product::first();

echo $product->price; 
// "350.000" (display unit)

$product->price = 400; 
$product->save();
// stored as 400 / 0.1 = 40000 rial
```
