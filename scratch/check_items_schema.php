<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$app->make(Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

if (Schema::hasTable('items')) {
    echo "Table: items\n";
    $columns = Schema::getColumnListing('items');
    print_r($columns);
    
    $first = DB::table('items')->first();
    if ($first) {
        echo "First row sample:\n";
        print_r((array)$first);
    }
} else {
    echo "Table 'items' does not exist.\n";
}
