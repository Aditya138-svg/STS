<script setup>
import GuestFooter from '@/Includes/Guest/Footer.vue'
</script>

<template>
    <div class="admin-footer-wrap">
        <GuestFooter />
    </div>
</template>

<style scoped>
.admin-footer-wrap :deep(.guest-footer-bar) {
    margin-top: 10px;
    border-top: 1px solid #d4d9dd;
}
</style>
