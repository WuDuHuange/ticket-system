import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const darkMode = ref(false)
  const loading = ref(false)
  const globalMessage = ref<{ type: 'success' | 'error' | 'warning' | 'info'; text: string } | null>(null)
  const breadcrumbs = ref<{ label: string; path?: string }[]>([])

  // Actions
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function setDarkMode(enabled: boolean) {
    darkMode.value = enabled
    document.documentElement.classList.toggle('dark', enabled)
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function showMessage(type: 'success' | 'error' | 'warning' | 'info', text: string, duration = 3000) {
    globalMessage.value = { type, text }
    
    if (duration > 0) {
      setTimeout(() => {
        globalMessage.value = null
      }, duration)
    }
  }

  function clearMessage() {
    globalMessage.value = null
  }

  function setBreadcrumbs(items: { label: string; path?: string }[]) {
    breadcrumbs.value = items
  }

  function addBreadcrumb(item: { label: string; path?: string }) {
    breadcrumbs.value.push(item)
  }

  function clearBreadcrumbs() {
    breadcrumbs.value = []
  }

  return {
    // State
    sidebarCollapsed,
    darkMode,
    loading,
    globalMessage,
    breadcrumbs,
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    toggleDarkMode,
    setDarkMode,
    setLoading,
    showMessage,
    clearMessage,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs
  }
})
