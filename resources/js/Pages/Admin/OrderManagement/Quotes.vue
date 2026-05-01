<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import QuotesListScaffold from '@/Components/Admin/OrderManagement/QuotesListScaffold.vue'

const page = usePage()
const quotesPage = computed(() => page.props.quotesPage ?? {})
const successMessage = computed(() => page.props.flash?.success ?? '')
</script>

<template>
    <div v-if="successMessage" class="quote-success-popup">
        <i class="fa fa-check-circle"></i>
        {{ successMessage }}
    </div>

    <h2 style="color: black;">Quotes</h2>
    <QuotesListScaffold
        :title="quotesPage.title ?? 'Quotes List'"
        :rows="quotesPage.rows ?? []"
        :status-options="quotesPage.status_options ?? []"
        :initial-status-filter="quotesPage.status_filter ?? ''"
    />
</template>

<style scoped>
.quote-success-popup {
    position: fixed;
    top: 76px;
    right: 24px;
    z-index: 2000;
    padding: 14px 18px;
    background: #7fa5a1;
    color: #fff;
    border-left: 5px solid #f39c12;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
    font-weight: 700;
}

.quote-success-popup i {
    margin-right: 8px;
}
</style>
