<template>
  <div class="article-detail-view" v-loading="loading">
    <template v-if="article">
      <!-- Header -->
      <div class="page-header">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('knowledge.backToKB') }}
        </el-button>
      </div>

      <el-row :gutter="24">
        <!-- Main Content -->
        <el-col :xs="24" :lg="18">
          <el-card class="article-card">
            <!-- Article Header -->
            <div class="article-header">
              <div class="article-tags">
                <el-tag type="info">{{ article.category }}</el-tag>
                <el-tag v-if="article.isFAQ" type="success">FAQ</el-tag>
              </div>
              
              <h1 class="article-title">{{ article.title }}</h1>
              
              <div class="article-meta">
                <span>
                  <el-icon><User /></el-icon>
                  {{ article.authorName }}
                </span>
                <span>
                  <el-icon><Clock /></el-icon>
                  {{ $t('knowledge.updated') }} {{ formatDate(article.updatedAt, 'long') }}
                </span>
                <span>
                  <el-icon><View /></el-icon>
                  {{ article.viewCount }} {{ $t('knowledge.viewCount') }}
                </span>
              </div>
            </div>

            <el-divider />

            <!-- Article Content -->
            <div class="article-content">
              <MdPreview
                :modelValue="article.content"
                previewTheme="github"
              />
            </div>

            <el-divider />

            <!-- Feedback Section -->
            <div class="feedback-section">
              <h3>{{ $t('knowledge.helpful') }}</h3>
              <div class="feedback-buttons">
                <el-button
                  :type="feedback === 'helpful' ? 'success' : 'default'"
                  @click="submitFeedback('helpful')"
                >
                  <el-icon><CircleCheck /></el-icon>
                  {{ $t('knowledge.yes') }} ({{ article.helpfulCount }})
                </el-button>
                <el-button
                  :type="feedback === 'not_helpful' ? 'danger' : 'default'"
                  @click="submitFeedback('not_helpful')"
                >
                  <el-icon><CircleClose /></el-icon>
                  {{ $t('knowledge.no') }} ({{ article.notHelpfulCount }})
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- Sidebar -->
        <el-col :xs="24" :lg="6">
          <!-- Tags -->
          <el-card class="sidebar-card">
            <template #header>
              <span>{{ $t('knowledge.tags') }}</span>
            </template>
            <div class="tag-list">
              <el-tag
                v-for="tag in article.tags"
                :key="tag"
                effect="plain"
                @click="searchByTag(tag)"
                class="clickable-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>

          <!-- Related Articles -->
          <el-card class="sidebar-card">
            <template #header>
              <span>{{ $t('knowledge.relatedArticles') }}</span>
            </template>
            <div class="related-list">
              <div
                v-for="related in relatedArticles"
                :key="related.id"
                class="related-item"
                @click="viewArticle(related.id)"
              >
                <el-icon><Document /></el-icon>
                <span>{{ related.title }}</span>
              </div>
              <el-empty v-if="relatedArticles.length === 0" :description="$t('knowledge.noRelated')" :image-size="60" />
            </div>
          </el-card>

          <!-- Need More Help -->
          <el-card class="sidebar-card help-card">
            <h3>{{ $t('knowledge.stillNeedHelp') }}</h3>
            <p>{{ $t('knowledge.stillNeedHelpDesc') }}</p>
            <el-button type="primary" @click="createTicket">
              <el-icon><Tickets /></el-icon>
              {{ $t('knowledge.submitTicket') }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- Not Found -->
    <el-empty v-else-if="!loading" :description="$t('knowledge.articleNotFound')">
      <el-button type="primary" @click="goBack">{{ $t('knowledge.goBack') }}</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useKnowledgeStore, useUIStore } from '@/stores'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  User,
  Clock,
  View,
  CircleCheck,
  CircleClose,
  Document,
  Tickets
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils/helpers'
import type { KnowledgeArticle } from '@/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const knowledgeStore = useKnowledgeStore()
const uiStore = useUIStore()

const loading = computed(() => knowledgeStore.loading)
const article = computed(() => knowledgeStore.currentArticle)

const feedback = ref<'helpful' | 'not_helpful' | null>(null)
const relatedArticles = ref<KnowledgeArticle[]>([])

onMounted(async () => {
  const articleId = route.params.id as string
  await knowledgeStore.fetchArticleById(articleId)
  
  if (article.value) {
    uiStore.setBreadcrumbs([
      { label: t('nav.dashboard'), path: '/' },
      { label: t('knowledge.title'), path: '/knowledge' },
      { label: article.value.title }
    ])
    
    // Load related articles based on category
    await knowledgeStore.fetchPublicArticles(1, 5, undefined, article.value.category)
    relatedArticles.value = knowledgeStore.articles
      .filter(a => a.id !== article.value?.id)
      .slice(0, 4)
  }
})

function goBack() {
  router.push('/knowledge')
}

function viewArticle(id: string) {
  router.push(`/knowledge/${id}`)
}

function searchByTag(tag: string) {
  router.push({ path: '/knowledge', query: { q: tag } })
}

function createTicket() {
  router.push('/tickets/create')
}

function submitFeedback(type: 'helpful' | 'not_helpful') {
  if (feedback.value === type) {
    feedback.value = null
    return
  }
  
  feedback.value = type
  ElMessage.success(t('knowledge.thanksFeedback'))
}
</script>

<style lang="scss" scoped>
.article-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .article-card {
    .article-header {
      .article-tags {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .article-title {
        margin: 0 0 16px;
        font-size: 28px;
        font-weight: 700;
        line-height: 1.3;
      }
      
      .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        color: #666;
        font-size: 14px;
        
        span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }
    
    .article-content {
      :deep(.md-editor-preview-wrapper) {
        padding: 0;
        
        h1, h2, h3, h4, h5, h6 {
          margin-top: 24px;
          margin-bottom: 12px;
        }
        
        p {
          margin-bottom: 16px;
          line-height: 1.7;
        }
        
        ul, ol {
          margin-bottom: 16px;
          padding-left: 24px;
          
          li {
            margin-bottom: 8px;
          }
        }
        
        pre {
          background: #f6f8fa;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
        }
        
        code {
          background: #f6f8fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        
        blockquote {
          border-left: 4px solid #409eff;
          padding-left: 16px;
          color: #666;
          margin: 16px 0;
        }
      }
    }
    
    .feedback-section {
      text-align: center;
      padding: 24px 0;
      
      h3 {
        margin: 0 0 16px;
        font-size: 16px;
        color: #666;
      }
      
      .feedback-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;
      }
    }
  }
  
  .sidebar-card {
    margin-bottom: 20px;
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .clickable-tag {
        cursor: pointer;
        
        &:hover {
          background-color: #ecf5ff;
          border-color: #409eff;
          color: #409eff;
        }
      }
    }
    
    .related-list {
      .related-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        cursor: pointer;
        color: #666;
        font-size: 14px;
        
        &:hover {
          color: #409eff;
        }
      }
    }
    
    &.help-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      
      :deep(.el-card__body) {
        padding: 24px;
      }
      
      h3 {
        margin: 0 0 8px;
        font-size: 18px;
      }
      
      p {
        margin: 0 0 16px;
        opacity: 0.9;
        font-size: 14px;
      }
      
      .el-button {
        background: #fff;
        color: #667eea;
        border: none;
        
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
}
</style>
