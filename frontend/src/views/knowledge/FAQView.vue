<template>
  <div class="faq-view">
    <div class="page-header">
      <h1>{{ $t('knowledge.faq') }}</h1>
      <p>{{ $t('knowledge.faqSubtitle') }}</p>
    </div>

    <!-- Search -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('knowledge.searchFAQ')"
        size="large"
        clearable
        @input="filterFAQs"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- FAQ List -->
    <div class="faq-section" v-loading="loading">
      <el-collapse v-model="activeNames" accordion v-if="filteredFAQs.length > 0">
        <el-collapse-item
          v-for="faq in filteredFAQs"
          :key="faq.id"
          :name="faq.id"
        >
          <template #title>
            <div class="faq-title">
              <el-icon class="question-icon"><QuestionFilled /></el-icon>
              <span>{{ faq.title }}</span>
            </div>
          </template>
          
          <div class="faq-content">
            <MdPreview
              :modelValue="faq.content"
              previewTheme="github"
            />
            
            <div class="faq-footer">
              <div class="faq-meta">
                <el-tag size="small" effect="plain">{{ faq.category }}</el-tag>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ faq.viewCount }} {{ $t('knowledge.viewCount') }}
                </span>
              </div>
              
              <el-button text type="primary" @click="viewFullArticle(faq.id)">
                {{ $t('knowledge.viewFullArticle') }}
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-empty v-else :description="$t('knowledge.noFAQ')">
        <el-button type="primary" @click="clearSearch">{{ $t('knowledge.showAllFAQs') }}</el-button>
      </el-empty>
    </div>

    <!-- Still Need Help -->
    <el-card class="help-card">
      <div class="help-content">
        <div class="help-text">
          <h3>{{ $t('knowledge.cantFind') }}</h3>
          <p>{{ $t('knowledge.cantFindDesc') }}</p>
        </div>
        <div class="help-actions">
          <el-button @click="goToKnowledge">
            <el-icon><Reading /></el-icon>
            {{ $t('dashboard.browseKB') }}
          </el-button>
          <el-button type="primary" @click="goToCreateTicket">
            <el-icon><Tickets /></el-icon>
            {{ $t('tickets.submitTicket') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useKnowledgeStore, useUIStore } from '@/stores'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import {
  Search,
  QuestionFilled,
  View,
  ArrowRight,
  Reading,
  Tickets
} from '@element-plus/icons-vue'
import type { KnowledgeArticle } from '@/types'

const router = useRouter()
const { t } = useI18n()
const knowledgeStore = useKnowledgeStore()
const uiStore = useUIStore()

const loading = computed(() => knowledgeStore.loading)
const faqArticles = computed(() => knowledgeStore.faqArticles)

const searchQuery = ref('')
const activeNames = ref<string[]>([])
const filteredFAQs = ref<KnowledgeArticle[]>([])

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('knowledge.faq') }
  ])
  
  await knowledgeStore.fetchFAQArticles()
  filteredFAQs.value = faqArticles.value
})

function filterFAQs() {
  if (!searchQuery.value) {
    filteredFAQs.value = faqArticles.value
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  filteredFAQs.value = faqArticles.value.filter(faq =>
    faq.title.toLowerCase().includes(query) ||
    faq.content.toLowerCase().includes(query) ||
    faq.tags.some(tag => tag.toLowerCase().includes(query))
  )
}

function clearSearch() {
  searchQuery.value = ''
  filteredFAQs.value = faqArticles.value
}

function viewFullArticle(id: string) {
  router.push(`/knowledge/${id}`)
}

function goToKnowledge() {
  router.push('/knowledge')
}

function goToCreateTicket() {
  router.push('/tickets/create')
}
</script>

<style lang="scss" scoped>
.faq-view {
  max-width: 900px;
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
    
    .el-input {
      max-width: 500px;
      margin: 0 auto;
      display: block;
    }
  }
  
  .faq-section {
    margin-bottom: 32px;
    
    :deep(.el-collapse) {
      border: none;
      
      .el-collapse-item {
        margin-bottom: 12px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        
        .el-collapse-item__header {
          padding: 16px 20px;
          font-size: 16px;
          font-weight: 500;
          border: none;
          background: #fff;
          
          &:hover {
            background: #f9f9f9;
          }
        }
        
        .el-collapse-item__wrap {
          border: none;
        }
        
        .el-collapse-item__content {
          padding: 0 20px 20px;
        }
      }
    }
    
    .faq-title {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .question-icon {
        color: #409eff;
        font-size: 20px;
      }
    }
    
    .faq-content {
      :deep(.md-editor-preview-wrapper) {
        padding: 0;
        
        p {
          line-height: 1.7;
          margin-bottom: 12px;
        }
        
        ul, ol {
          padding-left: 24px;
          
          li {
            margin-bottom: 8px;
          }
        }
        
        code {
          background: #f6f8fa;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
      
      .faq-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
        
        .faq-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .views {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #999;
            font-size: 13px;
          }
        }
      }
    }
  }
  
  .help-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
    
    .help-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
      
      .help-text {
        h3 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
        }
        
        p {
          margin: 0;
          color: #666;
        }
      }
      
      .help-actions {
        display: flex;
        gap: 12px;
      }
    }
  }
}
</style>
