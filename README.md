# laravel-base

A clean and reusable starter template for Laravel projects.
This repository gives you a pre-configured Laravel setup with common structure, helpers, and conventions — so you can skip repetitive setup steps and jump straight into building your application.

## Getting Started
### Clone the Template
```shell
git clone https://github.com/mohammad3a1eh/laravel-base.git my-project
cd my-project
```


If you're using GitHub’s “Use this template” feature, simply create a new repo from it and clone your own repository instead.

### Install Composer Dependencies
Make sure you have PHP + Composer installed, then run:
```shell
composer install
```

Copy the example environment file:
```shell
cp .env.example .env
```

Generate the application key:
```shell
php artisan key:generate
```

Configure your .env file (database, mail settings, etc.) and then run migrations:
```shell
php artisan migrate
```

### Install NPM Dependencies
This template includes a ready frontend build setup.
<br><br>
Install packages
```shell
npm install
```

Build assets for Production
```shell
npm run build
```

### Start the Project
```shell
composer dev
```
or
```shell
npm run dev
php artisan serve
```

## You’re Ready to Build

Everything is set up — Composer packages, NPM assets, environment configuration, and base structure.
<br>
Now you can directly start building your website or application on top of this clean Laravel base.


## Project Documentation
These are internal features of this template that you may want to review:

### Custom Casts
- [NormalizePhone Cast](documents/phone_number.md)
-> `app/Casts/NormalizePhone.php`
- Cleans and normalizes phone numbers before saving to the database.


- [CurrencyCast](documents/currency.md)
-> `app/Casts/CurrencyCast.php`
- Handles converting between Rial/Toman (DB ↔ display).


### Localization System
- [translation](documents/i18n.md)


## External Documentation (Libraries Used)
- [laravel 12](https://laravel.com/docs/12.x)
- [react.js 19](https://react.dev/learn/)
- [inertia.js](https://inertiajs.com/docs/v2/getting-started/index)
- [shadcn ui](https://ui.shadcn.com/)
- [laravel-react-i18n](https://github.com/EugeneMeles/laravel-react-i18n)

