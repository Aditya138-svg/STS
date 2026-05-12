<script setup>
import { computed, ref } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'
import '@/../../resources/css/admin-dashboard.css'

const { asset } = useAdminAssets()

const props = defineProps({
    dashboard: {
        type: Object,
        required: true,
    }
})

// Data mapping from the dashboard object
const scheduledOrdersList = computed(() => props.dashboard?.scheduled_orders_list ?? [])
const visibleScheduledOrdersList = computed(() => scheduledOrdersList.value.slice(0, 6))
const unreadOrderNotes = computed(() => props.dashboard?.unread_order_notes ?? [])
const myTasksList = computed(() => props.dashboard?.my_tasks_list ?? [])
const otherTasksList = computed(() => props.dashboard?.other_tasks_list ?? [])
const duplicateAddresses = computed(() => props.dashboard?.duplicate_addresses ?? [])
const missingOrders = computed(() => props.dashboard?.missing_orders ?? [])
const neverRoutedOrders = computed(() => props.dashboard?.never_routed_orders ?? [])
const todayRoutes = computed(() => props.dashboard?.scheduled_unroute_orders?.data ?? [])
const upcomingOrders = computed(() => {
    const data = props.dashboard?.upcoming_orders?.data ?? {}
    return Object.entries(data).map(([date, count]) => ({
        date,
        count,
        formatted: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    }))
})

const metrics = computed(() => props.dashboard?.metrics ?? {})
const activeTaskTab = ref('unread')

// Date formatting helpers
const todayFormatted = computed(() => new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
const tomorrowFormatted = computed(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
})

// Panel collapse/expand state
const panels = ref({
    ranking: { minimized: false },
    target: { minimized: false },
    scheduled: { minimized: false },
    tasks: { minimized: false },
    duplicates: { minimized: false },
    failed: { minimized: false },
    neverRouted: { minimized: false },
    todayRoutes: { minimized: false },
    upcoming: { minimized: false },
    temp: { minimized: false, tab: 'new' },
    post: { minimized: false, tab: 'new' }
})

const togglePanel = (key) => {
    panels.value[key].minimized = !panels.value[key].minimized
}

const setTab = (panel, tab) => {
    panels.value[panel].tab = tab
    // Trigger GlobalLoader by performing a partial reload
    router.reload({ only: ['dashboard'], preserveScroll: true })
}

// Helper to format date strings from controller (YYYY-MM-DD)
const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    return `${parts[1]}/${parts[2]}/${parts[0]}`
}
</script>

