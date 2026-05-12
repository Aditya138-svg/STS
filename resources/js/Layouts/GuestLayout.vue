<script setup>
import Footer from '@/Includes/Guest/Footer.vue'
import Header from '@/Includes/Guest/Header.vue'
import ScrollToTop from '@/Includes/Guest/ScrollToTop.vue'
</script>

<template>
    <div class="guest-layout-wrapper">
        <Header />
        <main class="guest-main-content">
            <slot />
        </main>
        <Footer />
        <ScrollToTop />
    </div>
</template>

<style scoped>
.guest-layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #020617; /* Matches the new dark theme */
}

.guest-main-content {
    flex: 1 0 auto;
    padding-top: 0; 
}

@media (max-width: 768px) {
    .guest-main-content {
        padding-top: 0;
    }
}

:deep(.main-content::before) {
    display: none !important;
}
</style>

