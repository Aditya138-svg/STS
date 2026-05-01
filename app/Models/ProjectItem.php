<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectItem extends Model
{
    protected $fillable = [
        'project_id',
        'manufacturer_address',
        'po_number',
        'tmp_number',
        'qty_due_in',
        'item_description',
        'item_number',
        'date_received',
        'notes',
        'cube',
        'cube_expanded',
        'rec_cost_pickup',
        'monthly_rate',
        'date_storage_starts',
        'tmp_storage',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }


    public static function getItemsForDataTable($params, $columns, $projectId)
    {
        $query = self::where('project_id', $projectId)
            ->select($columns);

        // Total count
        $totalRecords = $query->count();

        // Search filter
        if (!empty($params['search']['value'])) {
            $search = $params['search']['value'];

            $query->where(function ($q) use ($search, $params, $columns) {
                foreach ($params['columns'] as $colParam) {
                    $colIndex = $colParam['data'];
                    $colName = $columns[$colIndex] ?? null;

                    // Only add searchable columns
                    if ($colName && $colParam['searchable'] === 'true') {
                        $q->orWhere($colName, 'like', "%{$search}%");
                    }
                }
            });
        }

        $filteredCount = $query->count();

        // Sorting
        if (isset($params['order'][0]['column'])) {
            $colIndex = $params['order'][0]['column'];
            $dir = $params['order'][0]['dir'];
            if (isset($columns[$colIndex])) {
                $query->orderBy($columns[$colIndex], $dir);
            }
        }

        // Pagination
        $start = $params['start'] ?? 0;
        $length = $params['length'] ?? 10;
        $query->skip($start)->take($length);

        return [
            'items' => $query->get(),
            'totalRecords' => $totalRecords,
            'filteredCount' => $filteredCount
        ];
    }


    public function updateColumnAndRecalculate(string $column, $value): void
    {
        // Sanitize value
        $safeValue = strip_tags($value);

        // Update the column
        $this->{$column} = $safeValue;

        // Recalculate dependent fields
        if (in_array($column, ['qty_due_in','cube'])) {
            $qty = $this->qty_due_in ?? 0;
            $cube = $this->cube ?? 0;

            $this->cube_expanded = $qty * $cube;
            $this->monthly_rate = $this->cube_expanded * 0.9;
        }

        // Save the updated item
        $this->save();

        // Recalculate project totals
        $this->recalculateProjectTotals();
    }

    /**
     * Recalculate totals for the parent project
     *
     * @return void
     */
    protected function recalculateProjectTotals(): void
    {
        $projectId = $this->project_id;
        if (!$projectId) return;

        $totals = self::where('project_id', $projectId)
            ->selectRaw('
                SUM(cube_expanded) as total_cubes,
                SUM(monthly_rate) as est_monthly_storage,
                SUM(rec_cost_pickup) as rec_cost
            ')
            ->first();

        $project = Project::find($projectId);
        if ($project) {
            $project->total_cubes = $totals->total_cubes ?? 0;
            $project->est_monthly_storage = $totals->est_monthly_storage ?? 0;
            $project->rec_cost = $totals->rec_cost ?? 0;
            $project->est_del_cost = ($project->total_cubes ?? 0) * 4.25;
            $project->total_est = ($project->est_monthly_storage ?? 0)
                                + ($project->rec_cost ?? 0)
                                + ($project->est_del_cost ?? 0);
            $project->save();
        }
    }

}