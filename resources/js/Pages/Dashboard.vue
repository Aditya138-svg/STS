<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { route } = useGuestAssets()

const user = computed(() => page.props.auth?.user)
const appName = computed(() => page.props.sts?.appName ?? 'STS')
</script>

<template>
    <GuestLayout>
        <Head :title="`Dashboard — ${appName}`" />

        <div class="container py-5">
            <h1 class="h3 mb-3">Dashboard</h1>
            <p class="text-muted">
                Signed in as <strong>{{ user?.email }}</strong>. Replace this placeholder with your authenticated workspace.
            </p>
            <Link :href="route('guest.home')" class="btn btn-outline-secondary btn-sm">Home</Link>
        </div>
    </GuestLayout>
</template>
