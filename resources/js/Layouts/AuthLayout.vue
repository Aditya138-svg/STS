<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { route } = useGuestAssets()
</script>

<template>
    <div class="auth-shell" style="background: linear-gradient(135deg, #f6f8f7 0%, #eef3f1 100%);">
        <header class="auth-bar border-bottom bg-white py-3 shadow-sm">
            <div class="container auth-bar-inner">
                <Link :href="route('guest.home')" class="text-decoration-none fw-semibold text-dark">
                    {{ page.props.sts?.appName ?? 'STS' }}
                </Link>
                <Link :href="route('guest.home')" class="small text-muted text-decoration-none">← Back home</Link>
            </div>
        </header>
        <div class="auth-main">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-5 col-xl-4">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
