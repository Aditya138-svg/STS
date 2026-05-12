<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const { route, sts } = useGuestAssets()
const page = usePage()

const isOpen = ref(false)
const activeTab = ref('by_orderNum')
const loading = ref(false)
const errorMsg = ref('')
const errors = ref({
    trackOrderId: '',
    refNum: '',
    phnNum: ''
})

// Form data
const trackOrderId = ref('')
const refNum = ref('')
const phnNum = ref('')

// Results
const trackResult = ref(null)
const trackResultsList = ref([]) // For track by ref
const expandedOrderId = ref(null)

const togglePanel = () => {
    isOpen.value = !isOpen.value
    if (!isOpen.value) {
        resetForms()
    }
}

const resetForms = () => {
    trackResult.value = null
    trackResultsList.value = []
    errorMsg.value = ''
    errors.value = {
        trackOrderId: '',
        refNum: '',
        phnNum: ''
    }
    loading.value = false
}

const handleTrackOrder = async () => {
    errors.value.trackOrderId = ''
    if (!trackOrderId.value) {
        errors.value.trackOrderId = 'The Order ID is a required field.'
        return
    }

    loading.value = true
    errorMsg.value = ''
    trackResult.value = null

    try {
        const response = await axios.post(route('guest.tracking_order'), {
            orders_id: trackOrderId.value
        })

        if (response.data.status) {
            trackResult.value = response.data.data
        } else {
            errorMsg.value = response.data.message
        }
    } catch (e) {
        errorMsg.value = 'Order not found or system error occurred.'
    } finally {
        loading.value = false
    }
}

const handleTrackByRef = async () => {
    errors.value.refNum = ''
    errors.value.phnNum = ''
    let hasError = false

    if (!refNum.value) {
        errors.value.refNum = 'PO Number is required*'
        hasError = true
    }

    if (!phnNum.value) {
        errors.value.phnNum = 'Phone Number is required*'
        hasError = true
    }

    if (hasError) return

    loading.value = true
    errorMsg.value = ''
    trackResultsList.value = []

    try {
        const response = await axios.post(route('guest.tracking_order_by_refPhn'), {
            ref_no: refNum.value,
            phn_no: phnNum.value
        })

        if (response.data.status) {
            trackResultsList.value = response.data.data
            if (trackResultsList.value.length > 0) {
                expandedOrderId.value = trackResultsList.value[0].order_info.orders_id
            }
        } else {
            errorMsg.value = response.data.message
        }
    } catch (e) {
        errorMsg.value = 'No records found or system error occurred.'
    } finally {
        loading.value = false
    }
}

const toggleExpand = (id) => {
    expandedOrderId.value = expandedOrderId.value === id ? null : id
}

const getDashboardRoute = computed(() => {
    const user = usePage().props.auth.user
    if (!user) return route('login')
    
    const role = user.role
    if (role == 3) return route('warehouse_dashboard') // WAREHOUSE
    if (role == 2) return route('admin_dashboard') // OFFICE
    return route('dashboard')
})
</script>

