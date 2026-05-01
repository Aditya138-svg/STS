<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AssociateSheetExport implements FromCollection, WithTitle, WithHeadings
{
    protected $associateName;
    protected $records; // 22-column records
    
    public function __construct($associateName, $records)
    {
        $this->associateName = $associateName;
        $this->records = $records;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Assuming $records is already an array of arrays (22 columns)
        return collect($this->records);
    }

    public function headings(): array
    {
        // Example headings for 22 columns
        return config('constants.SMARTSHEET_COLUMNS');
    }

    public function title(): string
    {
        // Sheet name is associate name
        return $this->associateName;
    }
}
