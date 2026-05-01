<?php

use App\Http\Controllers\Guest\AboutController;
use App\Http\Controllers\Guest\ContactController;
use App\Http\Controllers\Guest\HomeController;
use App\Http\Controllers\Guest\QuoteController;
use App\Http\Controllers\Guest\ServiceAreasController;
use App\Http\Controllers\Guest\ShippingCalculatorController;
use App\Http\Controllers\Guest\TrackOrderController;
use Illuminate\Support\Facades\Route;

Route::name('guest.')->group(function (): void {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about-us', [AboutController::class, 'index'])->name('about');
    Route::get('/contact-us', [ContactController::class, 'index'])->name('contact');
    Route::get('/shipping-calculator', [ShippingCalculatorController::class, 'index'])->name('shipping_calculator');
    Route::get('/track-order', [TrackOrderController::class, 'index'])->name('track_order');
    Route::get('/request-quote', [QuoteController::class, 'index'])->name('create_quote');
    Route::get('/service-areas', [ServiceAreasController::class, 'index'])->name('service_areas');
});
