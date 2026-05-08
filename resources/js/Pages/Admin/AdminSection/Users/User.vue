<script setup>
import { ref, computed, watch } from 'vue'
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'

const page = usePage()

const props = defineProps({
    users: { type: Array, default: () => [] },
    pagination: {
        type: Object,
        default: () => ({
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1,
        }),
    },
    filters: { type: Object, default: () => ({}) },
    /** Distinct friendly role labels present in the database */
    user_types: { type: Array, default: () => [] },
    /** Stored role token → label (Blade roles_list parity: option value is stored key) */
    roles_dropdown: { type: Object, default: () => ({}) },
    roles_list: { type: Object, default: () => ({}) },
    /** Ordered labels for “Choose Role”: Admin, External Customer, … */
    role_filter_labels: { type: Array, default: () => [] },
    associates: { type: Array, default: () => [] },
    storage_rules: { type: Array, default: () => [] },
    invoice_terms: { type: Array, default: () => [] },
    status_flags: {
        type: Object,
        default: () => ({ active: '1', inactive: '0' }),
    },
    links: {
        type: Object,
        default: () => ({ create_user: '#', help_users: '#' }),
    },
})

const { href } = useAdminAssets()

const search = ref(props.filters.search || '')
const userType = ref(props.filters.user_type || '')
const associate = ref(props.filters.associate || '')
const storageRule = ref(props.filters.storage_rule || '')
const invoiceTermsFilter = ref(props.filters.invoice_terms || '')
const isActive = ref(
    props.filters.is_active !== undefined && props.filters.is_active !== null
        ? String(props.filters.is_active)
        : ''
)
const perPage = ref(Number(props.pagination.per_page) || 10)
const sortBy = ref(props.filters.order_by || 'created_at')
const sortDirection = ref(props.filters.order_direction || 'desc')

const selectedIds = ref(new Set())
const selectAllOnPage = ref(false)
const deleting = ref(false)

let searchTimer = null
watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => applyFilters(), 600)
})

watch(perPage, () => applyFilters())

watch(
    () => props.filters,
    (f) => {
        search.value = f.search ?? ''
        userType.value =
            f.user_type !== undefined && f.user_type !== null && f.user_type !== ''
                ? String(f.user_type)
                : ''
        associate.value =
            f.associate !== undefined && f.associate !== null && f.associate !== ''
                ? String(f.associate)
                : ''
        storageRule.value =
            f.storage_rule !== undefined && f.storage_rule !== null && f.storage_rule !== ''
                ? String(f.storage_rule)
                : ''
        invoiceTermsFilter.value =
            f.invoice_terms !== undefined && f.invoice_terms !== null && f.invoice_terms !== ''
                ? String(f.invoice_terms)
                : ''
        isActive.value =
            f.is_active !== undefined && f.is_active !== null && f.is_active !== ''
                ? String(f.is_active)
                : ''
        if (f.order_by) sortBy.value = f.order_by
        if (f.order_direction) sortDirection.value = f.order_direction
    },
    { deep: true }
)

watch(
    () => props.pagination?.per_page,
    (pp) => {
        if (pp !== undefined && pp !== null) perPage.value = Number(pp) || 10
    },
    { immediate: true }
)

function queryPayload(extra = {}) {
    const q = { ...extra }
    if (search.value) q.search = search.value
    if (userType.value) q.user_type = userType.value
    if (associate.value) q.associate = associate.value
    if (storageRule.value) q.storage_rule = storageRule.value
    if (invoiceTermsFilter.value) q.invoice_terms = invoiceTermsFilter.value
    if (isActive.value !== '') q.is_active = isActive.value
    if (Number(perPage.value) !== 10) q.per_page = perPage.value
    if (sortBy.value !== 'created_at') q.order_by = sortBy.value
    if (sortDirection.value !== 'desc') q.order_direction = sortDirection.value
    return q
}

function userShowPath(id) {
    return `admin/admin-section/users/user/${id}`
}

function userEditPath(id) {
    return `admin/admin-section/users/user/${id}/edit`
}

