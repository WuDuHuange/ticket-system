<template>
  <div class="knowledge-list-view">
    <div class="page-header">
      <div class="header-content">
        <h1>{{ $t('knowledge.title') }}</h1>
        <p>{{ $t('knowledge.subtitle') }}</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('knowledge.searchPlaceholder')"
        size="large"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button type="primary" @click="handleSearch">{{ $t('common.search') }}</el-button>
        </template>
      </el-input>
    </div>

    <!-- Categories -->
    <div class="categories-section">
      <el-card
        v-for="category in categories"
        :key="category"
        class="category-card"
        @click="filterByCategory(category)"
        :class="{ active: activeCategory === category }"
      >
        <el-icon :size="32" class="category-icon">
          <component :is="getCategoryIcon(category)" />
        </el-icon>
        <h3>{{ category }}</h3>
        <span class="article-count">{{ $t('knowledge.viewArticles') }}</span>
      </el-card>
    </div>

    <!-- Active Filter -->
    <div v-if="activeCategory || searchQuery" class="active-filter">
      <el-tag closable @close="clearFilter">
        {{ activeCategory ? getCategoryName(activeCategory) : `${$t('common.search')}: "${searchQuery}"` }}
      </el-tag>
      <el-button text type="primary" @click="clearFilter">{{ $t('common.clearFilter') }}</el-button>
    </div>

    <!-- Articles List -->
    <div class="articles-section">
      <el-card class="articles-card" v-loading="loading">
        <div v-if="articles.length > 0" class="article-list">
          <div
            v-for="article in articles"
            :key="article.id"
            class="article-item"
            @click="viewArticle(article.id)"
          >
            <div class="article-main">
              <h3 class="article-title">
                {{ article.title }}
                <el-tag v-if="article.isFAQ" type="success" size="small">FAQ</el-tag>
              </h3>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="category">
                  <el-icon><Folder /></el-icon>
                  {{ article.category }}
                </span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ article.viewCount }} {{ $t('knowledge.viewCount') }}
                </span>
                <span class="date">
                  <el-icon><Clock /></el-icon>
                  {{ formatDate(article.updatedAt) }}
                </span>
              </div>
            </div>
            <div class="article-tags">
              <el-tag
                v-for="tag in article.tags.slice(0, 3)"
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>

        <el-empty v-else :description="$t('knowledge.noArticles')">
          <el-button type="primary" @click="clearFilter">{{ $t('knowledge.allCategories') }}</el-button>
        </el-empty>

        <!-- Pagination -->
        <div v-if="articles.length > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="totalCount"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useKnowledgeStore, useUIStore } from '@/stores'
import {
  Search,
  Folder,
  View,
  Clock,
  Monitor,
  Connection,
  Lock,
  Setting,
  QuestionFilled,
  Document
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const knowledgeStore = useKnowledgeStore()
const uiStore = useUIStore()

const loading = computed(() => knowledgeStore.loading)
const articles = computed(() => knowledgeStore.articles)
const categories = computed(() => knowledgeStore.categories)
const totalCount = computed(() => knowledgeStore.pagination.total)

const searchQuery = ref('')
const activeCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const categoryIcons: Record<string, unknown> = {
  'Hardware': Monitor,
  'Software': Document,
  'Network': Connection,
  'Account & Access': Lock,
  'Email': Document,
  'General': QuestionFilled
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('knowledge.title') }
  ])
  
  // Check for query params
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
  
  await Promise.all([
    knowledgeStore.fetchCategories(),
    loadArticles()
  ])
})

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
    handleSearch()
  }
})

function getCategoryIcon(name: string) {
  return categoryIcons[name] || Setting
}

function getCategoryName(categoryId: string): string {
  return categoryId
}

function viewArticle(id: string) {
  router.push(`/knowledge/${id}`)
}

async function loadArticles() {
  await knowledgeStore.fetchPublicArticles(
    currentPage.value,
    pageSize.value,
    searchQuery.value || undefined,
    activeCategory.value || undefined
  )
}

async function handleSearch() {
  activeCategory.value = ''
  currentPage.value = 1
  await loadArticles()
}

async function filterByCategory(categoryId: string) {
  if (activeCategory.value === categoryId) {
    activeCategory.value = ''
  } else {
    activeCategory.value = categoryId
  }
  searchQuery.value = ''
  currentPage.value = 1
  await loadArticles()
}

async function clearFilter() {
  searchQuery.value = ''
  activeCategory.value = ''
  currentPage.value = 1
  await loadArticles()
}

async function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  await loadArticles()
}

async function handlePageChange(page: number) {
  currentPage.value = page
  await loadArticles()
}
</script>

<style lang="scss" scoped>
.knowledge-list-view {
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    text-align: center;
    margin-bottom: 32px;
    
    h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 700;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
  }
  
  .search-section {
    margin-bottom: 32px;
    
    .search-input {
      max-width: 600px;
      margin: 0 auto;
      display: block;
    }
  }
  
  .categories-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
    
    .category-card {
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
      
      &.active {
        border-color: #409eff;
        background: #ecf5ff;
      }
      
      .category-icon {
        color: #409eff;
        margin-bottom: 12px;
      }
      
      h3 {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 600;
      }
      
      .article-count {
        color: #999;
        font-size: 13px;
      }
    }
  }
  
  .active-filter {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .articles-section {
    .articles-card {
      .article-list {
        .article-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            background-color: #f9f9f9;
          }
          
          .article-main {
            flex: 1;
            
            .article-title {
              margin: 0 0 8px;
              font-size: 18px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              
              &:hover {
                color: #409eff;
              }
            }
            
            .article-summary {
              margin: 0 0 12px;
              color: #666;
              font-size: 14px;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .article-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
              font-size: 13px;
              color: #999;
              
              span {
                display: flex;
                align-items: center;
                gap: 4px;
              }
            }
          }
          
          .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-left: 24px;
          }
        }
      }
      
      .pagination-wrapper {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
