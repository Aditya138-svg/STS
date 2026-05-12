<script setup>
import { computed, ref } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { asset, route, christmasTheme } = useGuestAssets()

const user = computed(() => page.props.auth?.user)
const notifications = computed(() => page.props.notifications)
const roles = computed(() => page.props.sts?.roles ?? {})
const unread = computed(() => notifications.value?.unread_count ?? 0)
const noteItems = computed(() => notifications.value?.items ?? [])

const isCustomerRole = computed(() => {
    const r = user.value?.role
    if (!r) return true
    return r === roles.value.corporate || r === roles.value.non_corporate
})

function displayName(u) {
    if (!u) return ''
    const n = String(u.name ?? '').trim()
    return n.length ? u.name : u.email
}

const isMenuOpen = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
    <nav class="navbar navbar-default navbar-static-top guest-navbar">
        <div class="container guest-navbar-inner">
            <div class="navbar-header guest-navbar-header">
                <Link class="navbar-brand load_ajax guest-brand" :href="route('guest.home')">
                    <img
                        class="img-responsive main-logo"
                        :src="christmasTheme ? asset('images/christmas-logo.jpg') : asset('images/logo2.png')"
                        alt="STS Logistics"
                    >
                </Link>

                <button
                    type="button"
                    class="navbar-toggle guest-nav-toggle"
                    :class="{ 'collapsed': !isMenuOpen }"
                    @click="toggleMenu"
                    aria-label="Toggle Navigation"
                >
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                </button>
            </div>

            <div id="app-navbar-collapse" class="collapse navbar-collapse guest-navbar-collapse" :class="{ 'show': isMenuOpen }">
                <div class="nav-center-wrapper">
                    <ul class="guest-nav-menu">
                        <template v-if="!user">
                            <li><Link :href="route('guest.home')" :class="{ active: route().current('guest.home') }">Home</Link></li>
                            <li><Link :href="route('guest.about')" :class="{ active: route().current('guest.about') }">About</Link></li>
                            <li><Link :href="route('guest.contact')" :class="{ active: route().current('guest.contact') }">Contact</Link></li>
                            <li><Link :href="route('login')" :class="{ active: route().current('login') }">Login</Link></li>
                            <li><Link :href="route('register')" :class="{ active: route().current('register') }">Register</Link></li>
                        </template>

                        <template v-else-if="isCustomerRole">
                            <li><Link :href="route('guest.home')" :class="{ active: route().current('guest.home') }">Home</Link></li>
                            <li class="dropdown notifications-menu">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-bs-toggle="dropdown">
                                    <i class="fa fa-bell" />
                                    <span class="label label-warning">{{ unread ? unread : '' }}</span>
                                </a>
                                <ul class="dropdown-menu">
                                    <li class="header">{{ unread ? `You have ${unread} new order notes` : 'No new order notes found.' }}</li>
                                    <li>
                                        <ul class="menu">
                                            <li v-for="note in noteItems" :key="note.id">
                                                <Link :href="note.href ?? '#'">
                                                    <i class="fa fa-sticky-note text-aqua" /> {{ note.text }}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><Link :href="route('dashboard')" :class="{ active: route().current('dashboard') }">Dashboard</Link></li>
                            <li><Link :href="route('guest.create_quote')" :class="{ active: route().current('guest.create_quote') }">Quote</Link></li>
                            <li><Link :href="route('guest.shipping_calculator')" :class="{ active: route().current('guest.shipping_calculator') }">Calculator</Link></li>
                            <li><Link :href="route('guest.track_order')" :class="{ active: route().current('guest.track_order') }">Track</Link></li>
                            <li><Link :href="route('guest.service_areas')" :class="{ active: route().current('guest.service_areas') }">Areas</Link></li>
                        </template>

                        <template v-else>
                             <li><Link :href="route('guest.home')">Home</Link></li>
                             <li><Link :href="route('dashboard')">Dashboard</Link></li>
                        </template>
                    </ul>
                </div>

                <div class="nav-right-wrapper">
                    <template v-if="!user">
                        <Link :href="route('guest.track_order')" class="btn-nav-primary">Track Order</Link>
                    </template>
                    <template v-else>
                        <li class="dropdown" style="list-style: none;">
                            <a href="#" class="dropdown-toggle user-name-link" data-toggle="dropdown" data-bs-toggle="dropdown">
                                {{ displayName(user) }} <span class="caret" />
                            </a>
                            <ul class="dropdown-menu user-dropdown">
                                <li><Link :href="route('profile')">Profile</Link></li>
                                <li class="divider" />
                                <li><Link :href="route('logout')" method="post" as="button">Sign out</Link></li>
                            </ul>
                        </li>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.guest-navbar.navbar {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin-bottom: 0;
    margin-top: 10px;
    padding: 0;
    transition: all 0.3s ease;
    width: 100%;
}

