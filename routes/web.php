<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CategoryController;

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
//    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index'); // لیست دسته‌بندی‌ها
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create'); // فرم ایجاد دسته‌بندی
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store'); // ذخیره دسته‌بندی جدید
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
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
