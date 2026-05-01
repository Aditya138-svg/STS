<?php

namespace App\Http\Controllers\Admin\OrderManagement;

use App\Http\Controllers\Controller;
use App\Models\OrderItems;
use App\Models\Orders;
use Illuminate\Http\Request;
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
        $rows = $this->rows($mode, $status);

        $statusOptions = collect($rows)
            ->pluck('status')
            ->filter()
            ->unique()
            ->values()
            ->all();

        return Inertia::render($page, [
            'ordersPage' => [
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
    private function rows(string $mode, string $statusFilter): array
    {
        if (!Schema::hasTable('orders')) {
            return [];
        }

        $idCol = $this->firstExistingColumn('orders', ['id', 'order_id', 'o_id']) ?? 'id';
        $dateCol = $this->firstExistingColumn('orders', ['created_at', 'order_date', 'date']);
        $typeCol = $this->firstExistingColumn('orders', ['order_type', 'type']);
        $originCol = $this->firstExistingColumn('orders', ['origin_company_name', 'origin_name']);
        $destCol = $this->firstExistingColumn('orders', ['dest_company_name', 'destination_name']);
        $amountCol = $this->firstExistingColumn('orders', ['total_amount', 'amount', 'grand_total']);
        $statusCol = $this->firstExistingColumn('orders', ['status', 'order_status', 'state', 'current_status']);
        $customerCol = $this->firstExistingColumn('orders', ['customer_name', 'client_name', 'name']);
        $distanceCol = $this->firstExistingColumn('orders', ['distance', 'distance_miles', 'miles']);

        $query = Orders::query();

        if ($statusCol !== null) {
            if ($mode === 'attention') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%attention%']);
            } elseif ($mode === 'new') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%new%']);
            } elseif ($mode === 'all') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) NOT LIKE ?", ['%cancel%']);
            }

            if ($statusFilter !== '') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) = ?", [strtolower($statusFilter)]);
            }
        }

        $rows = $query
            ->orderByDesc($idCol)
            ->limit(200)
            ->get();

        $orderIds = $rows->pluck($idCol)->filter()->map(static fn ($id): int => (int) $id)->values()->all();
        $itemsByOrder = $this->orderItemStats($orderIds);

        return $rows->map(static function ($row) use (
            $idCol,
            $dateCol,
            $typeCol,
            $originCol,
            $destCol,
            $amountCol,
            $statusCol,
            $customerCol
        ,   $distanceCol,
            $itemsByOrder
        ): array {
            $orderId = (int) ($row->{$idCol} ?? 0);
            $itemStats = $itemsByOrder[$orderId] ?? ['items' => '', 'cubes' => ''];

            return [
                'order_number' => (string) $orderId,
                'order_date' => (string) ($dateCol ? ($row->{$dateCol} ?? '') : ''),
                'order_type' => (string) ($typeCol ? ($row->{$typeCol} ?? '') : ''),
                'contact_details' => (string) ($customerCol ? ($row->{$customerCol} ?? '') : ''),
                'origin' => (string) ($originCol ? ($row->{$originCol} ?? '') : ''),
                'destination' => (string) ($destCol ? ($row->{$destCol} ?? '') : ''),
                'distance' => (string) ($distanceCol ? ($row->{$distanceCol} ?? '') : ''),
                'items' => (string) $itemStats['items'],
                'cubes' => (string) $itemStats['cubes'],
                'total_amount' => (float) ($amountCol ? ($row->{$amountCol} ?? 0) : 0),
                'status' => (string) ($statusCol ? ($row->{$statusCol} ?? '') : ''),
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

        $orderIdCol = $this->firstExistingColumn('order_items', ['order_id', 'o_id']);
        if ($orderIdCol === null) {
            return [];
        }

        $cubeCol = $this->firstExistingColumn('order_items', ['cube', 'cubes', 'volume']);

        $rows = OrderItems::query()
            ->selectRaw(
                "{$orderIdCol} as order_id, COUNT(*) as items_count" .
                ($cubeCol ? ", SUM(COALESCE({$cubeCol}, 0)) as cubes_sum" : '')
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
