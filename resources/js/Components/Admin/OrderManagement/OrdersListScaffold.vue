<script setup>
import { computed, ref, watch } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'
import CancelOrderModal from './Modals/CancelOrderModal.vue'

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
    summaryCounts: {
        type: Object,
        default: () => ({}),
    },
    statusLabels: {
        type: Object,
        default: () => ({}),
    },
    billingMethods: {
        type: Object,
        default: () => ({}),
    },
    addresses: {
        type: Array,
        default: () => [],
    },
    customers: {
        type: Array,
        default: () => [],
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
})

const statusFilter = ref(props.initialStatusFilter)
const currentPage = ref(1)
const perPage = ref(5)
const { href } = useAdminAssets()

const isActionsOpen = ref(false)
const activeRowAction = ref(null)
const selectedRows = ref([])
const selectAll = ref(false)

const showCancelModal = ref(false)
const activeOrder = ref(null)

const showAdvancedSearch = ref(
    props.filters.billing_method?.length > 0 ||
    props.filters.territory?.length > 0 ||
    props.filters.po_number ||
    props.filters.sch_date
)

const billingFilter = ref(props.filters.billing_method ?? '')
const territoryFilter = ref(props.filters.territory ?? '')
const poFilter = ref(props.filters.po_number ?? '')
const dateFilter = ref(props.filters.sch_date ?? '')
const customerFilter = ref(props.filters.customer ?? '')
const addressFilter = ref(props.filters.address ?? '')

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedRows.value = filteredRows.value.map(row => row.id)
    } else {
        selectedRows.value = []
    }
}

const filteredRows = computed(() => props.rows)

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

watch(() => props.initialStatusFilter, (newVal) => {
    statusFilter.value = newVal
})

watch(() => props.filters, (newFilters) => {
    billingFilter.value = newFilters.billing_method ?? ''
    territoryFilter.value = newFilters.territory ?? ''
    poFilter.value = newFilters.po_number ?? ''
    dateFilter.value = newFilters.sch_date ?? ''
    customerFilter.value = newFilters.customer ?? ''
    addressFilter.value = newFilters.address ?? ''
}, { deep: true })

