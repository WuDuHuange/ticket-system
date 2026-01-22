import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

// Get saved language from localStorage, default to English
function getDefaultLocale(): string {
  const savedLocale = localStorage.getItem('language')
  if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
    return savedLocale
  }
  
  // Default to English
  return 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export default i18n

// Helper function to change locale
export function setLocale(locale: 'en' | 'zh') {
  i18n.global.locale.value = locale
  localStorage.setItem('language', locale)
  document.documentElement.setAttribute('lang', locale)
}

// Helper function to get current locale
export function getLocale(): string {
  return i18n.global.locale.value
}
