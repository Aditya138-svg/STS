<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShippingCalculatorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Guest/ComingSoon', [
            'title' => 'Shipping calculator',
            'message' => 'Hook this page to your existing calculator logic or blade.',
        ]);
    }
}