<template>
    <div>
        <!-- Fixed Track Tab -->
        <button @click="togglePanel" class="sts-fixed-track-tab" :class="{ 'panel-open': isOpen }">
            <i class="fa fa-truck sts-track-icon"></i>
            <span class="vertical-text">T<br>R<br>A<br>C<br>K</span>
        </button>

        <!-- Overlay -->
        <Transition name="fade">
            <div v-if="isOpen" class="sts-track-overlay" @click="togglePanel"></div>
        </Transition>

        <!-- Side Panel -->
        <Transition name="slide">
            <div v-if="isOpen" class="sts-track-panel">
                <div class="panel-header">
                    <h3>Track Your Order</h3>
                    <button @click="togglePanel" class="close-btn">&times;</button>
                </div>

                <div class="panel-body">
                    <!-- Tabs -->
                    <div class="track-tabs">
                        <button 
                            @click="activeTab = 'by_orderNum'; resetForms()" 
                            :class="{ active: activeTab === 'by_orderNum' }"
                        >Order#</button>
                        <button 
                            @click="activeTab = 'by_orderRef'; resetForms()" 
                            :class="{ active: activeTab === 'by_orderRef' }"
                        >PO# & Phone</button>
                    </div>

                    <!-- Error Alert -->
                    <div v-if="errorMsg" class="alert alert-danger mt-3">
                        {{ errorMsg }}
                    </div>

                    <!-- Tab Content: By Order ID -->
                    <div v-if="activeTab === 'by_orderNum'" class="tab-content-inner">
                        <div class="search-box">
                            <input 
                                type="number" 
                                v-model="trackOrderId" 
                                placeholder="Enter Order ID" 
                                @keyup.enter="handleTrackOrder"
                                class="sts-input"
                                :class="{ 'is-invalid': errors.trackOrderId }"
                            >
                            <button @click="handleTrackOrder" class="sts-btn" :disabled="loading">
                                <i v-if="loading" class="fa fa-refresh fa-spin"></i>
                                <span v-else>Go</span>
                            </button>
                        </div>
                        <span v-if="errors.trackOrderId" class="text-danger small mt-1 d-block">{{ errors.trackOrderId }}</span>

                        <!-- Result for Single Order -->
                        <div v-if="trackResult" class="result-container mt-4">
                            <div class="order-summary-card">
                                <table>
                                    <tr v-for="(val, label) in { 
                                        'Service Level': trackResult.order_info.service_level,
                                        'Origin': `${trackResult.order_info.origin_city}, ${trackResult.order_info.origin_state} ${trackResult.order_info.origin_zip}`,
                                        'Destination': `${trackResult.order_info.dest_city}, ${trackResult.order_info.dest_state} ${trackResult.order_info.dest_zip}`,
                                        '#Items': trackResult.order_info.num_of_items,
                                        '#Pieces': trackResult.order_info.num_of_pieces
                                    }" :key="label">
                                        <td>{{ label }}</td>
                                        <td><strong>{{ val }}</strong></td>
                                    </tr>
                                </table>
                            </div>

                            <div class="timeline-container mt-4">
                                <div v-for="(events, date) in trackResult.tracking_info" :key="date" class="timeline-day">
                                    <div class="timeline-date"><span>{{ date }}</span></div>
                                    <div v-for="event in events" :key="event.id" class="timeline-item">
                                        <div class="timeline-icon">
                                            <i class="fa fa-truck"></i>
                                        </div>
                                        <div class="timeline-content">
                                            <span class="time">{{ event.created_at_time_formatted }}</span>
                                            <h4>{{ event.t_status }}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab Content: By PO & Phone -->
                    <div v-if="activeTab === 'by_orderRef'" class="tab-content-inner">
                        <div class="search-grid">
                            <div class="input-wrap-mini">
                                <input 
                                    type="text" 
                                    v-model="refNum" 
                                    placeholder="PO Number" 
                                    class="sts-input full-width"
                                    :class="{ 'is-invalid': errors.refNum }"
                                >
                                <span v-if="errors.refNum" class="text-danger small mt-1 d-block">{{ errors.refNum }}</span>
                            </div>
                            <div class="input-wrap-mini">
                                <input 
                                    type="number" 
                                    v-model="phnNum" 
                                    placeholder="Delivery Phone" 
                                    class="sts-input full-width"
                                    :class="{ 'is-invalid': errors.phnNum }"
                                    maxlength="12"
                                >
                                <span v-if="errors.phnNum" class="text-danger small mt-1 d-block">{{ errors.phnNum }}</span>
                            </div>
                            <button @click="handleTrackByRef" class="sts-btn full-width" :disabled="loading">
                                <i v-if="loading" class="fa fa-refresh fa-spin"></i>
                                <span v-else>Go</span>
                            </button>
                        </div>

                        <!-- List of Orders for PO Search -->
                        <div v-if="trackResultsList.length > 0" class="results-list mt-4">
                            <div v-for="res in trackResultsList" :key="res.order_info.orders_id" class="order-collapse-item">
                                <div @click="toggleExpand(res.order_info.orders_id)" class="item-header">
                                    <span class="order-id">#{{ res.order_info.orders_id }}</span>
                                    <span v-if="res.delivery_completed" class="badge badge-success">Delivered</span>
                                    <i class="fa" :class="expandedOrderId === res.order_info.orders_id ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                </div>
                                
                                <Transition name="expand">
                                    <div v-if="expandedOrderId === res.order_info.orders_id" class="item-body">
                                        <div class="order-summary-card mini">
                                            <table>
                                                <tr v-for="(val, label) in { 
                                                    'Service Level': res.order_info.service_level,
                                                    'Origin': `${res.order_info.origin_city}, ${res.order_info.origin_state}`,
                                                    'Destination': `${res.order_info.dest_city}, ${res.order_info.dest_state}`
                                                }" :key="label">
                                                    <td>{{ label }}</td>
                                                    <td><strong>{{ val }}</strong></td>
                                                </tr>
                                            </table>
                                        </div>
                                        <!-- Timeline for this order -->
                                        <div class="timeline-container mini">
                                            <div v-for="(events, date) in res.tracking_info" :key="date" class="timeline-day">
                                                <div class="timeline-date"><span>{{ date }}</span></div>
                                                <div v-for="event in events" :key="event.id" class="timeline-item">
                                                    <div class="timeline-content">
                                                        <span class="time">{{ event.created_at_time_formatted }}</span>
                                                        <p>{{ event.t_status }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>

                    <!-- Advance Details Banner -->
                    <div class="advance-details-banner mt-5" v-if="trackResult || trackResultsList.length > 0">
                        <h4>FOR ADVANCE DETAILS!</h4>
                        <p>To get more details, click here to</p>
                        <a :href="getDashboardRoute" class="sts-btn-alt">
                            {{ usePage().props.auth.user ? 'DASHBOARD' : 'LOGIN' }}
                        </a>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Tab Styles */
.sts-fixed-track-tab {
    position: fixed;
    right: 0;
    top: 55%;
    transform: translateY(-50%);
    background: linear-gradient(180deg, #0ea5e9 0%, #0369a1 100%);
    color: white;
    padding: 22px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    border-radius: 16px 0 0 16px;
    z-index: 9999;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-right: none;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: -5px 5px 20px rgba(0,0,0,0.15);
}

.sts-fixed-track-tab:hover {
    padding-right: 22px;
    transform: translateY(-50%) translateX(-5px);
}

.sts-fixed-track-tab.panel-open {
    transform: translateY(-50%) translateX(100%);
    opacity: 0;
}

.sts-track-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.vertical-text {
    font-weight: 800;
    font-size: 12px;
    line-height: 1.5;
    letter-spacing: 2px;
}

/* Overlay */
.sts-track-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 10000;
}

/* Panel */
.sts-track-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 450px;
    background: #f8fafc;
    z-index: 10001;
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
}

