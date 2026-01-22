import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KnowledgeArticle, PaginatedResponse, ArticleCreateDTO } from '@/types'
import { knowledgeApi } from '@/api'

export const useKnowledgeStore = defineStore('knowledge', () => {
  // State
  const articles = ref<KnowledgeArticle[]>([])
  const currentArticle = ref<KnowledgeArticle | null>(null)
  const faqArticles = ref<KnowledgeArticle[]>([])
  const suggestedArticles = ref<KnowledgeArticle[]>([])
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const filter = ref<Record<string, unknown>>({})

  // Getters
  const articleCount = computed(() => articles.value.length)
  const publishedArticles = computed(() => articles.value.filter(a => a.status === 'published'))
  const draftArticles = computed(() => articles.value.filter(a => a.status === 'draft'))

  // Actions
  async function fetchPublicArticles(page = 1, pageSize = 10, keyword?: string, category?: string) {
    loading.value = true
    try {
      const response = await knowledgeApi.getPublishedArticles({ page, pageSize, keyword, category })
      
      if (response.code === 200 && response.data) {
        const data = response.data as PaginatedResponse<KnowledgeArticle>
        articles.value = data.items
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        }
      }
    } catch (error) {
      console.error('Fetch articles error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchAllArticles(page = 1, pageSize = 10, filterParams?: Record<string, unknown>) {
    loading.value = true
    try {
      const mergedFilter = { ...filter.value, ...filterParams }
      // Assuming api filter is compatible or needs adjustment
      const response = await knowledgeApi.getArticles({ page, pageSize, filter: mergedFilter })
      
      if (response.code === 200 && response.data) {
        const data = response.data as PaginatedResponse<KnowledgeArticle>
        articles.value = data.items
        pagination.value = {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        }
      }
    } catch (error) {
      console.error('Fetch all articles error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchFAQArticles() {
    loading.value = true
    try {
      const response = await knowledgeApi.getFAQArticles()
      
      if (response.code === 200 && response.data) {
        faqArticles.value = response.data
      }
    } catch (error) {
      console.error('Fetch FAQ articles error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchSuggestedArticles(query: string) {
    if (!query || query.length < 2) {
      suggestedArticles.value = []
      return
    }
    
    try {
      const response = await knowledgeApi.getSuggestedArticles(query)
      
      if (response.code === 200 && response.data) {
        suggestedArticles.value = response.data
      }
    } catch (error) {
      console.error('Fetch suggested articles error:', error)
    }
  }

  async function fetchArticleById(id: string) {
    loading.value = true
    try {
      const response = await knowledgeApi.getArticleById(id)
      
      if (response.code === 200 && response.data) {
        currentArticle.value = response.data
        return response.data
      }
      return null
    } catch (error) {
      console.error('Fetch article error:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createArticle(data: Record<string, unknown>) {
    loading.value = true
    try {
      const response = await knowledgeApi.createArticle(data as unknown as ArticleCreateDTO)
      
      if (response.code === 200 && response.data) {
        return { success: true, article: response.data }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Create article error:', error)
      return { success: false, message: 'Failed to create article' }
    } finally {
      loading.value = false
    }
  }

  async function updateArticle(id: string, data: Record<string, unknown>) {
    loading.value = true
    try {
      const response = await knowledgeApi.updateArticle(id, data as Partial<ArticleCreateDTO>)
      
      if (response.code === 200 && response.data) {
        currentArticle.value = response.data
        // Update in list if exists
        const index = articles.value.findIndex(a => a.id === id)
        if (index !== -1) {
          articles.value[index] = response.data
        }
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Update article error:', error)
      return { success: false, message: 'Failed to update article' }
    } finally {
      loading.value = false
    }
  }

  async function publishArticle(id: string) {
    loading.value = true
    try {
      const response = await knowledgeApi.publishArticle(id)
      
      if (response.code === 200 && response.data) {
        currentArticle.value = response.data
        const index = articles.value.findIndex(a => a.id === id)
        if (index !== -1) {
          articles.value[index] = response.data
        }
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      console.error('Publish article error:', error)
      return { success: false, message: 'Failed to publish article' }
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await knowledgeApi.getCategories()
      
      if (response.code === 200 && response.data) {
        categories.value = response.data
      }
    } catch (error) {
      console.error('Fetch categories error:', error)
    }
  }

  async function fetchTags() {
    try {
      const response = await knowledgeApi.getTags()
      
      if (response.code === 200 && response.data) {
        tags.value = response.data
      }
    } catch (error) {
      console.error('Fetch tags error:', error)
    }
  }

  function setFilter(newFilter: Record<string, unknown>) {
    filter.value = newFilter
  }

  function clearFilter() {
    filter.value = {}
  }

  function clearSuggestions() {
    suggestedArticles.value = []
  }

  return {
    // State
    articles,
    currentArticle,
    faqArticles,
    suggestedArticles,
    categories,
    tags,
    pagination,
    loading,
    filter,
    // Getters
    articleCount,
    publishedArticles,
    draftArticles,
    // Actions
    fetchPublicArticles,
    fetchAllArticles,
    fetchFAQArticles,
    fetchSuggestedArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    publishArticle,
    fetchCategories,
    fetchTags,
    setFilter,
    clearFilter,
    clearSuggestions
  }
})
