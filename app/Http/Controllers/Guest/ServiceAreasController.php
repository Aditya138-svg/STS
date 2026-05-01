<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ServiceAreasController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Guest/ComingSoon', [
            'title' => 'Service areas',
            'message' => 'Serviceable ZIP list — migrate your existing view here.',
        ]);
    }
}
