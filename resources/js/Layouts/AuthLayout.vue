<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/Composables/Guest'
import Navbar from '@/Includes/Guest/Header.vue'
import Header from '../Includes/Guest/Header.vue'

const props = defineProps({
    simple: {
        type: Boolean,
        default: false
    },
    authImage: {
        type: String,
        default: 'login.svg'
    }
})

const page = usePage()
const { asset, route, sts } = useGuestAssets()
</script>

<template>
    <div class="auth-wrapper">
        <Header />
        <div class="auth-container" :class="{ 'auth-simple': simple }">
            <!-- Left Side: Visuals (Hidden in simple mode) -->
            <div v-if="!simple" class="auth-visual">
                <img :src="asset('images/wp/' + authImage)" alt="Illustration" class="auth-illustration-img">
            </div>

            <!-- Right Side / Main Card: Content -->
            <div class="auth-content">
                
                <div class="content-body">
                    <slot />
                </div>
            </div>
        </div>

        <!-- Full width Guest Footer at the very bottom -->
        <!-- <Footer class="auth-page-footer" /> -->
    </div>
</template>