const applyFilters = () => {
    currentPage.value = 1
    const query = {}
    if (statusFilter.value) query.status = statusFilter.value
    if (billingFilter.value) query.billing_method = billingFilter.value
    if (territoryFilter.value) query.territory = territoryFilter.value
    if (poFilter.value) query.po_number = poFilter.value
    if (dateFilter.value) query.sch_date = dateFilter.value
    if (customerFilter.value) query.customer = customerFilter.value
    if (addressFilter.value) query.address = addressFilter.value

    router.get(window.location.pathname, query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

const clearFilters = () => {
    statusFilter.value = ''
    billingFilter.value = ''
    territoryFilter.value = ''
    poFilter.value = ''
    dateFilter.value = ''
    customerFilter.value = ''
    addressFilter.value = ''
    applyFilters()
}

const filterBySummary = (statusLabel) => {
    if (!statusLabel) return
    statusFilter.value = statusLabel
    applyFilters()
}

const toggleActions = () => {
    isActionsOpen.value = !isActionsOpen.value
    if (isActionsOpen.value) activeRowAction.value = null
}

const toggleRowActions = (idx) => {
    activeRowAction.value = activeRowAction.value === idx ? null : idx
}

const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-default'
    const s = status.toLowerCase()
    if (s.includes('new')) return 'badge-new'
    if (s.includes('attention')) return 'badge-attention'
    if (s.includes('pickup')) return 'badge-pickup'
    if (s.includes('delivery')) return 'badge-delivery'
    if (s.includes('delivered')) return 'badge-delivered'
    if (s.includes('cancelled')) return 'badge-cancelled'
    if (s.includes('archive')) return 'badge-archive'
    return 'badge-info'
}

const openCancelModal = (row) => {
    activeOrder.value = row
    showCancelModal.value = true
    activeRowAction.value = null
}

const completeOrder = (row) => {
    if (confirm(`Are you sure you want to mark Order #${row.order_number} as completed?`)) {
        router.post(route('admin.order_management.orders.complete'), { order_id: row.id }, {
            onSuccess: () => activeRowAction.value = null
        })
    }
}

const bulkPushPickups = () => {
    if (!selectedRows.value.length) return alert('Please select at least 1 order.')
    if (confirm(`Push ${selectedRows.value.length} orders for pickup?`)) {
        router.post(route('admin.order_management.orders.bulk_push_pickups'), { order_ids: selectedRows.value }, {
            onSuccess: () => {
                selectedRows.value = []
                selectAll.value = false
                isActionsOpen.value = false
            }
        })
    }
}

const bulkPushDeliveries = () => {
    if (!selectedRows.value.length) return alert('Please select at least 1 order.')
    if (confirm(`Push ${selectedRows.value.length} orders for delivery?`)) {
        router.post(route('admin.order_management.orders.bulk_push_deliveries'), { order_ids: selectedRows.value }, {
            onSuccess: () => {
                selectedRows.value = []
                selectAll.value = false
                isActionsOpen.value = false
            }
        })
    }
}
</script>

<template>
    <Head :title="title" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="box">
                <div class="box-header-flex">
                    <h3 class="box-title">{{ title }}</h3>
                    <div class="header-actions">
                        <div class="btn-group" :class="{ open: isActionsOpen }">
                            <button type="button" class="btn btn-primary dropdown-toggle" @click="toggleActions">
                                <i class="fa fa-bolt"></i> Actions <span class="caret ms-2"></span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                <li><a href="#" @click.prevent><i class="fa fa-plus"></i> New Order</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-upload"></i> Import Orders</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-phone"></i> Hold To Call Pickup</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-phone"></i> Hold To Call Delivery</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent="bulkPushPickups"><i class="fa fa-paper-plane"></i> Push PickUps</a></li>
                                <li><a href="#" @click.prevent="bulkPushDeliveries"><i class="fa fa-paper-plane"></i> Push Deliveries</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-bullhorn"></i> Send Notification</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-envelope"></i> Send Invoice</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-truck"></i> Receive All</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-plus"></i> Add Notes</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-bell"></i> Set Reminder</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-check text-success"></i> Complete Will Call Orders</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-times text-danger"></i> Cancel Selected Orders</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-print"></i> Print PickUp Slips</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-print"></i> Print Delivery Slips</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-print"></i> Print Labels</a></li>
                                <li><a href="#" @click.prevent><i class="fa fa-print"></i> Print Invoices</a></li>
                                <li class="divider"></li>
                                <li><a href="#" @click.prevent><i class="fa fa-download"></i> Export Excel (selected only)</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="box-body">
                    <div class="summary-tiles-container mb-20">
                        <div class="row row-tight">
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-waiting" @click="filterBySummary(statusLabels.w_p)" :title="statusLabels.w_p">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.w_p_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.w_p }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <img :src="href('images/admin/status/pickup_schedule.png')" class="stat-custom-icon" alt="Pickup Schedule">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-waiting" @click="filterBySummary(statusLabels.w_d)" :title="statusLabels.w_d">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.w_d_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.w_d }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <img :src="href('images/admin/status/delivery_schedule.png')" class="stat-custom-icon" alt="Delivery Schedule">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-new" @click="filterBySummary(statusLabels.n_p)" :title="statusLabels.n_p">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.n_p_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.n_p }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <i class="fa fa-arrow-circle-up"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-new" @click="filterBySummary(statusLabels.n_d)" :title="statusLabels.n_d">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.n_d_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.n_d }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <i class="fa fa-arrow-circle-up"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-onroute" @click="filterBySummary(statusLabels.o_p)" :title="statusLabels.o_p">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.o_p_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.o_p }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <i class="fa fa-truck"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-xs-6">
                                <div class="stat-card stat-card-onroute" @click="filterBySummary(statusLabels.o_d)" :title="statusLabels.o_d">
                                    <div class="stat-content">
                                        <div class="stat-number">{{ summaryCounts.o_d_count || 0 }}</div>
                                        <div class="stat-label">{{ statusLabels.o_d }}</div>
                                    </div>
                                    <div class="stat-icon-wrapper">
                                        <i class="fa fa-truck"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="row">
                        <div class="col-sm-12">
                            <strong class="text-info"><i class="fa fa-info fa-lg" /> <em>Important Notes</em></strong>
                            <ol class="order-notes-list">
                                <li><span class="text-info">Only open orders will be shown in this list.</span></li>
                                <li><span class="text-danger">If any order is not found here then please check in Archive Orders.</span></li>
                            </ol>
                        </div>
                    </div> -->

                    <div class="sts-table-filter-shell">
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Order Status</span>
                            <select v-model="statusFilter" class="sts-input-sm">
                                <option value="">-All Statuses-</option>
                                <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Customer</span>
                            <select v-model="customerFilter" class="sts-input-sm">
                                <option value="">-All Customers-</option>
                                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Address</span>
                            <select v-model="addressFilter" class="sts-input-sm">
                                <option value="">-All Addresses-</option>
                                <option v-for="a in addresses" :key="a.id" :value="a.id">{{ a.name }}</option>
                            </select>
                        </div>
                        <div class="sts-filter-group">
                            <button type="button" @click="showAdvancedSearch = !showAdvancedSearch" class="btn btn-default" style="margin-top: auto;">
                                <i class="fa fa-sliders me-2"></i> {{ showAdvancedSearch ? 'Hide' : 'Show' }} Advanced
                                <i class="fa fa-chevron-down ms-2" :style="{ transform: showAdvancedSearch ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }"></i>
                            </button>
                        </div>
                        <button type="button" class="sts-btn-go ms-auto" @click="applyFilters">
                            <i class="fa fa-search me-2"></i> Search Orders
                        </button>

                        <div v-if="showAdvancedSearch" class="advanced-filter-row mt-20" style="width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                            <div class="sts-filter-group">
                                <span class="sts-filter-label">Billing Method</span>
                                <select v-model="billingFilter" class="sts-input-sm">
                                    <option value="">All Methods</option>
                                    <option v-for="(val, key) in billingMethods" :key="val" :value="val">{{ key }}</option>
                                </select>
                            </div>
                            <div class="sts-filter-group">
                                <span class="sts-filter-label">Territory</span>
                                <select v-model="territoryFilter" class="sts-input-sm">
                                    <option value="">-All Territories-</option>
                                    <option v-for="t in territories" :key="t.id" :value="t.id">{{ t.name }}</option>
                                </select>
                            </div>
                            <div class="sts-filter-group">
                                <span class="sts-filter-label">PO Number Search</span>
                                <input type="text" v-model="poFilter" class="sts-input-sm" placeholder="Enter PO numbers...">
                            </div>
                        </div>
                    </div>

                    <div class="sts-table-card">
                        <div class="sts-table-responsive">
                            <table class="sts-table">
                                <thead>
                                    <tr>
                                        <th class="text-center checkbox-col">
                                            <input type="checkbox" @change="toggleAllRows" :checked="isAllSelected" class="row-checkbox">
                                        </th>
                                        <th>Date</th>
                                        <th>Parent</th>
                                        <th>Quote</th>
                                        <th>Type</th>
                                        <th>Contact</th>
                                        <th>Bill To</th>
                                        <th>Origin</th>
                                        <th>Destination</th>
                                        <th>Dist.</th>
                                        <th>Items</th>
                                        <th>Cubes</th>
                                        <th class="text-right">Total</th>
                                        <th>Status</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in paginatedRows" :key="`${row.id}-${idx}`" class="order-row">
                                        <td class="text-center checkbox-col">
                                            <input type="checkbox" v-model="selectedRows" :value="row.id" class="row-checkbox">
                                        </td>
                                        <td v-html="row.order_date_html"></td>
                                        <td><span class="sts-id-tag">{{ row.parent_order || '-' }}</span></td>
                                        <td><span class="sts-id-tag">{{ row.quote_id || '-' }}</span></td>
                                        <td>{{ row.order_type || '-' }}</td>
                                        <td v-html="row.contact_details || '-'"></td>
                                        <td v-html="row.bill_to || '-'"></td>
                                        <td v-html="row.origin || '-'"></td>
                                        <td v-html="row.destination || '-'"></td>
                                        <td>{{ row.distance || '-' }}</td>
                                        <td>{{ row.items || '-' }}</td>
                                        <td>{{ row.cubes || '-' }}</td>
                                        <td class="text-amount">${{ Number(row.total_amount ?? 0).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</td>
                                        <td>
                                            <span class="sts-badge" :class="getStatusBadgeClass(row.status)">
                                                {{ row.status || 'Unknown' }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <div class="btn-group" :class="{ open: activeRowAction === idx }">
                                                <button type="button" class="sts-action-btn dropdown-toggle" @click="toggleRowActions(idx)">
                                                    Actions <span class="caret"></span>
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                                    <li><a href="#" @click.prevent><i class="fa fa-eye"></i> View</a></li>
                                                    <li><a href="#" @click.prevent="openCancelModal(row)"><i class="fa fa-times text-danger"></i> Cancel Order</a></li>
                                                    <li><a href="#" @click.prevent="completeOrder(row)"><i class="fa fa-check text-success"></i> Complete Order</a></li>
                                                    <li class="divider"></li>
                                                    <li><a href="#" @click.prevent><i class="fa fa-pencil"></i> Edit Details</a></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!filteredRows.length">
                                        <td colspan="15" class="sts-table-empty">
                                            <i class="fa fa-shopping-bag sts-empty-icon"></i>
                                            <span class="sts-empty-text">No orders found</span>
                                            <span class="sts-empty-subtext">Try adjusting your filters or check the archive for older orders.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="row mt-20" v-if="filteredRows.length > perPage">
                            <div class="col-md-6">
                                <div style="font-size: 13px; color: var(--sts-text-muted); font-weight: 500;">
                                    Showing <span style="color: var(--sts-text-main); font-weight: 700;">{{ (currentPage - 1) * perPage + 1 }}</span> to <span style="color: var(--sts-text-main); font-weight: 700;">{{ Math.min(currentPage * perPage, filteredRows.length) }}</span> of <span style="color: var(--sts-text-main); font-weight: 700;">{{ filteredRows.length }}</span> orders
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

    <CancelOrderModal
        :show="showCancelModal"
        :order="activeOrder"
        @close="showCancelModal = false"
    />
</template>

<style scoped>
.summary-tiles-container {
    padding: 10px 0;
}

.row-tight {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
}

.row-tight > [class*="col-"] {
    padding: 5px;
    flex: 1 1 150px;
    max-width: 16.666%;
}

@media (max-width: 1200px) {
    .row-tight > [class*="col-"] {
        max-width: 33.333%;
    }
}

@media (max-width: 768px) {
    .row-tight > [class*="col-"] {
        max-width: 50%;
    }
}

.stat-card {
    position: relative;
    background: #fff;
    border: 1px solid #edf2f7;
    border-radius: 12px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    height: 75px;
    overflow: hidden;
}

.stat-card-waiting { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); }
.stat-card-new { background: linear-gradient(135deg, #fffaf0 0%, #fff4e5 100%); }
.stat-card-onroute { background: linear-gradient(135deg, #f0fdf4 0%, #e8f7ed 100%); }

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e0;
}

.stat-icon-wrapper {
    width: 38px;
    height: 38px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #4a5568;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.stat-card:hover .stat-icon-wrapper {
    background: rgba(0, 0, 0, 0.08);
    transform: scale(1.1) rotate(10deg);
    color: #2d3748;
}

.stat-number {
    font-size: 18px;
    font-weight: 800;
    color: #1a202c;
    line-height: 1.2;
}

.stat-label {
    font-size: 10px;
    font-weight: 700;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

/* Shine effect on hover */
.stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    transition: 0.6s;
}

.stat-card:hover::after {
    left: 100%;
}

.box-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #edf2f7;
}

.box-header-flex .box-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a202c;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.header-actions .btn-primary {
    background-color: #11635a !important;
    border-color: #0d5249 !important;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 6px;
}

.mt-15 {
    margin-top: 15px;
}

.text-nowrap {
    white-space: nowrap;
}

.text-bold {
    font-weight: 700;
}

.mb-20 {
    margin-bottom: 20px;
}

.advanced-toggle {
    color: #333;
    text-decoration: none;
    font-weight: 500;
}

.caret-up {
    transform: rotate(180deg);
}

.mt-10 {
    margin-top: 10px;
}

.advanced-filter-row {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
}

</style>
