<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', fn () => Inertia::render('Admin/Dashboard/Dashboard'))->name('dashboard');
    Route::get('/profile', fn () => Inertia::render('Auth/Profile/Edit'))->name('profile');
    require __DIR__.'/admin.php';

    Route::name('guest.')->group(function (): void {
        Route::get('/order-notes', fn () => Inertia::render('Guest/ComingSoon', [
            'title' => 'Order notes',
            'message' => 'Order notes list — connect your backend when ready.',
        ]))->name('order_notes');
    });
});

require __DIR__.'/guest.php';