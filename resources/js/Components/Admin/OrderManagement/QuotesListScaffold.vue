<script setup>
import { computed, ref } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    rows: {
        type: Array,
        default: () => [],
    },
    statusOptions: {
        type: Array,
        default: () => [],
    },
    initialStatusFilter: {
        type: String,
        default: '',
    },
})

const statusFilter = ref(props.initialStatusFilter)
const currentPage = ref(1)
const perPage = ref(5)
const { href } = useAdminAssets()

const filteredRows = computed(() =>
    props.rows.filter((row) => !statusFilter.value || String(row.status_raw ?? row.status ?? '') === statusFilter.value),
)

const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return filteredRows.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / perPage.value))

const pageNumbers = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
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

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const amountValue = (value) => {
    const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
}

const compactMoney = (value) => {
    const amount = Number(value ?? 0)
    if (Math.abs(amount) >= 1000) {
        return `$${Number(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    }

    return `$${Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })}`
}

const statusCode = (row) => String(row.status_raw ?? '').trim()

const statusLabel = (row) => String(row.status ?? '').toLowerCase()

const sumRowsAmount = (rows) => rows.reduce((sum, row) => sum + amountValue(row.total), 0)

const quoteStats = computed(() => {
    const rows = props.rows
    const totalAmount = sumRowsAmount(rows)
    const closedRows = rows.filter((row) => ['4', '5'].includes(statusCode(row)) || statusLabel(row).includes('closed'))
    const acceptedRows = rows.filter((row) => statusCode(row) === '2' || ['accepted', 'approved'].some((status) => statusLabel(row).includes(status)))
    const pendingCustomerRows = rows.filter((row) => {
        const status = statusLabel(row)
        return status.includes('pending customer')
    })

    const closedAmount = sumRowsAmount(closedRows)
    const acceptedAmount = sumRowsAmount(acceptedRows)
    const pendingCustomerAmount = sumRowsAmount(pendingCustomerRows)
    const quotePercent = rows.length ? Math.round((closedRows.length / rows.length) * 100) : 0
    const amountPercent = totalAmount ? Math.round((closedAmount / totalAmount) * 100) : 0

    return {
        closed: `${closedRows.length}/${compactMoney(closedAmount)}`,
        accepted: `${acceptedRows.length}/${compactMoney(acceptedAmount)}`,
        pendingCustomer: `${pendingCustomerRows.length}/${compactMoney(pendingCustomerAmount)}`,
        percentages: `${quotePercent}%/ ${amountPercent}%`,
    }
})

const applyFilters = () => {
    currentPage.value = 1
    const query = {}
    if (statusFilter.value) {
        query.status = statusFilter.value
    }

    router.get(window.location.pathname, query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

const getStatusClass = (status) => {
    const statusLower = String(status).toLowerCase()
    if (statusLower.includes('accepted') || statusLower.includes('approved')) return 'success'
    if (statusLower.includes('pending')) return 'warning'
    if (statusLower.includes('declined') || statusLower.includes('closed')) return 'danger'
    return 'default'
}

const canMakeOrder = (row) => {
    const rawStatus = String(row.status_raw ?? '').trim()
    const status = String(row.status ?? '').toLowerCase()

    return ['0', '1', '2'].includes(rawStatus)
        || status === 'pending our action'
        || status === 'approved'
}
</script>

<template>
    <Head :title="title" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="quote-stats-grid">
                <div class="quote-stat-card quote-stat-card-closed">
                    <div class="quote-stat-content">
                        <div class="quote-stat-value">{{ quoteStats.closed }}</div>
                        <div class="quote-stat-label">Closed / Total Amount</div>
                    </div>
                    <div class="quote-stat-icon-wrapper">
                        <i class="fa fa-quote-right quote-stat-icon"></i>
                    </div>
                </div>
                <div class="quote-stat-card quote-stat-card-accepted">
                    <div class="quote-stat-content">
                        <div class="quote-stat-value">{{ quoteStats.accepted }}</div>
                        <div class="quote-stat-label">Accepted / Total Amount</div>
                    </div>
                    <div class="quote-stat-icon-wrapper">
                        <i class="fa fa-quote-right quote-stat-icon"></i>
                    </div>
                </div>
                <div class="quote-stat-card quote-stat-card-pending">
                    <div class="quote-stat-content">
                        <div class="quote-stat-value">{{ quoteStats.pendingCustomer }}</div>
                        <div class="quote-stat-label">Pending Customer / Total Amount</div>
                    </div>
                    <div class="quote-stat-icon-wrapper">
                        <i class="fa fa-quote-right quote-stat-icon"></i>
                    </div>
                </div>
                <div class="quote-stat-card quote-stat-card-percent">
                    <div class="quote-stat-content">
                        <div class="quote-stat-value">{{ quoteStats.percentages }}</div>
                        <div class="quote-stat-label">Quote % / Amount %</div>
                    </div>
                    <div class="quote-stat-icon-wrapper">
                        <i class="fa fa-bar-chart quote-stat-icon"></i>
                    </div>
                </div>
            </div>

            <div class="box">
                <div class="box-header-flex">
                    <h3 class="box-title">{{ title }}</h3>
                    <div class="header-actions">
                        <Link :href="href('admin/order-management/quotes/create')" class="btn btn-warning">
                            <i class="fa fa-plus-circle"></i> Create Quote
                        </Link>
                    </div>
                </div>

                <div class="box-body">
                    <div class="alert alert-info" style="color: #004085 !important; background-color: #cce5ff !important; border-color: #b8daff;">
                        <strong>Important Note</strong>
                        <p>
                            <span style="display: inline-block; border-radius: 5px; background: #f00; width: 10px; height: 10px;"></span>
                            This dot indicates the accepted quotes by customer but not reviewed by admin.
                        </p>
                    </div>

                    <div class="sts-table-filter-shell">
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Filter by Status</span>
                            <select v-model="statusFilter" class="sts-input-sm">
                                <option value="">-All Statuses-</option>
                                <option
                                    v-for="option in statusOptions"
                                    :key="typeof option === 'object' ? option.value : option"
                                    :value="typeof option === 'object' ? option.value : option"
                                >
                                    {{ typeof option === 'object' ? option.label : option }}
                                </option>
                            </select>
                        </div>
                        <button type="button" class="sts-btn-go ms-auto" @click="applyFilters">
                            <i class="fa fa-search me-2"></i> Search Quotes
                        </button>
                    </div>

                    <div class="sts-table-card">
                        <div class="sts-table-responsive">
                            <table class="sts-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Order ID</th>
                                        <th>Type</th>
                                        <th>Zone</th>
                                        <th>Contact</th>
                                        <th>Origin</th>
                                        <th>Destination</th>
                                        <th>Dist.</th>
                                        <th>Items</th>
                                        <th>Cubes</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th class="text-right">Total</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in paginatedRows" :key="`${row.id}-${idx}`">
                                        <td><span class="sts-id-tag">#{{ row.id }}</span></td>
                                        <td><span class="sts-id-tag">{{ row.order_id || '-' }}</span></td>
                                        <td>{{ row.order_type || '-' }}</td>
                                        <td>{{ row.zone || '-' }}</td>
                                        <td>{{ row.contact_details || '-' }}</td>
                                        <td>{{ row.origin || '-' }}</td>
                                        <td>{{ row.destination || '-' }}</td>
                                        <td>{{ row.distance || '-' }}</td>
                                        <td>{{ row.items || '-' }}</td>
                                        <td>{{ row.cubes || '-' }}</td>
                                        <td>{{ row.created_at || '-' }}</td>
                                        <td>
                                            <span :class="`sts-badge sts-badge-${getStatusClass(row.status)}`">
                                                {{ row.status || '-' }}
                                            </span>
                                        </td>
                                        <td class="text-amount">{{ row.total || '-' }}</td>
                                        <td class="text-center">
                                            <div class="sts-action-icons">
                                                <Link :href="href(`admin/order-management/quotes/${row.id}`)" class="sts-action-link" title="View / Respond">
                                                    <i class="fa fa-eye fa-lg"></i>
                                                </Link>
                                                <Link
                                                    v-if="canMakeOrder(row)"
                                                    :href="href(`admin/order-management/quotes/${row.id}/make-order`)"
                                                    class="sts-action-link"
                                                    title="Make Order"
                                                >
                                                    <i class="fa fa-shopping-cart fa-lg"></i>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!filteredRows.length">
                                        <td colspan="14" class="sts-table-empty">
                                            <i class="fa fa-search sts-empty-icon"></i>
                                            <span class="sts-empty-text">No quotes found</span>
                                            <span class="sts-empty-subtext">Try adjusting your filters or searching for something else.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="row mt-20" v-if="filteredRows.length > perPage">
                            <div class="col-md-6">
                                <div style="font-size: 13px; color: var(--sts-text-muted); font-weight: 500;">
                                    Showing <span style="color: var(--sts-text-main); font-weight: 700;">{{ (currentPage - 1) * perPage + 1 }}</span> to <span style="color: var(--sts-text-main); font-weight: 700;">{{ Math.min(currentPage * perPage, filteredRows.length) }}</span> of <span style="color: var(--sts-text-main); font-weight: 700;">{{ filteredRows.length }}</span> quotes
                                </div>
                            </div>
                            <div class="col-md-6">
                                <ul class="sts-pagination" style="display: flex; justify-content: flex-end;">
                                    <li :class="{ disabled: currentPage === 1 }">
                                        <a href="#" @click.prevent="goToPage(currentPage - 1)">
                                            <i class="fa fa-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li v-for="p in pageNumbers" :key="p" :class="{ active: p === currentPage, disabled: p === '...' }">
                                        <a href="#" @click.prevent="p !== '...' && goToPage(p)">{{ p }}</a>
                                    </li>
                                    <li :class="{ disabled: currentPage === totalPages }">
                                        <a href="#" @click.prevent="goToPage(currentPage + 1)">
                                            <i class="fa fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quote-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.quote-stat-card {
    position: relative;
    padding: 20px;
    border-radius: 16px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 110px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.quote-stat-card-closed {
    background: linear-gradient(135deg, #438a7d 0%, #5ba89a 100%);
}

.quote-stat-card-accepted {
    background: linear-gradient(135deg, #4a7d9a 0%, #6da1bf 100%);
}

.quote-stat-card-pending {
    background: linear-gradient(135deg, #9b7e6b 0%, #bc9e8b 100%);
}

.quote-stat-card-percent {
    background: linear-gradient(135deg, #6b7280 0%, #8c939f 100%);
}

.quote-stat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.quote-stat-content {
    position: relative;
    z-index: 2;
}

.quote-stat-value {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 4px;
}

.quote-stat-label {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.quote-stat-icon-wrapper {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
    z-index: 2;
}

.quote-stat-icon {
    font-size: 24px;
    color: #fff;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.quote-stat-card:hover .quote-stat-icon-wrapper {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.quote-stat-card:hover .quote-stat-icon {
    transform: scale(1.2) rotate(15deg);
}

/* Shine effect on hover */
.quote-stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
}

.quote-stat-card:hover::after {
    left: 100%;
}

.text-bold {
    font-weight: 700;
    color: #1a202c;
}

@media (max-width: 1199px) {
    .quote-stats-grid {
        grid-template-columns: repeat(2, minmax(180px, 1fr));
        gap: 18px;
    }
}

@media (max-width: 767px) {
    .quote-stats-grid {
        grid-template-columns: 1fr;
    }

    .quote-stat-value {
        font-size: 24px;
    }
}
</style>
