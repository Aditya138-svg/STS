<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import OrdersListScaffold from '@/Components/Admin/OrderManagement/OrdersListScaffold.vue'

const page = usePage()
const ordersPage = computed(() => page.props.ordersPage ?? {})
</script>

<template>
    <OrdersListScaffold
        :title="ordersPage.title ?? 'Orders That Need Attention'"
        :rows="ordersPage.rows ?? []"
        :status-options="ordersPage.status_options ?? []"
        :initial-status-filter="ordersPage.status_filter ?? ''"
        :summary-counts="ordersPage.summary_counts ?? {}"
        :status-labels="ordersPage.status_labels ?? {}"
        :billing-methods="ordersPage.billing_methods ?? {}"
        :territories="ordersPage.territories ?? []"
        :customers="ordersPage.customers ?? []"
        :addresses="ordersPage.addresses ?? []"
        :filters="ordersPage.filters ?? {}"
    />
</template>
