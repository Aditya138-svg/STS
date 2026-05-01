<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'
import { useAdminSidebarMini } from '@/Composables/Admin/useAdminSidebarMini'

const page = usePage()
const { sidebarMini, toggleSidebarMini } = useAdminSidebarMini()
const { href, route } = useAdminAssets()

const userName = computed(() => page.props.auth?.user?.name ?? 'Admin')

const avatarUrl = computed(() => {
    const pic = page.props.auth?.user?.profile_pic
    if (!pic || typeof pic !== 'string') {
        return null
    }
    if (/^https?:\/\//i.test(pic)) {
        return pic
    }
    const base = page.props.sts?.s3StorageUrl ?? ''
    const path = pic.replace(/^\//, '')
    return base ? `${base}${path}` : null
})
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
                @click="toggleSidebarMini"
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

            <div class="admin-profile-cluster">
                <div class="admin-avatar" aria-hidden="true">
                    <img v-if="avatarUrl" class="admin-avatar-img" :src="avatarUrl" alt="">
                    <i v-else class="fa-solid fa-user admin-avatar-fallback" />
                </div>
                <span class="admin-profile-name">{{ userName }}</span>
                <Link :href="route('logout')" method="post" as="button" class="admin-logout-btn" aria-label="Log out">
                    <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                </Link>
            </div>
        </div>
    </header>
</template>

<style scoped>
.admin-header {
    min-height: 50px;
    background: #7a918d;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-bottom: 1px solid #697d79;
}

.admin-header-left,
.admin-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.admin-header-menu-btn {
    background: transparent;
    border: 0;
    color: #fff;
    padding: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
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
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

.icon-only {
    width: 28px;
    height: 28px;
    justify-content: center;
    font-size: 15px;
}

.admin-location-select {
    height: 30px;
    border: 1px solid #cfd8d7;
    background: #fff;
    color: #333;
    font-size: 12px;
    min-width: 148px;
    padding: 2px 8px;
    border-radius: 2px;
}

.admin-profile-cluster {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-left: 4px;
}

.admin-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.45);
    display: grid;
    place-items: center;
    overflow: hidden;
    flex-shrink: 0;
}

.admin-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.admin-avatar-fallback {
    font-size: 14px;
    opacity: 0.95;
}

.admin-profile-name {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.admin-logout-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
}

.admin-logout-btn:hover {
    background: rgba(255, 255, 255, 0.22);
}

.admin-logout-btn i {
    font-size: 13px;
}
</style>
