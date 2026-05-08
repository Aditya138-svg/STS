import { ref } from 'vue'

const STORAGE_KEY = 'sts.admin.mobileSidebarOpen'

const mobileSidebarOpen = ref(false)

function readStored() {
    if (typeof window === 'undefined') {
        return
    }
    try {
        mobileSidebarOpen.value = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        /* ignore */
    }
}

readStored()

/**
 * Shared mobile sidebar open state for admin shell.
 */
export function useAdminMobileSidebar() {
    function toggleMobileSidebar() {
        mobileSidebarOpen.value = !mobileSidebarOpen.value
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, mobileSidebarOpen.value ? '1' : '0')
            }
        } catch {
            /* ignore */
        }
    }

    function closeMobileSidebar() {
        mobileSidebarOpen.value = false
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, '0')
            }
        } catch {
            /* ignore */
        }
    }

    return {
        mobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
    }
}