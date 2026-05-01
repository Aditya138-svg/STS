<script setup>
import { computed, reactive, watchEffect } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/composables/Admin'
import { useAdminSidebarMini } from '@/Composables/Admin/useAdminSidebarMini'

const page = usePage()

const { href } = useAdminAssets()
const { sidebarMini } = useAdminSidebarMini()
const userName = computed(() => page.props.auth?.user?.name ?? 'Admin')
const userInitial = computed(() => {
    const n = (userName.value || '').trim()
    return n ? n.charAt(0).toUpperCase() : '?'
})
const currentPath = computed(() => (page.url || '').split('?')[0])

const open = reactive({
    users: false,
    accessorials: false,
    tasks: false,
    addresses: false,
    orders: false,
    warehouse: false,
    accounting: true,
    payments: false,
    scanned_documents: false,
    tip_management: false,
    dispatch_scheduling: false,
    dispatcher: false,
    scheduling: false,
    my_settings: false,
    zipcode_management: false,
})

const isActive = (path) => currentPath.value === path || currentPath.value.startsWith(`${path}/`)

watchEffect(() => {
    open.users = open.users || isActive('/admin/admin-section/users')
    open.accessorials = open.accessorials || isActive('/admin/admin-section/accessorials')
    open.tasks = open.tasks || isActive('/admin/admin-section/tasks')
    open.addresses = open.addresses || isActive('/admin/order-management/addresses')
    open.orders = open.orders || isActive('/admin/order-management/orders')
    open.warehouse = open.warehouse || isActive('/admin/order-management/warehouse')
    open.payments = open.payments || isActive('/admin/accounting/payments')
    open.scanned_documents = open.scanned_documents || isActive('/admin/accounting/scanned-documents')
    open.tip_management = open.tip_management || isActive('/admin/accounting/tip-management')
    open.dispatcher = open.dispatcher || isActive('/admin/dispatch-scheduling/dispatcher')
    open.scheduling = open.scheduling || isActive('/admin/dispatch-scheduling/scheduling')
    open.zipcode_management = open.zipcode_management || isActive('/admin/dispatch-scheduling/zipcode-management')
})

</script>

