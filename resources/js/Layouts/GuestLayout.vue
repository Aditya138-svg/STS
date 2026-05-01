<script setup>
import Footer from '@/Includes/Guest/Footer.vue'
import Header from '@/Includes/Guest/Header.vue'
import ScrollToTop from '@/Includes/Guest/ScrollToTop.vue'
</script>

<template>
    <div id="app">
        <Header />
        <slot />
        <div class="push"></div>
        <Footer />
        <ScrollToTop />
    </div>
</template>
