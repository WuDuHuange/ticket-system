<template>
  <div class="article-management-view">
    <div class="page-header">
      <h1>{{ $t('nav.articleManagement') }}</h1>
      <el-button type="primary" @click="showCreateArticle">
        <el-icon><Plus /></el-icon>
        {{ $t('admin.newArticle') }}
      </el-button>
    </div>

    <!-- Filters -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item :label="$t('common.status')">
          <el-select v-model="filter.status" :placeholder="$t('admin.allStatus')" clearable @change="loadArticles">
            <el-option :label="$t('admin.draft')" value="draft" />
            <el-option :label="$t('admin.published')" value="published" />
            <el-option :label="$t('admin.archived')" value="archived" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('common.category')">
          <el-select v-model="filter.category" :placeholder="$t('admin.allCategories')" clearable @change="loadArticles">
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('common.search')">
          <el-input
            v-model="filter.keyword"
            :placeholder="$t('admin.searchArticles')"
            clearable
            @keyup.enter="loadArticles"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="loadArticles">{{ $t('common.search') }}</el-button>
          <el-button @click="clearFilter">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Articles Table -->
    <el-card class="table-card">
      <el-table :data="articles" v-loading="loading">
        <el-table-column prop="title" :label="$t('common.title')" min-width="250">
          <template #default="{ row }">
            <div class="article-title">
              <span>{{ row.title }}</span>
              <el-tag v-if="row.isFAQ" type="success" size="small">FAQ</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" :label="$t('common.category')" width="130" />
        
        <el-table-column prop="status" :label="$t('common.status')" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="authorName" :label="$t('admin.author')" width="130" />
        
        <el-table-column prop="viewCount" :label="$t('admin.views')" width="80" align="center" />
        
        <el-table-column prop="updatedAt" :label="$t('common.updated')" width="130">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('common.actions')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="editArticle(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button 
              v-if="row.status === 'draft'" 
              text 
              type="success" 
              @click="publishArticle(row)"
            >
              <el-icon><Upload /></el-icon>
            </el-button>
            <el-button text @click="previewArticle(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button text type="danger" @click="deleteArticle(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalCount"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadArticles"
          @current-change="loadArticles"
        />
      </div>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEditing ? $t('admin.editArticle') : $t('admin.createArticle')"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form :model="articleForm" :rules="rules" ref="formRef" label-position="top">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item :label="$t('common.title')" prop="title">
              <el-input v-model="articleForm.title" :placeholder="$t('admin.enterArticleTitle')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('common.category')" prop="category">
              <el-select 
                v-model="articleForm.category" 
                style="width: 100%"
                filterable
                allow-create
                :placeholder="$t('admin.selectOrEnterCategory')"
              >
                <el-option
                  v-for="cat in categories"
                  :key="cat"
                  :label="cat"
                  :value="cat"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item :label="$t('admin.articleSummary')" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="2"
            :placeholder="$t('admin.briefSummary')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('admin.articleContent')" prop="content">
          <MdEditor
            v-model="articleForm.content"
            language="en-US"
            :preview="true"
            style="height: 400px"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('admin.articleTags')">
              <el-select
                v-model="articleForm.tags"
                multiple
                filterable
                allow-create
                style="width: 100%"
                :placeholder="$t('admin.addTags')"
              >
                <el-option
                  v-for="tag in availableTags"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('admin.accessLevel')">
              <el-select v-model="articleForm.accessLevel" style="width: 100%">
                <el-option :label="$t('admin.public')" value="public" />
                <el-option :label="$t('admin.internal')" value="internal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('admin.markAsFAQ')">
              <el-switch v-model="articleForm.isFAQ" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button @click="saveDraft" :loading="submitting">{{ $t('admin.saveAsDraft') }}</el-button>
        <el-button type="primary" @click="saveAndPublish" :loading="submitting">
          {{ $t('admin.saveAndPublish') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useKnowledgeStore, useUIStore } from '@/stores'
import { knowledgeApi } from '@/api'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { formatDate } from '@/utils/helpers'
import type { KnowledgeArticle } from '@/types'
import { Plus, Edit, Upload, View, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()
const knowledgeStore = useKnowledgeStore()
const uiStore = useUIStore()

const loading = computed(() => knowledgeStore.loading)
const articles = computed(() => knowledgeStore.articles)
const categories = computed(() => knowledgeStore.categories)
const availableTags = computed(() => knowledgeStore.tags)
const totalCount = computed(() => knowledgeStore.pagination.total)

const currentPage = ref(1)
const pageSize = ref(10)

const filter = reactive({
  status: '',
  category: '',
  keyword: ''
})

const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const articleForm = reactive({
  id: '',
  title: '',
  summary: '',
  content: '',
  category: '',
  tags: [] as string[],
  accessLevel: 'public' as 'public' | 'internal',
  isFAQ: false
})

const rules: FormRules = {
  title: [
    { required: true, message: () => t('admin.articleTitleRequired'), trigger: 'blur' }
  ],
  summary: [
    { required: true, message: () => t('admin.articleSummaryRequired'), trigger: 'blur' }
  ],
  content: [
    { required: true, message: () => t('admin.articleContentRequired'), trigger: 'blur' }
  ],
  category: [
    { required: true, message: () => t('admin.articleCategoryRequired'), trigger: 'change' }
  ]
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    draft: t('admin.draft'),
    published: t('admin.published'),
    archived: t('admin.archived')
  }
  return statusMap[status] || status
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.administration') },
    { label: t('nav.articleManagement') }
  ])
  
  await Promise.all([
    loadArticles(),
    knowledgeStore.fetchCategories(),
    knowledgeStore.fetchTags()
  ])
})

