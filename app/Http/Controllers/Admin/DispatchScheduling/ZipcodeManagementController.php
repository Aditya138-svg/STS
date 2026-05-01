<?php

namespace App\Http\Controllers\Admin\DispatchScheduling;

use App\Http\Controllers\Controller;
use App\Models\Zipcodes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ZipcodeManagementController extends Controller
{
    /**
     * Display the Zipcode Management page.
     */
    public function index(Request $request)
    {
        $zipcodeModel = new Zipcodes();
        
        $filters = $request->only(['search_val', 'filter_by_area', 'filter_by_day', 'sort_column', 'sort_by']);
        
        // Emulate the parameters expected by the old Zipcodes model `get_zipcode_details_subquery`
        $filter_arr = [
            'search_val' => $filters['search_val'] ?? '',
            'filter_by_area' => $filters['filter_by_area'] ?? '',
            'filter_by_day' => $filters['filter_by_day'] ?? '',
            'recordsFiltered' => false,
            'offset' => ($request->input('page', 1) - 1) * 10,
            'limit' => 10,
            'sort' => [
                'sort_column' => $filters['sort_column'] ?? 'z_id',
                'sort_by' => $filters['sort_by'] ?? 'desc',
            ]
        ];

        $totalCount = $zipcodeModel->get_opt_zipcode_list_count(null, null, $filter_arr);
        $zipcodesList = $zipcodeModel->get_opt_zipcode_list(null, null, $filter_arr);

        // Fetch Dropdown Data
        $areas = DB::table('address_books')
                    ->where('address_type', config('constants.ADDRESS_TYPE.DEPOT', 2))
                    ->select('zipcode', 'terminal_name', 'short_code', 'city')
                    ->get();
                    
        $locations = DB::table('schedule_settings')
                    ->select('id', 'loc_name', 'depot_id')
                    ->get();
                    
        $tiers = DB::table('tiers')
                    ->select('id', 'tier_name', 'tier_type')
                    ->get();

        return Inertia::render('Admin/DispatchScheduling/ZipCodeManagement/ZipcodeManagement', [
            'zipcodes' => [
                'data' => $zipcodesList ?: [],
                'total' => $totalCount,
                'current_page' => $request->input('page', 1),
                'per_page' => 10,
            ],
            'filters' => $filters,
            'areas' => $areas,
            'locations' => $locations,
            'tiers' => $tiers,
        ]);
    }

    /**
     * Store a newly created or updated zipcode in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'zipcode' => 'required',
            'area' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->with('error', 'Validation failed.');
        }

        $data = [
            'zipcode' => $request->zipcode,
            'zipcode_associate_with' => $request->area,
            'updated_at' => now(),
        ];

        $z_id = $request->input('z_id', 0);
        $zipcodeModel = new Zipcodes();

        if ($z_id == 0) {
            $data['created_at'] = now();
            $zipcodeModel->store($data);
            $message = "Zipcode added successfully.";
        } else {
            $zipcodeModel->store($data, $z_id);
            $message = "Zipcode updated successfully.";
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Get details of a specific zipcode for editing.
     */
    public function getZipcode(Request $request)
    {
        $z_id = $request->input('z_id');
        $zipcodeModel = new Zipcodes();
        $data = $zipcodeModel->get_opt_zipcode_list($z_id);

        if ($data) {
            return response()->json(['status' => true, 'data' => $data]);
        }
        return response()->json(['status' => false, 'message' => 'Zipcode not found.']);
    }

    /**
     * Delete multiple zipcodes.
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');
        if (empty($ids)) {
            return redirect()->back()->with('error', 'Please select at least 1 zipcode.');
        }

        DB::table('zipcodes_management')->whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Zipcodes deleted successfully.');
    }

    /**
     * Delete a single zipcode.
     */
    public function destroySingle(Request $request)
    {
        $z_id = $request->input('z_id');
        DB::table('zipcodes_management')->where('id', $z_id)->delete();

        return redirect()->back()->with('success', 'Zipcode deleted successfully.');
    }

    /**
     * Associate multiple zipcodes to a location and tier.
     */
    public function storeLocationZipcodes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'schedule_settings_id' => 'required',
            'tiers_id' => 'required',
            'loc_zipcodes' => 'required|regex:/^\d{5}(?:,\s*\d{5})*$/',
        ], [
            'loc_zipcodes.regex' => 'Please enter valid comma separated zipcode(s).',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->with('error', 'Validation failed. Check your inputs.');
        }

        $zipcodes = explode(',', str_replace(' ', '', $request->loc_zipcodes));
        
        $updatedCount = 0;
        foreach ($zipcodes as $zipcode) {
            $existing = DB::table('zipcodes_management')->where('zipcode', $zipcode)->first();
            
            $data = [
                'schedule_settings_id' => $request->schedule_settings_id,
                'tiers_id' => $request->tiers_id,
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('zipcodes_management')->where('id', $existing->id)->update($data);
                $updatedCount++;
            } else {
                $data['zipcode'] = $zipcode;
                $data['created_at'] = now();
                DB::table('zipcodes_management')->insert($data);
                $updatedCount++;
            }
        }

        return redirect()->back()->with('success', "$updatedCount Zipcode(s) successfully mapped to location.");
    }
}
