<?php

namespace App\Http\Controllers\Admin\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PaymentsController extends Controller
{
    public function allOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/AllOrders',
            'All Orders Payment List',
            '(Except Completed & Cancelled orders)',
            'all'
        );
    }

    public function billedOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/BilledOrder',
            'Billed Orders Payment List',
            '(Only Completed Orders)',
            'billed'
        );
    }

    public function cancelledOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/CancelledOrder',
            'Cancelled Orders Payment List',
            '(Cancelled orders)',
            'cancelled'
        );
    }

    public function completedOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/CompletedOrders',
            'Completed Orders Payment List',
            '(Completed orders)',
            'completed'
        );
    }

    public function consolidatedInvoice(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/ConsolidatedInvoice',
            'Consolidated Invoice List',
            '(Consolidated invoices)',
            'all'
        );
    }

    public function paidOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/PaidOrder',
            'Paid Orders Payment List',
            '(Only Completed Orders)',
            'paid'
        );
    }

    public function prePaidOrders(Request $request): Response
    {
        return $this->renderPaymentsPage(
            $request,
            'Admin/Accounting/Payments/PrePaidOrders',
            'Prepaid Orders Payment List',
            '(Prepaid orders)',
            'prepaid'
        );
    }

    private function renderPaymentsPage(
        Request $request,
        string $page,
        string $title,
        string $subtitle,
        string $mode
    ): Response {
        $rows = $this->paymentRows(
            $mode,
            (string) $request->query('status', ''),
            (string) $request->query('customer', '')
        );
        $customerOptions = collect($rows)
            ->pluck('customer')
            ->filter()
            ->unique()
            ->values()
            ->all();

        return Inertia::render($page, [
            'paymentPage' => [
                'title' => $title,
                'subtitle' => $subtitle,
                'rows' => $rows,
                'customer_options' => $customerOptions,
                'status_filter' => (string) $request->query('status', ''),
                'customer_filter' => (string) $request->query('customer', ''),
            ],
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function paymentRows(string $mode, string $statusFilter = '', string $customerFilter = ''): array
    {
        if (!Schema::hasTable('orders')) {
            return [];
        }

        $idCol = $this->firstExistingColumn('orders', ['id', 'order_id', 'o_id']) ?? 'id';
        $statusCol = $this->firstExistingColumn('orders', ['status', 'order_status', 'state', 'current_status']);
        $amountCol = $this->firstExistingColumn('orders', ['total_amount', 'amount', 'grand_total']);
        $createdCol = $this->firstExistingColumn('orders', ['created_at', 'created_date', 'date']);
        $customerCol = $this->firstExistingColumn('orders', ['customer_name', 'client_name', 'name']);
        $customerIdCol = $this->firstExistingColumn('orders', ['user_id', 'customer_id', 'users_id']);
        $billerCol = $this->firstExistingColumn('orders', ['billing_method', 'billing_type']);
        $txnCol = $this->firstExistingColumn('orders', ['transaction_id', 'txn_id', 'payment_txn_id']);
        $paidCol = $this->firstExistingColumn('orders', ['paid_amount', 'amount_paid']);
        $notesCol = $this->firstExistingColumn('orders', ['notes', 'payment_notes']);
        $collectionNotesCol = $this->firstExistingColumn('orders', ['collection_notes', 'internal_notes']);
        $createdByCol = $this->firstExistingColumn('orders', ['created_by', 'user_id', 'updated_by']);

        $query = Orders::query();

        if ($statusCol !== null) {
            if ($mode === 'all') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) NOT LIKE ?", ['%completed%'])
                    ->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) NOT LIKE ?", ['%cancelled%']);
            } elseif ($mode === 'billed') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%billed%']);
            } elseif ($mode === 'paid') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%paid%']);
            } elseif ($mode === 'cancelled') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%cancel%']);
            } elseif ($mode === 'completed') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%complete%']);
            } elseif ($mode === 'prepaid') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%prepaid%']);
            }

            if ($statusFilter !== '') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) = ?", [strtolower($statusFilter)]);
            }
        }

        if ($customerFilter !== '') {
            if ($customerCol !== null) {
                $query->whereRaw("LOWER(CAST({$customerCol} AS CHAR)) = ?", [strtolower($customerFilter)]);
            } elseif ($customerIdCol !== null && Schema::hasTable('users')) {
                $userNameCol = Schema::hasColumn('users', 'name')
                    ? 'name'
                    : (Schema::hasColumn('users', 'full_name') ? 'full_name' : null);

                if ($userNameCol !== null) {
                    $query->whereIn($customerIdCol, function ($sub) use ($userNameCol, $customerFilter): void {
                        $sub->select('id')
                            ->from('users')
                            ->whereRaw("LOWER(CAST({$userNameCol} AS CHAR)) = ?", [strtolower($customerFilter)]);
                    });
                }
            }
        }

        $rows = $query
            ->orderByDesc($idCol)
            ->limit(150)
            ->get();

        $orderIds = $rows->pluck($idCol)->filter()->map(static fn ($id): int => (int) $id)->values()->all();
        $paymentsByOrder = $this->paymentsByOrderIds($orderIds);

        return $rows->map(static function ($row) use (
            $idCol,
            $statusCol,
            $amountCol,
            $createdCol,
            $customerCol,
            $customerIdCol,
            $billerCol,
            $txnCol,
            $paidCol,
            $notesCol,
            $collectionNotesCol
        ,   $createdByCol,
            $paymentsByOrder
        ): array {
            $createdAt = $createdCol ? ($row->{$createdCol} ?? null) : null;
            $orderId = (int) ($row->{$idCol} ?? 0);
            $paymentInfo = $paymentsByOrder[$orderId] ?? [];

            return [
                'order_number' => (string) $orderId,
                'customer' => (string) ($customerCol ? ($row->{$customerCol} ?? '') : self::userNameById((int) ($customerIdCol ? ($row->{$customerIdCol} ?? 0) : 0))),
                'biller' => (string) ($billerCol ? ($row->{$billerCol} ?? '') : ''),
                'transaction_id' => (string) ($txnCol ? ($row->{$txnCol} ?? '') : ($paymentInfo['transaction_id'] ?? '')),
                'order_amount' => (float) ($amountCol ? ($row->{$amountCol} ?? 0) : 0),
                'paid' => (float) ($paidCol ? ($row->{$paidCol} ?? 0) : ($paymentInfo['paid'] ?? 0)),
                'notes' => (string) ($notesCol ? ($row->{$notesCol} ?? '') : ($paymentInfo['notes'] ?? '')),
                'collection_notes' => (string) ($collectionNotesCol ? ($row->{$collectionNotesCol} ?? '') : ''),
                'user' => self::userNameById((int) ($createdByCol ? ($row->{$createdByCol} ?? 0) : 0)),
                'txn_datetime' => $createdAt ? (string) $createdAt : '',
                'status' => (string) ($statusCol ? ($row->{$statusCol} ?? '') : ''),
            ];
        })->all();
    }

    /**
     * @param array<int, int> $orderIds
     * @return array<int, array{transaction_id:string,paid:float,notes:string}>
     */
    private function paymentsByOrderIds(array $orderIds): array
    {
        if (!$orderIds || !Schema::hasTable('payments')) {
            return [];
        }

        $orderIdCol = $this->firstExistingColumn('payments', ['orders_id', 'order_id', 'o_id']);
        if ($orderIdCol === null) {
            return [];
        }

        $txnCol = $this->firstExistingColumn('payments', ['transaction_id', 'txn_id']) ?? 'id';
        $paidCol = $this->firstExistingColumn('payments', ['net_amount', 'amount', 'paid_amount']);
        $notesCol = $this->firstExistingColumn('payments', ['p_notes', 'notes']);
        $dateCol = $this->firstExistingColumn('payments', ['created_at', 'txn_datetime', 'updated_at']) ?? 'id';

        $rows = Payments::query()
            ->whereIn($orderIdCol, $orderIds)
            ->orderByDesc($dateCol)
            ->get();

        $mapped = [];
        foreach ($rows as $row) {
            $oid = (int) ($row->{$orderIdCol} ?? 0);
            if (!$oid || isset($mapped[$oid])) {
                continue;
            }

            $mapped[$oid] = [
                'transaction_id' => (string) ($row->{$txnCol} ?? ''),
                'paid' => (float) ($paidCol ? ($row->{$paidCol} ?? 0) : 0),
                'notes' => (string) ($notesCol ? ($row->{$notesCol} ?? '') : ''),
            ];
        }

        return $mapped;
    }

    private static function userNameById(int $userId): string
    {
        static $cache = [];

        if (isset($cache[$userId])) {
            return $cache[$userId];
        }

        if ($userId <= 0 || !Schema::hasTable('users')) {
            return $cache[$userId] = '';
        }

        $idCol = Schema::hasColumn('users', 'id') ? 'id' : null;
        $nameCol = Schema::hasColumn('users', 'name')
            ? 'name'
            : (Schema::hasColumn('users', 'full_name') ? 'full_name' : null);

        if ($idCol === null || $nameCol === null) {
            return $cache[$userId] = '';
        }

        $row = DB::table('users')
            ->select($nameCol)
            ->where($idCol, $userId)
            ->first();

        return $cache[$userId] = ($row ? (string) ($row->{$nameCol} ?? '') : '');
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
