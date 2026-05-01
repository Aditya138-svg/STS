<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Services\SmartsheetClient;
use App\Models\Associate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AssociatesWithReceiverRecordsExport implements WithMultipleSheets
{
    protected $smartsheet;
    protected $exportDate;

    public function __construct($exportDate)
    {
        $this->smartsheet = new SmartsheetClient();
        $this->exportDate = $exportDate;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Get all associates you need
        $Associates = Associate::getAssociatesExceptSTS();
        if(!$Associates->isEmpty()){
            foreach ($Associates as $Associate) {
                $records = [];
                $clients = $Associate->clients;
                if(!$clients->isEmpty()){
                    $receiver_records = [];
                    foreach($clients AS $client){
                        if($this->exportDate){
                            $d = Carbon::parse($this->exportDate);
                        } else {
                            $d = now();
                        }
                        // dd($d->toDateString());
                        // Get good quality records for this client
                        $client_records = $this->smartsheet->getGoodQualityRecords($client->id, $d);
                        if(!$client_records->isEmpty()){
                            $receiver_records = array_merge($receiver_records, $client_records->toArray());
                        }
                    }
                    // Merge all client receiver records into $records
                    if(!empty($receiver_records)){
                        $records = array_merge($records, $receiver_records);
                    }
                }
                // Add the sheet for this associate only if records exist
                if(!empty($records)){
                    $sheets[] = new AssociateSheetExport($Associate->a_short_code, $records);
                }
            }
        }
        if(empty($sheets)){
            // If no sheets, add a dummy sheet to avoid error
            $sheets[] = new AssociateSheetExport('No Data', []);
        }
        return $sheets;
    }
}
