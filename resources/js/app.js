import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import GlobalLoader from './Components/GlobalLoader.vue'

const pages = import.meta.glob([
    './Pages/Guest/**/*.vue',
    './Pages/Auth/**/*.vue',
    './Pages/Admin/**/*.vue',
    './Pages/Dashboard.vue',
])

createInertiaApp({
  resolve: async (name) => {
    const page = pages[`./Pages/${name}.vue`]

    if (!page) {
      throw new Error(`Unknown Inertia page: ${name}`)
    }

    const module = await page()
    const component = module.default

    if (name.startsWith('Admin/') && !component.layout) {
      const { default: AdminLayout } = await import('./Layouts/AdminLayout.vue')
      component.layout = AdminLayout
    }

    return module
  },
  progress: false,
  setup({ el, App, props }) {
    createApp({ render: () => h(App, props) }).mount(el)

    const loaderDiv = document.createElement('div')
    document.body.appendChild(loaderDiv)
    createApp(GlobalLoader).mount(loaderDiv)
  },
})