<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import OrdersListScaffold from '@/Components/Admin/OrderManagement/OrdersListScaffold.vue'

const page = usePage()
const ordersPage = computed(() => page.props.ordersPage ?? {})
</script>

<template>
    <OrdersListScaffold
        :title="ordersPage.title ?? 'Order List'"
        :rows="ordersPage.rows ?? []"
        :status-options="ordersPage.status_options ?? []"
        :initial-status-filter="ordersPage.status_filter ?? ''"
    />
</template>
