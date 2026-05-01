<?php

namespace App\Http\Controllers\Admin\AdminSection;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class TasksController extends Controller
{
    public function myTask(Request $request): Response
    {
        return $this->renderTasksPage($request, 'Admin/AdminSection/Tasks/MyTask', 'My Task', 'mine');
    }

    public function overallTask(Request $request): Response
    {
        return $this->renderTasksPage($request, 'Admin/AdminSection/Tasks/OverallTask', 'Overall Task', 'overall');
    }

    public function privateNotes(Request $request): Response
    {
        return $this->renderNotesPage($request, 'Admin/AdminSection/Tasks/PrivateNotes', 'Private Notes', false);
    }

    public function publicNotes(Request $request): Response
    {
        return $this->renderNotesPage($request, 'Admin/AdminSection/Tasks/PublicNotes', 'Public Notes', true);
    }

    private function renderTasksPage(Request $request, string $page, string $title, string $mode): Response
    {
        $rows = $this->tasks((int) ($request->user()?->id ?? 0), $mode);

        return Inertia::render($page, [
            'tasksPage' => [
                'title' => $title,
                'rows' => $rows,
            ],
        ]);
    }

    private function renderNotesPage(Request $request, string $page, string $title, bool $public): Response
    {
        $rows = $this->notes((int) ($request->user()?->id ?? 0), $public);

        return Inertia::render($page, [
            'tasksPage' => [
                'title' => $title,
                'rows' => $rows,
            ],
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function tasks(int $userId, string $mode): array
    {
        if (!Schema::hasTable('tasks')) {
            return [];
        }

        $nameCol = $this->firstExistingColumn('tasks', ['task_name', 'name', 'title']);
        $descCol = $this->firstExistingColumn('tasks', ['task_desc', 'description', 'notes']);
        $ownerCol = $this->firstExistingColumn('tasks', ['users_id', 'user_id', 'created_by']);
        $statusCol = $this->firstExistingColumn('tasks', ['status', 'task_status']);
        $createdCol = $this->firstExistingColumn('tasks', ['created_at', 'created_date', 'date']);

        if ($nameCol === null) {
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
            if ($mode === 'mine') {
                $query->where($ownerCol, $userId);
            } elseif ($mode === 'overall') {
                $query->where($ownerCol, '<>', $userId);
            }
        }

        if ($createdCol !== null) {
            $query->orderByDesc($createdCol);
        } else {
            $query->orderByDesc('id');
        }

        return $query
            ->limit(200)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) ($row->id ?? 0),
                'title' => (string) ($row->{$nameCol} ?? ''),
                'description' => (string) ($descCol ? ($row->{$descCol} ?? '') : ''),
            ])
            ->filter(static fn ($row): bool => trim((string) ($row['title'] ?? '')) !== '')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function notes(int $userId, bool $public): array
    {
        if (!Schema::hasTable('order_notes')) {
            return [];
        }

        $messageCol = $this->firstExistingColumn('order_notes', ['notes', 'message', 'note']);
        $publicCol = $this->firstExistingColumn('order_notes', ['is_public', 'public']);
        $userCol = $this->firstExistingColumn('order_notes', ['users_id', 'user_id', 'created_by']);
        $createdCol = $this->firstExistingColumn('order_notes', ['created_at', 'created_date', 'date']);

        if ($messageCol === null) {
            return [];
        }

        $query = DB::table('order_notes');

        if ($publicCol !== null) {
            $query->where($publicCol, $public ? 1 : 0);
        }

        if ($userCol !== null && $userId > 0 && !$public) {
            $query->where($userCol, $userId);
        }

        if ($createdCol !== null) {
            $query->orderByDesc($createdCol);
        } else {
            $query->orderByDesc('id');
        }

        return $query
            ->limit(200)
            ->get()
            ->map(static fn ($row): array => [
                'id' => (int) ($row->id ?? 0),
                'title' => (string) ($row->{$messageCol} ?? ''),
                'description' => '',
            ])
            ->filter(static fn ($row): bool => trim((string) ($row['title'] ?? '')) !== '')
            ->values()
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
