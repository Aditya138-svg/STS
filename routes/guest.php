<?php

use App\Http\Controllers\Guest\AboutController;
use App\Http\Controllers\Guest\ContactController;
use App\Http\Controllers\Guest\FaqController;
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
    Route::post('/shipping-calculator/calculate', [ShippingCalculatorController::class, 'calculate'])->name('shipping_calculator.calculate');
    Route::get('/track-order', [TrackOrderController::class, 'index'])->name('track_order');
    Route::post('/track-order', [TrackOrderController::class, 'track'])->name('tracking_order');
    Route::post('/track-order-by-ref', [TrackOrderController::class, 'trackByRef'])->name('tracking_order_by_refPhn');
    Route::get('/request-quote', [QuoteController::class, 'index'])->name('create_quote');
    Route::get('/service-areas', [ServiceAreasController::class, 'index'])->name('service_areas');
    Route::get('/faq', [FaqController::class, 'index'])->name('faq');
});
