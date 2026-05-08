<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'
import { useAdminSidebarMini } from '@/Composables/Admin/useAdminSidebarMini'
import { useAdminMobileSidebar } from '@/Composables/Admin/useAdminMobileSidebar'

const page = usePage()
const { sidebarMini, toggleSidebarMini } = useAdminSidebarMini()
const { mobileSidebarOpen, toggleMobileSidebar } = useAdminMobileSidebar()
const { href, route, asset } = useAdminAssets()

const userName = computed(() => page.props.auth?.user?.name ?? 'Admin')

const avatarUrl = computed(() => {
    const pic = page.props.auth?.user?.profile_pic
    if (!pic || typeof pic !== 'string') {
        return null
    }
    if (/^https?:\/\//i.test(pic)) {
        return pic
    }
    return asset(`storage/${pic.replace(/^\//, '')}`)
})

const handleMenuToggle = () => {
    if (window.innerWidth <= 991) {
        toggleMobileSidebar()
    } else {
        toggleSidebarMini()
    }
}
</script>

<template>
    <header class="admin-header">
        <div class="admin-header-left">
            <Link :href="href('admin/dashboard')" class="admin-brand" :class="{ 'admin-brand--compact': sidebarMini }">
                <span v-if="sidebarMini">STS</span>
                <span v-else>Specialised Transport Service</span>
            </Link>
            <button
                type="button"
                class="admin-header-menu-btn"
                aria-label="Toggle sidebar"
                :aria-expanded="!sidebarMini"
                @click="handleMenuToggle"
            >
                <i class="fa-solid fa-bars admin-header-icon" aria-hidden="true" />
            </button>
        </div>

        <div class="admin-header-right">
            <a href="#" class="admin-top-link">
                <i class="fa-regular fa-envelope" aria-hidden="true" />
                <span>Send SMS</span>
            </a>
            <a href="#" class="admin-top-link icon-only" aria-label="Messages"><i class="fa-regular fa-comment-dots" aria-hidden="true" /></a>
            <a href="#" class="admin-top-link icon-only" aria-label="Tasks"><i class="fa-solid fa-list-check" aria-hidden="true" /></a>
            <a href="#" class="admin-top-link icon-only" aria-label="Locations"><i class="fa-solid fa-flag" aria-hidden="true" /></a>
            <select class="admin-location-select" aria-label="Location">
                <option>-All Locations-</option>
            </select>

            <Link :href="href('admin/my-settings/my-profile')" class="admin-profile-cluster">
                <div class="admin-avatar" aria-hidden="true">
                    <img v-if="avatarUrl" class="admin-avatar-img" :src="avatarUrl" alt="">
                    <i v-else class="fa-solid fa-user admin-avatar-fallback" />
                </div>
                <span class="admin-profile-name">{{ userName }}</span>
            </Link>

            <Link :href="href('admin/my-settings/my-profile')" class="admin-profile-link-btn" aria-label="My Profile">
                <i class="fa-solid fa-user-gear" aria-hidden="true" />
            </Link>
            <Link :href="route('logout')" method="post" as="button" class="admin-logout-btn" aria-label="Log out">
                <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            </Link>
        </div>
    </header>
</template>

<style scoped>
.admin-header {
    min-height: 60px;
    background: #7a918d;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    position: sticky;
    top: 0;
    z-index: 100;
}

.admin-header-left,
.admin-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.admin-header-menu-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: all 0.2s ease;
}

.admin-header-menu-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.admin-brand {
    color: #fff;
    font-weight: 700;
    text-decoration: none;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.02em;
    max-width: min(380px, 42vw);
}

.admin-brand--compact {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.06em;
    max-width: none;
}

.admin-header-icon {
    font-size: 1.05rem;
    opacity: 0.95;
}

.admin-top-link {
    color: #fff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    opacity: 0.9;
}

.admin-top-link:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
}

.icon-only {
    width: 28px;
    height: 28px;
    justify-content: center;
    font-size: 15px;
}

.admin-location-select {
    height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    min-width: 160px;
    padding: 0 12px;
    border-radius: 6px;
    outline: none;
    transition: all 0.2s ease;
}

.admin-location-select:focus {
    background: #fff;
    color: #333;
    border-color: #fff;
}

.admin-location-select option {
    color: #333;
}

.admin-profile-cluster {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-left: 4px;
    text-decoration: none;
    color: inherit;
    padding: 4px 8px;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.admin-profile-cluster:hover {
    background: rgba(255, 255, 255, 0.1);
}

.admin-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: grid;
    place-items: center;
    overflow: hidden;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.admin-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.admin-avatar-fallback {
    font-size: 16px;
    opacity: 0.9;
}

.admin-profile-name {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.admin-logout-btn,
.admin-profile-link-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: all 0.2s ease;
    text-decoration: none;
}

.admin-logout-btn:hover,
.admin-profile-link-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.admin-logout-btn i {
    font-size: 13px;
}
</style>
