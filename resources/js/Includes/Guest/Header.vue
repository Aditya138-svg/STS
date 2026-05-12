<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/Includes/Guest/Navbar.vue'

const isVisible = ref(true)
let lastScrollY = 0

const handleScroll = () => {
    const currentScrollY = window.scrollY
    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
        isVisible.value = false
    } else {
        isVisible.value = true
    }
    lastScrollY = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <header class="guest-header" aria-label="Site header">
        <div class="header-scroll-wrapper" :class="{ 'header-hidden': !isVisible }">
            <div class="navbar-container">
                <Navbar />
            </div>
        </div>
    </header>
</template>

<style scoped>
.guest-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1030;
    width: 100%;
}

.header-scroll-wrapper {
    position: relative;
    z-index: 1030;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
}

.header-hidden {
    /* Hide Navbar by sliding it up */
    transform: translateY(-100px); 
}

@media (prefers-reduced-motion: reduce) {
    .header-scroll-wrapper {
        transition: transform 0.2s ease;
    }
}
</style>
