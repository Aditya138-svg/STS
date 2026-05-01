<?php

namespace App\Http\Controllers\Admin\AdminSection;

use App\Http\Controllers\Controller;
use App\Models\Associate;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function index(Request $request): Response
    {
        $users = $this->getUsers($request);

        return Inertia::render('Admin/AdminSection/Users/User', [
            'users' => $users['data'],
            'pagination' => [
                'current_page' => $users['current_page'],
                'per_page' => $users['per_page'],
                'total' => $users['total'],
                'last_page' => $users['last_page'],
            ],
            'filters' => [
                'search' => $request->get('search', ''),
                'user_type' => $request->get('user_type', ''),
                'associate' => $request->get('associate', ''),
                'storage_rule' => $request->get('storage_rule', ''),
                'invoice_terms' => $request->get('invoice_terms', ''),
                'is_active' => $request->get('is_active', ''),
                'order_by' => $request->get('order_by', 'created_at'),
                'order_direction' => $request->get('order_direction', 'desc'),
            ],
            'user_types' => $this->getUserTypes(),
            'roles_dropdown' => $this->getRolesDropdownMap(),
            'roles_list' => $this->getRolesList(),
            'role_filter_labels' => $this->getRoleFilterLabels(),
            'associates' => $this->getAssociates(),
            'storage_rules' => $this->getStorageRules(),
            'invoice_terms' => $this->getInvoiceTerms(),
            'status_flags' => [
                'active' => (string) config('sts.user_active_flag', '1'),
                'inactive' => (string) config('sts.user_inactive_flag', '0'),
            ],
            'links' => [
                'create_user' => route('admin.admin_section.users.create', [], false),
                'help_users' => $this->helpUrlForGuide('users'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/AdminSection/Users/UserAccount', [
            'mode' => 'create',
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('Admin/AdminSection/Users/UserAccount', [
            'mode' => 'view',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/AdminSection/Users/UserAccount', [
            'mode' => 'edit',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        if (! Schema::hasTable('users')) {
            return back()->with('error', 'Users table not found.');
        }

        $ids = array_values(array_unique(array_map('intval', $data['ids'])));
        $selfId = (int) ($request->user()?->id ?? 0);
        $ids = array_values(array_filter($ids, fn (int $id) => $id > 0 && $id !== $selfId));

        if ($ids === []) {
            return back()->with('error', 'No valid users selected.');
        }

        DB::table('users')->whereIn('id', $ids)->delete();

        return redirect()
            ->route('admin.admin_section.users.index')
            ->with('success', 'Selected users were deleted.');
    }

    private function helpUrlForGuide(string $guide): string
    {
        $base = (string) config('sts.help_guide_base_url', '');
        if ($base === '') {
            return '#';
        }

        return $base.'/'.ltrim($guide, '/');
    }

    /**
     * Fixed ordered labels for “Choose Role” (Admin, External Customer, …).
     *
     * @return array<int, string>
     */
    private function getRoleFilterLabels(): array
    {
        return array_values(array_map(static fn ($label): string => (string) $label, config('sts.user_role_options', [])));
    }

    /**
     * @return array<string, string> value => label for “Choose Role” (canonical options only)
     */
    private function getRolesList(): array
    {
        $map = [];
        foreach (config('sts.user_role_options', []) as $label) {
            $label = (string) $label;
            $map[$label] = $label;
        }

        return $map;
    }

    /**
     * Blade parity: option value = stored token sent to server (legacy numeric keys when mapped).
     *
     * @return array<string, string>
     */
    private function getRolesDropdownMap(): array
    {
        $map = [];
        foreach (config('sts.user_role_options', []) as $label) {
            $label = (string) $label;
            $stored = $this->primaryStoredTokenForRoleLabel($label);
            $map[(string) $stored] = $label;
        }

        foreach ($this->getUserTypesRaw() as $raw) {
            $key = (string) $raw;
            $map[$key] = $this->normalizeUserRoleLabel($key);
        }

        return $map;
    }

    private function primaryStoredTokenForRoleLabel(string $displayLabel): string
    {
        foreach (config('sts.user_role_legacy_map', []) as $stored => $mapped) {
            if ((string) $mapped === $displayLabel) {
                return (string) $stored;
            }
        }

        return $displayLabel;
    }

    /**
     * @return array<int, mixed>
     */
    private function getUserTypesRaw(): array
    {
        if (! Schema::hasTable('users') || ! Schema::hasColumn('users', 'user_role')) {
            return [];
        }

        return DB::table('users')
            ->whereNotNull('user_role')
            ->where('user_role', '<>', '')
            ->distinct()
            ->orderBy('user_role')
            ->pluck('user_role')
            ->toArray();
    }

    private function normalizeUserRoleLabel(?string $raw): string
    {
        if ($raw === null || $raw === '') {
            return '-';
        }

        $key = trim((string) $raw);

        $legacy = config('sts.user_role_legacy_map', []);
        if ($legacy !== []) {
            if (array_key_exists($key, $legacy)) {
                return (string) $legacy[$key];
            }
            // PDO sometimes yields ints; config keys are string digits
            if (ctype_digit($key)) {
                $normalizedKey = (string) (int) $key;
                if (array_key_exists($normalizedKey, $legacy)) {
                    return (string) $legacy[$normalizedKey];
                }
            }
        }

        $fromSlug = $this->displayLabelFromStsRoleSlug($key);
        if ($fromSlug !== null) {
            return $fromSlug;
        }

        $displayMap = config('sts.user_role_display_map', []);
        if ($displayMap !== []) {
            if (array_key_exists($key, $displayMap)) {
                return (string) $displayMap[$key];
            }
            if (ctype_digit($key)) {
                $normalizedKey = (string) (int) $key;
                if (array_key_exists($normalizedKey, $displayMap)) {
                    return (string) $displayMap[$normalizedKey];
                }
            }
        }

        foreach (config('sts.user_role_options', []) as $opt) {
            if (strcasecmp($key, (string) $opt) === 0) {
                return (string) $opt;
            }
        }

        return $raw;
    }

    /**
     * Match stored values that equal configured sts.roles slugs (env-driven).
     */
    private function displayLabelFromStsRoleSlug(string $key): ?string
    {
        $roles = config('sts.roles', []);
        $pairs = [
            $roles['admin'] ?? null => 'Admin',
            $roles['office'] ?? null => 'Office',
            $roles['warehouse'] ?? null => 'Warehouse',
            $roles['corporate'] ?? null => 'External Customer',
            $roles['non_corporate'] ?? null => 'External Customer',
        ];

        foreach ($pairs as $slug => $label) {
            if ($slug !== null && $slug !== '' && (string) $slug === $key) {
                return $label;
            }
        }

        return null;
    }

    /**
     * All user_role values in the DB that should match the chosen friendly label (no schema changes).
     *
     * @return array<int, string|int>
     */
    private function storedRoleValuesMatchingDisplayLabel(string $displayLabel): array
    {
        $values = [$displayLabel];

        foreach (config('sts.user_role_legacy_map', []) as $stored => $mapped) {
            if ((string) $mapped === $displayLabel) {
                $values[] = $stored;
            }
        }

        foreach (config('sts.user_role_display_map', []) as $stored => $mapped) {
            if ((string) $mapped === $displayLabel) {
                $values[] = $stored;
            }
        }

        $roles = config('sts.roles', []);
        $slugPairs = [
            $roles['admin'] ?? null => 'Admin',
            $roles['office'] ?? null => 'Office',
            $roles['warehouse'] ?? null => 'Warehouse',
            $roles['corporate'] ?? null => 'External Customer',
            $roles['non_corporate'] ?? null => 'External Customer',
        ];
        foreach ($slugPairs as $slug => $label) {
            if ($label === $displayLabel && $slug !== null && $slug !== '') {
                $values[] = $slug;
            }
        }

        $unique = [];
        foreach ($values as $v) {
            $unique[(string) $v] = $v;
        }

        return array_values($unique);
    }

    /**
     * First matching column on users table (legacy schemas vary).
     */
    private function firstExistingColumnOnUsers(array $candidates): ?string
    {
        if (! Schema::hasTable('users')) {
            return null;
        }

        foreach ($candidates as $col) {
            if (Schema::hasColumn('users', $col)) {
                return $col;
            }
        }

        return null;
    }

    /**
     * @param  mixed  $rawStorageOrInvoice
     */
    private function formatStorageOrInvoiceCell(string $roleDisplay, mixed $rawStorageOrInvoice): string
    {
        if ($rawStorageOrInvoice !== null && trim((string) $rawStorageOrInvoice) !== '') {
            return trim((string) $rawStorageOrInvoice);
        }

        return 'N/A';
    }

    private function formatStorageFeeLine(?string $days, ?string $amount): ?string
    {
        if ($days === null || $days === '' || $amount === null || $amount === '') {
            return null;
        }

        return 'Fee after '.trim($days).' days is $'.trim($amount).' /day';
    }

    private function getUsers(Request $request): array
    {
        if (! Schema::hasTable('users')) {
            return $this->emptyPaginatedResponse();
        }

        $hasStorageDays = Schema::hasColumn('users', 'storage_rule_days');
        $hasStorageAmount = Schema::hasColumn('users', 'storage_rule_amount_per_day');

        $storageUsersCol = $this->firstExistingColumnOnUsers([
            'storage_rule',
            'storage_rules',
            'storage_rule_text',
            'user_storage_rule',
        ]);
        $invoiceUsersCol = $this->firstExistingColumnOnUsers([
            'invoice_terms',
            'invoice_term',
            'billing_terms',
            'payment_terms',
        ]);

        $query = DB::table('users');

        $joinAssoc = Schema::hasTable('associates')
            && Schema::hasColumn('users', 'associates_id');

        if ($joinAssoc) {
            $query->leftJoin('associates', 'associates.id', '=', 'users.associates_id');
        }

        $parts = [];
        $map = [
            'id' => 'id',
            'name' => 'name',
            'email' => 'email',
            'phone1' => 'phone1',
            'phone2' => 'phone2',
            'profile_pic' => 'profile_image',
            'user_role' => 'user_type',
            'active' => 'is_active_raw',
            'associates_id' => 'associate_id',
            'created_at' => 'created_at',
        ];

        foreach ($map as $col => $alias) {
            if (Schema::hasColumn('users', $col)) {
                $parts[] = "users.{$col} as {$alias}";
            }
        }

        if ($storageUsersCol !== null) {
            $parts[] = "users.{$storageUsersCol} as storage_rule";
        }
        if ($hasStorageDays) {
            $parts[] = 'users.storage_rule_days as storage_rule_days';
        }
        if ($hasStorageAmount) {
            $parts[] = 'users.storage_rule_amount_per_day as storage_rule_amount_per_day';
        }
        if ($invoiceUsersCol !== null) {
            $parts[] = "users.{$invoiceUsersCol} as invoice_terms";
        }

        foreach (['company_name', 'company'] as $col) {
            if (Schema::hasColumn('users', $col)) {
                $parts[] = "users.{$col} as company_name";
                break;
            }
        }

        if ($joinAssoc) {
            $parts[] = 'associates.a_company_name as associate_name';
        }

        if ($parts !== []) {
            $query->selectRaw(implode(', ', $parts));
        } else {
            $query->select('users.*');
        }

        $search = $request->get('search');
        if ($search) {
            $query->where(function ($q) use ($search, $joinAssoc) {
                foreach (['name', 'email', 'phone1', 'phone2'] as $col) {
                    if (Schema::hasColumn('users', $col)) {
                        $q->orWhere('users.'.$col, 'LIKE', "%{$search}%");
                    }
                }
                foreach (['company_name', 'company'] as $col) {
                    if (Schema::hasColumn('users', $col)) {
                        $q->orWhere('users.'.$col, 'LIKE', "%{$search}%");
                    }
                }
                if ($joinAssoc) {
                    $q->orWhere('associates.a_company_name', 'LIKE', "%{$search}%");
                }
            });
        }

        $userType = $request->get('user_type');
        if ($userType !== '' && $userType !== null && Schema::hasColumn('users', 'user_role')) {
            $param = (string) $userType;
            $label = $this->normalizeUserRoleLabel($param);
            $variants = ($label !== '-' && $label !== '')
                ? $this->storedRoleValuesMatchingDisplayLabel($label)
                : [];
            $variants[] = $param;
            $variants = array_values(array_unique($variants));
            $query->whereIn('users.user_role', $variants);
        }

        $associate = $request->get('associate');
        if ($associate !== '' && $associate !== null && Schema::hasColumn('users', 'associates_id')) {
            $query->where('users.associates_id', $associate);
        }

        $storageRule = $request->get('storage_rule');
        if ($storageRule !== '' && $storageRule !== null) {
            $trimmed = trim((string) $storageRule);
            if ($storageUsersCol !== null) {
                $query->where('users.'.$storageUsersCol, $trimmed);
            } elseif ($hasStorageDays && $hasStorageAmount && preg_match('/Fee after (\d+) days is \$([\d.]+) \/day/', $trimmed, $m)) {
                $query->where('users.storage_rule_days', $m[1])
                    ->where('users.storage_rule_amount_per_day', $m[2]);
            }
        }

        $invoiceTerms = $request->get('invoice_terms');
        if ($invoiceTerms && $invoiceUsersCol !== null) {
            $query->where('users.'.$invoiceUsersCol, $invoiceTerms);
        }

        $isActive = $request->get('is_active');
        if ($isActive !== '' && $isActive !== null && Schema::hasColumn('users', 'active')) {
            $activeVal = config('sts.user_active_flag', '1');
            $inactiveVal = config('sts.user_inactive_flag', '0');
            if ((string) $isActive === (string) $activeVal) {
                $query->where('users.active', $activeVal);
            } elseif ((string) $isActive === (string) $inactiveVal) {
                $query->where(function ($q) use ($inactiveVal) {
                    $q->where('users.active', $inactiveVal)->orWhereNull('users.active');
                });
            }
        }

        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = strtolower((string) $request->get('order_direction', 'desc')) === 'asc' ? 'asc' : 'desc';

        $orderExpr = 'users.id';
        if ($joinAssoc && in_array($orderBy, ['company', 'company_name', 'associate_raw', 'associate_name'], true)) {
            $orderExpr = 'associates.a_company_name';
        } elseif (Schema::hasColumn('users', $orderBy)) {
            $orderExpr = 'users.'.$orderBy;
        } elseif (Schema::hasColumn('users', 'created_at')) {
            $orderExpr = 'users.created_at';
        }

        $query->orderBy($orderExpr, $orderDirection);

        $perPage = max(1, min(100, (int) $request->get('per_page', 10)));
        $page = max(1, (int) $request->get('page', 1));

        $total = (clone $query)->count('users.id');
        $rows = (clone $query)
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        $activeFlag = config('sts.user_active_flag', '1');

        $data = $rows->map(function ($user) use ($activeFlag, $hasStorageDays, $hasStorageAmount) {
            $u = (array) $user;

            $rawActive = $u['is_active_raw'] ?? null;
            $isActiveUser = false;
            if ($rawActive !== null && $rawActive !== '') {
                $isActiveUser = (string) $rawActive === (string) $activeFlag || $rawActive === 1 || $rawActive === true;
            }

            $assocName = $u['associate_name'] ?? null;
            $companyName = $u['company_name'] ?? null;

            $roleRaw = $u['user_type'] ?? null;
            $roleDisplay = $this->normalizeUserRoleLabel($roleRaw !== null ? (string) $roleRaw : null);

            $storageRaw = $u['storage_rule'] ?? null;
            $feeLine = ($hasStorageDays && $hasStorageAmount)
                ? $this->formatStorageFeeLine(
                    isset($u['storage_rule_days']) ? (string) $u['storage_rule_days'] : null,
                    isset($u['storage_rule_amount_per_day']) ? (string) $u['storage_rule_amount_per_day'] : null,
                )
                : null;
            $storageDisplay = $feeLine
                ?? (($storageRaw !== null && trim((string) $storageRaw) !== '') ? trim((string) $storageRaw) : null);
            $invoiceRaw = $u['invoice_terms'] ?? null;

            return [
                'id' => $u['id'] ?? null,
                'profile_pic' => $u['profile_image'] ?? null,
                'profile_image' => $u['profile_image'] ?? null,
                'company_name' => $companyName ?: '-',
                'name' => $u['name'] ?? '-',
                'email' => $u['email'] ?? '-',
                'user_role' => $roleDisplay,
                'user_role_raw' => $roleRaw,
                'user_type' => $roleRaw,
                'associate' => $assocName ?: '-',
                'associate_raw' => $assocName ?: '',
                'associate_id' => $u['associate_id'] ?? null,
                'storage_rule' => $this->formatStorageOrInvoiceCell($roleDisplay, $storageDisplay),
                'invoice_term' => $this->formatStorageOrInvoiceCell($roleDisplay, $invoiceRaw),
                'invoice_terms' => $invoiceRaw,
                'created_at' => $u['created_at'] ?? null,
                'created_on' => ! empty($u['created_at'])
                    ? date('m/d/Y h:i A', strtotime((string) $u['created_at']))
                    : '-',
                'is_active' => $isActiveUser,
                'active_label' => $isActiveUser ? 'Active' : 'Inactive',
            ];
        })->toArray();

        return [
            'data' => $data,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => max(1, (int) ceil($total / $perPage)),
        ];
    }

    /**
     * Distinct friendly role labels currently present in the database (for alignment / summaries).
     *
     * @return array<int, string>
     */
    private function getUserTypes(): array
    {
        $seen = [];
        foreach ($this->getUserTypesRaw() as $role) {
            $label = $this->normalizeUserRoleLabel((string) $role);
            if ($label !== '-' && $label !== '') {
                $seen[$label] = true;
            }
        }

        $labels = array_keys($seen);
        sort($labels);

        return $labels;
    }

    private function getAssociates(): array
    {
        if (Schema::hasTable('associates')) {
            return Associate::query()
                ->select('id', 'a_company_name as name', 'a_company_name as company_name')
                ->where('a_status', 1)
                ->orderBy('a_company_name')
                ->get()
                ->toArray();
        }

        return [];
    }

    private function getStorageRules(): array
    {
        $col = $this->firstExistingColumnOnUsers([
            'storage_rule',
            'storage_rules',
            'storage_rule_text',
            'user_storage_rule',
        ]);

        $strings = [];
        if ($col !== null) {
            $strings = DB::table('users')
                ->whereNotNull($col)
                ->where($col, '<>', '')
                ->distinct()
                ->orderBy($col)
                ->pluck($col)
                ->toArray();
        }

        $feeLines = [];
        if (Schema::hasColumn('users', 'storage_rule_days') && Schema::hasColumn('users', 'storage_rule_amount_per_day')) {
            $feeLines = DB::table('users')
                ->select('storage_rule_days', 'storage_rule_amount_per_day')
                ->whereNotNull('storage_rule_days')
                ->whereNotNull('storage_rule_amount_per_day')
                ->distinct()
                ->orderBy('storage_rule_days')
                ->orderBy('storage_rule_amount_per_day')
                ->get()
                ->map(fn ($r) => $this->formatStorageFeeLine(
                    (string) $r->storage_rule_days,
                    (string) $r->storage_rule_amount_per_day,
                ))
                ->filter()
                ->unique()
                ->values()
                ->toArray();
        }

        return array_values(array_unique(array_merge($strings, $feeLines)));
    }

    private function getInvoiceTerms(): array
    {
        $col = $this->firstExistingColumnOnUsers([
            'invoice_terms',
            'invoice_term',
            'billing_terms',
            'payment_terms',
        ]);
        if ($col === null) {
            return [];
        }

        return DB::table('users')
            ->whereNotNull($col)
            ->where($col, '<>', '')
            ->distinct()
            ->orderBy($col)
            ->pluck($col)
            ->toArray();
    }

    private function emptyPaginatedResponse(): array
    {
        return [
            'data' => [],
            'current_page' => 1,
            'per_page' => 10,
            'total' => 0,
            'last_page' => 1,
        ];
    }
}