<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'interior_design_name',
        'project_name',
        'address',
        'zipcode', 
        'est_install_date',
        'total_est',
        'est_del_cost',
        'rec_cost',
        'est_monthly_storage',
        'total_cubes'
    ];

    public function items()
    {
        return $this->hasMany(ProjectItem::class);
    }



    // 1) FETCH ALL PROJECTS DATA
    public static function getProjectsForDataTable($params, $columns)
    {
        $query = self::select($columns);

        // Count before filtering
        $totalRecords = $query->count();

        // Apply search
        if (!empty($params['search']['value'])) {
            $searchTerm = $params['search']['value'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('project_name', 'like', "%{$searchTerm}%")
                    ->orWhere('interior_design_name', 'like', "%{$searchTerm}%")
                    ->orWhere('address', 'like', "%{$searchTerm}%");
            });
        }

        // Count after filtering
        $filteredCount = $query->count();

        // Sorting
        if (isset($params['order'][0]['column'])) {
            $orderColumnIndex = $params['order'][0]['column'];
            $orderDir = $params['order'][0]['dir'] ?? 'asc';

            if (isset($columns[$orderColumnIndex])) {
                $query->orderBy($columns[$orderColumnIndex], $orderDir);
            }
        }

        // Pagination
        $start = $params['start'] ?? 0;
        $length = $params['length'] ?? 10;
        $query->skip($start)->take($length);

        // Fetch data
        $projects = $query->get();

        return [
            'totalRecords' => $totalRecords,
            'filteredCount' => $filteredCount,
            'projects' => $projects
        ];
    }

}
