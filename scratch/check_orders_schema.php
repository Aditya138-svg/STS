<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$app->make(Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

if (Schema::hasTable('orders')) {
    echo "Table: orders\n";
    $columns = Schema::getColumnListing('orders');
    print_r($columns);
    
    $first = DB::table('orders')->orderBy('id', 'desc')->first();
    if ($first) {
        echo "Latest row sample:\n";
        print_r((array)$first);
    }
} else {
    echo "Table 'orders' does not exist.\n";
}
