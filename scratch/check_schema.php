<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$app->make(Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$tables = ['quote_items', 'quotes_items', 'quote_item'];
foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "Table: $table\n";
        $columns = Schema::getColumnListing($table);
        print_r($columns);
        
        $first = DB::table($table)->orderBy('id', 'desc')->first();
        if ($first) {
            echo "Latest row sample:\n";
            print_r((array)$first);
        } else {
            echo "No data in $table\n";
        }
        echo "-------------------\n";
    }
}
