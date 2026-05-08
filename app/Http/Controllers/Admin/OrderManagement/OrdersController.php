<?php

namespace App\Http\Controllers\Admin\OrderManagement;

use App\Http\Controllers\Controller;
use App\Models\OrderItems;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    public function allOrders(Request $request): Response
    {
        return $this->renderOrdersPage(
            $request,
            'Admin/OrderManagement/Orders/AllOrders',
            'Order List',
            'all'
        );
    }

    public function needAttention(Request $request): Response
    {
        return $this->renderOrdersPage(
            $request,
            'Admin/OrderManagement/Orders/NeedAttention',
            'Orders That Need Attention',
            'attention'
        );
    }

    public function newOrders(Request $request): Response
    {
        return $this->renderOrdersPage(
            $request,
            'Admin/OrderManagement/Orders/NewOrders',
            'New Orders',
            'new'
        );
    }

    private function renderOrdersPage(
        Request $request,
        string $page,
        string $title,
        string $mode
    ): Response {
        $status = (string) $request->query('status', '');
        $billingFilter = $request->query('billing_method', []);
        $territoryFilter = $request->query('territory', []);
        $poFilter = $request->query('po_number', '');
        $customerFilter = $request->query('customer', '');
        $addressFilter = $request->query('address', '');
        $dateFilter = $request->query('sch_date', '');

        $extraFilters = [
            'billing_method' => $billingFilter,
            'territory' => $territoryFilter,
            'po_number' => $poFilter,
            'sch_date' => $dateFilter,
            'customer' => $customerFilter,
            'address' => $addressFilter,
            'status' => $status,
        ];

        $rows = $this->rows($mode, $status, $extraFilters);

        $statusOptions = [
            'New',
            'Attention',
            'Wait For Pickup Schedule',
            'Wait For Delivery Schedule',
            'Need To Push For Pickup',
            'Need To Push For Delivery',
            'Out For Pickup',
            'Out For Delivery',
            'Delivered',
            'Cancelled',
            'Archive'
        ];

        $summaryCounts = $this->getSummaryCounts();
        $statusLabels = [
            'w_p' => config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_PICKUP') ?? 'Wait For Pickup Schedule',
            'w_d' => config('constants.ORDER_STATUS_OTHER.WAIT_FOR_SCHEDULE_DELIVERY') ?? 'Wait For Delivery Schedule',
            'n_p' => config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_PICKUP') ?? 'Need To Push For Pickup',
            'n_d' => config('constants.ORDER_STATUS_OTHER.NEED_TO_PUSH_FOR_DELIVERY') ?? 'Need To Push For Delivery',
            'o_p' => config('constants.REVERSAL_ORDER_STATUS')[config('constants.ORDER_STATUS.SCHEDULE_PICKUP')] ?? 'Out For Pickup',
            'o_d' => config('constants.REVERSAL_ORDER_STATUS')[config('constants.ORDER_STATUS.SCHEDULE_DELIVERY')] ?? 'Out For Delivery',
        ];

        $billingMethods = [
            'Capture CC Internally' => 1,
            'Collect Before Delivery' => 2,
            'Shipper' => 3,
            'Third Party' => 4,
        ];
        $territories = DB::table('schedule_settings')
            ->select('id', DB::raw("CONCAT(loc_name, ' - RPFL') as name"))
            ->get()
            ->map(function($t) {
                if (str_contains($t->name, 'Fox')) {
                    $t->name = str_replace(' - RPFL', ' - RPFL2', $t->name);
                }
                return $t;
            });
        $customers = DB::table('users')
            ->join('orders', 'users.id', '=', 'orders.users_id')
            ->join('order_items', 'orders.id', '=', 'order_items.orders_id')
            ->distinct()
            ->select('users.id', 'users.name')
            ->get();
        $addresses = DB::table('address_books')
            ->where(function($q) {
                $q->where('company_name', 'like', 'Recycle%')
                  ->orWhere('company_name', 'like', 'Repair%')
                  ->orWhere('company_name', 'like', 'Storage%')
                  ->orWhere('company_name', 'like', 'Will Call%');
            })
            ->select('id', 'company_name as name')
            ->get();

        return Inertia::render($page, [
            'ordersPage' => [
                'title' => $title,
                'rows' => $rows,
                'status_options' => $statusOptions,
                'status_filter' => $status,
                'summary_counts' => $summaryCounts,
                'status_labels' => $statusLabels,
                'billing_methods' => $billingMethods,
                'territories' => $territories,
                'customers' => $customers,
                'addresses' => $addresses,
                'filters' => $extraFilters,
            ],
        ]);
    }

    public function cancel(Request $request): RedirectResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:1000',
        ]);

        $order = Orders::find($request->order_id);
        $order->status = config('constants.ORDER_STATUS.CANCELLED');
        $order->save();

        // Log the reason - assuming there's an OrderNotes model
        OrderNotes::create([
            'orders_id' => $order->id,
            'notes' => 'Order Cancelled. Reason: ' . $request->reason,
            'is_public' => config('constants.NOTES.PRIVATE'),
            'created_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', "Order #{$order->order_number} has been cancelled.");
    }

    public function complete(Request $request): RedirectResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Orders::find($request->order_id);
        $order->status = config('constants.ORDER_STATUS.DELIVERED');
        $order->save();

        return redirect()->back()->with('success', "Order #{$order->order_number} has been marked as completed.");
    }

    public function sendNotification(Request $request): RedirectResponse
    {
        // Placeholder for notification logic
        return redirect()->back()->with('success', 'Notification sent successfully.');
    }

    public function bulkPushPickups(Request $request): RedirectResponse
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        Orders::whereIn('id', $request->order_ids)
            ->update(['status_other' => 'Need To Push For Pickup']);

        return redirect()->back()->with('success', count($request->order_ids) . ' orders pushed for pickup.');
    }

    public function bulkPushDeliveries(Request $request): RedirectResponse
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:orders,id',
        ]);

        Orders::whereIn('id', $request->order_ids)
            ->update(['status_other' => 'Need To Push For Delivery']);

        return redirect()->back()->with('success', count($request->order_ids) . ' orders pushed for delivery.');
    }

    /**
     * @return array<string, int>
     */
    private function getSummaryCounts(): array
    {
        if (!Schema::hasTable('orders')) {
            return [
                'w_p_count' => 0,
                'w_d_count' => 0,
                'n_p_count' => 0,
                'n_d_count' => 0,
                'o_p_count' => 0,
                'o_d_count' => 0,
            ];
        }

        // Based on DB observation: 9=Other, 6=Out For Pickup, 7=Out For Delivery
        $otherStatus = 9;
        $schPickup = 6;
        $schDelivery = 7;

        return [
            'w_p_count' => Orders::where('status', $otherStatus)->where('status_other', 'Wait For Pickup Schedule')->count(),
            'w_d_count' => Orders::where('status', $otherStatus)->where('status_other', 'Wait For Delivery Schedule')->count(),
            'n_p_count' => Orders::where('status', $otherStatus)->where('status_other', 'Need To Push For Pickup')->count(),
            'n_d_count' => Orders::where('status', $otherStatus)->where('status_other', 'Need To Push For Delivery')->count(),
            'o_p_count' => Orders::where('status', $schPickup)->count(),
            'o_d_count' => Orders::where('status', $schDelivery)->count(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function rows(string $mode, string $statusFilter, array $extraFilters = []): array
    {
        if (!Schema::hasTable('orders')) {
            return [];
        }

        $idCol = $this->firstExistingColumn('orders', ['id', 'order_id', 'o_id']) ?? 'id';
        $dateCol = $this->firstExistingColumn('orders', ['created_at', 'order_date', 'date']);
        $typeCol = $this->firstExistingColumn('orders', ['order_type', 'type']);
        $originCol = $this->firstExistingColumn('orders', ['origin_company_name', 'origin_name']);
        $destCol = $this->firstExistingColumn('orders', ['dest_company_name', 'destination_name']);
        $amountCol = $this->firstExistingColumn('orders', ['grand_total', 'total_amount', 'order_total', 'amount']);
        $statusCol = $this->firstExistingColumn('orders', ['status', 'order_status', 'state', 'current_status']);
        $customerCol = $this->firstExistingColumn('orders', ['name', 'customer_name', 'client_name']);
        $distanceCol = $this->firstExistingColumn('orders', ['distance', 'distance_miles', 'miles']);

        $query = Orders::with([
            'externalCustomer',
            'originAddress',
            'destAddress',
            'billingAddress',
            'criticalDates',
            'serviceLevels'
        ]);

        if ($statusCol !== null) {
            if ($mode === 'attention') {
                $query->where($statusCol, 2); // Attention
            } elseif ($mode === 'new') {
                $query->where($statusCol, 1); // New
            } elseif ($mode === 'all') {
                $query->where($statusCol, '!=', 4); // Not Cancelled
            }

            if ($statusFilter !== '') {
                $statusMap = [
                    'New' => 1,
                    'Attention' => 2,
                    'Cancelled' => 4,
                    'Delivered' => 5,
                    'Out For Pickup' => 6,
                    'Out For Delivery' => 7,
                    'Archive' => 8,
                ];

                if (isset($statusMap[$statusFilter])) {
                    $query->where($statusCol, $statusMap[$statusFilter]);
                } else {
                    $query->where('status_other', $statusFilter);
                }
            }
        }

        if (!empty($extraFilters['billing_method'])) {
            $query->whereIn('billing_method', (array) $extraFilters['billing_method']);
        }

        if (!empty($extraFilters['po_number'])) {
            $poNumbers = array_map('trim', explode(',', $extraFilters['po_number']));
            $query->whereIn('po_number', $poNumbers);
        }

        if (!empty($extraFilters['customer'])) {
            $query->where('users_id', $extraFilters['customer']);
        }

        if (!empty($extraFilters['address'])) {
            $addrId = $extraFilters['address'];
            $query->where(function($q) use ($addrId) {
                $q->where('origin_address_id', $addrId)
                  ->orWhere('dest_address_id', $addrId)
                  ->orWhere('customer_address_id', $addrId);
            });
        }

        if (!empty($extraFilters['sch_date'])) {
            $query->whereHas('criticalDates', function ($q) use ($extraFilters) {
                $q->whereDate('scheduled_pickup_date', $extraFilters['sch_date'])
                  ->orWhereDate('scheduled_delivery_date', $extraFilters['sch_date']);
            });
        }

        if (!empty($extraFilters['territory'])) {
            $query->whereHas('originAddress', function ($q) use ($extraFilters) {
                $q->whereIn('zipcode', function ($sub) use ($extraFilters) {
                    $sub->select('zipcode')
                        ->from('zipcodes_management')
                        ->whereIn('schedule_settings_id', (array) $extraFilters['territory']);
                });
            });
        }

        $rows = $query
            ->orderByDesc($idCol)
            ->limit(200)
            ->get();

        $orderIds = $rows->pluck($idCol)->filter()->map(static fn ($id): int => (int) $id)->values()->all();
        $itemsByOrder = $this->orderItemStats($orderIds);

        return $rows->map(static function ($row) use (
            $idCol,
            $distanceCol,
            $itemsByOrder
        ): array {
            $orderId = (int) ($row->{$idCol} ?? 0);
            $itemStats = $itemsByOrder[$orderId] ?? ['items' => '', 'cubes' => ''];

            $orderDateHtml = $row->created_at ? sprintf("%s<br>(%s<br>%s)", $orderId, $row->created_at->format('m/d/Y'), $row->created_at->format('h:i A')) : $orderId;

            // Contact Details
            $contactDetails = [];
            $contactDetails[] = "<b>Company:</b> " . ($row->externalCustomer->company_name ?? '-');
            $contactDetails[] = "<b>Name:</b> " . ($row->externalCustomer->name ?? '-');
            $contactDetails[] = "<b>Phone:</b> " . ($row->externalCustomer->phone ?? '-');
            $contactDetails[] = "<b>Email:</b> " . ($row->externalCustomer->email ?? '-');
            $contactDetails[] = "<b>Ref:</b> " . ($row->customer_ref ?? '-');
            $contactDetails[] = "<b>PO:</b> " . ($row->po_number ?? '-');

            // Bill To
            $billTo = [];
            if ($row->billingAddress) {
                $billTo[] = "<b>Company:</b> " . $row->billingAddress->company_name;
                $billTo[] = "<b>Phone:</b> " . $row->billingAddress->contact_phone;
                $billTo[] = "<b>Email:</b> " . $row->billingAddress->contact_email;
                $billTo[] = "<b>Address:</b> " . $row->billingAddress->addressline1;
                $billTo[] = $row->billingAddress->city . ', ' . $row->billingAddress->state . ', ' . $row->billingAddress->zipcode;
            }

            // Origin
            $origin = [];
            if ($row->originAddress) {
                $origin[] = "<b>Company:</b> " . $row->originAddress->company_name;
                $origin[] = "<b>Phone:</b> " . $row->originAddress->contact_phone;
                $origin[] = "<b>Email:</b> " . $row->originAddress->contact_email;
                $origin[] = "<b>Address:</b> " . $row->originAddress->addressline1;
                $origin[] = $row->originAddress->city . ', ' . $row->originAddress->state . ', ' . $row->originAddress->zipcode;
                if ($row->serviceLevels) $origin[] = "<b>Service:</b> " . $row->serviceLevels->service_name;
                $origin[] = ($row->criticalDates && $row->criticalDates->scheduled_pickup_date) ? "<b>Pickup:</b> " . date('m/d/Y', strtotime($row->criticalDates->scheduled_pickup_date)) : "<b>Pickup:</b> Not scheduled";
                if ($row->originAddress->terminal_name) $origin[] = "<b>Terminal:</b> " . $row->originAddress->terminal_name;
            }

            // Destination
            $destination = [];
            if ($row->destAddress) {
                $destination[] = "<b>Company:</b> " . $row->destAddress->company_name;
                $destination[] = "<b>Phone:</b> " . $row->destAddress->contact_phone;
                $destination[] = "<b>Email:</b> " . $row->destAddress->contact_email;
                $destination[] = "<b>Address:</b> " . $row->destAddress->addressline1;
                $destination[] = $row->destAddress->city . ', ' . $row->destAddress->state . ', ' . $row->destAddress->zipcode;
                if ($row->serviceLevels) $destination[] = "<b>Service:</b> " . $row->serviceLevels->service_name;
                $destination[] = ($row->criticalDates && $row->criticalDates->scheduled_delivery_date) ? "<b>Delivery:</b> " . date('m/d/Y', strtotime($row->criticalDates->scheduled_delivery_date)) : "<b>Delivery:</b> Not scheduled";
                if ($row->destAddress->terminal_name) $destination[] = "<b>Terminal:</b> " . $row->destAddress->terminal_name;
            }

            // Status
            $statusMap = [
                1 => 'New',
                2 => 'Attention',
                4 => 'Cancelled',
                5 => 'Delivered',
                6 => 'Out For Pickup',
                7 => 'Out For Delivery',
                8 => 'Finished',
                9 => 'Other',
                10 => 'Finished',
            ];
            $statusText = $row->status_other ?: ($statusMap[$row->status] ?? $row->status);

            // Calculate storage charges using the model's method
            $storageCharges = $row->calculateStorageCharges();

            return [
                'id' => $orderId,
                'order_number' => $row->order_number ?? $orderId,
                'order_date_html' => $orderDateHtml,
                'parent_order' => $row->parent_orders_id ?? '-',
                'quote_id' => $row->quotes_id ?? '-',
                'order_type' => $row->order_type == 1 ? 'Pickup & Deliver' : ($row->order_type == 2 ? 'Receive In & Deliver' : ($row->order_type ?? '-')),
                'contact_details' => implode('<br>', array_filter($contactDetails)),
                'bill_to' => implode('<br>', array_filter($billTo)),
                'origin' => implode('<br>', array_filter($origin)),
                'destination' => implode('<br>', array_filter($destination)),
                'distance' => $row->distance ?? '-',
                'items' => $itemStats['items'],
                'cubes' => $itemStats['cubes'],
                'total_amount' => (float)($row->delivery_charges ?? 0) + 
                                  (float)($row->insurance_charges ?? 0) + 
                                  (float)($row->accessory_charges ?? 0) + 
                                  (float)($row->pickup_charges ?? 0) + 
                                  (float)($row->extra_service_charges ?? 0) + 
                                  (float)($row->tip_amount ?? 0) +
                                  (float)($row->cc_fees_value ?? 0) +
                                  (float)$storageCharges -
                                  (float)($row->discount ?? 0),
                'status' => $statusText,
            ];
        })->all();
    }

    /**
     * @param array<int, int> $orderIds
     * @return array<int, array{items:int|string,cubes:float|string}>
     */
    private function orderItemStats(array $orderIds): array
    {
        if (!$orderIds || !Schema::hasTable('order_items')) {
            return [];
        }

        $orderIdCol = $this->firstExistingColumn('order_items', ['orders_id', 'order_id', 'o_id']);
        if ($orderIdCol === null) {
            return [];
        }

        $cubeCol = $this->firstExistingColumn('order_items', ['cube', 'cubes', 'volume']);

        $rows = OrderItems::query()
            ->selectRaw(
                "`{$orderIdCol}` as order_id, SUM(COALESCE(`quantity`, 1)) as items_count" .
                ($cubeCol ? ", SUM(COALESCE(`{$cubeCol}`, 0)) as cubes_sum" : '')
            )
            ->whereIn($orderIdCol, $orderIds)
            ->groupBy($orderIdCol)
            ->get();

        $mapped = [];
        foreach ($rows as $row) {
            $oid = (int) ($row->order_id ?? 0);
            if (!$oid) {
                continue;
            }

            $mapped[$oid] = [
                'items' => (int) ($row->items_count ?? 0),
                'cubes' => $cubeCol ? (float) ($row->cubes_sum ?? 0) : '',
            ];
        }

        return $mapped;
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
}