@media (max-width: 500px) {
    .sts-track-panel {
        width: 100%;
    }
}

.panel-header {
    padding: 25px;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #64748b;
    cursor: pointer;
    line-height: 1;
}

.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 25px;
}

/* Tabs */
.track-tabs {
    display: flex;
    background: #f1f5f9;
    padding: 5px;
    border-radius: 12px;
    gap: 5px;
}

.track-tabs button {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    border-radius: 8px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}

.track-tabs button.active {
    background: white;
    color: #0369a1;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

/* Form Elements */
.search-box {
    margin-top: 25px;
    display: flex;
    gap: 10px;
}

.search-grid {
    margin-top: 25px;
    display: grid;
    gap: 15px;
}

.sts-input {
    flex: 1;
    padding: 12px 15px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
}

.sts-input:focus {
    outline: none;
    border-color: #0369a1;
}

.sts-btn {
    background: #0369a1;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
}

.sts-btn.full-width {
    width: 100%;
}

.sts-btn:hover {
    background: #075985;
}

/* Result Cards */
.order-summary-card {
    background: white;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.order-summary-card table {
    width: 100%;
    border-collapse: collapse;
}

.order-summary-card td {
    padding: 8px 0;
    font-size: 0.9rem;
    color: #475569;
}

.order-summary-card td:last-child {
    text-align: right;
    color: #1e293b;
}

/* Timeline */
.timeline-container {
    padding-left: 10px;
}

.timeline-day {
    position: relative;
    padding-left: 30px;
    padding-bottom: 25px;
}

.timeline-day::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 10px;
    bottom: 0;
    width: 2px;
    background: #e2e8f0;
}

.timeline-date {
    margin-bottom: 15px;
}

.timeline-date span {
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #475569;
}

.timeline-item {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
}

.timeline-icon {
    position: absolute;
    left: -6px;
    width: 22px;
    height: 22px;
    background: #0369a1;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 1;
}

.timeline-content h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
}

.timeline-content .time {
    font-size: 0.8rem;
    color: #94a3b8;
}

/* Collapse List */
.order-collapse-item {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
}

.item-header {
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    user-select: none;
}

.order-id {
    font-weight: 700;
    color: #0369a1;
}

.badge-success {
    background: #dcfce7;
    color: #166534;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
}

.item-header i {
    margin-left: auto;
    color: #94a3b8;
}

.item-body {
    padding: 15px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
}

/* Banner */
.advance-details-banner {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 25px;
    border-radius: 16px;
    text-align: center;
}

.advance-details-banner h4 {
    margin: 0 0 10px;
    font-weight: 800;
    letter-spacing: 1px;
}

.advance-details-banner p {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 15px;
}

.sts-btn-alt {
    display: inline-block;
    background: #f59e0b;
    color: white;
    text-decoration: none;
    padding: 10px 25px;
    border-radius: 8px;
    font-weight: 700;
    transition: transform 0.2s;
}

.sts-btn-alt:hover {
    transform: scale(1.05);
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease-out; max-height: 500px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>
