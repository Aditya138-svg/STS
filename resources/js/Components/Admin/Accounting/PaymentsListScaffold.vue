<script setup>
import { computed, ref } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    helpPath: {
        type: String,
        default: '',
    },
    primaryActionLabel: {
        type: String,
        default: '',
    },
    primaryActionPath: {
        type: String,
        default: '',
    },
    secondaryActionLabel: {
        type: String,
        default: '',
    },
    secondaryActionPath: {
        type: String,
        default: '',
    },
    rows: {
        type: Array,
        default: () => [],
    },
    customerOptions: {
        type: Array,
        default: () => [],
    },
    initialStatusFilter: {
        type: String,
        default: '',
    },
    initialCustomerFilter: {
        type: String,
        default: '',
    },
})

const { href } = useAdminAssets()
const statusFilter = ref(props.initialStatusFilter)
const customerFilter = ref(props.initialCustomerFilter)

const statusOptions = computed(() => {
    const set = new Set()
    props.rows.forEach((row) => {
        const value = String(row.status ?? '').trim()
        if (value) {
            set.add(value)
        }
    })
    return Array.from(set)
})

const filteredRows = computed(() =>
    props.rows.filter((row) => {
        const statusOk = !statusFilter.value || String(row.status ?? '') === statusFilter.value
        const customerOk = !customerFilter.value || String(row.customer ?? '') === customerFilter.value
        return statusOk && customerOk
    }),
)

const applyFilters = () => {
    const query = {}
    if (statusFilter.value) {
        query.status = statusFilter.value
    }
    if (customerFilter.value) {
        query.customer = customerFilter.value
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

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">
                        {{ title }}
                        <small v-if="subtitle">{{ subtitle }}</small>
                    </h3>

                    <div class="btn-toolbar pull-right payment-toolbar">
                        <div class="btn-group" v-if="primaryActionLabel && primaryActionPath">
                            <Link :href="href(primaryActionPath)" class="btn btn-success">
                                <i class="fa fa-check" />
                                {{ primaryActionLabel }}
                            </Link>
                        </div>
                        <div class="btn-group" v-if="secondaryActionLabel && secondaryActionPath">
                            <Link :href="href(secondaryActionPath)" class="btn btn-info">
                                <i class="fa fa-download" />
                                {{ secondaryActionLabel }}
                            </Link>
                        </div>
                        <div class="btn-group" v-if="helpPath">
                            <Link :href="href(helpPath)" class="btn btn-primary" target="_blank">
                                Help <i class="fa fa-question-circle" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div class="box-body">
                    <div class="payment-filter-shell">
                        <div class="row">
                            <label class="col-sm-5 col-xs-12 control-label">
                                Status
                                <select v-model="statusFilter" class="form-control">
                                    <option value="">All</option>
                                    <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
                                </select>
                            </label>
                            <label class="col-sm-5 col-xs-12 control-label">
                                Customer
                                <select v-model="customerFilter" class="form-control">
                                    <option value="">All</option>
                                    <option v-for="option in customerOptions" :key="option" :value="option">{{ option }}</option>
                                </select>
                            </label>
                            <div class="col-sm-2 col-xs-12">
                                <button type="button" class="btn btn-success pull-right" @click="applyFilters">Go</button>
                            </div>
                        </div>
                    </div>

                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th><input type="checkbox" value="1"></th>
                                <th>Order#</th>
                                <th>Customer</th>
                                <th>Biller</th>
                                <th>Transaction ID</th>
                                <th>Order Amount</th>
                                <th>Paid</th>
                                <th>Notes</th>
                                <th>Collection Notes</th>
                                <th>User</th>
                                <th>Txn Datetime</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in filteredRows" :key="`${row.order_number}-${idx}`">
                                <td><input type="checkbox" :value="row.order_number"></td>
                                <td>{{ row.order_number }}</td>
                                <td>{{ row.customer }}</td>
                                <td>{{ row.biller }}</td>
                                <td>{{ row.transaction_id }}</td>
                                <td>${{ Number(row.order_amount ?? 0).toFixed(2) }}</td>
                                <td>${{ Number(row.paid ?? 0).toFixed(2) }}</td>
                                <td>{{ row.notes || '-' }}</td>
                                <td>{{ row.collection_notes || '-' }}</td>
                                <td>{{ row.user || '-' }}</td>
                                <td>{{ row.txn_datetime || '-' }}</td>
                                <td><span class="label label-default">{{ row.status || 'N/A' }}</span></td>
                            </tr>
                            <tr v-if="!filteredRows.length">
                                <td colspan="12" class="text-center text-muted payment-placeholder-row">
                                    No payment rows found for selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.payment-toolbar {
    gap: 6px;
}

.payment-filter-shell {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 15px;
    margin: 12px 0 15px;
}

.payment-placeholder-row {
    padding: 30px 12px;
    font-weight: 600;
}
</style>
