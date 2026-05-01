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
    props.rows.filter((row) => !statusFilter.value || String(row.status ?? '') === statusFilter.value),
)

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
</script>

<template>
    <Head :title="title" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">{{ title }}</h3>
                    <div class="btn-toolbar pull-right">
                        <div class="btn-group">
                            <Link :href="href('admin/accounting/payments/all-orders')" class="btn btn-danger">
                                <i class="fa fa-dollar" /> Payments
                            </Link>
                        </div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info">Actions</button>
                        </div>
                    </div>
                </div>

                <div class="box-body">
                    <div class="row">
                        <div class="col-sm-12">
                            <strong class="text-info"><i class="fa fa-info fa-lg" /> <em>Important Notes</em></strong>
                            <ol class="order-notes-list">
                                <li><span class="text-info">Only open orders will be shown in this list.</span></li>
                                <li><span class="text-danger">If any order is not found here then please check in Archive Orders.</span></li>
                            </ol>
                        </div>
                    </div>

                    <div class="order-filter-shell">
                        <label class="control-label">
                            Status
                            <select v-model="statusFilter" class="form-control input-sm">
                                <option value="">-All-</option>
                                <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
                            </select>
                        </label>
                        <button type="button" class="btn btn-success btn-sm" @click="applyFilters">Go</button>
                    </div>

                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Order Date</th>
                                <th>Order Type</th>
                                <th>Contact Details</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Distance</th>
                                <th>#Items</th>
                                <th>Cubes</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in filteredRows" :key="`${row.order_number}-${idx}`">
                                <td>{{ row.order_number }}</td>
                                <td>{{ row.order_date || '-' }}</td>
                                <td>{{ row.order_type || '-' }}</td>
                                <td>{{ row.contact_details || '-' }}</td>
                                <td>{{ row.origin || '-' }}</td>
                                <td>{{ row.destination || '-' }}</td>
                                <td>{{ row.distance || '-' }}</td>
                                <td>{{ row.items || '-' }}</td>
                                <td>{{ row.cubes || '-' }}</td>
                                <td>${{ Number(row.total_amount ?? 0).toFixed(2) }}</td>
                                <td>{{ row.status || '-' }}</td>
                                <td><button type="button" class="btn btn-xs btn-default" disabled>View</button></td>
                            </tr>
                            <tr v-if="!filteredRows.length">
                                <td colspan="12" class="text-center text-muted empty-row">No orders found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-notes-list {
    margin-left: 25px;
}

.order-filter-shell {
    margin: 10px 0;
    display: flex;
    gap: 12px;
    align-items: end;
}

.empty-row {
    padding: 24px 12px;
    font-weight: 600;
}
</style>
