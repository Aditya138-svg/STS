<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Guest/ComingSoon', [
            'title' => 'Request a quote',
            'message' => 'Connect your quote form or legacy route here.',
        ]);
    }
}
