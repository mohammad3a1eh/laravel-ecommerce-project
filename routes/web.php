<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::middleware(['auth', 'role:dev'])->group(function () {
    Route::get('/dashboard/maintenance', function () {
        $isDown = File::exists(storage_path('framework/maintenance.flag'));
        return Inertia::render('dev/maintenance', ['isDown' => $isDown]);
    })->name('maintenance.index');

    Route::post('/dashboard/maintenance/toggle', function () {
        $flag = storage_path('framework/maintenance.flag');
        File::exists($flag) ? unlink($flag) : touch($flag);
        return redirect()->route('maintenance.index');
    })->name('maintenance.toggle');
});

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
