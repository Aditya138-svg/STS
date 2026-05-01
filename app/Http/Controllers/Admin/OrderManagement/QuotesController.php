<?php

namespace App\Http\Controllers\Admin\OrderManagement;

use App\Http\Controllers\Controller;
use App\Models\Associate;
use App\Models\Quotes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class QuotesController extends Controller
{
    public function index(Request $request): Response
    {
        return $this->renderQuotesPage(
            $request,
            'Admin/OrderManagement/Quotes',
            'Quotes List'
        );
    }

    public function create(): Response
    {
        $defaultAssociate = Schema::hasTable('associates')
            ? Associate::query()->where('a_default', 1)->first()
            : null;

        return Inertia::render('Admin/OrderManagement/QuoteCreate', [
            'quoteCreate' => [
                'title' => 'Create Quote',
                'back_url' => url('/admin/order-management/quotes'),
                'submit_url' => url('/admin/order-management/quotes'),
                'csrf_token' => csrf_token(),
                'order_types' => [
                    ['value' => '1', 'label' => 'Pickup & Deliver'],
                    ['value' => '2', 'label' => 'Delivery'],
                    ['value' => '3', 'label' => 'Receive In & Deliver'],
                ],
                'referral_sources' => [
                    ['value' => 'existing_customer', 'label' => 'Existing Customer'],
                    ['value' => 'magazine', 'label' => 'Magazine'],
                    ['value' => 'newspaper', 'label' => 'Newspaper'],
                    ['value' => 'television', 'label' => 'Television'],
                    ['value' => 'tradeshow', 'label' => 'Tradeshow'],
                    ['value' => 'recommendation', 'label' => 'Recommendation'],
                    ['value' => 'internet', 'label' => 'Internet'],
                    ['value' => 'other', 'label' => 'Other'],
                ],
                'customers' => $this->quoteCustomerOptions(),
                'default_associate' => [
                    'company_name' => (string) ($defaultAssociate->a_company_name ?? 'FOX'),
                    'short_code' => (string) ($defaultAssociate->a_short_code ?? 'OOX'),
                ],
                'service_levels' => $this->serviceLevelOptions(),
                'deductibles' => [
                    ['value' => '0', 'label' => '$0'],
                    ['value' => '1', 'label' => '$250'],
                    ['value' => '2', 'label' => '$500'],
                    ['value' => '3', 'label' => '$1000'],
                ],
                'package_types' => [
                    ['value' => '1', 'label' => 'Blanket Wrap'],
                    ['value' => '2', 'label' => 'Carton'],
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!Schema::hasTable('quotes')) {
            return redirect()
                ->back()
                ->with('error', 'Quotes table was not found.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'order_type' => ['required'],
            'origin_zip' => ['required', 'string', 'max:20'],
            'dest_zip' => ['required', 'string', 'max:20'],
            'service_levels_id' => ['nullable'],
            'item_name' => ['nullable', 'array'],
            'item_name.*' => ['nullable', 'string', 'max:255'],
            'item_qty' => ['nullable', 'array'],
            'item_qty.*' => ['nullable', 'numeric', 'min:1'],
        ]);

        $quoteData = [];
        $serviceLevelId = $request->input('service_levels_id') ?: 1;
        $this->putIfColumn('quotes', $quoteData, 'users_id', $request->input('users_id'));
        $this->putIfColumn('quotes', $quoteData, 'company_name', $request->input('company_name'));
        $this->putIfColumn('quotes', $quoteData, 'name', $validated['name']);
        $this->putIfColumn('quotes', $quoteData, 'phone', $validated['phone']);
        $this->putIfColumn('quotes', $quoteData, 'email', $validated['email']);
        $this->putIfColumn('quotes', $quoteData, 'customer_ref', $request->input('customer_ref'));
        $this->putIfColumn('quotes', $quoteData, 'po_number', $request->input('po_number'));
        $this->putIfColumn('quotes', $quoteData, 'order_type', $validated['order_type']);
        $this->putIfColumn('quotes', $quoteData, 'pay_note', $request->input('pay_note'));
        $this->putIfColumn('quotes', $quoteData, 'origin_zip', $validated['origin_zip']);
        $this->putIfColumn('quotes', $quoteData, 'origin_is_residence', $request->boolean('origin_is_residence') ? 1 : 0);
        $this->putIfColumn('quotes', $quoteData, 'origin_company_name', $request->input('origin_company_name'));
        $this->putIfColumn('quotes', $quoteData, 'origin_contact_phone', $request->input('origin_contact_phone'));
        $this->putIfColumn('quotes', $quoteData, 'origin_contact_email', $request->input('origin_contact_email'));
        $this->putIfColumn('quotes', $quoteData, 'origin_addressline1', $request->input('origin_addressline1'));
        $this->putIfColumn('quotes', $quoteData, 'origin_city', $request->input('origin_city'));
        $this->putIfColumn('quotes', $quoteData, 'origin_state', $request->input('origin_state'));
        $this->putIfColumn('quotes', $quoteData, 'dest_zip', $validated['dest_zip']);
        $this->putIfColumn('quotes', $quoteData, 'dest_is_residence', $request->boolean('dest_is_residence') ? 1 : 0);
        $this->putIfColumn('quotes', $quoteData, 'dest_company_name', $request->input('dest_company_name'));
        $this->putIfColumn('quotes', $quoteData, 'dest_contact_phone', $request->input('dest_contact_phone'));
        $this->putIfColumn('quotes', $quoteData, 'dest_contact_email', $request->input('dest_contact_email'));
        $this->putIfColumn('quotes', $quoteData, 'dest_addressline1', $request->input('dest_addressline1'));
        $this->putIfColumn('quotes', $quoteData, 'dest_city', $request->input('dest_city'));
        $this->putIfColumn('quotes', $quoteData, 'dest_state', $request->input('dest_state'));
        $this->putIfColumn('quotes', $quoteData, 'service_levels_id', $serviceLevelId);
        $this->putIfColumn('quotes', $quoteData, 'valuation_coverage', $request->input('valuation_coverage') ?? 0);
        $this->putIfColumn('quotes', $quoteData, 'additional_valuation_declined', $request->boolean('additional_valuation_declined') ? 1 : 0);
        $this->putIfColumn('quotes', $quoteData, 'deductible', $request->input('deductible') ?? 0);
        $this->putIfColumn('quotes', $quoteData, 'distance', $request->input('distance', '0.00'));
        $this->putIfColumn('quotes', $quoteData, 'referral_source', $request->input('referral_source'));
        $this->putIfColumn('quotes', $quoteData, 'referral_by', $request->input('referral_by'));
        $this->putIfColumn('quotes', $quoteData, 'notes', $request->input('notes'));
        $this->putIfColumn('quotes', $quoteData, 'accessories', $this->accessoriesString($request));
        $this->putIfColumn('quotes', $quoteData, 'status', '1');
        $this->putIfColumn('quotes', $quoteData, 'associates_id', 1);
        $this->putIfColumn('quotes', $quoteData, 'associate_commission', 0);
        $this->putIfColumn('quotes', $quoteData, 'is_automatic', 1);
        $this->putIfColumn('quotes', $quoteData, 'discount_type', 0);
        $this->putIfColumn('quotes', $quoteData, 'discount_value', 0);
        $this->putIfColumn('quotes', $quoteData, 'is_price_lock', 0);
        $this->putIfColumn('quotes', $quoteData, 'price_lock_option', 0);
        $this->putIfColumn('quotes', $quoteData, 'is_read_response', 1);
        $this->putIfColumn('quotes', $quoteData, 'is_read_accept', 1);
        $this->putIfColumn('quotes', $quoteData, 'is_est_mail_sent', 0);
        $this->putIfColumn('quotes', $quoteData, 'inf_perc', 0);
        $this->putIfColumn('quotes', $quoteData, 'inf_amount', 0);
        $this->putIfColumn('quotes', $quoteData, 'fee_type', 'Delivery Fee');
        $this->putIfColumn('quotes', $quoteData, 'accessory_charge_type', 'Specials (See Accessorials)');
        $this->putIfColumn('quotes', $quoteData, 'num_of_items', array_sum(array_map('intval', $request->input('item_qty', []))));
        $this->putIfColumn('quotes', $quoteData, 'total_cubes', array_sum(array_map('floatval', $request->input('item_cubes', []))));
        if (Schema::hasColumn('quotes', 'created_at')) {
            $quoteData['created_at'] = now();
        }
        if (Schema::hasColumn('quotes', 'updated_at')) {
            $quoteData['updated_at'] = now();
        }

        try {
            $quoteId = DB::table('quotes')->insertGetId($quoteData);
            $this->storeQuoteItems($quoteId, $request);
        } catch (\Throwable $exception) {
            Log::error('Quote creation failed', [
                'message' => $exception->getMessage(),
                'quote_data' => $quoteData,
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Quote could not be created: '.$exception->getMessage());
        }

        return redirect()
            ->to(url('/admin/order-management/quotes'))
            ->with('success', 'Quote created successfully.');
    }

    public function show(int|string $quote): Response
    {
        if (!Schema::hasTable('quotes')) {
            abort(404);
        }

        $idCol = $this->firstExistingColumn('quotes', ['id', 'quote_id', 'q_id']) ?? 'id';
        $row = Quotes::query()
            ->where($idCol, $quote)
            ->firstOrFail();

        return Inertia::render('Admin/OrderManagement/QuoteView', [
            'quoteView' => $this->quoteViewData($row, $idCol),
        ]);
    }

    public function verifyZip(string $zip)
    {
        $zipInfo = DB::table('zipcodes_management')
            ->where('zipcode', $zip)
            ->first();

        if (!$zipInfo) {
            return response()->json(['found' => false]);
        }

        // We found the zip in management, so we service it.
        $result = [
            'found' => true,
            'city' => (string) ($zipInfo->city ?? ''),
            'state' => (string) ($zipInfo->state ?? ''),
            'addressline1' => '',
            'company_name' => '',
            'contact_phone' => '',
            'contact_email' => '',
        ];

        // Now try to pre-fill address details from previous quotes (if any)
        if (Schema::hasTable('quotes')) {
            $prev = DB::table('quotes')
                ->where(function($query) use ($zip) {
                    $query->where('origin_zip', $zip)
                          ->orWhere('dest_zip', $zip);
                })
                ->where(function($query) {
                    $query->whereNotNull('origin_addressline1')
                          ->where('origin_addressline1', '!=', '')
                          ->orWhereNotNull('dest_addressline1')
                          ->where('dest_addressline1', '!=', '');
                })
                ->orderBy('id', 'desc')
                ->first();

            if ($prev) {
                // Determine if it was origin or dest to get details
                if ($prev->origin_zip === $zip && !empty($prev->origin_addressline1)) {
                    $result['addressline1'] = (string) ($prev->origin_addressline1 ?? '');
                    $result['company_name'] = (string) ($prev->origin_company_name ?? '');
                    $result['contact_phone'] = (string) ($prev->origin_contact_phone ?? '');
                    $result['contact_email'] = (string) ($prev->origin_contact_email ?? '');
                    if (!empty($prev->origin_city)) $result['city'] = $prev->origin_city;
                    if (!empty($prev->origin_state)) $result['state'] = $prev->origin_state;
                } else if ($prev->dest_zip === $zip && !empty($prev->dest_addressline1)) {
                    $result['addressline1'] = (string) ($prev->dest_addressline1 ?? '');
                    $result['company_name'] = (string) ($prev->dest_company_name ?? '');
                    $result['contact_phone'] = (string) ($prev->dest_contact_phone ?? '');
                    $result['contact_email'] = (string) ($prev->dest_contact_email ?? '');
                    if (!empty($prev->dest_city)) $result['city'] = $prev->dest_city;
                    if (!empty($prev->dest_state)) $result['state'] = $prev->dest_state;
                }
            }
        }

        return response()->json($result);
    }

    private function renderQuotesPage(
        Request $request,
        string $page,
        string $title
    ): Response {
        $status = (string) $request->query('status', '');
        $rows = $this->rows($status);

        $statusOptions = collect($rows)
            ->map(fn (array $row): array => [
                'value' => (string) ($row['status_raw'] ?? $row['status'] ?? ''),
                'label' => (string) ($row['status'] ?? ''),
            ])
            ->filter(fn (array $row): bool => $row['value'] !== '' && $row['label'] !== '')
            ->unique('value')
            ->values()
            ->all();

        return Inertia::render($page, [
            'quotesPage' => [
                'title' => $title,
                'rows' => $rows,
                'status_options' => $statusOptions,
                'status_filter' => $status,
            ],
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function rows(string $statusFilter): array
    {
        if (!Schema::hasTable('quotes')) {
            return [];
        }

        $idCol = $this->firstExistingColumn('quotes', ['id', 'quote_id', 'q_id']) ?? 'id';
        $orderIdCol = $this->firstExistingColumn('quotes', ['order_id', 'related_order_id']);
        $typeCol = $this->firstExistingColumn('quotes', ['order_type', 'type', 'quote_type']);
        $companyCol = $this->firstExistingColumn('quotes', ['company_name', 'company']);
        $nameCol = $this->firstExistingColumn('quotes', ['name', 'contact_name', 'customer_name']);
        $phoneCol = $this->firstExistingColumn('quotes', ['phone', 'contact_phone', 'telephone']);
        $emailCol = $this->firstExistingColumn('quotes', ['email', 'contact_email']);
        $poNumCol = $this->firstExistingColumn('quotes', ['po_number', 'po_num', 'purchase_order']);
        $originZipCol = $this->firstExistingColumn('quotes', ['origin_zip', 'origin_zipcode', 'zipcode_origin']);
        $originResCol = $this->firstExistingColumn('quotes', ['origin_is_residence', 'origin_residential', 'is_residence_origin']);
        $destZipCol = $this->firstExistingColumn('quotes', ['dest_zip', 'dest_zipcode', 'zipcode_dest']);
        $destResCol = $this->firstExistingColumn('quotes', ['dest_is_residence', 'dest_residential', 'is_residence_dest']);
        $distanceCol = $this->firstExistingColumn('quotes', ['distance', 'distance_miles', 'miles']);
        $itemsCol = $this->firstExistingColumn('quotes', ['num_of_items', 'item_count', 'items_count']);
        $cubesCol = $this->firstExistingColumn('quotes', ['total_cubes', 'cubes', 'total_cube']);
        $createdAtCol = $this->firstExistingColumn('quotes', ['created_at', 'created_date', 'quote_date']);
        $statusCol = $this->firstExistingColumn('quotes', ['status', 'quote_status', 'state']);
        $totalCol = $this->firstExistingColumn('quotes', ['total', 'total_amount', 'amount', 'grand_total']);

        $query = Quotes::query();

        if ($statusCol !== null && $statusFilter !== '') {
            $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) = ?", [strtolower($statusFilter)]);
        }

        $rows = $query
            ->orderByDesc($idCol)
            ->limit(200)
            ->get();
        $itemTotals = $this->quoteItemTotals($rows->pluck($idCol)->map(fn ($id): int => (int) $id)->all());

        return $rows->map(function ($row) use (
            $idCol,
            $orderIdCol,
            $typeCol,
            $companyCol,
            $nameCol,
            $phoneCol,
            $emailCol,
            $poNumCol,
            $originZipCol,
            $originResCol,
            $destZipCol,
            $destResCol,
            $distanceCol,
            $itemsCol,
            $cubesCol,
            $createdAtCol,
            $statusCol,
            $totalCol,
            $itemTotals
        ): array {
            $quoteId = (int) ($row->{$idCol} ?? 0);
            $originIsResidence = $originResCol ? (bool) ($row->{$originResCol} ?? false) : false;
            $destIsResidence = $destResCol ? (bool) ($row->{$destResCol} ?? false) : false;
            $distance = $distanceCol ? ($row->{$distanceCol} ?? null) : null;
            $items = $itemTotals[$quoteId]['items'] ?? ($itemsCol ? ($row->{$itemsCol} ?? 0) : 0);
            $cubes = $itemTotals[$quoteId]['cubes'] ?? ($cubesCol ? ($row->{$cubesCol} ?? 0) : 0);
            $createdAt = $createdAtCol ? ($row->{$createdAtCol} ?? null) : null;
            $status = $statusCol ? ($row->{$statusCol} ?? '') : '';
            $total = $totalCol ? ($row->{$totalCol} ?? 0) : 0;

            // Format contact details inline
            $company = $companyCol ? ($row->{$companyCol} ?? '') : '';
            $contactName = $nameCol ? ($row->{$nameCol} ?? '') : '';
            $phone = $phoneCol ? ($row->{$phoneCol} ?? '') : '';
            $email = $emailCol ? ($row->{$emailCol} ?? '') : '';
            $poNum = $poNumCol ? ($row->{$poNumCol} ?? '') : '';
            
            $contactDetails = [];
            if ($company) $contactDetails[] = "Company: {$company}";
            if ($contactName) $contactDetails[] = "Contact: {$contactName}";
            if ($phone) $contactDetails[] = "Phone: {$phone}";
            if ($email) $contactDetails[] = "Email: {$email}";
            if ($poNum) $contactDetails[] = "PO: {$poNum}";
            $contactDetailsStr = implode(' | ', $contactDetails) ?: '-';

            // Format origin inline
            $originZip = $originZipCol ? ($row->{$originZipCol} ?? '') : '';
            $originParts = [];
            if ($originZip) $originParts[] = "Zip: {$originZip}";
            $originParts[] = $originIsResidence ? 'Yes' : 'No';
            $originStr = implode(' | ', $originParts);

            // Format destination inline
            $destZip = $destZipCol ? ($row->{$destZipCol} ?? '') : '';
            $destParts = [];
            if ($destZip) $destParts[] = "Zip: {$destZip}";
            $destParts[] = $destIsResidence ? 'Yes' : 'No';
            $destStr = implode(' | ', $destParts);

            return [
                'id' => $quoteId,
                'order_id' => $orderIdCol ? (string) ($row->{$orderIdCol} ?? '') : '',
                'order_type' => $typeCol ? $this->orderTypeLabel($row->{$typeCol} ?? '') : '',
                'contact_details' => $contactDetailsStr,
                'origin' => $originStr,
                'destination' => $destStr,
                'distance' => $distance !== null && $distance > 0 ? $distance . ' mile(s)' : '-',
                'items' => (string) $items,
                'cubes' => (string) $cubes,
                'created_at' => $createdAt ? date('Y-m-d H:i:s', strtotime($createdAt)) : '-',
                'status' => $this->quoteStatusLabel($status),
                'status_raw' => (string) $status,
                'total' => $total > 0 ? '$' . number_format($total, 2) : '-',
            ];
        })->all();
    }

    private function quoteStatusLabel(mixed $status): string
    {
        $value = trim((string) $status);

        return match ($value) {
            '0' => 'Pending Our Action',
            '1' => 'Pending Our Action',
            '2' => 'Approved',
            '3' => 'Declined',
            '4' => 'Closed',
            '5' => 'Closed',
            default => $value,
        };
    }

    private function fillIfColumn(Quotes $quote, string $column, mixed $value): void
    {
        if (Schema::hasColumn('quotes', $column)) {
            $quote->{$column} = $value;
        }
    }

    private function accessoriesString(Request $request): string
    {
        return implode(',', [
            'REQ_ASSEMBLY|'.($request->boolean('assembly_req') ? '1' : '0'),
            'REQ_CRATING|'.($request->boolean('crating_req') ? '1' : '0'),
            'REQ_PACKAGING|'.($request->boolean('packaging_req') ? '1' : '0'),
            'REQ_UNPACKAGING|'.($request->boolean('unpackaging_req') ? '1' : '0'),
            'REQ_STAIR_CARRY|'.($request->boolean('stair_carry_req') ? '1' : '0'),
            'NUM_OF_FLIGHTS|'.(string) $request->input('num_of_flights', 0),
        ]);
    }

    private function storeQuoteItems(int $quoteId, Request $request): void
    {
        $itemTable = $this->firstExistingTable(['quote_items', 'quotes_items', 'quote_item']);
        if ($itemTable === null) {
            return;
        }

        $quoteIdCol = $this->firstExistingColumn($itemTable, ['quotes_id', 'quote_id', 'q_id']);
        if ($quoteIdCol === null) {
            return;
        }

        if (Schema::hasColumn($itemTable, 'items_id') && !Schema::hasColumn($itemTable, 'item_name')) {
            return;
        }

        $names = $request->input('item_name', []);

        foreach ($names as $index => $name) {
            if (trim((string) $name) === '') {
                continue;
            }

            $data = [$quoteIdCol => $quoteId];
            $this->putIfColumn($itemTable, $data, 'package_type', $request->input("package_type.$index"));
            $this->putIfColumn($itemTable, $data, 'item_name', $name);
            $this->putIfColumn($itemTable, $data, 'length', $request->input("item_length.$index"));
            $this->putIfColumn($itemTable, $data, 'width', $request->input("item_width.$index"));
            $this->putIfColumn($itemTable, $data, 'height', $request->input("item_height.$index"));
            $this->putIfColumn($itemTable, $data, 'weight', $request->input("item_weight.$index"));
            $this->putIfColumn($itemTable, $data, 'quantity', $request->input("item_qty.$index"));
            $this->putIfColumn($itemTable, $data, 'cube', $request->input("item_cubes.$index"));
            $this->putIfColumn($itemTable, $data, 'has_marble_or_stone', isset($request->input('item_has_marble_or_stone', [])[$index]) ? 1 : 0);

            if (Schema::hasColumn($itemTable, 'created_at')) {
                $data['created_at'] = now();
            }
            if (Schema::hasColumn($itemTable, 'updated_at')) {
                $data['updated_at'] = now();
            }

            DB::table($itemTable)->insert($data);
        }
    }

    private function putIfColumn(string $table, array &$data, string $column, mixed $value): void
    {
        if (Schema::hasColumn($table, $column)) {
            $data[$column] = $value;
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function quoteCustomerOptions(): array
    {
        if (!Schema::hasTable('users')) {
            return [];
        }

        $select = ['users.id', 'users.name', 'users.email'];
        $select[] = Schema::hasColumn('users', 'username') ? 'users.username' : DB::raw("'' as username");
        $select[] = Schema::hasColumn('users', 'phone1') ? 'users.phone1 as phone' : DB::raw("'' as phone");
        $select[] = Schema::hasColumn('users', 'company_name') ? 'users.company_name' : DB::raw("'' as company_name");

        if (Schema::hasTable('associates') && Schema::hasColumn('users', 'associates_id')) {
            $select[] = 'associates.a_company_name as associate_company_name';
            $select[] = 'associates.a_short_code as associate_short_code';

            $query = User::query()
                ->leftJoin('associates', 'associates.id', '=', 'users.associates_id')
                ->select($select);
        } else {
            $select[] = DB::raw("'' as associate_company_name");
            $select[] = DB::raw("'' as associate_short_code");

            $query = User::query()->select($select);
        }

        return $query
            ->orderBy('users.name')
            ->limit(500)
            ->get()
            ->map(fn ($user): array => [
                'id' => (string) $user->id,
                'name' => (string) ($user->name ?? ''),
                'username' => (string) ($user->username ?? ''),
                'email' => (string) ($user->email ?? ''),
                'phone' => (string) ($user->phone ?? ''),
                'company_name' => (string) ($user->company_name ?? ''),
                'associate_company_name' => (string) ($user->associate_company_name ?? ''),
                'associate_short_code' => (string) ($user->associate_short_code ?? ''),
                'display_name' => trim(implode(' - ', array_filter([
                    (string) (($user->name ?? '') ?: ($user->username ?? '')),
                    (string) ($user->email ?? ''),
                ]))),
            ])
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function serviceLevelOptions(): array
    {
        if (!Schema::hasTable('service_levels')) {
            return [['value' => '1', 'label' => 'Standard']];
        }

        $nameCol = $this->firstExistingColumn('service_levels', ['service_name', 'name', 'title']);

        $levels = DB::table('service_levels')
            ->select(['id', DB::raw(($nameCol ? $nameCol : 'id').' as label')])
            ->orderBy($nameCol ?? 'id')
            ->get()
            ->map(fn ($level): array => [
                'value' => (string) $level->id,
                'label' => (string) $level->label,
            ])
            ->all();

        return $levels ?: [['value' => '1', 'label' => 'Standard']];
    }

    /**
     * @return array<string, mixed>
     */
    private function quoteViewData(Quotes $quote, string $idCol): array
    {
        $rawStatus = (string) ($this->value($quote, ['status', 'quote_status', 'state']) ?? '');
        $orderType = $this->value($quote, ['order_type', 'type', 'quote_type']);
        $items = $this->quoteItems((int) ($quote->{$idCol} ?? 0));
        $delivery = (float) ($this->value($quote, ['delivery_charges', 'delivery_charge']) ?? 0);
        $insurance = (float) ($this->value($quote, ['insurance_charges', 'insurance_val', 'insurance_charge']) ?? 0);
        $accessory = (float) ($this->value($quote, ['accessory_charges', 'accessorial_charges']) ?? 0);
        $pickup = (float) ($this->value($quote, ['pickup_charges', 'pickup_charge']) ?? 0);
        $total = (float) ($this->value($quote, ['total', 'total_amount', 'amount', 'grand_total']) ?? ($delivery + $insurance + $accessory + $pickup));

        return [
            'title' => 'Quote View',
            'id' => (int) ($quote->{$idCol} ?? 0),
            'created_at' => $this->dateValue($this->value($quote, ['created_at', 'created_date', 'quote_date'])),
            'status' => $this->quoteStatusLabel($rawStatus),
            'status_raw' => $rawStatus,
            'can_make_order' => in_array($rawStatus, ['0', '1', '2'], true),
            'can_edit' => in_array($rawStatus, ['0', '1'], true),
            'general' => [
                'company_name' => $this->stringValue($this->value($quote, ['company_name', 'company'])),
                'name' => $this->stringValue($this->value($quote, ['name', 'contact_name', 'customer_name'])),
                'phone' => $this->stringValue($this->value($quote, ['phone', 'contact_phone', 'telephone'])),
                'email' => $this->stringValue($this->value($quote, ['email', 'contact_email'])),
                'customer_ref' => $this->stringValue($this->value($quote, ['customer_ref', 'customer_reference'])),
                'po_number' => $this->stringValue($this->value($quote, ['po_number', 'po_num', 'purchase_order'])),
                'order_type' => $this->orderTypeLabel($orderType),
                'associate' => $this->stringValue($this->value($quote, ['a_company_name', 'associate', 'associate_name'])),
                'associate_short_code' => $this->stringValue($this->value($quote, ['a_short_code', 'associate_short_code'])),
                'associate_commission' => $this->stringValue($this->value($quote, ['associate_commission'])),
                'service_level' => $this->stringValue($this->value($quote, ['service_name', 'service_level', 'service_levels_id'])),
                'referral_source' => $this->stringValue($this->value($quote, ['referral_source'])),
                'referral_by' => $this->stringValue($this->value($quote, ['referral_by'])),
                'pay_note' => $this->stringValue($this->value($quote, ['pay_note'])),
            ],
            'origin' => $this->addressBlock($quote, 'origin'),
            'destination' => $this->addressBlock($quote, 'dest'),
            'distance' => $this->stringValue($this->value($quote, ['distance', 'distance_miles', 'miles'])),
            'items' => $items,
            'valuation' => [
                'coverage' => (float) ($this->value($quote, ['valuation_coverage']) ?? 0),
                'deductible' => $this->stringValue($this->value($quote, ['deductible', 'additional_valuation_declined'])),
            ],
            'accessorials' => $this->accessorials($this->value($quote, ['accessories'])),
            'notes' => $this->stringValue($this->value($quote, ['notes'])),
            'pricing' => [
                'is_automatic' => (string) ($this->value($quote, ['is_automatic']) ?? ''),
                'is_price_lock' => (bool) ($this->value($quote, ['is_price_lock']) ?? false),
                'price_model' => $this->stringValue($this->value($quote, ['price_model'])),
                'discount_type' => (string) ($this->value($quote, ['discount_type']) ?? '0'),
                'discount_value' => (float) ($this->value($quote, ['discount_value']) ?? 0),
                'delivery_charges' => $delivery,
                'insurance_charges' => $insurance,
                'accessory_charges' => $accessory,
                'pickup_charges' => $pickup,
                'total_amount' => $total,
            ],
            'urls' => [
                'back' => url('/admin/order-management/quotes'),
                'edit' => url('/admin/order-management/quotes/'.$quote->{$idCol}.'/edit'),
                'make_order' => url('/admin/order-management/quotes/'.$quote->{$idCol}.'/make-order'),
            ],
        ];
    }

    private function value(Quotes $quote, array $columns): mixed
    {
        foreach ($columns as $column) {
            if (array_key_exists($column, $quote->getAttributes())) {
                return $quote->{$column};
            }
        }

        return null;
    }

    private function stringValue(mixed $value): string
    {
        return trim((string) ($value ?? ''));
    }

    private function dateValue(mixed $value): string
    {
        return $value ? date('m/d/Y h:i A', strtotime((string) $value)) : '';
    }

    private function orderTypeLabel(mixed $value): string
    {
        return match (trim((string) $value)) {
            '1' => "Pickup\n& Deliver",
            '2' => 'Delivery',
            '3' => "Receive In\n& Deliver",
            default => $this->stringValue($value),
        };
    }

    /**
     * @param array<int, int> $quoteIds
     * @return array<int, array{items: int, cubes: float}>
     */
    private function quoteItemTotals(array $quoteIds): array
    {
        $quoteIds = array_values(array_unique(array_filter($quoteIds)));
        $itemTable = $this->firstExistingTable(['quote_items', 'quotes_items', 'quote_item']);

        if (empty($quoteIds) || $itemTable === null) {
            return [];
        }

        $quoteIdCol = $this->firstExistingColumn($itemTable, ['quotes_id', 'quote_id', 'q_id']);
        if ($quoteIdCol === null) {
            return [];
        }

        $quantityCol = $this->firstExistingColumn($itemTable, ['quantity', 'qty', 'item_quantity']);
        $cubeCol = $this->firstExistingColumn($itemTable, ['cube', 'cubes', 'total_cube', 'total_cubes']);

        return DB::table($itemTable)
            ->whereIn($quoteIdCol, $quoteIds)
            ->get()
            ->groupBy($quoteIdCol)
            ->mapWithKeys(function ($items, int|string $quoteId) use ($quantityCol, $cubeCol): array {
                $quantity = $quantityCol
                    ? $items->sum(fn ($item): int => (int) ($item->{$quantityCol} ?? 0))
                    : $items->count();
                $cubes = $cubeCol
                    ? $items->sum(fn ($item): float => (float) ($item->{$cubeCol} ?? 0))
                    : 0;

                return [(int) $quoteId => [
                    'items' => (int) $quantity,
                    'cubes' => (float) $cubes,
                ]];
            })
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private function addressBlock(Quotes $quote, string $prefix): array
    {
        $zip = $this->stringValue($this->value($quote, [$prefix.'_zip', $prefix.'_zipcode', 'zipcode_'.$prefix]));
        $city = $this->stringValue($this->value($quote, [$prefix.'_city']));
        $state = $this->stringValue($this->value($quote, [$prefix.'_state']));
        $residence = (bool) ($this->value($quote, [$prefix.'_is_residence', $prefix.'_residential', 'is_residence_'.$prefix]) ?? false);

        return [
            'company_name' => $this->stringValue($this->value($quote, [$prefix.'_company_name'])),
            'phone' => $this->stringValue($this->value($quote, [$prefix.'_contact_phone'])),
            'email' => $this->stringValue($this->value($quote, [$prefix.'_contact_email'])),
            'addressline1' => $this->stringValue($this->value($quote, [$prefix.'_addressline1', $prefix.'_address_line_1'])),
            'city' => $city,
            'state' => $state,
            'zip' => $zip,
            'detail' => implode(', ', array_filter([$city, $state, $zip])),
            'type' => $residence ? 'Residence' : '',
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function quoteItems(int $quoteId): array
    {
        $itemTable = $this->firstExistingTable(['quote_items', 'quotes_items', 'quote_item']);
        if ($quoteId <= 0 || $itemTable === null) {
            return [];
        }

        $quoteIdCol = $this->firstExistingColumn($itemTable, ['quotes_id', 'quote_id', 'q_id']);
        if ($quoteIdCol === null) {
            return [];
        }

        return DB::table($itemTable)
            ->where($quoteIdCol, $quoteId)
            ->get()
            ->map(fn ($item): array => [
                'package_type' => $this->itemValue($item, ['package_type', 'pkg_type']),
                'description' => $this->itemValue($item, ['item_name', 'description', 'name']),
                'length' => $this->itemValue($item, ['length']),
                'width' => $this->itemValue($item, ['width']),
                'height' => $this->itemValue($item, ['height']),
                'weight' => (float) ($this->itemValue($item, ['weight']) ?: 0),
                'quantity' => (int) ($this->itemValue($item, ['quantity', 'qty']) ?: 0),
                'cube' => $this->itemValue($item, ['cube', 'cubes']),
                'has_marble_or_stone' => (bool) ($this->itemValue($item, ['has_marble_or_stone', 'has_marble_or_stones']) ?: false),
            ])
            ->all();
    }

    private function itemValue(object $row, array $columns): mixed
    {
        foreach ($columns as $column) {
            if (property_exists($row, $column)) {
                return $row->{$column};
            }
        }

        return '';
    }

    /**
     * @return array<string, string>
     */
    private function accessorials(mixed $raw): array
    {
        $labels = [
            'REQ_ASSEMBLY' => 'Assembly Required',
            'REQ_CRATING' => 'Crating Required',
            'REQ_PACKAGING' => 'Packaging Required',
            'REQ_UNPACKAGING' => 'Unpackaging Required',
            'REQ_STAIR_CARRY' => 'Stair Carry Required',
            'NUM_OF_FLIGHTS' => 'Number Of Flights',
        ];
        $out = array_fill_keys(array_keys($labels), 'No');
        $out['NUM_OF_FLIGHTS'] = '0';

        foreach (explode(',', (string) $raw) as $pair) {
            [$key, $value] = array_pad(explode('|', $pair, 2), 2, '');
            $key = trim($key);
            if ($key !== '' && array_key_exists($key, $out)) {
                $out[$key] = $key === 'NUM_OF_FLIGHTS' ? (string) $value : (!empty($value) ? 'Yes' : 'No');
            }
        }

        return collect($out)
            ->mapWithKeys(fn (string $value, string $key): array => [$labels[$key] => $value])
            ->all();
    }

    /**
     * @param array<int, string> $columns
     */
    private function firstExistingColumn(string $table, array $columns): ?string
    {
        if (!Schema::hasTable($table)) {
            return null;
        }

        foreach ($columns as $column) {
            if (Schema::hasColumn($table, $column)) {
                return $column;
            }
        }

        return null;
    }

    /**
     * @param array<int, string> $tables
     */
    private function firstExistingTable(array $tables): ?string
    {
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                return $table;
            }
        }

        return null;
    }
}
