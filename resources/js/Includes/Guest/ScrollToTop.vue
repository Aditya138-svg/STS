<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
    visible.value = window.scrollY > 260
}

function goTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
    <a
        v-show="visible"
        style="width:50px; cursor:pointer; height:50px; background:rgb(17, 99, 90); border-radius:50%; position:fixed; z-index:99; right:40px; bottom:10px; padding:4px 12px; display:flex; justify-content:center; align-items:center;"
        id="nav_up"
        @click="goTop"
    >
        <i class="fa fa-angle-double-up" style="color:#fff;" />
    </a>
</template>
