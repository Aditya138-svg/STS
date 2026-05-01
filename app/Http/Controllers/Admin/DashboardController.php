<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AddressBooks;
use App\Models\Orders;
use App\Models\Quotes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = (int) ($request->user()?->id ?? 0);
        $newUsers = 0;
        if (Schema::hasTable('users')) {
            $newUsers = (int) DB::table('users')
                ->whereDate('created_at', today())
                ->count();
        }

        $newQuotes = $this->countToday('quotes');
        $newOrders = $this->countToday('orders');
        $acceptedQuotes = $this->acceptedQuotesCount();

        $scheduledOrdersList = $this->scheduledOrdersList();
        $missingOrders = $this->missingOrders();
        $neverRoutedOrders = $this->neverRoutedOrders();
        $upcomingOrders = $this->upcomingOrders();
        $scheduledUnrouteOrders = $this->scheduledUnroutedOrdersToday();
        $unreadOrderNotes = $this->unreadOrderNotes($userId);
        $myTasksList = $this->myTasksList($userId);
        $otherTasksList = $this->otherTasksList($userId);

        return Inertia::render('Admin/Dashboard/Dashboard', [
            'dashboard' => [
                'scheduled_orders_list' => $scheduledOrdersList,
                'unread_order_notes' => $unreadOrderNotes,
                'total_unread_order_notes' => count($unreadOrderNotes),
                'my_tasks_list' => $myTasksList,
                'other_tasks_list' => $otherTasksList,
                'duplicate_addresses' => $this->duplicateAddresses(),
                'missing_orders' => $missingOrders,
                'never_routed_orders' => $neverRoutedOrders,
                'upcoming_orders' => ['data' => $upcomingOrders],
                'scheduled_unroute_orders' => $scheduledUnrouteOrders,
                'metrics' => [
                    'new_quotes' => $newQuotes,
                    'accepted_quotes' => $acceptedQuotes,
                    'new_orders' => $newOrders,
                    'new_users' => $newUsers,
                    'scheduled_orders_count' => $this->scheduledOrdersCountToday(),
                    'undelivered_orders_count' => $this->countByStatusLike('orders', ['undelivered', 'failed']),
                    'attention_orders_count' => $this->countByStatusLike('orders', ['attention']),
                    'due_in_count' => $this->countByStatusLike('orders', ['due_in', 'due in']),
                    'hold_to_call_count' => $this->countByStatusLike('orders', ['hold_to_call', 'hold to call']),
                    'sch_for_p_count' => $this->countByStatusLike('orders', ['pickup']),
                ],
            ],
        ]);
    }

    private function countToday(string $table): int
    {
        if (!Schema::hasTable($table)) {
            return 0;
        }

        $query = DB::table($table);

        if (Schema::hasColumn($table, 'created_at')) {
            return (int) $query->whereDate('created_at', today())->count();
        }

        return (int) $query->count();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function scheduledOrdersList(): array
    {
        $dateCol = $this->firstExistingColumn('orders', ['sch_date', 'scheduled_date', 'schedule_date', 'date']);
        if (!Schema::hasTable('orders') || $dateCol === null) {
            return [];
        }

        $rows = Orders::query()
            ->selectRaw("DATE({$dateCol}) as date, COUNT(*) as total_orders")
            ->whereNotNull($dateCol)
            ->groupByRaw("DATE({$dateCol})")
            ->orderByRaw("DATE({$dateCol}) asc")
            ->limit(12)
            ->get();

        return $rows->map(static function ($row): array {
            $date = (string) $row->date;

            return [
                'date' => $date,
                'date_formatted' => date('m/d/Y', strtotime($date)),
                'total_orders' => (int) $row->total_orders,
            ];
        })->all();
    }

    private function acceptedQuotesCount(): int
    {
        if (!Schema::hasTable('quotes')) {
            return 0;
        }

        $statusCol = $this->firstExistingColumn('quotes', ['status', 'quote_status']);
        if ($statusCol === null) {
            return 0;
        }

        return (int) Quotes::query()
            ->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%accepted%'])
            ->count();
    }

    private function scheduledOrdersCountToday(): int
    {
        if (!Schema::hasTable('orders')) {
            return 0;
        }

        $dateCol = $this->firstExistingColumn('orders', ['sch_date', 'scheduled_date', 'schedule_date', 'date']);
        if ($dateCol === null) {
            return 0;
        }

        return (int) Orders::query()
            ->whereDate($dateCol, today())
            ->count();
    }

    private function countByStatusLike(string $table, array $terms): int
    {
        if (!Schema::hasTable($table)) {
            return 0;
        }

        $statusCol = $this->firstExistingColumn($table, ['status', 'order_status', 'state', 'current_status']);
        if ($statusCol === null) {
            return 0;
        }

        if ($table !== 'orders') {
            $query = DB::table($table);
        } else {
            $query = Orders::query();
        }
        $query->where(function ($q) use ($statusCol, $terms): void {
            foreach ($terms as $term) {
                $q->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%'.strtolower($term).'%']);
            }
        });

        return (int) $query->count();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function missingOrders(): array
    {
        return $this->statusBuckets(['undelivered', 'failed']);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function neverRoutedOrders(): array
    {
        return $this->statusBuckets(['unrouted', 'never routed']);
    }

    /**
     * @return array<int, int>
     */
    private function upcomingOrders(): array
    {
        if (!Schema::hasTable('orders')) {
            return [];
        }

        $dateCol = $this->firstExistingColumn('orders', ['sch_date', 'scheduled_date', 'schedule_date', 'date']);
        if ($dateCol === null) {
            return [];
        }

        $rows = Orders::query()
            ->selectRaw("DATE({$dateCol}) as date, COUNT(*) as total_orders")
            ->whereDate($dateCol, '>', today())
            ->groupByRaw("DATE({$dateCol})")
            ->orderByRaw("DATE({$dateCol}) asc")
            ->limit(20)
            ->get();

        $out = [];
        foreach ($rows as $row) {
            $out[(string) $row->date] = (int) $row->total_orders;
        }

        return $out;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function duplicateAddresses(): array
    {
        $tableName = Schema::hasTable('address_books') ? 'address_books' : 'addresses';
        if (!Schema::hasTable($tableName)) {
            return [];
        }

        $addressCol = $this->firstExistingColumn($tableName, ['address', 'addressline1', 'street', 'line1']);
        if ($addressCol === null) {
            return [];
        }

        $rows = $tableName === 'address_books'
            ? AddressBooks::query()
            : DB::table($tableName);

        $rows = $rows
            ->selectRaw("{$addressCol} as address, COUNT(*) as total")
            ->whereNotNull($addressCol)
            ->where($addressCol, '<>', '')
            ->groupBy($addressCol)
            ->having('total', '>', 1)
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        return $rows->map(static fn ($row): array => [
            'address' => (string) $row->address,
            'address_soundex' => substr(md5((string) $row->address), 0, 12),
        ])->all();
    }

    /**
     * @return array{count_un_route:int,data:array<int,array<string,mixed>>}
     */
    private function scheduledUnroutedOrdersToday(): array
    {
        if (!Schema::hasTable('orders')) {
            return ['count_un_route' => 0, 'data' => []];
        }

        $dateCol = $this->firstExistingColumn('orders', ['sch_date', 'scheduled_date', 'schedule_date', 'date']);
        $statusCol = $this->firstExistingColumn('orders', ['status', 'order_status', 'state', 'current_status']);

        if ($dateCol === null) {
            return ['count_un_route' => 0, 'data' => []];
        }

        $idCol = $this->firstExistingColumn('orders', ['id', 'o_id', 'order_id']) ?? 'id';
        $originCol = $this->firstExistingColumn('orders', ['origin_company_name', 'origin_name', 'origin_company']);
        $destCol = $this->firstExistingColumn('orders', ['dest_company_name', 'destination_company_name', 'destination_name']);

        $query = DB::table('orders')
            ->whereDate($dateCol, today());

        if ($statusCol !== null) {
            $query->where(function ($q) use ($statusCol): void {
                $q->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%unroute%'])
                    ->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%not assigned%'])
                    ->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%pending route%']);
            });
        }

        $select = ["{$idCol} as o_id"];
        if ($originCol !== null) {
            $select[] = "{$originCol} as origin_company_name";
        }
        if ($destCol !== null) {
            $select[] = "{$destCol} as dest_company_name";
        }

        $rows = $query
            ->selectRaw(implode(', ', $select))
            ->orderBy($idCol, 'desc')
            ->limit(10)
            ->get();

        return [
            'count_un_route' => (int) $rows->count(),
            'data' => $rows->map(static fn ($row): array => [
                'o_id' => (int) ($row->o_id ?? 0),
                'origin_company_name' => (string) ($row->origin_company_name ?? ''),
                'dest_company_name' => (string) ($row->dest_company_name ?? ''),
            ])->all(),
        ];
    }

    /**
     * @param array<int, string> $statusTerms
     * @return array<int, array<string, mixed>>
     */
    private function statusBuckets(array $statusTerms): array
    {
        if (!Schema::hasTable('orders')) {
            return [];
        }

        $statusCol = $this->firstExistingColumn('orders', ['status', 'order_status', 'state', 'current_status']);
        $dateCol = $this->firstExistingColumn('orders', ['sch_date', 'scheduled_date', 'schedule_date', 'date']);

        if ($statusCol === null || $dateCol === null) {
            return [];
        }

        $query = Orders::query()
            ->selectRaw("DATE({$dateCol}) as date, COUNT(*) as total_orders")
            ->where(function ($q) use ($statusCol, $statusTerms): void {
                foreach ($statusTerms as $term) {
                    $q->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%'.strtolower($term).'%']);
                }
            })
            ->groupByRaw("DATE({$dateCol})")
            ->orderByRaw("DATE({$dateCol}) desc")
            ->limit(10)
            ->get();

        return $query->map(static fn ($row): array => [
            'date' => (string) $row->date,
            'total_orders' => (int) $row->total_orders,
        ])->all();
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
     * @return array<int, array<string, mixed>>
     */
    private function unreadOrderNotes(int $userId): array
    {
        if (!Schema::hasTable('order_notes')) {
            return [];
        }

        $notesTable = DB::table('order_notes');
        $messageCol = $this->firstExistingColumn('order_notes', ['notes', 'message', 'note']);
        $createdCol = $this->firstExistingColumn('order_notes', ['created_at', 'created_date', 'date']);
        $publicCol = $this->firstExistingColumn('order_notes', ['is_public', 'public']);
        $readCol = $this->firstExistingColumn('order_notes', ['is_read', 'read_status']);
        $userCol = $this->firstExistingColumn('order_notes', ['users_id', 'user_id', 'created_by']);

        if ($messageCol === null) {
            return [];
        }

        if ($publicCol !== null) {
            $notesTable->where($publicCol, 0);
        }

        if ($readCol !== null) {
            $notesTable->where(function ($q) use ($readCol): void {
                $q->whereNull($readCol)->orWhere($readCol, 0);
            });
        }

        if ($userId > 0 && $userCol !== null) {
            $notesTable->where($userCol, $userId);
        }

        if ($createdCol !== null) {
            $notesTable->orderByDesc($createdCol);
        } else {
            $notesTable->orderByDesc('id');
        }

        return $notesTable
            ->limit(20)
            ->get()
            ->map(static fn ($row): array => [
                'message' => (string) ($row->{$messageCol} ?? ''),
            ])
            ->filter(static fn ($row): bool => trim((string) ($row['message'] ?? '')) !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function myTasksList(int $userId): array
    {
        return $this->tasksByOwner($userId, true);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function otherTasksList(int $userId): array
    {
        return $this->tasksByOwner($userId, false);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function tasksByOwner(int $userId, bool $forCurrentUser): array
    {
        if (!Schema::hasTable('tasks')) {
            return [];
        }

        $taskNameCol = $this->firstExistingColumn('tasks', ['task_name', 'name', 'title']);
        $taskDescCol = $this->firstExistingColumn('tasks', ['task_desc', 'description', 'notes']);
        $ownerCol = $this->firstExistingColumn('tasks', ['users_id', 'user_id', 'created_by']);
        $statusCol = $this->firstExistingColumn('tasks', ['status', 'task_status']);
        $createdCol = $this->firstExistingColumn('tasks', ['created_at', 'created_date', 'date']);

        if ($taskNameCol === null) {
            return [];
        }

        $query = DB::table('tasks');

        if ($statusCol !== null) {
            $query->where(function ($q) use ($statusCol): void {
                $q->whereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%open%'])
                    ->orWhereRaw("LOWER(CAST({$statusCol} AS CHAR)) LIKE ?", ['%pending%'])
                    ->orWhereNull($statusCol);
            });
        }

        if ($ownerCol !== null && $userId > 0) {
            if ($forCurrentUser) {
                $query->where($ownerCol, $userId);
            } else {
                $query->where($ownerCol, '<>', $userId);
            }
        }

        if ($createdCol !== null) {
            $query->orderByDesc($createdCol);
        } else {
            $query->orderByDesc('id');
        }

        return $query
            ->limit(20)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) ($row->id ?? 0),
                'task_name' => (string) ($row->{$taskNameCol} ?? ''),
                'task_desc' => (string) ($taskDescCol ? ($row->{$taskDescCol} ?? '') : ''),
            ])
            ->filter(static fn ($row): bool => trim((string) ($row['task_name'] ?? '')) !== '')
            ->values()
            ->all();
    }
}
