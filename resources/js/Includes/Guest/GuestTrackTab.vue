<script setup>
import { Link } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const { route } = useGuestAssets()
</script>

<template>
    <Link :href="route('guest.track_order')" class="guest-track-tab text-decoration-none d-none d-md-flex" aria-label="Track your order">
        <i class="fa-solid fa-truck guest-track-tab__icon" aria-hidden="true" />
        <span class="guest-track-tab__label">Track</span>
    </Link>
</template>
