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
                    'sch_for_d_tomorrow' => $this->countScheduled('delivery', today()->addDay()),
                    'out_for_p_yesterday' => $this->countScheduled('pickup', today()->subDay()),
                    'out_for_d_yesterday' => $this->countScheduled('delivery', today()->subDay()),
                    'no_action_24h' => $this->countNoAction(24),
                    'not_scheduled_48h' => $this->countNotScheduled(48),
                    'not_scheduled_notified_48h' => $this->countNotScheduled(48, true),
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
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return [];
        }

        $rows = DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->selectRaw("DATE(order_critical_dates.scheduled_delivery_date) as date, COUNT(*) as total_orders")
            ->whereNotNull('order_critical_dates.scheduled_delivery_date')
            ->groupByRaw("DATE(order_critical_dates.scheduled_delivery_date)")
            ->orderByRaw("DATE(order_critical_dates.scheduled_delivery_date) asc")
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

        return (int) Quotes::query()
            ->where('status', 'LIKE', '%accepted%')
            ->count();
    }

    private function scheduledOrdersCountToday(): int
    {
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return 0;
        }

        return (int) DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->whereDate('order_critical_dates.scheduled_delivery_date', today())
            ->count();
    }

    private function countByStatusLike(string $table, array $terms): int
    {
        if (!Schema::hasTable($table)) {
            return 0;
        }

        $query = DB::table($table);
        $query->where(function ($q) use ($terms): void {
            foreach ($terms as $term) {
                $q->orWhere('status', 'LIKE', '%'.$term.'%');
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
     * @return array<string, int>
     */
    private function upcomingOrders(): array
    {
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return [];
        }

        $rows = DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->selectRaw("DATE(order_critical_dates.scheduled_delivery_date) as date, COUNT(*) as total_orders")
            ->whereDate('order_critical_dates.scheduled_delivery_date', '>', today())
            ->groupByRaw("DATE(order_critical_dates.scheduled_delivery_date)")
            ->orderByRaw("DATE(order_critical_dates.scheduled_delivery_date) asc")
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
        if (!Schema::hasTable('address_books')) {
            return [];
        }

        $rows = AddressBooks::query()
            ->selectRaw("addressline1 as address, COUNT(*) as total")
            ->whereNotNull('addressline1')
            ->where('addressline1', '<>', '')
            ->groupBy('addressline1')
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
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return ['count_un_route' => 0, 'data' => []];
        }

        $query = DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->whereDate('order_critical_dates.scheduled_delivery_date', today())
            ->where(function ($q): void {
                $q->orWhere('orders.status', 'LIKE', '%unroute%')
                    ->orWhere('orders.status', 'LIKE', '%not assigned%')
                    ->orWhere('orders.status', 'LIKE', '%pending route%');
            });

        $rows = $query
            ->select('orders.id as o_id')
            ->orderBy('orders.id', 'desc')
            ->limit(10)
            ->get();

        return [
            'count_un_route' => (int) $rows->count(),
            'data' => $rows->map(static fn ($row): array => [
                'o_id' => (int) ($row->o_id ?? 0),
                'origin_company_name' => '', // Needs address join if really needed
                'dest_company_name' => '',
            ])->all(),
        ];
    }

    /**
     * @param array<int, string> $statusTerms
     * @return array<int, array<string, mixed>>
     */
    private function statusBuckets(array $statusTerms): array
    {
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return [];
        }

        $query = DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->selectRaw("DATE(order_critical_dates.scheduled_delivery_date) as date, COUNT(*) as total_orders")
            ->where(function ($q) use ($statusTerms): void {
                foreach ($statusTerms as $term) {
                    $q->orWhere('orders.status', 'LIKE', '%'.$term.'%');
                }
            })
            ->whereNotNull('order_critical_dates.scheduled_delivery_date')
            ->groupByRaw("DATE(order_critical_dates.scheduled_delivery_date)")
            ->orderByRaw("DATE(order_critical_dates.scheduled_delivery_date) desc")
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
        if ($userId <= 0 || !Schema::hasTable('order_notes') || !Schema::hasTable('order_note_users')) {
            return [];
        }

        return DB::table('order_notes')
            ->join('order_note_users', 'order_notes.id', '=', 'order_note_users.order_notes_id')
            ->where('order_note_users.users_id', $userId)
            ->where('order_note_users.read', 0)
            ->orderByDesc('order_notes.created_at')
            ->limit(20)
            ->get()
            ->map(static fn ($row): array => [
                'message' => (string) ($row->notes ?? ''),
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

        $query = DB::table('tasks')
            ->where(function ($q): void {
                $q->where('task_status', 'LIKE', '%open%')
                    ->orWhere('task_status', 'LIKE', '%pending%')
                    ->orWhereNull('task_status');
            });

        if ($userId > 0) {
            if ($forCurrentUser) {
                $query->where('created_by', $userId);
            } else {
                $query->where('created_by', '<>', $userId);
            }
        }

        return $query->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) ($row->id ?? 0),
                'task_name' => (string) ($row->task_name ?? ''),
                'task_desc' => (string) ($row->task_desc ?? ''),
            ])
            ->filter(static fn ($row): bool => trim((string) ($row['task_name'] ?? '')) !== '')
            ->values()
            ->all();
    }

    private function countScheduled(string $type, \DateTimeInterface $date): int
    {
        if (!Schema::hasTable('orders') || !Schema::hasTable('order_critical_dates')) {
            return 0;
        }

        $column = $type === 'delivery' ? 'scheduled_delivery_date' : 'scheduled_pickup_date';

        return (int) DB::table('orders')
            ->join('order_critical_dates', 'orders.id', '=', 'order_critical_dates.orders_id')
            ->whereDate('order_critical_dates.'.$column, $date)
            ->count();
    }

    private function countNoAction(int $hours): int
    {
        if (!Schema::hasTable('orders')) {
            return 0;
        }

        return (int) DB::table('orders')
            ->where('created_at', '>=', now()->subHours($hours))
            ->where(function ($q): void {
                $q->where('status', 'LIKE', '%new%')
                    ->orWhere('status', 'LIKE', '%pending%');
            })
            ->count();
    }

    private function countNotScheduled(int $hours, bool $notified = false): int
    {
        if (!Schema::hasTable('orders')) {
            return 0;
        }

        $query = DB::table('orders')
            ->where('created_at', '<=', now()->subHours($hours))
            ->whereNotExists(function ($q): void {
                $q->select(DB::raw(1))
                    ->from('order_critical_dates')
                    ->whereRaw('order_critical_dates.orders_id = orders.id');
            });

        if ($notified) {
            $query->where('status', 'LIKE', '%notified%');
        }

        return (int) $query->count();
    }
}
