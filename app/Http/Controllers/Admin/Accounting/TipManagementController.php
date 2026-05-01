<?php

namespace App\Http\Controllers\Admin\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class TipManagementController extends Controller
{
    public function pendingTips(Request $request): Response
    {
        return $this->renderTipsPage(
            $request,
            'Admin/Accounting/TipManagement/PendingTips',
            'Pending Tips',
            'pending'
        );
    }

    public function tipPayout(Request $request): Response
    {
        return $this->renderTipsPage(
            $request,
            'Admin/Accounting/TipManagement/TipPayout',
            'Tip Payout',
            'paid'
        );
    }

    public function tipReport(Request $request): Response
    {
        return $this->renderTipsPage(
            $request,
            'Admin/Accounting/TipManagement/TipReport',
            'Tip Report',
            'all'
        );
    }

    private function renderTipsPage(Request $request, string $page, string $title, string $mode): Response
    {
        $rows = $this->rows($mode);

        return Inertia::render($page, [
            'tipsPage' => [
                'title' => $title,
                'rows' => $rows,
                'total_tip_amount' => (float) collect($rows)->sum('tip_amount'),
                'status_filter' => (string) $request->query('status', ''),
            ],
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function rows(string $mode): array
    {
        if (!Schema::hasTable('payments')) {
            return [];
        }

        $tipCol = $this->firstExistingColumn('payments', ['tip_amount', 'tip']);
        $statusCol = $this->firstExistingColumn('payments', ['status', 'payment_status']);
        $ordersIdCol = $this->firstExistingColumn('payments', ['orders_id', 'order_id']) ?? 'id';
        $employeeCol = $this->firstExistingColumn('payments', ['employees_id', 'employee_id', 'users_id']);
        $dateCol = $this->firstExistingColumn('payments', ['txn_datetime', 'created_at', 'updated_at']) ?? 'id';

        if ($tipCol === null) {
            return [];
        }

        $query = Payments::query()
            ->where($tipCol, '>', 0);

        if ($statusCol !== null) {
            if ($mode === 'pending') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) NOT LIKE ?", ['%paid%']);
            } elseif ($mode === 'paid') {
                $query->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%paid%']);
            }
        }

        return $query
            ->orderByDesc($dateCol)
            ->limit(200)
            ->get()
            ->map(static fn ($row): array => [
                'payment_id' => (int) ($row->id ?? 0),
                'order_id' => (int) ($row->{$ordersIdCol} ?? 0),
                'employee_id' => (int) ($employeeCol ? ($row->{$employeeCol} ?? 0) : 0),
                'tip_amount' => (float) ($row->{$tipCol} ?? 0),
                'status' => (string) ($statusCol ? ($row->{$statusCol} ?? '') : ''),
                'txn_datetime' => (string) ($row->{$dateCol} ?? ''),
            ])
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
}
