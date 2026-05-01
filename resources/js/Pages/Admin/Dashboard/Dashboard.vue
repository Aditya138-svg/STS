<script setup>
import { computed, ref } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/composables/Admin'

const page = usePage()
const { asset, href } = useAdminAssets()
const dashboard = computed(() => page.props.dashboard ?? {})

const scheduledOrdersList = computed(() => dashboard.value.scheduled_orders_list ?? [])
const unreadNotes = computed(() => dashboard.value.unread_order_notes ?? [])
const myTasks = computed(() => dashboard.value.my_tasks_list ?? [])
const overallTasks = computed(() => dashboard.value.other_tasks_list ?? [])
const duplicateAddresses = computed(() => dashboard.value.duplicate_addresses ?? [])
const missingOrders = computed(() => dashboard.value.missing_orders ?? [])
const neverRoutedOrders = computed(() => dashboard.value.never_routed_orders ?? [])
const upcomingOrders = computed(() => dashboard.value.upcoming_orders ?? {})
const scheduledUnroutedOrders = computed(() => dashboard.value.scheduled_unroute_orders ?? { count_un_route: 0, data: [] })

const schDate = ref(new Date().toISOString().slice(0, 10))
const undeliveredDate = ref(new Date().toISOString().slice(0, 10))
const activeTaskTab = ref('unread-notes')
const taskNotesScrollEl = ref(null)
const todayIso = new Date().toISOString().slice(0, 10)

function scrollTaskNotes(deltaPx) {
    const el = taskNotesScrollEl.value
    if (!el) {
        return
    }
    el.scrollBy({ top: deltaPx, behavior: 'smooth' })
}

const withQuery = (path, query = {}) => {
    const qs = new URLSearchParams(query).toString()
    return qs ? `${href(path)}?${qs}` : href(path)
}

const formatDate = (value) => {
    if (!value) {
        return ''
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        return String(value)
    }

    return parsed.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    })
}