<template>
    <Head title="Admin Dashboard" />
    <div class="dashboard-wrapper bg-slate-100 min-h-screen px-8 py-8 font-sans text-slate-700">
        <!-- Row 1: High-Level Metrics -->
        <div class="metric-grid">
            <div class="metric-box bg-green">
                <div class="relative z-10">
                    <h3>{{ metrics.new_quotes ?? 0 }}</h3>
                    <p>New Quotes</p>
                </div>
                <div class="metric-icon">
                    <i class="fa fa-quote-left"></i>
                </div>
                <Link href="#" class="metric-footer">
                    Explore Details <i class="fa fa-chevron-right text-[10px]"></i>
                </Link>
            </div>

            <div class="metric-box bg-blue">
                <div class="relative z-10">
                    <h3>{{ metrics.accepted_quotes ?? 0 }}</h3>
                    <p>Accepted Quotes</p>
                </div>
                <div class="metric-icon">
                    <i class="fa fa-quote-left"></i>
                </div>
                <Link href="#" class="metric-footer">
                    Explore Details <i class="fa fa-chevron-right text-[10px]"></i>
                </Link>
            </div>

            <div class="metric-box bg-aqua">
                <div class="relative z-10">
                    <h3>{{ metrics.new_orders ?? 0 }}</h3>
                    <p>New Orders</p>
                </div>
                <div class="metric-icon">
                    <i class="fa fa-shopping-bag"></i>
                </div>
                <Link href="#" class="metric-footer">
                    Explore Details <i class="fa fa-chevron-right text-[10px]"></i>
                </Link>
            </div>

            <div class="metric-box bg-yellow">
                <div class="relative z-10">
                    <h3>{{ metrics.new_users ?? 0 }}</h3>
                    <p>New Users</p>
                </div>
                <div class="metric-icon">
                    <i class="fa fa-user-plus"></i>
                </div>
                <Link href="#" class="metric-footer">
                    Explore Details <i class="fa fa-chevron-right text-[10px]"></i>
                </Link>
            </div>
        </div>

        <!-- Row 2: Status indicators (Info Cards) -->
        <div class="info-card-grid gap-8 mb-12">
            <template v-for="card in [
                { title: 'Undelivered orders', date: todayFormatted, count: metrics.undelivered_orders_count ?? 0, color: 'blue', icon: 'fa-shopping-cart' },
                { title: 'Scheduled orders', date: todayFormatted, count: metrics.scheduled_orders_count ?? 0, color: 'slate', icon: 'fa-calendar-check' },
                { title: 'Orders That Need Attention', date: tomorrowFormatted, count: metrics.attention_orders_count ?? 0, color: 'amber', icon: 'fa-exclamation-triangle' },
                { title: 'Due In', count: metrics.due_in_count ?? 0, color: 'orange', icon: 'fa-bus' },
                { title: 'Hold to Call (Today)', count: metrics.hold_to_call_count ?? 0, color: 'amber', icon: 'fa-phone-volume' },
                { title: 'Scheduled For Pickup (Tomorrow)', count: metrics.sch_for_p_count ?? 0, color: 'emerald', icon: 'fa-truck-loading' },
                { title: 'Scheduled For Delivery (Tomorrow)', count: metrics.sch_for_d_tomorrow ?? 0, color: 'slate', icon: 'fa-truck' },
                { title: 'Out For Pickup (Yesterday)', count: metrics.out_for_p_yesterday ?? 0, color: 'emerald', icon: 'fa-truck' },
                { title: 'Out For Delivery (Yesterday)', count: metrics.out_for_d_yesterday ?? 0, color: 'slate', icon: 'fa-truck' },
                { title: 'No Action Taken For New Orders (Last 24 H...)', count: metrics.no_action_24h ?? 0, color: 'blue-grey', icon: 'fa-shopping-bag' },
                { title: 'Orders Not Schedule Yet (Over 48 Hours)', count: metrics.not_scheduled_48h ?? 0, color: 'orange', icon: 'fa-shopping-bag' },
                { title: 'Orders Not Schedule Yet (Notified Over 48 ...)', count: metrics.not_scheduled_notified_48h ?? 0, color: 'blue-grey', icon: 'fa-shopping-bag' }
            ]" :key="card.title">
                <div :class="[
                    'info-card',
                    card.color === 'blue' ? 'border-blue-100' :
                    card.color === 'slate' ? 'border-slate-200' :
                    card.color === 'amber' ? 'border-amber-100' :
                    card.color === 'orange' ? 'border-orange-100' :
                    card.color === 'emerald' ? 'border-emerald-100' : 'border-slate-200'
                ]">
                    <div class="info-card-icon">
                        <i :class="['fa', card.icon]"></i>
                    </div>
                    <div class="info-card-content">
                        <h4>{{ card.title }}</h4>
                        <div class="info-card-number-row">
                            <span :class="[card.count === 0 && card.date ? 'text-rose-500' : 'text-slate-800']">
                                {{ card.count !== undefined ? card.count : card.value }}
                            </span>
                            <span v-if="card.date" class="info-card-date">{{ card.date }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Row 3: Insights & Performance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="ranking-panel" :class="{ 'panel--minimized': panels.ranking.minimized }">
                <div class="ranking-header flex-row !justify-between">
                    <h3>Today's Top 3 Ranking</h3>
                    <button class="panel-toggle" @click="togglePanel('ranking')">
                        <i :class="['fa', panels.ranking.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.ranking.minimized" class="ranking-grid">
                    <div v-for="n in [1, 2, 3]" :key="n" class="ranking-item">
                        <div class="rank-medal">
                            <img :src="asset(`/images/rank_${n === 1 ? 'first' : n === 2 ? 'second' : 'third'}.png`)" 
                                 class="w-full h-full object-contain" />
                        </div>
                        <div class="rank-copy">
                            <strong>Rank #{{ n }}</strong>
                            <span>You can be on Rank #{{ n }}.</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="target-panel" :class="{ 'panel--minimized': panels.target.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <h3>Target Achieved Stats <small>(based on scheduled DELIVERIES only)</small></h3>
                    <button class="panel-toggle" @click="togglePanel('target')">
                        <i :class="['fa', panels.target.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.target.minimized" class="target-grid !gap-y-6">
                    <div v-for="label in ['Today', 'Tomorrow', 'This Week', 'This Month']" :key="label" class="space-y-4">
                        <div class="target-copy">
                            <span>{{ label }}</span>
                            <div class="text-right"><span>0%</span> Achieved</div>
                        </div>
                        <div class="target-progress">
                            <div style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 4: Main Operational Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <!-- Date-wise Scheduled Orders List -->
            <div class="dashboard-panel lg:col-span-3 h-[410px]" :class="{ 'panel--minimized': panels.scheduled.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <div>
                        <h3>Date-wise Scheduled Orders List</h3>
                        <p class="route-hint">Route <i class="fa fa-map"></i>: Please route the dated orders</p>
                    </div>
                    <button class="panel-toggle" @click="togglePanel('scheduled')">
                        <i :class="['fa', panels.scheduled.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.scheduled.minimized" class="dashboard-panel-body panel-center custom-scrollbar">
                    <div v-if="visibleScheduledOrdersList.length" class="flex flex-col items-center gap-[7px]">
                        <Link v-for="item in visibleScheduledOrdersList" :key="item.date" 
                            href="#" 
                            class="date-pill">
                            <span>{{ formatDate(item.date) }}</span>
                            <span class="count-badge">{{ item.total_orders }}</span>
                        </Link>
                    </div>
                    <div v-else class="empty-text"><span>No order(s) found.</span></div>
                </div>
            </div>

            <!-- Notes & Tasks Tabs -->
            <div class="dashboard-tabs lg:col-span-5 h-[410px]" :class="{ 'panel--minimized': panels.tasks.minimized }">
                <div class="tab-strip flex-row !justify-between">
                    <div class="flex items-end h-full">
                        <button :class="{ active: activeTaskTab === 'unread' }" @click="activeTaskTab === 'unread'">Unread Notes</button>
                        <button :class="{ active: activeTaskTab === 'my-tasks' }" @click="activeTaskTab === 'my-tasks'">My Tasks</button>
                        <button :class="{ active: activeTaskTab === 'overall' }" @click="activeTaskTab === 'overall'">Overall Tasks</button>
                    </div>
                    <button class="panel-toggle self-center mr-4" @click="togglePanel('tasks')">
                        <i :class="['fa', panels.tasks.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.tasks.minimized" class="tab-body custom-scrollbar">
                    <div v-if="activeTaskTab === 'unread' && unreadOrderNotes.length" class="space-y-4">
                        <div v-for="(note, idx) in unreadOrderNotes" :key="idx" class="p-2 bg-slate-50 border border-slate-200">
                            <p class="text-[12px] text-slate-600 font-medium leading-relaxed">{{ note.message }}</p>
                        </div>
                    </div>
                    <div v-else-if="activeTaskTab === 'unread'" class="h-full flex items-center">
                        <p class="text-[13px] font-bold text-slate-500">No Unread Notes found. Please check My Tasks</p>
                    </div>
                    <div v-else-if="activeTaskTab === 'my-tasks' && myTasksList.length" class="space-y-4">
                        <div v-for="task in myTasksList" :key="task.id ?? task.task_name" class="p-2 bg-slate-50 border border-slate-200">
                            <p class="text-[12px] text-slate-600 font-medium leading-relaxed">{{ task.task_name ?? task.message ?? 'Task' }}</p>
                        </div>
                    </div>
                    <div v-else-if="activeTaskTab === 'my-tasks'" class="h-full flex items-center">
                        <p class="text-[13px] font-bold text-slate-500">No Assigned Notes found. Please check Unread Notes</p>
                    </div>
                    <div v-else-if="otherTasksList.length" class="space-y-4">
                        <div v-for="task in otherTasksList" :key="task.id ?? task.task_name" class="p-2 bg-slate-50 border border-slate-200">
                            <p class="text-[12px] text-slate-600 font-medium leading-relaxed">{{ task.task_name ?? task.message ?? 'Task' }}</p>
                        </div>
                    </div>
                    <div v-else class="h-full flex items-center">
                        <p class="text-[13px] font-bold text-slate-500">No Assigned Notes found. Please check Unread Notes</p>
                    </div>
                </div>
            </div>

            <!-- Duplicate Addresses List -->
            <div class="dashboard-panel lg:col-span-4 h-[410px]" :class="{ 'panel--minimized': panels.duplicates.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <div class="flex items-center gap-3">
                        <h3>Duplicate Addresses List</h3>
                        <span class="title-badge">{{ duplicateAddresses.length }}</span>
                    </div>
                    <button class="panel-toggle" @click="togglePanel('duplicates')">
                        <i :class="['fa', panels.duplicates.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.duplicates.minimized" class="dashboard-panel-body custom-scrollbar !px-5 !py-4">
                    <div v-if="duplicateAddresses.length" class="flex flex-col gap-3">
                        <button v-for="addr in duplicateAddresses" :key="addr.address_soundex" class="duplicate-btn">{{ addr.address }}</button>
                    </div>
                    <div v-else class="empty-text"><p>No addresses found.</p></div>
                </div>
                <div v-show="!panels.duplicates.minimized" class="dashboard-panel-footer"><Link href="#">View All</Link></div>
            </div>
        </div>

        <!-- Row 5: Operation Quads -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <!-- Failed Attempt(s) -->
            <div class="dashboard-panel danger h-[367px]" :class="{ 'panel--minimized': panels.failed.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <h3>Failed Attempt(s)</h3>
                    <button class="panel-toggle" @click="togglePanel('failed')">
                        <i :class="['fa', panels.failed.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.failed.minimized" class="dashboard-panel-body panel-center custom-scrollbar space-y-2">
                    <button v-for="item in missingOrders" :key="item.date" class="date-pill danger">
                        <span>{{ formatDate(item.date) }}</span>
                        <span class="count-badge">{{ item.total_orders }}</span>
                    </button>
                    <div v-if="!missingOrders.length" class="empty-text">No data available.</div>
                </div>
                <div v-show="!panels.failed.minimized" class="dashboard-panel-footer"><Link href="#">View More</Link></div>
            </div>

            <!-- Never Routed Order(s) -->
            <div class="dashboard-panel danger h-[367px]" :class="{ 'panel--minimized': panels.neverRouted.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <h3>Never Routed Order(s)</h3>
                    <button class="panel-toggle" @click="togglePanel('neverRouted')">
                        <i :class="['fa', panels.neverRouted.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.neverRouted.minimized" class="dashboard-panel-body panel-center custom-scrollbar space-y-2">
                    <button v-for="item in neverRoutedOrders" :key="item.date" class="date-pill danger">
                        <span>{{ formatDate(item.date) }}</span>
                        <span class="count-badge">{{ item.total_orders }}</span>
                    </button>
                    <div v-if="!neverRoutedOrders.length" class="empty-text">No data available.</div>
                </div>
                <div v-show="!panels.neverRouted.minimized" class="dashboard-panel-footer"><Link href="#">View More</Link></div>
            </div>

            <!-- Today Routes -->
            <div class="dashboard-panel h-[367px]" :class="{ 'panel--minimized': panels.todayRoutes.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <h3>Today Routes</h3>
                    <button class="panel-toggle" @click="togglePanel('todayRoutes')">
                        <i :class="['fa', panels.todayRoutes.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.todayRoutes.minimized" class="dashboard-panel-body custom-scrollbar">
                    <div v-if="todayRoutes.length" class="space-y-3">
                        <div v-for="route in todayRoutes" :key="route.o_id" class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white hover:border-[#11635a] hover:shadow-md transition-all">
                            <span class="text-[12px] font-bold text-slate-700 group-hover:text-[#11635a]">Order #{{ route.o_id }}</span>
                            <span class="text-[9px] font-black text-white bg-[#11635a] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Standard</span>
                        </div>
                    </div>
                    <div v-else class="empty-text">No order(s) found.</div>
                </div>
                <div v-show="!panels.todayRoutes.minimized" class="dashboard-panel-footer"><Link href="#">View More</Link></div>
            </div>

            <!-- Upcoming Routes -->
            <div class="dashboard-panel h-[367px]" :class="{ 'panel--minimized': panels.upcoming.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <h3>Upcoming Routes</h3>
                    <div class="flex items-center gap-3">
                        <span v-if="upcomingOrders.length" class="title-badge">{{ upcomingOrders.reduce((a, b) => a + b.count, 0) }}</span>
                        <button class="panel-toggle" @click="togglePanel('upcoming')">
                            <i :class="['fa', panels.upcoming.minimized ? 'fa-plus' : 'fa-minus']"></i>
                        </button>
                    </div>
                </div>
                <div v-show="!panels.upcoming.minimized" class="dashboard-panel-body custom-scrollbar grid grid-cols-2 gap-2 content-start">
                    <button v-for="item in upcomingOrders" :key="item.date" class="bg-white border border-slate-200 hover:border-[#11635a] group py-3 px-5 rounded-xl font-bold text-[11px] flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
                        <span class="text-slate-500 group-hover:text-[#11635a]">{{ item.formatted }}</span>
                        <span class="bg-[#11635a] text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform">{{ item.count }}</span>
                    </button>
                    <div v-if="!upcomingOrders.length" class="empty-text col-span-2">No route(s) found.</div>
                </div>
                <div v-show="!panels.upcoming.minimized" class="dashboard-panel-footer"><Link href="#">View More</Link></div>
            </div>
        </div>

        <!-- Row 6: Print Tables -->
        <div class="print-grid gap-8 pb-10">
            <div class="print-panel" :class="{ 'panel--minimized': panels.temp.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <div class="flex items-center gap-2">
                        <i class="fa fa-print"></i>
                        <h3>Print Temp Label</h3>
                    </div>
                    <button class="panel-toggle" @click="togglePanel('temp')">
                        <i :class="['fa', panels.temp.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.temp.minimized" class="print-body">
                    <div class="tab-strip">
                        <button :class="{ active: panels.temp.tab === 'new' }" @click="setTab('temp', 'new')">New</button><button :class="{ active: panels.temp.tab === 'printed' }" @click="setTab('temp', 'printed')">Printed</button><button :class="{ active: panels.temp.tab === 'declined' }" @click="setTab('temp', 'declined')">Declined</button>
                    </div>
                    <div class="print-content-wrap">
                        <div class="data-table-controls">
                            <div class="entries-select">Show <select><option>10</option></select> entries</div>
                            <div class="search-box">Search: <input type="text" /></div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Location <i class="fa fa-caret-down text-blue-500"></i></th>
                                        <th>Requested By <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Receiving ID <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Status <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Action Performed at <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Created At <i class="fa fa-sort text-slate-300"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td colspan="6" class="text-center py-6 text-slate-500 font-medium">No data available in table</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="data-table-footer">
                            <div class="info">Showing 0 to 0 of 0 entries</div>
                            <div class="pagination">
                                <span class="disabled">Previous</span>
                                <span class="disabled">Next</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="print-panel" :class="{ 'panel--minimized': panels.post.minimized }">
                <div class="dashboard-panel-header flex-row">
                    <div class="flex items-center gap-2">
                        <i class="fa fa-print"></i>
                        <h3>Print Post Inspection Item Label(s) <small class="text-red-600">(NEW, please download updated app)</small></h3>
                    </div>
                    <button class="panel-toggle" @click="togglePanel('post')">
                        <i :class="['fa', panels.post.minimized ? 'fa-plus' : 'fa-minus']"></i>
                    </button>
                </div>
                <div v-show="!panels.post.minimized" class="print-body">
                    <div class="tab-strip">
                        <button :class="{ active: panels.post.tab === 'new' }" @click="setTab('post', 'new')">New</button><button :class="{ active: panels.post.tab === 'printed' }" @click="setTab('post', 'printed')">Printed</button><button :class="{ active: panels.post.tab === 'declined' }" @click="setTab('post', 'declined')">Declined</button>
                    </div>
                    <div class="print-content-wrap">
                        <div class="data-table-controls">
                            <div class="entries-select">Show <select><option>10</option></select> entries</div>
                            <div class="search-box">Search: <input type="text" /></div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Location <i class="fa fa-caret-down text-blue-500"></i></th>
                                        <th>Requested By <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>QR ID <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Status <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Action Performed at <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Created At <i class="fa fa-sort text-slate-300"></i></th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td colspan="7" class="text-center py-6 text-slate-500 font-medium">No data available in table</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="data-table-footer">
                            <div class="info">Showing 0 to 0 of 0 entries</div>
                            <div class="pagination">
                                <span class="disabled">Previous</span>
                                <span class="disabled">Next</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