async function loadArticles() {
  const filterParams: Record<string, unknown> = {}
  
  if (filter.status) filterParams.status = filter.status
  if (filter.category) filterParams.category = filter.category
  if (filter.keyword) filterParams.keyword = filter.keyword
  
  await knowledgeStore.fetchAllArticles(currentPage.value, pageSize.value, filterParams)
}

function clearFilter() {
  filter.status = ''
  filter.category = ''
  filter.keyword = ''
  currentPage.value = 1
  loadArticles()
}

function getStatusType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    draft: 'warning',
    published: 'success',
    archived: 'info'
  }
  return typeMap[status] || ''
}

function showCreateArticle() {
  isEditing.value = false
  articleForm.id = ''
  articleForm.title = ''
  articleForm.summary = ''
  articleForm.content = ''
  articleForm.category = ''
  articleForm.tags = []
  articleForm.accessLevel = 'public'
  articleForm.isFAQ = false
  dialogVisible.value = true
}

function editArticle(article: KnowledgeArticle) {
  isEditing.value = true
  articleForm.id = article.id
  articleForm.title = article.title
  articleForm.summary = article.summary || ''
  articleForm.content = article.content
  articleForm.category = article.category
  articleForm.tags = [...article.tags]
  articleForm.accessLevel = article.accessLevel
  articleForm.isFAQ = article.isFAQ
  dialogVisible.value = true
}

function previewArticle(article: KnowledgeArticle) {
  router.push(`/knowledge/${article.id}`)
}

async function publishArticle(article: KnowledgeArticle) {
  try {
    await ElMessageBox.confirm(
      `${t('admin.confirmPublish')} "${article.title}"?`,
      t('admin.publishArticle'),
      { type: 'info' }
    )
    
    const result = await knowledgeStore.publishArticle(article.id)
    
    if (result.success) {
      ElMessage.success(t('admin.articlePublished'))
      await loadArticles()
    } else {
      ElMessage.error(result.message || t('admin.failedPublish'))
    }
  } catch {
    // User cancelled
  }
}

async function deleteArticle(article: KnowledgeArticle) {
  try {
    await ElMessageBox.confirm(
      `${t('admin.confirmDeleteArticle')} "${article.title}"?`,
      t('common.delete'),
      { type: 'warning' }
    )
    
    // Call API to delete article
    const response = await knowledgeApi.deleteArticle(article.id)
    if (response.code === 200) {
      ElMessage.success(t('admin.articleDeleted'))
      await loadArticles()
    } else {
      ElMessage.error(response.message || t('messages.operationFailed'))
    }
  } catch (error: any) {
    // Check if user cancelled or if it's an actual error
    if (error !== 'cancel' && error?.toString() !== 'cancel') {
      console.error('Failed to delete article:', error)
      ElMessage.error(t('messages.operationFailed'))
    }
  }
}

async function saveDraft() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      if (isEditing.value) {
        await knowledgeStore.updateArticle(articleForm.id, {
          title: articleForm.title,
          summary: articleForm.summary,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tags,
          accessLevel: articleForm.accessLevel,
          isFAQ: articleForm.isFAQ
        })
      } else {
        await knowledgeStore.createArticle({
          title: articleForm.title,
          summary: articleForm.summary,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tags,
          accessLevel: articleForm.accessLevel,
          isFAQ: articleForm.isFAQ
        })
      }
      
      ElMessage.success(t('admin.articleSavedDraft'))
      dialogVisible.value = false
      await loadArticles()
    } finally {
      submitting.value = false
    }
  })
}

async function saveAndPublish() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      let articleId = articleForm.id
      
      if (isEditing.value) {
        await knowledgeStore.updateArticle(articleForm.id, {
          title: articleForm.title,
          summary: articleForm.summary,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tags,
          accessLevel: articleForm.accessLevel,
          isFAQ: articleForm.isFAQ
        })
      } else {
        const result = await knowledgeStore.createArticle({
          title: articleForm.title,
          summary: articleForm.summary,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tags,
          accessLevel: articleForm.accessLevel,
          isFAQ: articleForm.isFAQ
        })
        
        if (result.article) {
          articleId = result.article.id
        }
      }
      
      if (articleId) {
        await knowledgeStore.publishArticle(articleId)
      }
      
      ElMessage.success(t('admin.articleSavedPublished'))
      dialogVisible.value = false
      await loadArticles()
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.article-management-view {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .filter-card {
    margin-bottom: 24px;
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  
  .table-card {
    .article-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
