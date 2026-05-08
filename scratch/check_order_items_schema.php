<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$app->make(Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

if (Schema::hasTable('order_items')) {
    echo "Table: order_items\n";
    $columns = Schema::getColumnListing('order_items');
    print_r($columns);
    
    $first = DB::table('order_items')->first();
    if ($first) {
        echo "First row sample:\n";
        print_r((array)$first);
    }
} else {
    echo "Table 'order_items' does not exist.\n";
}