<template>
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--mini': sidebarMini }">
        <div class="admin-sidebar-user admin-sidebar-user-row">
            <span class="admin-sidebar-user-text">{{ userName }}</span>
            <abbr class="admin-sidebar-user-mini" :title="userName">{{ userInitial }}</abbr>
            <span class="admin-mini-hover-label">{{ userName }}</span>
        </div>
        <div class="admin-section-title">Dashboard</div>
        <ul class="admin-nav">
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/dashboard')" class="admin-link" :class="{ active: isActive('/admin/dashboard') }">
                    <i class="fa-solid fa-gauge" />
                    <span class="admin-nav-label">Dashboard</span>
                </Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-gauge" /><span>Dashboard</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dashboard')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dashboard') }">Dashboard</Link></li>
                    </ul>
                </div>
            </li>
        </ul>

        <div class="admin-section-title">Admin</div>
        <ul class="admin-nav">
            <li class="admin-nav-expandable" :class="{ 'is-open': open.users }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/admin-section/users') }" @click="open.users = !open.users">
                    <span class="admin-toggle-main"><i class="fa-solid fa-users" /><span class="admin-nav-label">Users</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.users }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.users">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-users" /><span>Users</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/users/group')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/users/group') }">Group</Link></li>
                        <li><Link :href="href('admin/admin-section/users/over-due-report')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/users/over-due-report') }">Over Due Report</Link></li>
                        <li><Link :href="href('admin/admin-section/users/pricing')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/users/pricing') }">Pricing</Link></li>
                        <li><Link :href="href('admin/admin-section/users/user')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/users/user') }">User</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/associates')" class="admin-link" :class="{ active: isActive('/admin/admin-section/associates') }"><i class="fa-solid fa-building-user" /><span class="admin-nav-label">Associates</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-building-user" /><span>Associates</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/associates')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/associates') }">Associates</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/projects')" class="admin-link" :class="{ active: isActive('/admin/admin-section/projects') }"><i class="fa-solid fa-file-lines" /><span class="admin-nav-label">Projects</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-file-lines" /><span>Projects</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/projects')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/projects') }">Projects</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/service-layer')" class="admin-link" :class="{ active: isActive('/admin/admin-section/service-layer') }"><i class="fa-solid fa-briefcase" /><span class="admin-nav-label">Service Levels</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-briefcase" /><span>Service Levels</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/service-layer')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/service-layer') }">Service Levels</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-expandable" :class="{ 'is-open': open.accessorials }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/admin-section/accessorials') }" @click="open.accessorials = !open.accessorials">
                    <span class="admin-toggle-main"><i class="fa-solid fa-list" /><span class="admin-nav-label">Accessorials</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.accessorials }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.accessorials">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-list" /><span>Accessorials</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/accessorials/default-accessorials')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/accessorials/default-accessorials') }">Default Accessorials</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/items')" class="admin-link" :class="{ active: isActive('/admin/admin-section/items') }"><i class="fa-solid fa-bars" /><span class="admin-nav-label">Items</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-bars" /><span>Items</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/items')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/items') }">Items</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/reason-code')" class="admin-link" :class="{ active: isActive('/admin/admin-section/reason-code') }"><i class="fa-solid fa-triangle-exclamation text-danger" /><span class="admin-nav-label">Reason Codes</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-triangle-exclamation text-danger" /><span>Reason Codes</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/reason-code')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/reason-code') }">Reason Codes</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/admin-section/dnd-emails')" class="admin-link" :class="{ active: isActive('/admin/admin-section/dnd-emails') }"><i class="fa-solid fa-envelope" /><span class="admin-nav-label">DND Emails</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-envelope" /><span>DND Emails</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/dnd-emails')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/dnd-emails') }">DND Emails</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-expandable" :class="{ 'is-open': open.tasks }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/admin-section/tasks') }" @click="open.tasks = !open.tasks">
                    <span class="admin-toggle-main"><i class="fa-solid fa-table-list" /><span class="admin-nav-label">Tasks</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.tasks }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.tasks">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-table-list" /><span>Tasks</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/admin-section/tasks/my-task')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/tasks/my-task') }">My Task</Link></li>
                        <li><Link :href="href('admin/admin-section/tasks/overall-task')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/tasks/overall-task') }">Overall Task</Link></li>
                        <li><Link :href="href('admin/admin-section/tasks/private-notes')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/tasks/private-notes') }">Private Notes</Link></li>
                        <li><Link :href="href('admin/admin-section/tasks/public-notes')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/admin-section/tasks/public-notes') }">Public Notes</Link></li>
                    </ul>
                </div>
            </li>
        </ul>

        <div class="admin-section-title">Order management</div>
        <ul class="admin-nav">
            <li class="admin-nav-expandable" :class="{ 'is-open': open.addresses }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/order-management/addresses') }" @click="open.addresses = !open.addresses">
                    <span class="admin-toggle-main"><i class="fa-solid fa-house" /><span class="admin-nav-label">Addresses</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.addresses }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.addresses">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-house" /><span>Addresses</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/order-management/addresses/address-book')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/addresses/address-book') }">Address Book</Link></li>
                        <li><Link :href="href('admin/order-management/addresses/depot-address')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/addresses/depot-address') }">Depot Address</Link></li>
                        <li><Link :href="href('admin/order-management/addresses/duplicate-address')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/addresses/duplicate-address') }">Duplicate Address</Link></li>
                        <li><Link :href="href('admin/order-management/addresses/non-billable-address')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/addresses/non-billable-address') }">Non Billable Address</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/order-management/quotes')" class="admin-link" :class="{ active: isActive('/admin/order-management/quotes') }"><i class="fa-solid fa-quote-left" /><span class="admin-nav-label">Quotes</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-quote-left" /><span>Quotes</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/order-management/quotes')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/quotes') }">Quotes</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-expandable" :class="{ 'is-open': open.orders }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/order-management/orders') }" @click="open.orders = !open.orders">
                    <span class="admin-toggle-main"><i class="fa-solid fa-cart-shopping" /><span class="admin-nav-label">Orders</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.orders }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.orders">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-cart-shopping" /><span>Orders</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/order-management/orders/all-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/orders/all-orders') }">All Orders</Link></li>
                        <li><Link :href="href('admin/order-management/orders/need-attention')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/orders/need-attention') }">Need Attention</Link></li>
                        <li><Link :href="href('admin/order-management/orders/new-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/orders/new-orders') }">New Orders</Link></li>
                    </ul>
                </div>
            </li>

            <li class="admin-nav-expandable" :class="{ 'is-open': open.warehouse }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/order-management/warehouse') }" @click="open.warehouse = !open.warehouse">
                    <span class="admin-toggle-main"><i class="fa-solid fa-truck" /><span class="admin-nav-label">Warehouse</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.warehouse }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.warehouse">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-truck" /><span>Warehouse</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/order-management/warehouse/racks')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/warehouse/racks') }">Racks</Link></li>
                        <li><Link :href="href('admin/order-management/warehouse/recieve-in-records')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/warehouse/recieve-in-records') }">Recieve In Records</Link></li>
                        <li><Link :href="href('admin/order-management/warehouse/tickets')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/order-management/warehouse/tickets') }">Tickets</Link></li>
                    </ul>
                </div>
            </li>
        </ul>

        <div class="admin-section-title">Dispatch/Scheduling</div>
        <ul class="admin-nav">
            <li class="admin-nav-expandable" :class="{ 'is-open': open.scheduling }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling') }" @click="open.scheduling = !open.scheduling">
                    <span class="admin-toggle-main"><i class="fa-solid fa-calendar-days" /><span class="admin-nav-label">Scheduling</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.scheduling }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.scheduling">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-calendar-days" /><span>Scheduling</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/holiday-setting')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/holiday-setting') }">Holiday Setting</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/order-avail-to-schedule')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/order-avail-to-schedule') }">Order Avail To Schedule</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/order-not-in-service-area')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/order-not-in-service-area') }">Order Not In Service Area</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/order-responded')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/order-responded') }">Order Responded</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/order-reviewed')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/order-reviewed') }">Order Reviewed</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/terttiory-setting')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/terttiory-setting') }">Terttiory Setting</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/scheduling/volume-setting')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/scheduling/volume-setting') }">Volume Setting</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-expandable admin-nav-expandable--dispatcher" :class="{ 'is-open': open.dispatcher }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher') }" @click="open.dispatcher = !open.dispatcher">
                    <span class="admin-toggle-main"><i class="fa-solid fa-truck-fast" /><span class="admin-nav-label">Dispatcher</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.dispatcher }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.dispatcher">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-truck-fast" /><span>Dispatcher</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/dashboard')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/dashboard') }">Dashboard</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/what-next')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/what-next') }">What Next / Manifest</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/notification')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/notification') }">Notifications</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/transfer')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/transfer') }">Transfers</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/routes')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/routes') }">Routes</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/dynamic-forms')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/dynamic-forms') }">Dynamic forms</Link></li>
                        <li class="admin-subnav-heading-row" role="presentation"><span class="admin-subnav-heading">Undelivered Orders</span></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/undelivered-orders/routed-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/undelivered-orders/routed-orders') }">Routed Orders</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/undelivered-orders/unrouted-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/undelivered-orders/unrouted-orders') }">Un-Routed Orders</Link></li>
                        <li class="admin-subnav-heading-row" role="presentation"><span class="admin-subnav-heading">One Time Setting</span></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/one-time-setting/trucks')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/one-time-setting/trucks') }">Trucks</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/dispatcher/one-time-setting/drivers')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/dispatcher/one-time-setting/drivers') }">Drivers</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/dispatch-scheduling/survey-list')" class="admin-link" :class="{ active: isActive('/admin/dispatch-scheduling/survey-list') }"><i class="fa-solid fa-list-check" /><span class="admin-nav-label">Survey List</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-list-check" /><span>Survey List</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dispatch-scheduling/survey-list')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/survey-list') }">Survey List</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/dispatch-scheduling/check-service-area')" class="admin-link" :class="{ active: isActive('/admin/dispatch-scheduling/check-service-area') }"><i class="fa-solid fa-map-location-dot" /><span class="admin-nav-label">Check Service Area</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-map-location-dot" /><span>Check Service Area</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dispatch-scheduling/check-service-area')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/check-service-area') }">Check Service Area</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-expandable" :class="{ 'is-open': open.zipcode_management }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/dispatch-scheduling/zipcode-management') }" @click="open.zipcode_management = !open.zipcode_management">
                    <span class="admin-toggle-main"><i class="fa-solid fa-location-dot" /><span class="admin-nav-label">Zipcode Management</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.zipcode_management }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.zipcode_management">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-location-dot" /><span>Zipcode Management</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/dispatch-scheduling/zipcode-management')" class="admin-link admin-subnav-link" :class="{ active: currentPath === '/admin/dispatch-scheduling/zipcode-management' }">Zipcode Management</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/zipcode-management/tier')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/zipcode-management/tier') }">Tier</Link></li>
                        <li><Link :href="href('admin/dispatch-scheduling/zipcode-management/conflict-zipcode')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/dispatch-scheduling/zipcode-management/conflict-zipcode') }">Conflict Zipcode</Link></li>
                    </ul>
                </div>
            </li>
        </ul>

        <div class="admin-section-title">Accounting</div>
        <ul class="admin-nav">
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/accounting/qb-status')" class="admin-link" :class="{ active: isActive('/admin/accounting/qb-status') }"><i class="fa-solid fa-file-invoice-dollar" /><span class="admin-nav-label">QB Status</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-file-invoice-dollar" /><span>QB Status</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/accounting/qb-status')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/qb-status') }">QB Status</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-expandable" :class="{ 'is-open': open.tip_management }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/accounting/tip-management') }" @click="open.tip_management = !open.tip_management">
                    <span class="admin-toggle-main"><i class="fa-solid fa-hand-holding-dollar" /><span class="admin-nav-label">Tip Management</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.tip_management }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.tip_management">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-hand-holding-dollar" /><span>Tip Management</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/accounting/tip-management/pending-tips')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/tip-management/pending-tips') }">Pending Tips</Link></li>
                        <li><Link :href="href('admin/accounting/tip-management/tip-payout')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/tip-management/tip-payout') }">Tip Payout</Link></li>
                        <li><Link :href="href('admin/accounting/tip-management/tip-report')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/tip-management/tip-report') }">Tip Report</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-expandable" :class="{ 'is-open': open.payments }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/accounting/payments') }" @click="open.payments = !open.payments">
                    <span class="admin-toggle-main"><i class="fa-solid fa-credit-card" /><span class="admin-nav-label">Payments</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.payments }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.payments">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-credit-card" /><span>Payments</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/accounting/payments/all-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/all-orders') }">All Orders</Link></li>
                        <li><Link :href="href('admin/accounting/payments/billed-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/billed-orders') }">Billed Orders</Link></li>
                        <li><Link :href="href('admin/accounting/payments/cancelled-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/cancelled-orders') }">Cancelled Orders</Link></li>
                        <li><Link :href="href('admin/accounting/payments/completed-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/completed-orders') }">Completed Orders</Link></li>
                        <li><Link :href="href('admin/accounting/payments/consolidated-invoice')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/consolidated-invoice') }">Consolidated Invoice</Link></li>
                        <li><Link :href="href('admin/accounting/payments/paid-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/paid-orders') }">Paid Orders</Link></li>
                        <li><Link :href="href('admin/accounting/payments/prepaid-orders')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/payments/prepaid-orders') }">Prepaid Orders</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-expandable" :class="{ 'is-open': open.scanned_documents }">
                <button type="button" class="admin-link admin-toggle" :class="{ active: isActive('/admin/accounting/scanned-documents') }" @click="open.scanned_documents = !open.scanned_documents">
                    <span class="admin-toggle-main"><i class="fa-solid fa-folder-open" /><span class="admin-nav-label">Scanned Documents</span></span>
                    <i class="fa-solid fa-chevron-right admin-toggle-chevron" :class="{ rotate: open.scanned_documents }" />
                </button>
                <div class="admin-subnav-panel" v-show="sidebarMini || open.scanned_documents">
                    <div v-if="sidebarMini" class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-folder-open" /><span>Scanned Documents</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/accounting/scanned-documents/map-docs')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/scanned-documents/map-docs') }">Map Docs</Link></li>
                        <li><Link :href="href('admin/accounting/scanned-documents/upload-docs')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/accounting/scanned-documents/upload-docs') }">Upload Docs</Link></li>
                    </ul>
                </div>
            </li>
        </ul>

        <div class="admin-section-title">My settings</div>
        <ul class="admin-nav">
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/my-settings/my-profile')" class="admin-link" :class="{ active: isActive('/admin/my-settings/my-profile') }"><i class="fa-solid fa-user" /><span class="admin-nav-label">My Profile</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-user" /><span>My Profile</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/my-settings/my-profile')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/my-settings/my-profile') }">My Profile</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/my-settings/remote-printing')" class="admin-link" :class="{ active: isActive('/admin/my-settings/remote-printing') }"><i class="fa-solid fa-print" /><span class="admin-nav-label">Remote Printing</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-print" /><span>Remote Printing</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/my-settings/remote-printing')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/my-settings/remote-printing') }">Remote Printing</Link></li>
                    </ul>
                </div>
            </li>
            <li class="admin-nav-mini-leaf">
                <Link :href="href('admin/my-settings/setting')" class="admin-link" :class="{ active: isActive('/admin/my-settings/setting') }"><i class="fa-solid fa-gear" /><span class="admin-nav-label">Setting</span></Link>
                <div v-if="sidebarMini" class="admin-subnav-panel admin-mini-leaf-panel">
                    <div class="admin-mini-flyout-head" aria-hidden="true">
                        <span class="admin-mini-flyout-head-main"><i class="fa-solid fa-gear" /><span>Setting</span></span>
                        <i class="fa-solid fa-chevron-right" />
                    </div>
                    <ul class="admin-subnav">
                        <li><Link :href="href('admin/my-settings/setting')" class="admin-link admin-subnav-link" :class="{ active: isActive('/admin/my-settings/setting') }">Setting</Link></li>
                    </ul>
                </div>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
