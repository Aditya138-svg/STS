<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import PaymentsListScaffold from '@/Components/Admin/Accounting/PaymentsListScaffold.vue'

const page = usePage()
const paymentPage = computed(() => page.props.paymentPage ?? {})
</script>

<template>
    <PaymentsListScaffold
        :title="paymentPage.title ?? 'Paid Orders Payment List'"
        :subtitle="paymentPage.subtitle ?? '(Only Completed Orders)'"
        help-path="helppost/payment"
        primary-action-label="Mark As Billed"
        primary-action-path="admin/accounting/payments/paid-orders"
        secondary-action-label="Export CSV"
        secondary-action-path="admin/accounting/payments/paid-orders"
        :rows="paymentPage.rows ?? []"
        :customer-options="paymentPage.customer_options ?? []"
        :initial-status-filter="paymentPage.status_filter ?? ''"
        :initial-customer-filter="paymentPage.customer_filter ?? ''"
    />
</template>
