<?php

namespace App\Models;

use App\Model\Orders;
use App\Model\Quotes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Associate extends Model
{
    use HasFactory;

    protected $table = 'associates';
    protected $primaryKey = 'id';

    protected $fillable = [
        'a_company_name',
        'a_short_code',
        'a_logo',
        'a_contact_person',
        'a_email',
        'a_phone_number',
        'a_commission_percentage',
        'a_default',
        'a_active',
    ];

    protected $casts = [
        'a_commission_percentage' => 'float',
        'a_default' => 'boolean',
    ];

    /**
     * Get the clients for the associate
     * 
     */
    public function clients(): HasMany
    {
        return $this->hasMany(User::class, 'associates_id', 'id');
    }

    public static function getFilteredAssociates($params)
    {
        $limit = $params['length'] ?? 10;
        $start = $params['start'] ?? 0;
        $orderColumn = $params['orderColumn'] ?? 'id'; // default id
        $orderDir = $params['orderDir'] ?? 'asc';
        $statusFilter = $params['status'] ?? '-All-';
        $search = $params['search'] ?? '';

        $query = self::whereIn('a_status', [0, 1]); // active & inactive only

        // Status filter
        if ($statusFilter !== '-All-') {
            $query->where('a_status', $statusFilter);
        }

        // Search filter
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('a_company_name', 'LIKE', "%{$search}%")
                ->orWhere('a_short_code', 'LIKE', "%{$search}%")
                ->orWhere('a_email', 'LIKE', "%{$search}%")
                ->orWhere('a_phone_number', 'LIKE', "%{$search}%")
                ->orWhere('a_contact_person', 'LIKE', "%{$search}%");
            });
        }

        $totalFiltered = $query->count();

        // Ensure column exists in table to avoid SQL errors
        if (!in_array($orderColumn, (new self)->getFillable()) && $orderColumn !== 'id') {
            $orderColumn = 'id';
        }

        $data = $query->offset($start)
            ->limit($limit)
            ->orderBy($orderColumn, $orderDir)
            ->get();

        return [
            'data' => $data,
            'recordsFiltered' => $totalFiltered,
            'recordsTotal' => self::whereIn('a_status', [0,1])->count(),
        ];
    }


    // -------------------------------
    // Add new associate
    // -------------------------------
    public function addAssociate(array $data, $file = null)
    {
        if ($file) {
            $imageService = new \App\Services\ImageUploadService();
            $result = $imageService->uploadImage('AssociateLogoUpload', $file, 1);

            if (!$result['status']) {
                throw new \Exception('Logo upload failed: ' . implode(', ', $result['error']));
            }

            $data['a_logo'] = $result['data']['filename']; // save path in DB
        }

        return $this->create($data); // Using Eloquent create
    }

    // -------------------------------
    // Update existing associate
    // -------------------------------
    public function updateAssociate(array $data, $file = null)
    {
        // Delete old logo first (before overwriting)
        if ($file && $this->a_logo && Storage::disk(config('filesystems.default'))->exists($this->a_logo)) {
            Storage::disk(config('filesystems.default'))->delete($this->a_logo);
        }

        // Handle file upload
        if ($file) {
            $imageService = new \App\Services\ImageUploadService();
            $result = $imageService->uploadImage('AssociateLogoUpload', $file, 1);

            if (!$result['status']) {
                throw new \Exception('Logo upload failed: ' . implode(', ', $result['error']));
            }

            $data['a_logo'] = $result['data']['filename']; // save new path
        }

        $this->update($data);
        return $this;
    }


    // -------------------------------
    // Delete associate
    // -------------------------------
    public static function softDelete(array $ids): array
    {
        $result = [
            'deleted_count' => 0,
            'warnings'      => [],
            'errors'        => [],
        ];

        if (empty($ids)) {
            return $result;
        }

        try {
            // Protect ID 1
            $ids = array_filter($ids, fn($id) => $id != 1);

            if (empty($ids)) {
                return $result;
            }

            // Fetch the selected associates
            $associates = self::whereIn('id', $ids)->get();

            $toDelete = [];

            // Fetch default associate once
            $defaultAssociate = self::getDefaultAssociate();
            if (!$defaultAssociate) {
                $result['errors'][] = "No default associate found.";
                return $result;
            }
            foreach ($associates as $associate) {
                // Only active items can be deleted
                // if ($associate->a_status != 1) {
                //     $result['warnings'][] = "Skipping '{$associate->a_company_name}' as it is not active.";
                //     continue;
                // }

                // Cannot delete default items
                if ($associate->a_default == 1) {
                    $result['errors'][] = "Cannot delete '{$associate->a_company_name}' because it is set as default.";
                    continue;
                }

                $toDelete[] = $associate->id;

                // Step 2: Find users linked to this associate
                $users = User::where('associates_id', $associate->id)->get();
                foreach ($users as $user) {
                    // Step 3: Update users table
                    $user->associates_id = $defaultAssociate->id;
                    $user->associate_commission = $defaultAssociate->a_commission_percentage;
                    $user->save();

                    // Step 4: Update Open Quotes for this user
                    Quotes::updateAssociateInfoForUser(
                        $user->id,
                        $defaultAssociate->id,
                        $defaultAssociate->a_commission_percentage
                    );

                    // Step 5: Update Open Orders for this user
                    Orders::updateAssociateInfoForUser(
                        $user->id,
                        $defaultAssociate->id,
                        $defaultAssociate->a_commission_percentage
                    );
                }

            }

            // Soft delte the associate
            if (!empty($toDelete)) {
                $result['deleted_count'] = self::whereIn('id', $toDelete)->update(['a_status' => config('constants.ASSOCIATE_STATUS.INACTIVE')]);
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('Associate soft delete failed: ' . $e->getMessage());
            $result['errors'][] = 'Internal server error occurred while deleting associates.';
            return $result;
        }
    }


    // -------------------------------
    // Check if company name exists
    // -------------------------------
    public function companyExists($companyName)
    {
        return self::where('a_company_name', $companyName)
            ->where('id', '!=', $this->id ?? 0)
            ->exists();
    }   

    // -------------------------------
    // Check if Short code exists
    // -------------------------------
    public function shortcodeExists($shortcode)
    {
        return self::where('a_short_code', $shortcode)
            ->where('id', '!=', $this->id ?? 0)
            ->exists();
    }


    // -------------------------------
    // Check if email exists
    // -------------------------------
    public function emailExists($email)
    {
        if (!$email) return false;

        return self::where('a_email', $email)
            ->where('id', '!=', $this->id ?? 0)
            ->exists();
    }

    // -------------------------------
    // GET DEFAULT ASSOCIATE
    // -------------------------------
    public static function getDefaultAssociate()
    {
        return self::where('a_default', 1)->first();
    }

    // LOGIC FOR FETCHING COMMISSION DATA
    public static function calculate_net_amount() {
        return '(
            COALESCE(o.delivery_charges,0)
            + COALESCE(o.insurance_charges,0)
            + COALESCE(o.accessory_charges,0)
            + COALESCE(CASE WHEN o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' THEN o.pickup_charges END, 0)
            + COALESCE(CASE WHEN o.is_audit_required IN ('.config('constants.AUDIT.APPROVED').','.config('constants.AUDIT.EDITED').') THEN o.extra_service_charges END, 0)
            + CASE
                    WHEN (o.is_absorb_order = "1" OR o.status = ' .config('constants.ORDER_STATUS.CANCELLED'). ') THEN 0.00
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' AND o.storage_waive = 0 AND o.storage_manually_override = 0 AND ocd.actual_delivery_date IS NULL)
                        THEN IF(DATEDIFF(CURDATE(), DATE_ADD(ocd.actual_pickup_date, INTERVAL o.storage_rule_days_o DAY)) > 0,
                                DATEDIFF(CURDATE(), DATE_ADD(ocd.actual_pickup_date, INTERVAL o.storage_rule_days_o DAY)) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' AND o.storage_waive = 0 AND o.storage_manually_override = 0 AND ocd.actual_delivery_date IS NOT NULL)
                        THEN IF(DATEDIFF(ocd.actual_delivery_date, DATE_ADD(ocd.actual_pickup_date, INTERVAL o.storage_rule_days_o DAY)) > 0,
                                DATEDIFF(ocd.actual_delivery_date, DATE_ADD(ocd.actual_pickup_date, INTERVAL o.storage_rule_days_o DAY)) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' AND o.storage_waive = 1 AND o.storage_manually_override = 0) THEN 0.00
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' AND o.storage_waive = 0 AND o.storage_manually_override = 1 AND ocd.actual_delivery_date IS NULL)
                        THEN IF(o.storage_override_date IS NOT NULL AND DATEDIFF(CURDATE(), o.storage_override_date) > 0,
                                DATEDIFF(CURDATE(), o.storage_override_date) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.PICKUP').' AND o.storage_waive = 0 AND o.storage_manually_override = 1 AND ocd.actual_delivery_date IS NOT NULL)
                        THEN IF(o.storage_override_date IS NOT NULL AND DATEDIFF(ocd.actual_delivery_date, o.storage_override_date) > 0,
                                DATEDIFF(ocd.actual_delivery_date, o.storage_override_date) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.RECEIVE_IN').' AND o.storage_waive = 0 AND o.storage_manually_override = 0 AND ocd.actual_delivery_date IS NULL)
                        THEN IF(DATEDIFF(CURDATE(), DATE_ADD(ocd.actual_arrival_date, INTERVAL o.storage_rule_days_o DAY)) > 0,
                                DATEDIFF(CURDATE(), DATE_ADD(ocd.actual_arrival_date, INTERVAL o.storage_rule_days_o DAY)) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.RECEIVE_IN').' AND o.storage_waive = 0 AND o.storage_manually_override = 0 AND ocd.actual_delivery_date IS NOT NULL)
                        THEN IF(DATEDIFF(ocd.actual_delivery_date, DATE_ADD(ocd.actual_arrival_date, INTERVAL o.storage_rule_days_o DAY)) > 0,
                                DATEDIFF(ocd.actual_delivery_date, DATE_ADD(ocd.actual_arrival_date, INTERVAL o.storage_rule_days_o DAY)) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.RECEIVE_IN').' AND o.storage_waive = 1 AND o.storage_manually_override = 0) THEN 0.00
                    WHEN (o.order_type = '.config('constants.ORDER_TYPE.RECEIVE_IN').' AND o.storage_waive = 0 AND o.storage_manually_override = 1 AND ocd.actual_delivery_date IS NULL)
                        THEN IF(o.storage_override_date IS NOT NULL AND DATEDIFF(CURDATE(), o.storage_override_date) > 0,
                                DATEDIFF(CURDATE(), o.storage_override_date) * o.storage_rule_amount_per_day_o, 0.00)
                    WHEN (o.order_type = ' .config('constants.ORDER_TYPE.RECEIVE_IN'). ' AND o.storage_waive = 0 AND o.storage_manually_override = 1 AND ocd.actual_delivery_date IS NOT NULL)
                        THEN IF(o.storage_override_date IS NOT NULL AND DATEDIFF(ocd.actual_delivery_date, o.storage_override_date) > 0,
                                DATEDIFF(ocd.actual_delivery_date, o.storage_override_date) * o.storage_rule_amount_per_day_o, 0.00)
                    ELSE 0.00
                END
            )';
    }

    public static function getCommissionData(array $data)
    {
        $associateId   = $data['associate_id'];
        $paymentStatus = $data['payment_status'] ?? '';
        $fromDate      = $data['from_date'] ?? null;
        $toDate        = $data['to_date'] ?? null;
        $searchTerm    = $data['search_term'] ?? '';
        $start         = $data['start'] ?? 0;
        $length        = $data['length'] ?? 10;
        $sortColumn    = $data['sort_column'] ?? null;
        $sortOrder     = $data['sort_order'] ?? 'desc';
        $context       = $data['context'] ?? 'ajax'; // 'ajax' or 'export'
        $columns       = $data['columns'] ?? [];

        $orderByColumn = $sortColumn !== null && isset($columns[$sortColumn]) ? $columns[$sortColumn] : 'o.created_at';

        $totalAmountFormula = self::calculate_net_amount();

        // Base Query
        $query = DB::table('orders AS o')
            ->join('users AS u', 'u.id', '=', 'o.users_id')
            ->join('associates AS a', 'a.id', '=', 'o.associates_id')
            ->leftJoin('payments AS p', 'p.orders_id', '=', 'o.id')
            ->leftJoin('order_critical_dates AS ocd', 'ocd.orders_id', '=', 'o.id')
            ->leftJoin('address_books AS ab', 'ab.id', '=', 'o.dest_address_id')
            ->select([
                'o.id AS orders_id',
                'u.name AS user_name',
                'ab.company_name AS destination_name', // fetch this data from : the selected order row contains a column names dest_address_id -> use this to get the row of address from table address_books -> once fethed that row select column company_name from adress book 
                'u.email AS user_email',
                'a.a_company_name AS associate_name',
                'a.a_short_code AS associate_short_code',
                'o.associate_commission AS commission_percentage',
                DB::raw("
                    $totalAmountFormula AS net_amount
                "),
                DB::raw("
                    (COALESCE(p.net_amount, 0) - COALESCE(o.cc_fees_value, 0)) AS paid_amount
                "), 
                DB::raw('COALESCE(p.status, ' . config('constants.PAYMENT_STATUS.PENDING') . ') AS payment_status'),
                'o.status AS order_status',
                'o.created_at',
                DB::raw("
                    ROUND(
                        (COALESCE(p.net_amount, 0) - COALESCE(o.cc_fees_value, 0)) * o.associate_commission / 100, 2
                    ) AS commission_value 
                "), // IF WE ALSO WANT TO CALCULATE THE COMMISION VALUE OF A PENDING ORDER WHOSE PAYMENT IS NOT MADE YET WE CAN JUST ADD THIS TOTALAMOUNTFORMULA IN ABOVE COALESCE
                DB::raw('COALESCE(p.txn_Datetime, NULL) AS transaction_date')
            ])
            ->where('a.id', $associateId)
            ->where('o.status', '!=', config('constants.ORDER_STATUS.CANCELLED'));

        // Payment Status Filter
        if ($paymentStatus !== '-1') {
            if ($paymentStatus === '' || $paymentStatus === null) {
                $query->whereIn('p.status', [
                    config('constants.PAYMENT_STATUS.PAID'),
                    config('constants.PAYMENT_STATUS.PREPAID')
                ]);
            } else {
                switch ($paymentStatus) {
                    case config('constants.PAYMENT_STATUS.PENDING'): 
                        $query->where(function($q){
                            $q->where('p.status', config('constants.PAYMENT_STATUS.PENDING'))
                            ->orWhereNull('p.id');
                        });
                        break;
                    default:
                        $query->where('p.status', intval($paymentStatus));
                }
            }
        }

        // Date Filter
        // if ($fromDate && $toDate) {
        //     $query->whereBetween('o.created_at', [$fromDate.' 00:00:00', $toDate.' 23:59:59']);
        // }
        // Date Filter Handling
        if ($fromDate && $toDate) {
            if (($data['date_filter_type'] ?? config('constants.DATE_FTILER_TYPE.ORDER_CREATED_ON')) == config('constants.DATE_FTILER_TYPE.PAYMENT_MADE_ON')) {
                // Only consider PAID / PREPAID orders having p.txn_datetime and paid amount > 0
                $query->whereNotNull('p.txn_datetime')
                    ->whereIn('p.status', [
                        config('constants.PAYMENT_STATUS.PAID'),
                        config('constants.PAYMENT_STATUS.PREPAID')
                    ])
                    ->whereBetween('p.txn_datetime', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
                    ->where(function ($q) {
                        $q->where('p.net_amount', '!=', 0.00)
                        ->whereNotNull('p.net_amount');
                    });

            } else {
                // Default = order.created_at
                $query->whereBetween('o.created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59']);
            }
        }


        // Global Search
        if ($context === 'ajax' && $searchTerm) {
            $query->where(function($q) use ($searchTerm, $totalAmountFormula){
                $q->where('o.id', 'like', "%{$searchTerm}%")
                ->orWhere('u.name', 'like', "%{$searchTerm}%")
                ->orWhere('ab.company_name', 'like', "%{$searchTerm}%")
                ->orWhere('u.email', 'like', "%{$searchTerm}%")
                ->orWhere('a.a_company_name', 'like', "%{$searchTerm}%")
                ->orWhere('a.a_short_code', 'like', "%{$searchTerm}%")
                ->orWhere('o.status', 'like', "%{$searchTerm}%")
                ->orWhere(DB::raw("(COALESCE(p.net_amount, 0) - COALESCE(o.cc_fees_value, 0))"), 'like', "%{$searchTerm}%")
                ->orWhere(DB::raw("COALESCE(p.net_amount, $totalAmountFormula)"), 'like', "%{$searchTerm}%");
            });
        }

        // Count records
        $totalRecords = DB::table('orders AS o')
            ->join('associates AS a', 'a.id', '=', 'o.associates_id')
            ->where('a.id', $associateId)
            ->where('o.status', '!=', config('constants.ORDER_STATUS.CANCELLED'))
            ->count(DB::raw('distinct o.id'));

        $filteredRecords = $query->count(DB::raw('distinct o.id'));

        // Total commission using formula
        $totalCommission = $query->sum(DB::raw('(COALESCE(p.net_amount, 0) - COALESCE(o.cc_fees_value, 0)) * o.associate_commission / 100'));

        // Handle sorting for paid_amount (deduct cc_fees_value)
        if ($orderByColumn === 'paid_amount') {
            $orderByColumn = '(COALESCE(p.net_amount, 0) - COALESCE(o.cc_fees_value, 0))';
        }
        // Pagination & Sorting
        if ($context === 'ajax') {
            $dataQuery = $query->orderByRaw("$orderByColumn $sortOrder")
                            ->offset($start)
                            ->limit($length)
                            ->get();
        } else {
            $dataQuery = $query->orderBy('o.created_at', 'desc')->get();
        }

        return [
            'data' => $dataQuery,
            'totalCommission' => $totalCommission,
            'totalRecords' => $totalRecords,
            'filteredRecords' => $filteredRecords,
        ];
    }

    /**
     * Get associates except the DEFAULT_ASSOCIATE_ID i.e. STS
     *
     */
    public static function getAssociatesExceptSTS()
    {
        return self::with(['clients:id,associates_id,name'])
                    ->where('id', '!=', config('constants.DEFAULT_ASSOCIATE_ID'))
                    ->where('a_status', '=', config('constants.ACTIVE'))->get();
    }
}