.guest-navbar-inner {
    background: #ffffff !important;
    border-radius: 12px;
    padding: 0.35rem 1.5rem !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    min-height: 64px;
    width: calc(100% - 60px);
}

.guest-navbar-header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

:deep(.guest-brand.navbar-brand) {
    padding: 0;
    height: auto;
    margin: 0;
}

.main-logo {
    max-height: 52px;
    width: auto;
}

.guest-navbar-collapse.navbar-collapse {
    flex: 1;
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    border: none;
    box-shadow: none;
    visibility: visible !important;
}

.nav-center-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
}

:deep(.guest-nav-menu) {
    display: flex !important;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
    padding: 0;
    list-style: none;
}

:deep(.guest-nav-menu > li) {
    float: none !important;
    list-style: none;
}

:deep(.guest-nav-menu > li > a),
.user-name-link {
    color: #334155 !important;
    font-weight: 500;
    font-size: 0.95rem;
    padding: 0.5rem 1.15rem !important;
    transition: all 0.2s ease;
    background: transparent !important;
    text-decoration: none !important;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

:deep(.guest-nav-menu > li > a:hover),
:deep(.guest-nav-menu > li > a.active),
.user-name-link:hover {
    color: #0d9488 !important;
    font-weight: 600;
}

.nav-right-wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.btn-nav-primary {
    background-color: #0d9488 !important;
    color: #ffffff !important;
    padding: 0.75rem 2rem !important;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none !important;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    display: inline-block;
}

.btn-nav-primary:hover {
    background-color: #0b7a6f !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.25);
}

:deep(.dropdown-menu) {
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    padding: 0.5rem;
}

:deep(.dropdown-menu > li > a) {
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: #334155;
    transition: all 0.2s ease;
}

:deep(.dropdown-menu > li > a:hover) {
    background-color: #f1f5f9;
    color: #053321;
}

@media (max-width: 1200px) {
    :deep(.guest-nav-menu > li > a) {
        padding: 0.5rem 0.75rem !important;
        font-size: 0.875rem;
    }
}

@media (max-width: 767px) {
    .guest-navbar-inner {
        flex-wrap: wrap;
        border-radius: 12px;
    }

    .guest-navbar-collapse.navbar-collapse {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        display: none !important;
    }

    .navbar-collapse.show {
        display: flex !important;
        padding-top: 1rem;
        animation: slideDown 0.3s ease-out forwards;
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .nav-center-wrapper {
        justify-content: flex-start;
    }

    :deep(.guest-nav-menu) {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    :deep(.guest-nav-menu > li > a) {
        padding: 0.75rem 0 !important;
        width: 100%;
    }

    .nav-right-wrapper {
        margin-top: 1rem;
        width: 100%;
    }

    .btn-nav-primary {
        width: 100%;
        text-align: center;
    }

    .guest-navbar-header {
        width: 100%;
        justify-content: space-between;
    }

    .guest-nav-toggle {
        display: flex !important;
        flex-direction: column;
        gap: 4px;
        background: transparent;
        border: none;
        padding: 8px;
        margin: 0;
        cursor: pointer;
    }

    .guest-nav-toggle .icon-bar {
        display: block;
        width: 22px;
        height: 2px;
        background-color: #0d9488;
        border-radius: 1px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }

    /* Transform to Cross (X) */
    .guest-nav-toggle:not(.collapsed) .icon-bar:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
    }

    .guest-nav-toggle:not(.collapsed) .icon-bar:nth-child(2) {
        opacity: 0;
        transform: translateX(-10px);
    }

    .guest-nav-toggle:not(.collapsed) .icon-bar:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
    }

    .guest-nav-toggle:hover .icon-bar {
        background-color: #0b7a6f;
    }
}
</style>
