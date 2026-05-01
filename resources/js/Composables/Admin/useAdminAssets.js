import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

/**
 * Centralizes admin URLs so subdirectory installs
 * (e.g. http://localhost/STS/public/) work consistently.
 */
export function useAdminAssets() {
    const page = usePage()

    const rootUrl = computed(() => {
        const raw = page.props.sts?.rootUrl ?? ''
        return String(raw).replace(/\/$/, '')
    })

    function asset(path) {
        const rel = String(path).replace(/^\//, '')
        const base = rootUrl.value
        if (!base) {
            return `/${rel}`
        }
        return `${base}/${rel}`
    }

    function href(path) {
        return asset(path)
    }

    function route(name) {
        const routes = page.props.sts?.routes ?? {}
        const url = routes[name]
        return typeof url === 'string' && url.length ? url : '#'
    }

    return {
        rootUrl,
        asset,
        href,
        route,
        sts: computed(() => page.props.sts ?? {}),
    }
}
