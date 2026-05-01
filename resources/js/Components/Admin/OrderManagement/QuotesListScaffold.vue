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
const { href } = useAdminAssets()

const filteredRows = computed(() =>
    props.rows.filter((row) => !statusFilter.value || String(row.status_raw ?? row.status ?? '') === statusFilter.value),
)

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
                    <div>
                        <div class="quote-stat-value">{{ quoteStats.closed }}</div>
                        <div class="quote-stat-label">Closed / Total Amount</div>
                    </div>
                    <i class="fa fa-quote-right quote-stat-icon"></i>
                </div>
                <div class="quote-stat-card quote-stat-card-accepted">
                    <div>
                        <div class="quote-stat-value">{{ quoteStats.accepted }}</div>
                        <div class="quote-stat-label">Accepted / Total Amount</div>
                    </div>
                    <i class="fa fa-quote-right quote-stat-icon"></i>
                </div>
                <div class="quote-stat-card quote-stat-card-pending">
                    <div>
                        <div class="quote-stat-value">{{ quoteStats.pendingCustomer }}</div>
                        <div class="quote-stat-label">Pending Customer / Total Amount</div>
                    </div>
                    <i class="fa fa-quote-right quote-stat-icon"></i>
                </div>
                <div class="quote-stat-card quote-stat-card-percent">
                    <div>
                        <div class="quote-stat-value">{{ quoteStats.percentages }}</div>
                        <div class="quote-stat-label">Quote % / Amount %</div>
                    </div>
                    <i class="fa fa-bar-chart quote-stat-icon"></i>
                </div>
            </div>

            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">{{ title }}</h3>
                    <div class="btn-toolbar pull-right">
                        <div class="btn-group">
                            <Link :href="href('admin/order-management/quotes/create')" class="btn btn-warning">
                                <span class="glyphicon glyphicon-plus"></span> Create Quote
                            </Link>
                        </div>
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

                    <div class="quote-filter-shell">
                        <label class="control-label">
                            Status
                            <select v-model="statusFilter" class="form-control input-sm">
                                <option value="">-All-</option>
                                <option
                                    v-for="option in statusOptions"
                                    :key="typeof option === 'object' ? option.value : option"
                                    :value="typeof option === 'object' ? option.value : option"
                                >
                                    {{ typeof option === 'object' ? option.label : option }}
                                </option>
                            </select>
                        </label>
                        <button type="button" class="btn btn-success btn-sm" @click="applyFilters">Go</button>
                    </div>

                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order ID</th>
                                <th>Type</th>
                                <th>Contact Details</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Distance</th>
                                <th>#Items</th>
                                <th>Cubes</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in filteredRows" :key="`${row.id}-${idx}`">
                                <td>{{ row.id }}</td>
                                <td>{{ row.order_id || '-' }}</td>
                                <td>{{ row.order_type || '-' }}</td>
                                <td>{{ row.contact_details || '-' }}</td>
                                <td>{{ row.origin || '-' }}</td>
                                <td>{{ row.destination || '-' }}</td>
                                <td>{{ row.distance || '-' }}</td>
                                <td>{{ row.items || '-' }}</td>
                                <td>{{ row.cubes || '-' }}</td>
                                <td>{{ row.created_at || '-' }}</td>
                                <td>
                                    <span :class="`btn btn-${getStatusClass(row.status)} btn-xs default-cursor`">
                                        {{ row.status || '-' }}
                                    </span>
                                </td>
                                <td>{{ row.total || '-' }}</td>
                                <td>
                                    <Link :href="href(`admin/order-management/quotes/${row.id}`)" title="View / Respond">
                                        <i class="fa fa-eye fa-lg action-icons"></i>
                                    </Link>
                                    <Link
                                        v-if="canMakeOrder(row)"
                                        :href="href(`admin/order-management/quotes/${row.id}/make-order`)"
                                        title="Make Order"
                                    >
                                        <i class="fa fa-shopping-cart fa-lg action-icons"></i>
                                    </Link>
                                </td>
                            </tr>
                            <tr v-if="!filteredRows.length">
                                <td colspan="13" class="text-center text-muted empty-row">No result found!</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quote-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    gap: 36px;
    margin: 0 0 25px;
}

.quote-stat-card {
    min-height: 129px;
    padding: 15px 14px;
    border-radius: 2px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.quote-stat-card-closed {
    background: #dff0d8;
}

.quote-stat-card-accepted {
    background: #9fc4c2;
}

.quote-stat-card-pending {
    background: #d1c8bb;
}

.quote-stat-card-percent {
    background: #c5d2bd;
}

.quote-stat-value {
    font-size: 48px;
    line-height: 1.05;
    font-weight: 700;
    white-space: nowrap;
}

.quote-stat-label {
    margin-top: 17px;
    font-size: 18px;
    line-height: 1.2;
    font-weight: 500;
}

.quote-stat-icon {
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.16);
    font-size: 96px;
    line-height: 1;
}

.quote-stat-card-percent .quote-stat-icon {
    font-size: 70px;
    align-self: flex-end;
    margin-bottom: 6px;
}

.quote-filter-shell {
    margin: 10px 0;
    display: flex;
    gap: 12px;
    align-items: end;
}

.empty-row {
    padding: 24px 12px;
    font-weight: 600;
}

.action-icons {
    margin: 0 5px;
    cursor: pointer;
    color: #337ab7;
}

.action-icons:hover {
    color: #23527c;
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
        font-size: 40px;
    }
}
</style>