function applyFilters() {
    router.get(window.location.pathname, queryPayload({ page: 1 }), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

function goToPage(pageNum) {
    router.get(window.location.pathname, queryPayload({ page: pageNum }), {
        preserveState: true,
        preserveScroll: true,
    })
}

function sort(column) {
    if (sortBy.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = column
        sortDirection.value = 'asc'
    }
    applyFilters()
}

function getUserImage(user) {
    const pic = user.profile_pic || user.profile_image
    if (pic) {
        return String(pic).startsWith('http') ? pic : `/storage/${pic}`
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&size=40`
}

function toggleRow(id, checked) {
    const next = new Set(selectedIds.value)
    if (checked) next.add(id)
    else next.delete(id)
    selectedIds.value = next
    syncSelectAllState()
}

function syncSelectAllState() {
    const idsOnPage = props.users.map((u) => u.id).filter(Boolean)
    selectAllOnPage.value =
        idsOnPage.length > 0 && idsOnPage.every((id) => selectedIds.value.has(id))
}

function toggleSelectAll(checked) {
    const next = new Set(selectedIds.value)
    props.users.forEach((u) => {
        if (!u.id) return
        if (checked) next.add(u.id)
        else next.delete(u.id)
    })
    selectedIds.value = next
    selectAllOnPage.value = checked
}

watch(
    () => props.users,
    () => {
        syncSelectAllState()
    },
    { immediate: true }
)

const paginationInfo = computed(() => {
    const total = props.pagination.total || 0
    if (!total) return { start: 0, end: 0 }
    const start = (props.pagination.current_page - 1) * props.pagination.per_page + 1
    const end = Math.min(props.pagination.current_page * props.pagination.per_page, total)
    return { start, end }
})

const flashSuccess = computed(() => page.props.flash?.success)
const flashError = computed(() => page.props.flash?.error)

function bulkDelete() {
    const ids = [...selectedIds.value]
    if (!ids.length) {
        alert('Please select at least 1 user.')
        return
    }
    if (!confirm('Are you sure you want to delete?')) return

    deleting.value = true
    router.post(href('admin/admin-section/users/user/bulk-delete'), { ids }, {
        preserveScroll: true,
        onFinish: () => {
            deleting.value = false
            selectedIds.value = new Set()
            selectAllOnPage.value = false
        },
    })
}

/** Shortened pagination with ellipses */
const displayedPages = computed(() => {
    const total = props.pagination.last_page || 1
    const current = props.pagination.current_page || 1
    const pages = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > 3) pages.push('...')

        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i)
        }

        if (current < total - 2) pages.push('...')
        if (!pages.includes(total)) pages.push(total)
    }
    return pages
})
</script>

<template>
    <Head title="Users" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="box">
                <div class="box-header-flex">
                    <h3 class="box-title">User Directory</h3>
                    <div class="header-actions">
                        <Link :href="href(links.create_user.replace(/^\//, ''))" class="btn btn-warning">
                            <i class="fa fa-plus me-1"></i> Create User
                        </Link>
                        <button type="button" class="btn btn-danger" :disabled="deleting" @click="bulkDelete">
                            <i class="fa fa-trash me-1"></i> Delete
                        </button>
                        <a :href="links.help_users" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            <i class="fa fa-question-circle me-1"></i> Help
                        </a>
                    </div>
                </div>

                <div class="box-body">
                    <div v-if="flashSuccess" class="alert alert-success">{{ flashSuccess }}</div>
                    <div v-if="flashError" class="alert alert-danger">{{ flashError }}</div>

                    <p class="text-right small mb-2">
                        <a href="#user-filters">Jump to filters</a>
                        ·
                        <a href="#listing_table">Jump to table</a>
                    </p>

                    <!-- Blade-style filters: Status + Role (DataTables #filter_by_status_div / #filter_by_role) -->
                    <div class="sts-table-filter-shell">
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Account Status</span>
                            <select v-model="isActive" class="sts-input-sm" @change="applyFilters">
                                <option value="">-All Statuses-</option>
                                <option :value="status_flags.active">Active</option>
                                <option :value="status_flags.inactive">In-Active</option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">User Role</span>
                            <select v-model="userType" class="sts-input-sm" @change="applyFilters">
                                <option value="">-Choose Role-</option>
                                <option v-for="(label, storedKey) in roles_dropdown" :key="storedKey" :value="storedKey">
                                    {{ label }}
                                </option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Associate</span>
                            <select v-model="associate" class="sts-input-sm" @change="applyFilters">
                                <option value="">-All Associates-</option>
                                <option v-for="a in associates" :key="a.id" :value="String(a.id)">
                                    {{ a.name || a.company_name }}
                                </option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Storage Rule</span>
                            <select v-model="storageRule" class="sts-input-sm" @change="applyFilters">
                                <option value="">-All-</option>
                                <option v-for="s in storage_rules" :key="s" :value="s">{{ s }}</option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Quick Search</span>
                            <input v-model="search" type="text" class="sts-input-sm" placeholder="Name, email, company..." />
                        </div>
                        <button type="button" class="sts-btn-go ms-auto" @click="applyFilters">
                            <i class="fa fa-filter me-2"></i> Apply Filters
                        </button>
                    </div>

                    <p v-if="user_types.length" class="text-muted small mb-3 user-types-line">
                        User types in data:
                        <span v-for="(t, i) in user_types" :key="t">
                            <strong>{{ t }}</strong><span v-if="i < user_types.length - 1"> · </span>
                        </span>
                    </p>

                    <div class="table-responsive">
                        <table class="sts-table" id="listing_table">
                            <thead>
                                <tr>
                                    <th class="text-center checkbox-col">
                                        <input
                                            type="checkbox"
                                            :checked="selectAllOnPage"
                                            @change="toggleSelectAll(($event.target).checked)"
                                            class="row-checkbox"
                                        />
                                    </th>
                                    <th>User</th>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Associate</th>
                                    <th>Rule/Terms</th>
                                    <th>Created On</th>
                                    <th>Status</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td class="text-center">
                                        <input
                                            type="checkbox"
                                            :checked="selectedIds.has(user.id)"
                                            @change="toggleRow(user.id, ($event.target).checked)"
                                            class="row-checkbox"
                                        />
                                    </td>
                                    <td>
                                        <div class="user-info-cell" style="display: flex; align-items: center; gap: 12px;">
                                            <img :src="getUserImage(user)" class="sts-avatar" width="40" height="40" alt="" />
                                            <div class="user-details">
                                                <div style="font-weight: 700; color: var(--sts-text-main);">{{ user.name }}</div>
                                                <div style="font-size: 12px; color: var(--sts-text-muted);">{{ user.email }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ user.company_name || '-' }}</td>
                                    <td><span class="sts-id-tag">{{ user.user_role }}</span></td>
                                    <td>{{ user.associate || '-' }}</td>
                                    <td>
                                        <div style="font-size: 13px;">{{ user.storage_rule || '-' }}</div>
                                        <div style="font-size: 11px; opacity: 0.7;">{{ user.invoice_term || '-' }}</div>
                                    </td>
                                    <td>{{ user.created_on }}</td>
                                    <td class="text-center">
                                        <span :class="['sts-badge', user.is_active ? 'sts-badge-success' : 'sts-badge-danger']">
                                            {{ user.active_label }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <div class="sts-action-icons">
                                            <Link :href="href(userShowPath(user.id))" class="sts-action-link" title="View Profile">
                                                <i class="fa fa-eye"></i>
                                            </Link>
                                            <Link :href="href(userEditPath(user.id))" class="sts-action-link" title="Edit User">
                                                <i class="fa fa-pencil"></i>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!users.length">
                                    <td colspan="12" class="sts-table-empty">
                                        <i class="fa fa-users sts-empty-icon"></i>
                                        <span class="sts-empty-text">No users found</span>
                                        <span class="sts-empty-subtext">Try adjusting your filters or search terms.</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="row mt-20" v-if="pagination.total > 0">
                        <div class="col-md-6">
                            <div style="font-size: 13px; color: var(--sts-text-muted); font-weight: 500;">
                                Showing <span style="color: var(--sts-text-main); font-weight: 700;">{{ paginationInfo.start }}</span> to <span style="color: var(--sts-text-main); font-weight: 700;">{{ paginationInfo.end }}</span> of <span style="color: var(--sts-text-main); font-weight: 700;">{{ pagination.total }}</span> users
                            </div>
                        </div>
                        <div class="col-md-6">
                            <ul class="sts-pagination justify-content-end" style="display: flex; justify-content: flex-end;">
                                <li :class="{ disabled: pagination.current_page <= 1 }">
                                    <a href="#" @click.prevent="pagination.current_page > 1 && goToPage(pagination.current_page - 1)">
                                        <i class="fa fa-chevron-left"></i>
                                    </a>
                                </li>
                                <li v-for="p in displayedPages" :key="p" :class="{ active: p === pagination.current_page, disabled: p === '...' }">
                                    <a href="#" @click.prevent="p !== '...' && goToPage(p)">{{ p }}</a>
                                </li>
                                <li :class="{ disabled: pagination.current_page >= pagination.last_page }">
                                    <a href="#" @click.prevent="pagination.current_page < pagination.last_page && goToPage(pagination.current_page + 1)">
                                        <i class="fa fa-chevron-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="row mt-2" v-if="pagination.total > 0">
                        <div class="col-md-3">
                            <label class="control-label">Show entries</label>
                            <select v-model.number="perPage" class="form-control input-sm">
                                <option :value="10">10</option>
                                <option :value="25">25</option>
                                <option :value="50">50</option>
                                <option :value="100">100</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-avatar {
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info-cell:hover .sts-avatar {
    transform: scale(1.05);
    border-color: var(--sts-primary);
}

.sts-avatar {
    transition: all 0.2s ease;
}

.mt-20 {
    margin-top: 20px;
}
</style>