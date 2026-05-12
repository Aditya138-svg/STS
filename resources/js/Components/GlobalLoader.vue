<template>
  <transition name="fade">
    <div v-if="isLoading" class="global-loader">
      <!-- Ambient Background Glow -->
      <div class="ambient-glow"></div>
      <div class="ambient-glow glow-2"></div>

      <div class="loader-content">
        <div class="brand-container">
          <div class="sts-logo">
            <span class="letter">S</span>
            <span class="letter">T</span>
            <span class="letter">S</span>
          </div>
          
          <!-- Elegant loading track instead of spinner -->
          <div class="loading-track">
            <div class="loading-progress"></div>
          </div>
        </div>
        
        <div class="loading-text">
          <span>Processing</span>
          <span class="dots">...</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { router } from '@inertiajs/vue3'

const isLoading = ref(false)
let timeout = null

onMounted(() => {
  const removeStart = router.on('start', () => {
    isLoading.value = true
  })
  
  const removeFinish = router.on('finish', () => {
    timeout = setTimeout(() => {
      isLoading.value = false
    }, 400)
  })

  onUnmounted(() => {
    removeStart()
    removeFinish()
    if (timeout) clearTimeout(timeout)
  })
})
</script>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Deep, sophisticated slate tint that still reveals the background */
  background-color: rgba(15, 23, 42, 0.75); 
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(16px);
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  animation: pulse-glow 4s ease-in-out infinite alternate;
  z-index: -1;
}

.glow-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
  animation-delay: -2s;
}

@keyframes pulse-glow {
  0% { transform: scale(0.8) translate(-10%, -10%); opacity: 0.5; }
  100% { transform: scale(1.2) translate(10%, 10%); opacity: 1; }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  position: relative;
}

.brand-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.sts-logo {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 6.5rem;
  font-weight: 900;
  display: flex;
  letter-spacing: -4px;
  /* Premium silver-to-sky gradient */
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 30%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
}

.letter {
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.letter:nth-child(1) { animation-delay: 0s; }
.letter:nth-child(2) { animation-delay: 0.15s; }
.letter:nth-child(3) { animation-delay: 0.3s; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.loading-track {
  width: 140px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.loading-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  background: linear-gradient(90deg, transparent, #38bdf8, #fff, #38bdf8, transparent);
  border-radius: 4px;
  animation: shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes shimmer {
  0% { left: -50%; }
  100% { left: 100%; }
}

.loading-text {
  color: #94a3b8; /* Slate 400 */
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 5px;
  display: flex;
  align-items: center;
  margin-left: 5px; /* Offset for letter spacing */
}

.dots {
  display: inline-block;
  width: 20px;
  text-align: left;
  animation: blink 1.5s infinite steps(4, end);
}

@keyframes blink {
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
  100% { content: ""; }
}

/* Elegant entry and exit transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  transform: scale(1.02); /* Slight zoom out effect on leave */
}
</style>
