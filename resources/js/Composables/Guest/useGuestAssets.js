import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

/**
 * Centralizes public URLs so subdirectory installs (e.g. http://localhost/sts/public/)
 * work when APP_URL matches that base. Mirrors Laravel `url()` + named `route()` URLs.
 */
export function useGuestAssets() {
    const page = usePage()

    const rootUrl = computed(() => {
        const raw = page.props.sts?.rootUrl ?? ''
        return String(raw).replace(/\/$/, '')
    })

    /**
     * Build an absolute URL under the application root (like Laravel `asset()` without versioning).
     * @param {string} path e.g. "images/logo.png" or "/images/logo.png"
     */
    function asset(path) {
        const rel = String(path).replace(/^\//, '')
        const base = rootUrl.value
        if (!base) {
            return `/${rel}`
        }
        return `${base}/${rel}`
    }

    /**
     * Named route URL (relative), shared from HandleInertiaRequests.
     * @param {string} name e.g. "guest.home", "login"
     */
    /**
     * Named route URL (relative), shared from HandleInertiaRequests.
     * Also supports .current(name) check when called without arguments.
     * @param {string} [name] e.g. "guest.home", "login"
     */
    function route(name) {
        if (!name) {
            return {
                current: (checkName) => {
                    const routes = page.props.sts?.routes ?? {}
                    const rawTarget = routes[checkName]
                    if (!rawTarget || rawTarget === '#') return false

                    let currentPath = page.url.split('?')[0] || '/'
                    if (!currentPath.startsWith('/')) {
                        currentPath = `/${currentPath}`
                    }

                    let targetPath = String(rawTarget)
                    if (targetPath.includes('://')) {
                        try {
                            targetPath = new URL(targetPath).pathname || '/'
                        } catch {
                            return false
                        }
                    }
                    if (!targetPath.startsWith('/')) {
                        targetPath = `/${targetPath}`
                    }

                    const normalize = (p) => String(p).replace(/\/$/, '') || '/'
                    const nCurrent = normalize(currentPath)
                    const nTarget = normalize(targetPath)

                    if (nTarget === '/' && (nCurrent === '/' || nCurrent === '')) {
                        return true
                    }

                    return nTarget === nCurrent
                },
            }
        }
        const routes = page.props.sts?.routes ?? {}
        const href = routes[name]
        return typeof href === 'string' && href.length ? href : '#'
    }

    return {
        rootUrl,
        asset,
        route,
        christmasTheme: computed(() => !!page.props.sts?.christmasTheme),
        sts: computed(() => page.props.sts ?? {}),
    }
}