.admin-sidebar {
    --admin-exp-teal: #308e87;
    --admin-exp-mint: #c5e1d4;
    background: #d9e9e1;
    border-right: 1px solid #b8d9cc;
    height: 100%;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
}

.admin-subnav-panel {
    background: transparent;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-subnav-panel {
    background: var(--admin-exp-mint);
}

.admin-mini-flyout-head {
    display: none;
}

.admin-mini-flyout-head-main {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.admin-sidebar-user {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    font-weight: 700;
    font-size: 16px;
    line-height: 1.2;
    color: #0f5f5a;
    background: #c5e4d9;
    border-bottom: 1px solid #a8d4c8;
}

.admin-sidebar-user-mini {
    display: none;
    text-decoration: none;
    border: none;
    cursor: default;
}

.admin-sidebar-user-row {
    position: relative;
}

.admin-mini-hover-label {
    display: none;
}

.admin-section-title {
    background: #f2f5f4;
    color: #546e7a;
    padding: 8px 14px;
    margin: 0;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: capitalize;
    border-top: 1px solid #e2e8e6;
    border-bottom: 1px solid #e2e8e6;
}

.admin-sidebar-user + .admin-section-title {
    border-top: none;
}

.admin-nav,
.admin-subnav {
    list-style: none;
    margin: 0;
    padding: 0;
}

.admin-link {
    width: 100%;
    border: 0;
    background: transparent;
    color: #000;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    padding: 9px 12px;
    font-size: 14px;
    text-align: left;
    line-height: 1.1;
    outline: none;
    box-shadow: none;
    cursor: pointer;
    border-radius: 0;
}

.admin-toggle {
    justify-content: space-between;
}

.admin-toggle-main {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.admin-nav > li > .admin-link:not(.admin-subnav-link):hover:not(.active),
.admin-toggle:hover:not(.active) {
    background: #c5f0e0;
    color: #000;
}

/* Full sidebar: selected top-level links stay black on tinted mint (not white-on-teal) */
.admin-sidebar:not(.admin-sidebar--mini) .admin-link.active:not(.admin-subnav-link) {
    background: rgba(49, 151, 149, 0.32);
    color: #111;
    font-weight: 700;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-link.active:not(.admin-subnav-link) i:not(.text-danger) {
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-link.active:not(.admin-subnav-link) .admin-toggle-chevron {
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-link.active:not(.admin-subnav-link):hover {
    background: rgba(49, 151, 149, 0.44);
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-link.active:not(.admin-subnav-link):hover i:not(.text-danger) {
    color: #111;
}

/* Expanded nested rows: override generic .active (placed after .active rules for cascade) */
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle {
    background: var(--admin-exp-mint);
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle .admin-toggle-chevron {
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle:hover {
    background: #b7d8ca;
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle:hover .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle:hover .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle:hover .admin-toggle-chevron {
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle {
    background: var(--admin-exp-teal);
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle .admin-toggle-chevron {
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle:hover {
    background: #267a73;
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle:hover .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle:hover .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle:hover .admin-toggle-chevron {
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle.active {
    background: var(--admin-exp-mint);
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle.active .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle.active .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable.is-open > .admin-toggle.active .admin-toggle-chevron {
    color: #111;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active {
    background: var(--admin-exp-teal);
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active .admin-toggle-chevron {
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active:hover {
    background: #267a73;
    color: #fff;
}

.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active:hover .admin-nav-label,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active:hover .admin-toggle-main > i,
.admin-sidebar:not(.admin-sidebar--mini) .admin-nav-expandable--dispatcher.is-open > .admin-toggle.active:hover .admin-toggle-chevron {
    color: #fff;
}

/* Remove default browser focus “black box”; keep a teal ring for keyboard users */
.admin-link:focus:not(:focus-visible),
.admin-toggle:focus:not(:focus-visible) {
    outline: none;
}

.admin-link:focus-visible,
.admin-toggle:focus-visible {
    outline: 2px solid rgba(49, 151, 149, 0.65);
    outline-offset: -2px;
}

.admin-link:active,
.admin-toggle:active {
    outline: none;
}

.admin-subnav .admin-subnav-link {
    position: relative;
    padding: 10px 12px 10px 28px;
    font-size: 13px;
}

.admin-subnav .admin-subnav-link::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #111;
}

.admin-subnav .admin-subnav-link:hover:not(.active) {
    background: rgba(48, 142, 135, 0.22) !important;
    color: #111 !important;
}

.admin-subnav .admin-subnav-link:hover:not(.active)::before {
    background: #111;
}

.admin-subnav-heading-row {
    list-style: none;
    margin: 0;
    padding: 0;
}

.admin-subnav-heading {
    display: block;
    padding: 10px 12px 10px 28px;
    margin: 0;
    background: #fff;
    color: #5a6d7e;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.02em;
    line-height: 1.3;
}

.admin-subnav .admin-subnav-link.active {
    background: rgba(52, 142, 132, 0.22);
    color: #111;
    font-weight: 700;
}

.admin-subnav .admin-subnav-link.active::before {
    background: #111;
}

.admin-subnav .admin-subnav-link.active:hover {
    background: rgba(52, 142, 132, 0.35);
    color: #111;
}

.admin-subnav .admin-subnav-link.active:hover::before {
    background: #111;
}

.rotate {
    transform: rotate(90deg);
}

/* ---- Collapsed mini sidebar (hamburger) ---- */
.admin-sidebar--mini {
    --admin-mini-rail-icon: 18px;
    --admin-mini-head-font: 15px;
    --admin-mini-sub-font: 14px;
    background: #eef2f1;
    border-right-color: #cfd8dc;
    overflow: visible;
}

.admin-sidebar--mini .admin-sidebar-user {
    justify-content: center;
    padding: 10px 6px;
    background: #e4ecef;
    border-bottom-color: #cfd8dc;
}

.admin-sidebar--mini .admin-sidebar-user-text {
    display: none;
}

.admin-sidebar--mini .admin-sidebar-user-mini {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    margin: 0 auto;
    border-radius: 50%;
    background: #319795;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
}

.admin-sidebar--mini .admin-section-title {
    display: none;
}

.admin-sidebar--mini .admin-nav > li {
    position: relative;
}

.admin-sidebar--mini .admin-sidebar-user-row > .admin-mini-hover-label {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 10px;
    padding: 8px 14px;
    background: var(--admin-exp-teal);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    z-index: 450;
    border-radius: 4px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    max-width: min(300px, 75vw);
    overflow: hidden;
    text-overflow: ellipsis;
}

.admin-sidebar--mini .admin-sidebar-user-row:hover > .admin-mini-hover-label {
    display: block;
}

/* Invisible hover bridge (icon rail → flyout), leaf + expandable */
.admin-sidebar--mini .admin-nav-expandable::after,
.admin-sidebar--mini .admin-nav-mini-leaf::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 0;
    width: 20px;
    height: 100%;
    min-height: 52px;
    z-index: 398;
}

.admin-sidebar--mini .admin-nav-label {
    display: none;
}

.admin-sidebar--mini .admin-toggle-chevron {
    display: none;
}

.admin-sidebar--mini .admin-toggle {
    justify-content: center;
}

.admin-sidebar--mini .admin-toggle-main {
    justify-content: center;
}

.admin-sidebar--mini .admin-link:not(.admin-toggle),
.admin-sidebar--mini .admin-toggle {
    min-height: 52px;
    align-items: center;
}

.admin-sidebar--mini .admin-link:not(.admin-toggle) {
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
}

.admin-sidebar--mini .admin-link:not(.admin-toggle) > i:first-child,
.admin-sidebar--mini .admin-toggle-main > i:first-child {
    font-size: var(--admin-mini-rail-icon);
    line-height: 1;
}

/* Mini rail: teal strip + white icons (matches flyout header), leaf links */
.admin-sidebar--mini .admin-nav-mini-leaf:hover > .admin-link,
.admin-sidebar--mini .admin-nav-mini-leaf:focus-within > .admin-link {
    background: var(--admin-exp-teal);
    color: #fff;
}

.admin-sidebar--mini .admin-nav-mini-leaf:hover > .admin-link i:not(.text-danger),
.admin-sidebar--mini .admin-nav-mini-leaf:focus-within > .admin-link i:not(.text-danger) {
    background: transparent !important;
    color: #fff !important;
}

.admin-sidebar--mini .admin-nav-mini-leaf > .admin-link.active {
    background: var(--admin-exp-teal);
    color: #fff;
}

.admin-sidebar--mini .admin-nav-mini-leaf > .admin-link.active i:not(.text-danger) {
    background: transparent !important;
    color: #fff !important;
    width: auto !important;
    height: auto !important;
    border-radius: 0 !important;
    display: inline-block !important;
    font-size: var(--admin-mini-rail-icon);
}

/* Mini rail: expandable toggles */
.admin-sidebar--mini .admin-nav-expandable:hover > .admin-toggle,
.admin-sidebar--mini .admin-nav-expandable:focus-within > .admin-toggle,
.admin-sidebar--mini .admin-nav-expandable > .admin-toggle.active {
    background: var(--admin-exp-teal);
    color: #fff;
}

.admin-sidebar--mini .admin-nav-expandable:hover > .admin-toggle .admin-toggle-main > i:first-child,
.admin-sidebar--mini .admin-nav-expandable:focus-within > .admin-toggle .admin-toggle-main > i:first-child,
.admin-sidebar--mini .admin-nav-expandable > .admin-toggle.active .admin-toggle-main > i:first-child {
    background: transparent !important;
    color: #fff !important;
    width: auto !important;
    height: auto !important;
    border-radius: 0 !important;
    display: inline-block !important;
    font-size: var(--admin-mini-rail-icon);
}

.admin-sidebar--mini .admin-nav-mini-leaf > .admin-subnav-panel {
    position: absolute;
    left: 100%;
    top: 0;
    min-width: 252px;
    max-width: min(340px, 78vw);
    margin-left: 0;
    border: 1px solid var(--admin-exp-teal);
    box-shadow: 4px 6px 16px rgba(0, 0, 0, 0.14);
    z-index: 400;
    display: none !important;
    background: var(--admin-exp-mint);
    overflow: visible;
    pointer-events: auto;
}

.admin-sidebar--mini .admin-nav-mini-leaf:hover > .admin-subnav-panel,
.admin-sidebar--mini .admin-nav-mini-leaf:focus-within > .admin-subnav-panel,
.admin-sidebar--mini .admin-nav-mini-leaf .admin-subnav-panel:hover {
    display: block !important;
}

.admin-sidebar--mini .admin-nav-expandable > .admin-subnav-panel {
    position: absolute;
    left: 100%;
    top: 0;
    min-width: 252px;
    max-width: min(340px, 78vw);
    margin-left: 0;
    border: 1px solid var(--admin-exp-teal);
    box-shadow: 4px 6px 16px rgba(0, 0, 0, 0.14);
    z-index: 400;
    display: none !important;
    background: var(--admin-exp-mint);
    overflow: visible;
    pointer-events: auto;
}

.admin-sidebar--mini .admin-nav-expandable:hover > .admin-subnav-panel,
.admin-sidebar--mini .admin-nav-expandable:focus-within > .admin-subnav-panel,
.admin-sidebar--mini .admin-subnav-panel:hover {
    display: block !important;
}

.admin-sidebar--mini .admin-mini-flyout-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 11px;
    padding: 12px 14px;
    background: var(--admin-exp-teal);
    color: #fff;
    font-weight: 700;
    font-size: var(--admin-mini-head-font);
}

.admin-sidebar--mini .admin-mini-flyout-head i {
    color: #fff;
}

.admin-sidebar--mini .admin-mini-flyout-head-main > i {
    font-size: calc(var(--admin-mini-rail-icon) + 1px);
}

.admin-sidebar--mini .admin-mini-flyout-head .text-danger {
    color: #fff !important;
}

.admin-sidebar--mini .admin-subnav .admin-subnav-link::before {
    width: 7px;
    height: 7px;
    left: 11px;
}

.admin-sidebar--mini .admin-subnav {
    padding: 6px 0;
}

.admin-sidebar--mini .admin-subnav .admin-subnav-link {
    padding: 11px 14px 11px 28px;
    white-space: nowrap;
    font-size: var(--admin-mini-sub-font);
}

.admin-sidebar--mini .admin-subnav .admin-subnav-link.active {
    background: rgba(52, 142, 132, 0.26);
    color: #111;
}

.admin-sidebar--mini .admin-subnav-heading {
    padding-left: 28px;
    padding-right: 14px;
    white-space: nowrap;
    font-size: 13px;
}
</style>
