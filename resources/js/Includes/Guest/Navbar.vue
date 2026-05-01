<script setup>
import { computed } from 'vue'
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
</script>

<template>
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <button
                    type="button"
                    class="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-bs-toggle="collapse"
                    data-target="#app-navbar-collapse"
                    data-bs-target="#app-navbar-collapse"
                >
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                </button>

                <Link class="navbar-brand load_ajax" :href="route('guest.home')">
                    <div class="row">
                        <div class="col-xs-3 col-sm-3 col-md-4">
                            <img
                                class="img-responsive main-logo"
                                :src="christmasTheme ? asset('images/christmas-logo.jpg') : asset('images/logo2.png')"
                                alt="logo"
                            >
                        </div>
                    </div>
                </Link>
            </div>

            <div id="app-navbar-collapse" class="collapse navbar-collapse">
                <ul class="nav navbar-nav"><li>&nbsp;</li></ul>

                <ul class="nav navbar-nav navbar-right cs-nav">
                    <template v-if="!user">
                        <li><Link class="load_ajax" :href="route('guest.home')">Home</Link></li>
                        <li><Link class="load_ajax" :href="route('guest.about')">About Us</Link></li>
                        <li><Link class="load_ajax" :href="route('guest.contact')">Contact Us</Link></li>
                        <li><Link class="load_ajax" :href="route('login')">Login</Link></li>
                        <li><Link class="last-menu-item load_ajax" :href="route('register')">Register</Link></li>
                    </template>

                    <template v-else-if="isCustomerRole">
                        <li class="dropdown notifications-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-bs-toggle="dropdown">
                                <i class="fa fa-bell" />
                                <span class="label label-warning" id="unread_notes_count">{{ unread ? unread : '' }}</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header" id="notes_head">{{ unread ? `You have ${unread} new order notes` : 'No new order notes found.' }}</li>
                                <li>
                                    <ul class="menu">
                                        <li v-for="note in noteItems" :key="note.id">
                                            <Link :href="note.href ?? '#'">
                                                <i class="fa fa-sticky-note text-aqua" /> {{ note.text }}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li class="footer" style="padding:0;margin:0;"><Link :href="route('guest.order_notes')">View all</Link></li>
                            </ul>
                        </li>

                        <li><Link class="load_ajax" :href="route('dashboard')"><i class="fa fa-dashboard" /> Dashboard</Link></li>
                        <li><Link class="load_ajax" :href="route('guest.create_quote')"><i class="fa fa-file-text" /> Request A Quote</Link></li>
                        <li><Link class="load_ajax" :href="route('guest.shipping_calculator')"><i class="fa fa-calculator" /> Shipping Calculator</Link></li>
                        <li><Link class="load_ajax" :href="route('guest.service_areas')"><i class="glyphicon glyphicon-map-marker" /> Service Areas</Link></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-bs-toggle="dropdown">
                                Hello {{ displayName(user) }} <span class="caret" />
                            </a>
                            <ul class="dropdown-menu">
                                <li class="text-center">
                                    <Link :href="route('profile')">
                                        <img v-if="user.profile_pic" :src="`${page.props.sts.s3StorageUrl}crm/${user.profile_pic}`" class="img-circle" alt="User Image" width="100">
                                        <img v-else :src="asset('dist/img/default-user.png')" class="img-circle" alt="User Image" width="100">
                                    </Link>
                                    <p>{{ displayName(user) }}<br><small v-if="user.created_at">Member since {{ new Date(user.created_at).toLocaleDateString() }}</small></p>
                                </li>
                                <li class="divider" />
                                <li style="padding:8px 12px; display:flex; justify-content:space-between; gap:8px;">
                                    <Link :href="route('profile')" class="btn btn-default btn-flat">Profile</Link>
                                    <Link class="btn btn-default btn-flat" :href="route('logout')" method="post" as="button">Sign out</Link>
                                </li>
                            </ul>
                        </li>
                    </template>

                    <template v-else-if="user?.role === roles.warehouse">
                        <li><Link class="load_ajax" :href="route('dashboard')">Warehouse Dashboard</Link></li>
                    </template>
                    <template v-else-if="user?.role === roles.office">
                        <li><Link class="load_ajax" :href="route('dashboard')">Office Dashboard</Link></li>
                    </template>
                    <template v-else>
                        <li><Link class="load_ajax" :href="route('dashboard')">Admin Dashboard</Link></li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>
