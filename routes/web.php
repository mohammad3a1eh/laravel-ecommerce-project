<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;

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


Route::prefix('dashboard')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name("categories.destroy");

    Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/brands/create', [BrandController::class, 'create'] )->name('brands.create');
    Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
    Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'] )->name('brands.edit');
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
