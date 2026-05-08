<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$o = App\Models\Orders::with(['externalCustomer', 'originAddress', 'destAddress', 'billingAddress', 'criticalDates', 'serviceLevels'])->find(81);
$data = [
    'customer_ref' => $o->customer_ref,
    'po_number' => $o->po_number,
    'externalCustomer' => $o->externalCustomer ? $o->externalCustomer->toArray() : null,
    'originAddress' => $o->originAddress ? $o->originAddress->toArray() : null,
    'destAddress' => $o->destAddress ? $o->destAddress->toArray() : null,
    'billingAddress' => $o->billingAddress ? $o->billingAddress->toArray() : null,
];
echo json_encode($data, JSON_PRETTY_PRINT);
