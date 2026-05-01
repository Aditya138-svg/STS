<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import PaymentsListScaffold from '@/Components/Admin/Accounting/PaymentsListScaffold.vue'

const page = usePage()
const paymentPage = computed(() => page.props.paymentPage ?? {})
</script>

<template>
    <PaymentsListScaffold
        :title="paymentPage.title ?? 'All Orders Payment List'"
        :subtitle="paymentPage.subtitle ?? '(Except Completed & Cancelled orders)'"
        help-path="helppost/payment"
        primary-action-label="Export PDF (selected)"
        primary-action-path="admin/accounting/payments/all-orders"
        :rows="paymentPage.rows ?? []"
        :customer-options="paymentPage.customer_options ?? []"
        :initial-status-filter="paymentPage.status_filter ?? ''"
        :initial-customer-filter="paymentPage.customer_filter ?? ''"
    />
</template>
