<script setup>
import { Head } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'

defineProps({
    title: { type: String, default: 'Coming soon' },
    message: { type: String, default: 'This section will be connected to your existing Laravel screens.' },
})
</script>

<template>
    <GuestLayout>
        <Head :title="title" />

        <header class="guest-page-strip">
            <div class="container text-center">
                <h1 class="h3 mb-0">{{ title }}</h1>
            </div>
        </header>
        <div class="container py-5">
            <div class="mx-auto text-center text-muted" style="max-width: 520px">
                <p class="mb-0">{{ message }}</p>
            </div>
        </div>
    </GuestLayout>
</template>
