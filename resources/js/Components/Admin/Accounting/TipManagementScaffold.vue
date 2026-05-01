<script setup>
import { computed } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'

const page = usePage()
const tipsPage = computed(() => page.props.tipsPage ?? {})
</script>

<template>
    <Head :title="tipsPage.title ?? 'Tip Management'" />

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ tipsPage.title ?? 'Tip Management' }}</h3>
                    <div class="pull-right tip-total">
                        Total Tips: <strong>${{ Number(tipsPage.total_tip_amount ?? 0).toFixed(2) }}</strong>
                    </div>
                </div>
                <div class="box-body">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Order ID</th>
                                <th>Employee ID</th>
                                <th>Tip Amount</th>
                                <th>Status</th>
                                <th>Txn Datetime</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in (tipsPage.rows ?? [])" :key="row.payment_id">
                                <td>{{ row.payment_id }}</td>
                                <td>{{ row.order_id }}</td>
                                <td>{{ row.employee_id || '-' }}</td>
                                <td>${{ Number(row.tip_amount ?? 0).toFixed(2) }}</td>
                                <td>{{ row.status || '-' }}</td>
                                <td>{{ row.txn_datetime || '-' }}</td>
                            </tr>
                            <tr v-if="!(tipsPage.rows ?? []).length">
                                <td colspan="6" class="text-center text-muted">No tip records found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tip-total {
    font-size: 13px;
}
</style>
