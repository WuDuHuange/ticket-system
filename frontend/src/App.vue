<script setup lang="ts">
import { useUIStore } from './stores/ui'
import { onMounted, watch } from 'vue'

const uiStore = useUIStore()

// Apply dark mode class to document
watch(() => uiStore.darkMode, (isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
}, { immediate: true })

onMounted(() => {
  // Initialize from localStorage
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    uiStore.setDarkMode(savedDarkMode === 'true')
  }
})
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles are in src/styles/main.scss */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
