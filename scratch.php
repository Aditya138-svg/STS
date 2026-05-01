<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $req = Illuminate\Http\Request::create('/admin/dispatch-scheduling/zipcode-management', 'GET');
    $controller = new App\Http\Controllers\Admin\DispatchScheduling\ZipcodeManagementController();
    $response = $controller->index($req);
    
    $props = $response->toResponse($req)->getOriginalContent()->getData()['page']['props'];
    
    echo "Zipcodes fetched: " . count($props['zipcodes']['data']) . "\n";
    if(count($props['zipcodes']['data']) == 0) {
        $zipcodeModel = new App\Models\Zipcodes();
        $totalCount = $zipcodeModel->get_opt_zipcode_list_count();
        echo "Total count from model: " . $totalCount . "\n";
        echo "Table used by Model: " . $zipcodeModel->getTable() . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
