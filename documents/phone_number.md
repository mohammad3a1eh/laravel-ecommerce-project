## NormalizePhone Cast

This cast automatically normalizes phone numbers before storing them in the database.  
Its main purpose is to convert different Iranian phone number formats into one clean and consistent 11-digit format (e.g. `09121234567`).

## 1- What it does

When a value is assigned to the model attribute, the cast:

1. Removes any non-digit characters.
2. Strips country prefixes such as:
    - `098`
    - `0098`
    - `98`
3. Ensures the number starts with a leading `0`.
4. Validates that the final result contains exactly 11 digits.
5. Returns `null` if the number is invalid.

## 2- Example

```php
use App\Models\User;

$user = User::create([
    'phone_number' => '+98 912 123 4567',
]);

// Saved into the database as:
//"09121234567"
```

## 3- Usage
Add the cast to your Eloquent model

```php
use App\Casts\NormalizePhone;

class User extends Model
{
    protected $casts = [
        'phone_number' => NormalizePhone::class,
    ];
}
```

From now on, any phone number set on `phone_number` will be normalized automatically before being stored in your database.




