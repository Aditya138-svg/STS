import { ref } from 'vue'

const STORAGE_KEY = 'sts.admin.sidebarMini'

const sidebarMini = ref(false)

function readStored() {
    if (typeof window === 'undefined') {
        return
    }
    try {
        sidebarMini.value = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        /* ignore */
    }
}

readStored()

/**
 * Shared collapsed “mini” sidebar state for admin shell (icon strip + flyouts).
 * Used by Header (hamburger) and Sidebar / AdminLayout (layout width).
 */
export function useAdminSidebarMini() {
    function toggleSidebarMini() {
        sidebarMini.value = !sidebarMini.value
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, sidebarMini.value ? '1' : '0')
            }
        } catch {
            /* ignore */
        }
    }

    return {
        sidebarMini,
        toggleSidebarMini,
    }
}
