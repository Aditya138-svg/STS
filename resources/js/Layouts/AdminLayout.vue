<script setup>
import { computed, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminHeader from '@/Includes/Admin/Header.vue'
import AdminSidebar from '@/Includes/Admin/Sidebar.vue'
import AdminFooter from '@/Includes/Admin/Footer.vue'
import { useAdminAssets } from '@/Composables/Admin'
import { useAdminSidebarMini } from '@/Composables/Admin/useAdminSidebarMini'
import { useAdminMobileSidebar } from '@/Composables/Admin/useAdminMobileSidebar'
import '@/../../resources/css/admin-common.css'

const page = usePage()
const { sidebarMini } = useAdminSidebarMini()
const { mobileSidebarOpen, closeMobileSidebar } = useAdminMobileSidebar()
const { asset } = useAdminAssets()

const isAdminDashboard = computed(() => {
    const path = (page.url || '').split('?')[0]
    return /\/admin\/dashboard\/?$/.test(path)
})

const isMobile = computed(() => window.innerWidth <= 991)

const ensureStylesheet = (id, path) => {
    if (document.getElementById(id)) {
        return
    }

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = asset(path)
    document.head.appendChild(link)
}

onMounted(() => {
    // Legacy admin pages in sts-sample depend on these styles.
    ensureStylesheet('admin-style-css', 'css/style.css')
    ensureStylesheet('admin-design-css', 'css/design.css')
    ensureStylesheet('admin-ionicons-css', 'css/ionicons.min.css')
})
</script>

<template>
    <div class="admin-shell" :class="{ 'admin-shell--sidebar-mini': sidebarMini }">
        <AdminHeader />
        <div class="admin-main">
            <AdminSidebar v-show="!isMobile" />
            <div class="admin-right">
                <div v-if="isAdminDashboard" class="admin-page-toolbar">
                    <select class="admin-dashboard-select" aria-label="Dashboard layout">
                        <option>DEFAULT DASHBOARD</option>
                    </select>
                    <div class="admin-dashboard-actions">
                        <button type="button" class="btn btn-warning btn-sm admin-dash-download">
                            Download Admin App
                        </button>
                        <button type="button" class="btn btn-sm admin-dash-help">
                            <i class="fa-regular fa-circle-question me-1" aria-hidden="true" />
                            Help
                        </button>
                    </div>
                </div>
                <main class="admin-content">
                    <slot />
                </main>
                <AdminFooter />
            </div>
        </div>
        <!-- Mobile sidebar overlay -->
        <div v-if="mobileSidebarOpen" class="admin-mobile-sidebar-overlay" @click="closeMobileSidebar">
            <div class="admin-mobile-sidebar" @click.stop>
                <AdminSidebar />
            </div>
        </div>
        <a href="#" class="admin-fab-chat" aria-label="Open chat" @click.prevent>
            <i class="fa-solid fa-comments" aria-hidden="true" />
        </a>
    </div>
</template>

<style scoped>
.admin-shell {
    --admin-sidebar-width: 248px;
    --admin-sidebar-mini-width: 56px;
    min-height: 100vh;
    background: #f4f7f6;
    display: flex;
    flex-direction: column;
}

.admin-shell--sidebar-mini {
    --admin-sidebar-width: var(--admin-sidebar-mini-width);
}

.admin-page-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 14px;
    background: #fff;
    border-bottom: 1px solid #dde3e6;
    flex-shrink: 0;
}

.admin-dashboard-select {
    flex: 0 1 300px;
    max-width: 100%;
    height: 32px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid #cfd5d8;
    background: #fff;
    padding: 4px 12px;
    color: #222;
    border-radius: 2px;
}

.admin-dashboard-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex: 1;
}

.admin-dash-download {
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    white-space: nowrap;
}

.admin-dash-help {
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    background-color: #11635a !important;
    border-color: #0d5249 !important;
    color: #fff !important;
}

.admin-dash-help:hover {
    background-color: #0d5249 !important;
    border-color: #0a403a !important;
    color: #fff !important;
}

.admin-main {
    flex: 1;
    display: grid;
    grid-template-columns: var(--admin-sidebar-width) 1fr;
    min-height: 0;
}

.admin-right {
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #f4f7f6;
}

.admin-content {
    padding: 10px 14px 14px;
    flex: 1;
}

.admin-fab-chat {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #11635a;
    color: #fff;
    display: grid;
    place-items: center;
    box-shadow: 0 4px 14px rgba(17, 99, 90, 0.4);
    z-index: 1030;
    text-decoration: none;
    font-size: 1.25rem;
    border: 1px solid #0d5249;
}

.admin-fab-chat:hover {
    background: #0d5249;
    color: #fff;
}

@media (max-width: 991px) {
    .admin-page-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .admin-dashboard-actions {
        justify-content: stretch;
    }

    .admin-dash-download,
    .admin-dash-help {
        flex: 1;
    }

    .admin-main {
        grid-template-columns: 1fr;
    }

    .admin-mobile-sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
    }

    .admin-mobile-sidebar {
        width: 280px;
        max-width: 80vw;
        height: 100vh;
        background: #fff;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
    }

    .admin-fab-chat {
        right: 16px;
        bottom: 16px;
    }
}
</style>
