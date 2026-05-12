<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { sts } = useGuestAssets()
const lastLogin = computed(() => page.props.auth?.user?.last_login_display ?? null)

const phoneRaw = computed(() => String(sts.value.warehousePhone ?? '').trim())
const emailRaw = computed(() => String(sts.value.scheduleEmail ?? '').trim())

const phoneHref = computed(() => {
    if (!phoneRaw.value) return '#'
    const cleaned = phoneRaw.value.replace(/[^\d+]/g, '')
    return cleaned ? `tel:${cleaned}` : '#'
})

const mailHref = computed(() => (emailRaw.value ? `mailto:${emailRaw.value}` : '#'))
</script>

<template>
    <div class="guest-topbar-root">
        <div v-if="lastLogin" class="top-bar">
            <div class="container-fluid top-bar-inner">
                <p>Last Login at: <span>{{ lastLogin }}</span></p>
            </div>
        </div>
        <div class="top-header">
            <div class="container-fluid top-header-inner">
                <div class="main-top-header">
                    <div class="left-header-div">
                        <ul class="mail-number-div">
                            <li v-if="phoneRaw">
                                <a class="guest-top-link" :href="phoneHref">
                                    <i class="fa fa-phone" aria-hidden="true" />
                                    <span>{{ phoneRaw }}</span>
                                </a>
                            </li>
                            <li v-if="emailRaw">
                                <a class="guest-top-link" :href="mailHref">
                                    <i class="fa fa-envelope" aria-hidden="true" />
                                    <span>{{ emailRaw }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="right-header-div">
                        <ul class="social-icons-div">
                            <li><a class="guest-social-link" target="_blank" :href="sts.social?.facebook" aria-label="Facebook"><i class="fab fa-facebook-f" /></a></li>
                            <li><a class="guest-social-link" target="_blank" :href="sts.social?.instagram" aria-label="Instagram"><i class="fab fa-instagram" /></a></li>
                            <li><a class="guest-social-link" target="_blank" :href="sts.social?.x_twitter" aria-label="X/Twitter"><i class="fab fa-x-twitter" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.guest-topbar-root {
    display: flex;
    flex-direction: column;
}

.top-bar {
    background-color: #0f172a !important;
    color: #94a3b8;
    padding: 1px 0;
    font-size: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.top-bar-inner {
    max-width: 1140px;
    margin: 0 auto;
}

.top-bar p {
    margin: 0;
    text-align: left;
}

.top-bar span {
    color: #2dd4bf;
    font-weight: 600;
}

.top-header {
    background: #1e293b;
    padding: 2px 0;
    color: #f1f5f9;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.top-header-inner {
    max-width: 1140px;
    margin: 0 auto;
}

.main-top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.left-header-div {
    display: flex;
    justify-content: flex-start;
}

.mail-number-div {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1.35rem;
    flex-wrap: wrap;
}

.guest-top-link {
    color: #e2e8f0 !important;
    font-size: 0.8125rem;
    font-weight: 500;
    text-decoration: none !important;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: all 0.2s ease;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
}

.guest-top-link:hover {
    color: #2dd4bf !important;
    background-color: rgba(255, 255, 255, 0.05);
}

.guest-top-link:focus-visible {
    outline: 2px solid #7dd3fc;
    outline-offset: 2px;
}

.guest-top-link i {
    color: #2dd4bf;
    font-size: 13px;
}

.social-icons-div {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 10px;
}

.guest-social-link {
    color: #cbd5e1 !important;
    font-size: 0.95rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.75;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.guest-social-link:hover {
    color: #ffffff !important;
    background: #0d9488;
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

@media (prefers-reduced-motion: reduce) {
    .social-icons-div li a {
        transition: color 0.15s ease, background-color 0.15s ease;
    }

    .social-icons-div li a:hover {
        transform: none;
    }
}

@media (max-width: 768px) {
    .main-top-header {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }

    .mail-number-div {
        justify-content: center;
    }

    .top-bar p {
        text-align: center;
    }
}
</style>