const isTodayOrFuture = (value) => {
    if (!value) {
        return false
    }

    const d = new Date(value)
    if (Number.isNaN(d.getTime())) {
        return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    d.setHours(0, 0, 0, 0)
    return d >= today
}

const totalFailedOrders = computed(() =>
    missingOrders.value.reduce((sum, item) => sum + Number(item.total_orders ?? 0), 0),
)

const totalNeverRoutedOrders = computed(() =>
    neverRoutedOrders.value.reduce((sum, item) => sum + Number(item.total_orders ?? 0), 0),
)

const totalUpcomingOrders = computed(() => {
    const data = upcomingOrders.value.data ?? {}
    return Object.values(data).reduce((sum, count) => sum + Number(count ?? 0), 0)
})

const metrics = computed(() => dashboard.value.metrics ?? {})
const duplicateAddressesCount = computed(() => duplicateAddresses.value.length)
</script>

<template>
    <Head title="Dashboard" />

    <div class="container-fluid admin-dashboard">
        <div class="row">
            <div class="col-md-3">
                <div class="box box-info direct-chat">
                    <div class="box-header with-border">
                        <h3 class="box-title">Date-wise Scheduled Orders List</h3>
                        <small class="text-danger d-block">Route <i class="fa fa-map"></i>: Please route the dated orders</small>
                    </div>
                    <div class="box-body">
                        <div class="direct-chat-messages">
                            <div v-if="scheduledOrdersList.length" class="todo-list row">
                                <div v-for="item in scheduledOrdersList" :key="item.date" class="col-12 text-center mb-2">
                                    <Link :href="withQuery('admin/order-management/orders/all-orders', { sch_date: item.date })" class="btn btn-primary btn-xs">
                                        {{ item.date_formatted }}
                                        <span class="badge bg-light text-dark">{{ item.total_orders }}</span>
                                    </Link>
                                    <div v-if="isTodayOrFuture(item.date)" class="mt-1">
                                        <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/dashboard', { date: item.date })" class="text-danger small route-link">
                                            Route <i class="fa fa-map"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <h4 v-else class="text-muted fw-semibold">No order(s) found.</h4>
                        </div>
                    </div>
                    <div class="box-footer clearfix text-center">
                        <Link :href="href('admin/order-management/orders/all-orders')" class="small">View All</Link>
                    </div>
                </div>
            </div>

            <div class="col-md-5">
                <div class="task-notes-panel">
                    <div class="task-notes-tabs" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            class="task-notes-tab"
                            :class="{ active: activeTaskTab === 'unread-notes' }"
                            :aria-selected="activeTaskTab === 'unread-notes'"
                            @click="activeTaskTab = 'unread-notes'"
                        >
                            Unread Notes
                        </button>
                        <button
                            type="button"
                            role="tab"
                            class="task-notes-tab"
                            :class="{ active: activeTaskTab === 'my-tasks' }"
                            :aria-selected="activeTaskTab === 'my-tasks'"
                            @click="activeTaskTab = 'my-tasks'"
                        >
                            My Tasks
                        </button>
                        <button
                            type="button"
                            role="tab"
                            class="task-notes-tab"
                            :class="{ active: activeTaskTab === 'overall-tasks' }"
                            :aria-selected="activeTaskTab === 'overall-tasks'"
                            @click="activeTaskTab = 'overall-tasks'"
                        >
                            Overall Tasks
                        </button>
                    </div>
                    <div class="task-notes-divider" aria-hidden="true" />
                    <div class="task-notes-body">
                        <div ref="taskNotesScrollEl" class="task-notes-scroll">
                            <div v-show="activeTaskTab === 'unread-notes'" class="task-notes-pane" role="tabpanel">
                                <ul class="task-notes-list todo-list my-todo-list">
                                    <li v-for="(note, idx) in unreadNotes" :key="idx">{{ note.message ?? note.note ?? 'Unread note' }}</li>
                                    <li v-if="!unreadNotes.length" class="task-notes-empty">
                                        No Unread Notes found. Please check
                                        <button type="button" class="task-notes-empty-action" @click="activeTaskTab = 'my-tasks'">My Tasks</button>
                                    </li>
                                </ul>
                            </div>
                            <div v-show="activeTaskTab === 'my-tasks'" class="task-notes-pane" role="tabpanel">
                                <ul class="task-notes-list todo-list my-todo-list">
                                    <li v-for="task in myTasks" :key="task.id" class="task-notes-item">
                                        {{ task.task_name ?? 'Task' }} - {{ task.task_desc ?? '' }}
                                    </li>
                                    <li v-if="!myTasks.length" class="task-notes-empty">
                                        No Assigned Notes found. Please check
                                        <button type="button" class="task-notes-empty-action" @click="activeTaskTab = 'unread-notes'">Unread Notes</button>
                                    </li>
                                </ul>
                            </div>
                            <div v-show="activeTaskTab === 'overall-tasks'" class="task-notes-pane" role="tabpanel">
                                <ul class="task-notes-list todo-list my-todo-list">
                                    <li v-for="task in overallTasks" :key="task.id" class="task-notes-item">
                                        {{ task.task_name ?? 'Task' }} - {{ task.task_desc ?? '' }}
                                    </li>
                                    <li v-if="!overallTasks.length" class="task-notes-empty">
                                        No Assigned Notes found. Please check
                                        <button type="button" class="task-notes-empty-action" @click="activeTaskTab = 'unread-notes'">Unread Notes</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="task-notes-arrows">
                            <button type="button" class="task-notes-arrow-btn" aria-label="Scroll up" @click="scrollTaskNotes(-56)">
                                <i class="fa-solid fa-caret-up" />
                            </button>
                            <button type="button" class="task-notes-arrow-btn" aria-label="Scroll down" @click="scrollTaskNotes(56)">
                                <i class="fa-solid fa-caret-down" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="box box-info direct-chat">
                    <div class="box-header with-border">
                        <h3 class="box-title">
                            Duplicate Addresses List
                            <span class="badge bg-warning dashboard-counter-badge">{{ duplicateAddressesCount }}</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div class="direct-chat-messages">
                            <div v-if="duplicateAddresses.length" class="todo-list row">
                                <div v-for="item in duplicateAddresses.slice(0, 10)" :key="item.address_soundex ?? item.address" class="col-12 text-center mb-2">
                                    <Link :href="href(`admin/order-management/addresses/duplicate-address?search=${encodeURIComponent(item.address ?? '')}`)" class="btn btn-warning btn-xs w-100 text-truncate">
                                        {{ item.address }}
                                    </Link>
                                </div>
                            </div>
                            <h4 v-else class="text-muted fw-semibold">No addresses found.</h4>
                        </div>
                    </div>
                    <div class="box-footer clearfix text-center">
                        <Link :href="href('admin/order-management/addresses/duplicate-address')">View All</Link>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <div class="box box-danger">
                    <div class="box-header with-border">
                        <h3 class="box-title text-danger">
                            Failed Attempt(s)
                            <span class="badge bg-warning dashboard-counter-badge">{{ totalFailedOrders }}</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div v-for="item in missingOrders" :key="item.date" class="text-center mb-2">
                            <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/undelivered-orders/routed-orders', { sch_date: item.date })" class="btn btn-danger btn-xs">
                                {{ formatDate(item.date) }} <span class="badge bg-light text-dark">{{ item.total_orders }}</span>
                            </Link>
                        </div>
                        <h4 v-if="!missingOrders.length" class="text-muted fw-semibold">No data available.</h4>
                    </div>
                    <div v-if="totalFailedOrders" class="box-footer clearfix text-center">
                        <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/undelivered-orders/routed-orders', { sch_date: todayIso })">
                            View More
                        </Link>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="box box-danger">
                    <div class="box-header with-border">
                        <h3 class="box-title text-danger">
                            Never Routed Order(s)
                            <span class="badge bg-warning dashboard-counter-badge">{{ totalNeverRoutedOrders }}</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div v-for="item in neverRoutedOrders" :key="item.date" class="text-center mb-2">
                            <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/undelivered-orders/unrouted-orders', { sch_date: item.date })" class="btn btn-danger btn-xs">
                                {{ formatDate(item.date) }} <span class="badge bg-light text-dark">{{ item.total_orders }}</span>
                            </Link>
                        </div>
                        <h4 v-if="!neverRoutedOrders.length" class="text-muted fw-semibold">No data available.</h4>
                    </div>
                    <div v-if="totalNeverRoutedOrders" class="box-footer clearfix text-center">
                        <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/undelivered-orders/unrouted-orders', { sch_date: todayIso })">
                            View More
                        </Link>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">
                            Today Routes
                            <span class="badge bg-warning dashboard-counter-badge">{{ scheduledUnroutedOrders.count_un_route }}</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <ul class="products-list product-list-in-box">
                            <li v-for="item in (scheduledUnroutedOrders.data ?? []).slice(0, 10)" :key="item.o_id" class="item">
                                <div class="product-info" style="margin:0;">
                                    <span class="product-title">Order #{{ item.o_id }}</span>
                                    <span class="product-description">{{ item.origin_company_name ?? item.dest_company_name }}</span>
                                </div>
                            </li>
                        </ul>
                        <h4 v-if="!(scheduledUnroutedOrders.data ?? []).length" class="text-muted fw-semibold">No order(s) found.</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">
                            Upcoming Routes
                            <span class="badge bg-warning dashboard-counter-badge">{{ totalUpcomingOrders }}</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <div class="todo-list row" v-if="upcomingOrders.data">
                            <div v-for="(count, dateKey) in upcomingOrders.data" :key="dateKey" class="col-6 text-center mb-2">
                                <Link :href="withQuery('admin/dispatch-scheduling/dispatcher/routes', { date: dateKey })" class="btn btn-primary btn-xs">
                                    {{ formatDate(dateKey) }} <span class="badge bg-light text-dark">{{ count }}</span>
                                </Link>
                            </div>
                        </div>
                        <h4 v-else class="text-muted fw-semibold">No route(s) found.</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Today's Top 3 Ranking <small></small></h3>
                    </div>
                    <div class="box-body ranking-strip">
                        <div class="rank-item"><img :src="asset('images/rank_first.png')" alt="rank1"><span>Rank #1</span><small>You can be on Rank #1</small></div>
                        <div class="rank-item"><img :src="asset('images/rank_second.png')" alt="rank2"><span>Rank #2</span><small>You can be on Rank #2</small></div>
                        <div class="rank-item"><img :src="asset('images/rank_third.png')" alt="rank3"><span>Rank #3</span><small>You can be on Rank #3</small></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="small-box bg-green">
                    <div class="inner">
                        <h3>{{ metrics.new_quotes ?? 0 }}</h3>
                        <p>New Quotes</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="small-box bg-blue">
                    <div class="inner">
                        <h3>{{ metrics.accepted_quotes ?? 0 }}</h3>
                        <p>Accepted Quotes</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="small-box bg-aqua">
                    <div class="inner">
                        <h3>{{ metrics.new_orders ?? 0 }}</h3>
                        <p>New Orders</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-6">
                <div class="small-box bg-yellow">
                    <div class="inner">
                        <h3>{{ metrics.new_users ?? 0 }}</h3>
                        <p>New Users</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Target Achieved Stats <small>(based on scheduled DELIVERIES only)</small></h3>
                    </div>
                    <div class="box-body target-stats-grid">
                        <div>Today <strong>0% Achieved</strong></div>
                        <div>Tomorrow <strong>0% Achieved</strong></div>
                        <div>This Week <strong>0% Achieved</strong></div>
                        <div>This Month <strong>0% Achieved</strong></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-6">
                <div class="info-box bg-gray">
                    <span class="info-box-icon"><i class="fa fa-shopping-cart" /></span>
                    <div class="info-box-content">
                        <span class="info-box-text">Scheduled orders</span>
                        <span class="info-box-number">{{ metrics.scheduled_orders_count ?? 0 }}</span>
                        <input v-model="schDate" type="date" class="form-control form-control-sm mt-2">
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-6">
                <div class="info-box bg-aqua">
                    <span class="info-box-icon"><i class="fa fa-shopping-cart" /></span>
                    <div class="info-box-content">
                        <span class="info-box-text">Undelivered orders</span>
                        <span class="info-box-number">{{ metrics.undelivered_orders_count ?? 0 }}</span>
                        <input v-model="undeliveredDate" type="date" class="form-control form-control-sm mt-2">
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-6">
                <div class="info-box bg-yellow">
                    <span class="info-box-icon"><i class="fa fa-shopping-cart" /></span>
                    <div class="info-box-content">
                        <span class="info-box-text">Orders That Need Attention</span>
                        <span class="info-box-number">{{ metrics.attention_orders_count ?? 0 }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-6 col-6"><div class="info-box bg-orange"><span class="info-box-icon"><i class="fa fa-bus" /></span><div class="info-box-content"><span class="info-box-text">Due In</span><span class="info-box-number">{{ metrics.due_in_count ?? 0 }}</span></div></div></div>
            <div class="col-lg-4 col-md-6 col-6"><div class="info-box bg-yellow"><span class="info-box-icon"><i class="fa fa-phone" /></span><div class="info-box-content"><span class="info-box-text">Hold to Call (Today)</span><span class="info-box-number">{{ metrics.hold_to_call_count ?? 0 }}</span></div></div></div>
            <div class="col-lg-4 col-md-6 col-6"><div class="info-box bg-green"><span class="info-box-icon"><i class="fa fa-truck" /></span><div class="info-box-content"><span class="info-box-text">Scheduled For Pickup</span><span class="info-box-number">{{ metrics.sch_for_p_count ?? 0 }}</span></div></div></div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="box box-info">
                    <div class="box-header with-border"><h3 class="box-title"><i class="fa fa-print" /> Print Temp Label</h3></div>
                    <div class="box-body"><div class="table-placeholder">Data table area</div></div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="box box-info">
                    <div class="box-header with-border"><h3 class="box-title"><i class="fa fa-print" /> Print Post Inspection Item Label(s)</h3></div>
                    <div class="box-body"><div class="table-placeholder">Data table area</div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.task-notes-panel {
    --task-notes-green: #11635a;
    --task-notes-mint: #d4f4ea;
    border: 1px solid var(--task-notes-green);
    border-radius: 8px 8px 4px 4px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(17, 99, 90, 0.08);
    overflow: hidden;
}

.task-notes-tabs {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 10px 10px 0;
    background: #fff;
}

.task-notes-tab {
    border: none;
    background: transparent;
    color: #333;
    padding: 10px 18px 12px;
    font-size: 13px;
    line-height: 1.2;
    cursor: pointer;
    border-radius: 7px 7px 0 0;
    outline: none;
    box-shadow: none;
}

.task-notes-tab:focus:not(:focus-visible) {
    outline: none;
}

.task-notes-tab:focus-visible {
    outline: 2px solid rgba(17, 99, 90, 0.45);
    outline-offset: 2px;
}

.task-notes-tab.active {
    background: var(--task-notes-mint);
    color: #1a1a1a;
    font-weight: 700;
    border: 2px solid var(--task-notes-green);
    border-bottom: none;
    padding-bottom: 12px;
}

.task-notes-divider {
    height: 2px;
    background: var(--task-notes-green);
    flex-shrink: 0;
}

.task-notes-body {
    display: flex;
    align-items: stretch;
    min-height: 120px;
    background: #fff;
    border-left: 1px solid #cfd5d8;
    border-right: 1px solid #cfd5d8;
    border-bottom: 1px solid #cfd5d8;
}

.task-notes-scroll {
    flex: 1;
    min-width: 0;
    max-height: 200px;
    overflow-y: auto;
    padding: 14px 12px;
}

.task-notes-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.task-notes-item {
    border: 1px solid #e6eaec;
    padding: 8px 10px;
    margin-bottom: 8px;
    border-radius: 2px;
    font-size: 13px;
}

.task-notes-empty {
    font-weight: 700;
    color: #5c656b;
    font-size: 13px;
    line-height: 1.45;
    padding: 4px 0;
}

.task-notes-empty-action {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    font-weight: 700;
    color: #11635a;
    text-decoration: underline;
    cursor: pointer;
}

.task-notes-empty-action:hover {
    color: #0d5249;
}

.task-notes-arrows {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 8px 10px 8px 4px;
    border-left: 1px solid #e8ecf0;
}

.task-notes-arrow-btn {
    border: none;
    background: transparent;
    color: #8a9399;
    padding: 2px 6px;
    cursor: pointer;
    line-height: 1;
    font-size: 14px;
}

.task-notes-arrow-btn:hover {
    color: #11635a;
}

.dashboard-counter-badge {
    margin-left: 4px;
    min-width: 22px;
    text-align: center;
}

.ranking-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.rank-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.rank-item img {
    width: 34px;
}

.rank-item span {
    font-weight: 600;
}

.rank-item small {
    color: #222;
}

.target-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    font-size: 12px;
}

.table-placeholder {
    height: 140px;
    border: 1px solid #d7dde2;
    background: #f8fafc;
    display: grid;
    place-items: center;
    color: #8e97a3;
    font-size: 12px;
}

.admin-dashboard :deep(.row > [class*="col-"]) {
    margin-bottom: 10px;
}

.admin-dashboard :deep(.box),
.admin-dashboard :deep(.small-box),
.admin-dashboard :deep(.info-box) {
    margin-bottom: 0;
}

.admin-dashboard :deep(.box-header > .box-title) {
    font-size: 16px;
    line-height: 1.2;
}

.admin-dashboard :deep(.box-header.with-border) {
    border-bottom: 1px solid #f4f4f4;
}

.admin-dashboard :deep(.box-footer) {
    font-size: 12px;
}

@media (max-width: 991px) {
    .ranking-strip,
    .target-stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
