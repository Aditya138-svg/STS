<script setup>
import { ref, computed, onMounted } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import axios from 'axios'
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { useGuestAssets } from '@/Composables/Guest'

const { route, sts, asset } = useGuestAssets()
const page = usePage()

const props = defineProps({
    orders_id: {
        type: [String, Number],
        default: ''
    }
})

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
    const user = page.props.auth.user
    if (!user) return route('login')
    
    const role = user.role
    if (role == 3) return route('warehouse_dashboard') // WAREHOUSE
    if (role == 2) return route('admin_dashboard') // OFFICE
    return route('dashboard')
})

onMounted(() => {
    if (props.orders_id) {
        trackOrderId.value = props.orders_id
        handleTrackOrder()
    }
})
</script>

<template>
    <AuthLayout authImage="track-order.svg">
        <Head title="Track Your Order" />
        
        <div class="track-form-container">
            <div class="auth-header mb-5">
                <h1 class="auth-title mb-2">Track Order</h1>
                <p class="auth-subtitle">Enter your details to get real-time updates.</p>
            </div>

            <div class="track-tabs-container mb-4">
                <div class="track-tabs-nav">
                    <button 
                        @click="activeTab = 'by_orderNum'; resetForms()" 
                        :class="{ active: activeTab === 'by_orderNum' }"
                        class="tab-nav-btn"
                    >Order ID</button>
                    <button 
                        @click="activeTab = 'by_orderRef'; resetForms()" 
                        :class="{ active: activeTab === 'by_orderRef' }"
                        class="tab-nav-btn"
                    >PO# & Phone</button>
                </div>
            </div>

            <div class="track-form-body">
                <!-- Error Alert -->
                <Transition name="fade">
                    <div v-if="errorMsg" class="alert-custom error mb-4">
                        <i class="fa fa-exclamation-circle"></i>
                        {{ errorMsg }}
                    </div>
                </Transition>

                <!-- Tab Content: By Order ID -->
                <div v-if="activeTab === 'by_orderNum'" class="form-group">
                    <div class="auth-input-group">
                        <i class="fa fa-hashtag input-icon"></i>
                        <input 
                            type="number" 
                            v-model="trackOrderId" 
                            placeholder="Order ID" 
                            @keyup.enter="handleTrackOrder"
                            class="form-control"
                            :class="{ 'is-invalid': errors.trackOrderId }"
                        >
                    </div>
                    <span v-if="errors.trackOrderId" class="text-danger small mt-1 d-block">{{ errors.trackOrderId }}</span>
                    <button @click="handleTrackOrder" class="btn-auth mt-4" :disabled="loading">
                        <i v-if="loading" class="fa fa-refresh fa-spin mr-2"></i>
                        <span v-else>Track Package</span>
                    </button>
                </div>

                <!-- Tab Content: By PO & Phone -->
                <div v-if="activeTab === 'by_orderRef'" class="track-multi-form">
                    <div class="form-group">
                        <div class="auth-input-group">
                            <i class="fa fa-file-text input-icon"></i>
                            <input type="text" v-model="refNum" placeholder="PO Number" class="form-control" :class="{ 'is-invalid': errors.refNum }">
                        </div>
                        <span v-if="errors.refNum" class="text-danger small mt-1 d-block">{{ errors.refNum }}</span>
                    </div>
                    <div class="form-group">
                        <div class="auth-input-group">
                            <i class="fa fa-phone input-icon"></i>
                            <input type="number" v-model="phnNum" placeholder="Delivery Phone" class="form-control" :class="{ 'is-invalid': errors.phnNum }" maxlength="12">
                        </div>
                        <span v-if="errors.phnNum" class="text-danger small mt-1 d-block">{{ errors.phnNum }}</span>
                    </div>
                    <button @click="handleTrackByRef" class="btn-auth mt-2" :disabled="loading">
                        <i v-if="loading" class="fa fa-refresh fa-spin mr-2"></i>
                        <span v-else>Search Orders</span>
                    </button>
                </div>

                <!-- Results Visualization -->
                <div v-if="trackResult || trackResultsList.length > 0" class="results-container mt-5">
                    
                    <!-- Single Order View -->
                    <div v-if="trackResult" class="order-detail-card">
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Service</label>
                                <span>{{ trackResult.order_info.service_level }}</span>
                            </div>
                            <div class="info-item">
                                <label>Items</label>
                                <span>{{ trackResult.order_info.num_of_pieces }} Pcs</span>
                            </div>
                            <div class="info-item full">
                                <label>Route</label>
                                <div class="route-display">
                                    <span class="city">{{ trackResult.order_info.origin_city }}</span>
                                    <i class="fa fa-long-arrow-right mx-2"></i>
                                    <span class="city">{{ trackResult.order_info.dest_city }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="timeline-container mt-4">
                            <div v-for="(events, date) in trackResult.tracking_info" :key="date" class="timeline-date-group">
                                <div class="timeline-date-label">{{ date }}</div>
                                <div v-for="event in events" :key="event.id" class="timeline-item">
                                    <div class="timeline-point"></div>
                                    <div class="timeline-info">
                                        <div class="status">{{ event.t_status }}</div>
                                        <div class="time">{{ event.created_at_time_formatted }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Multi Order View (PO Search) -->
                    <div v-if="trackResultsList.length > 0" class="orders-list">
                        <div v-for="res in trackResultsList" :key="res.order_info.orders_id" class="order-compact-card">
                            <div @click="toggleExpand(res.order_info.orders_id)" class="compact-header">
                                <div class="id-info">
                                    <span class="label">ID:</span>
                                    <span class="value">#{{ res.order_info.orders_id }}</span>
                                </div>
                                <div class="status-info">
                                    <span v-if="res.delivery_completed" class="badge-delivered">Delivered</span>
                                    <i class="fa" :class="expandedOrderId === res.order_info.orders_id ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                </div>
                            </div>
                            
                            <Transition name="fade">
                                <div v-if="expandedOrderId === res.order_info.orders_id" class="compact-body">
                                    <div class="mini-info">
                                        <p><strong>To:</strong> {{ res.order_info.dest_city }}</p>
                                    </div>
                                    <div class="mini-timeline">
                                        <div v-for="(events, date) in res.tracking_info" :key="date" class="mini-step">
                                            <div class="mini-date">{{ date }}</div>
                                            <div v-for="event in events" :key="event.id" class="mini-status">
                                                {{ event.t_status }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- Final CTA -->
                    <div class="tracking-footer-cta mt-5">
                        <p>Need detailed shipping documents?</p>
                        <a :href="getDashboardRoute" class="btn-link">
                            {{ page.props.auth.user ? 'Go to Dashboard' : 'Login to Account' }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </AuthLayout>
</template>

<style scoped>
/* Overriding content-body width for Track Order results if needed */
:deep(.content-body) {
    max-width: 500px; /* Slightly wider for tracking info */
}

.auth-subtitle {
    color: #64748b;
    font-size: 15px;
}

.track-tabs-nav {
    display: flex;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 12px;
    gap: 5px;
}

.tab-nav-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.tab-nav-btn.active {
    background: white;
    color: #0d9488;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.alert-custom.error {
    background: #fef2f2;
    border-radius: 12px;
    padding: 14px 18px;
    color: #ef4444;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #fee2e2;
}

/* Results Card */
.order-detail-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.info-item label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 700;
    color: #94a3b8;
    margin-bottom: 2px;
}

.info-item span {
    font-weight: 700;
    color: #1e293b;
    font-size: 15px;
}

.info-item.full {
    grid-column: span 2;
    padding-top: 10px;
    border-top: 1px dashed #e2e8f0;
}

.route-display {
    display: flex;
    align-items: center;
    color: #0d9488;
}

.route-display .city {
    color: #1e293b;
}

/* Timeline */
.timeline-container {
    padding-left: 10px;
}

.timeline-date-group {
    margin-bottom: 20px;
}

.timeline-date-label {
    font-size: 12px;
    font-weight: 800;
    color: #0d9488;
    margin-bottom: 12px;
}

.timeline-item {
    position: relative;
    padding-left: 24px;
    padding-bottom: 16px;
    border-left: 2px solid #f1f5f9;
}

.timeline-item:last-child {
    border-left-color: transparent;
}

.timeline-point {
    position: absolute;
    left: -7px;
    top: 0;
    width: 12px;
    height: 12px;
    background: white;
    border: 2px solid #0d9488;
    border-radius: 50%;
}

.timeline-info .status {
    font-weight: 700;
    font-size: 14px;
    color: #1e293b;
    line-height: 1.2;
}

.timeline-info .time {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

/* Multi results */
.order-compact-card {
    background: #f8fafc;
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
}

.compact-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.compact-header .id-info .label {
    color: #64748b;
    font-weight: 600;
    font-size: 13px;
    margin-right: 4px;
}

.compact-header .id-info .value {
    font-weight: 800;
    color: #1e293b;
}

.badge-delivered {
    background: #dcfce7;
    color: #15803d;
    padding: 2px 8px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    margin-right: 10px;
}

.compact-body {
    padding: 0 16px 16px;
    border-top: 1px solid #e2e8f0;
}

.mini-info {
    padding: 10px 0;
    font-size: 13px;
}

.mini-timeline {
    font-size: 12px;
}

.mini-status {
    color: #64748b;
}

/* CTA Footer */
.tracking-footer-cta {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid #f1f5f9;
}

.tracking-footer-cta p {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 5px;
}

.btn-link {
    color: #0d9488;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
