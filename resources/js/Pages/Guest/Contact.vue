<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { route } = useGuestAssets()

const appName = computed(() => page.props.sts?.appName ?? 'STS')
const phone = computed(() => page.props.sts?.warehousePhone)
const email = computed(() => page.props.sts?.scheduleEmail)
</script>

<template>
    <GuestLayout>
        <Head :title="`Contact — ${appName}`" />

        <header class="guest-page-strip">
            <div class="container">
                <h1 class="h2 mb-0 text-center text-uppercase">Contact us</h1>
                <p class="text-center mb-0 mt-2 small guest-page-strip-lead">
                    Reach the team at {{ appName }} — replace this page with your legacy contact form when ready.
                </p>
            </div>
        </header>

        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-4">
                            <ul class="list-unstyled mb-4">
                                <li class="mb-2"><strong>Phone:</strong> {{ phone }}</li>
                                <li><strong>Email:</strong> <a :href="`mailto:${email}`">{{ email }}</a></li>
                            </ul>
                            <p class="small text-muted mb-0">
                                Prefer the classic experience?
                                <Link :href="route('guest.home')" class="link-secondary">Return home</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>
