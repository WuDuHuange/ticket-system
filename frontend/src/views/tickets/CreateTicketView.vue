<template>
  <div class="create-ticket-view">
    <div class="page-header">
      <h1>{{ $t('tickets.submitTicket') }}</h1>
      <p>{{ $t('tickets.submitDesc') }}</p>
    </div>

    <!-- Knowledge Base Suggestions -->
    <el-card v-if="suggestedArticles.length > 0" class="suggestions-card">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ $t('tickets.suggestedArticles') }}</span>
        </div>
      </template>
      
      <div class="suggestion-list">
        <div
          v-for="article in suggestedArticles"
          :key="article.id"
          class="suggestion-item"
          @click="viewArticle(article.id)"
        >
          <el-icon><Document /></el-icon>
          <span>{{ article.title }}</span>
        </div>
      </div>
    </el-card>

    <!-- Ticket Form -->
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item :label="$t('common.title')" prop="title">
          <el-input
            v-model="form.title"
            :placeholder="$t('tickets.titlePlaceholder')"
            maxlength="200"
            show-word-limit
            @input="debouncedSearch"
          />
        </el-form-item>

        <el-form-item :label="$t('common.category')" prop="categoryId">
          <el-select v-model="form.categoryId" :placeholder="$t('tickets.selectCategory')" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('common.priority')" prop="priority">
          <el-radio-group v-model="form.priority">
            <el-radio value="low">
              <el-tag type="info" effect="plain">{{ $t('tickets.priorityLow') }}</el-tag>
              <span class="priority-desc">{{ $t('tickets.priorityLowDesc') }}</span>
            </el-radio>
            <el-radio value="medium">
              <el-tag effect="plain">{{ $t('tickets.priorityMedium') }}</el-tag>
              <span class="priority-desc">{{ $t('tickets.priorityMediumDesc') }}</span>
            </el-radio>
            <el-radio value="high">
              <el-tag type="warning" effect="plain">{{ $t('tickets.priorityHigh') }}</el-tag>
              <span class="priority-desc">{{ $t('tickets.priorityHighDesc') }}</span>
            </el-radio>
            <el-radio value="urgent">
              <el-tag type="danger" effect="plain">{{ $t('tickets.priorityUrgent') }}</el-tag>
              <span class="priority-desc">{{ $t('tickets.priorityUrgentDesc') }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('common.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            :placeholder="$t('tickets.descriptionPlaceholder')"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('tickets.attachments')">
          <el-upload
            ref="uploadRef"
            v-model:file-list="fileList"
            class="upload-area"
            drag
            multiple
            :auto-upload="false"
            :limit="5"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.log"
          >
            <el-icon class="upload-icon"><UploadFilled /></el-icon>
            <div class="upload-text">
              {{ $t('tickets.uploadText') }}
            </div>
            <template #tip>
              <div class="upload-tip">
                {{ $t('tickets.uploadTip') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" size="large" :loading="submitting">
            {{ $t('common.submit') }}
          </el-button>
          <el-button size="large" @click="handleCancel">
            {{ $t('common.cancel') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTicketStore, useKnowledgeStore, useUIStore } from '@/stores'
import { ticketApi } from '@/api'
import { ElMessage, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'
import { InfoFilled, Document, UploadFilled } from '@element-plus/icons-vue'
import { debounce } from '@/utils/helpers'

const router = useRouter()
const { t } = useI18n()
const ticketStore = useTicketStore()
const knowledgeStore = useKnowledgeStore()
const uiStore = useUIStore()

const formRef = ref<FormInstance>()
const uploadRef = ref()
const submitting = ref(false)
const fileList = ref<UploadUserFile[]>([])

const form = reactive({
  title: '',
  categoryId: '',
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  description: ''
})

const rules: FormRules = {
  title: [
    { required: true, message: 'Please enter a title', trigger: 'blur' },
    { min: 10, message: 'Title must be at least 10 characters', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ],
  priority: [
    { required: true, message: 'Please select a priority', trigger: 'change' }
  ],
  description: [
    { required: true, message: 'Please enter a description', trigger: 'blur' },
    { min: 20, message: 'Description must be at least 20 characters', trigger: 'blur' }
  ]
}

const categories = ref(ticketStore.categories)
const suggestedArticles = ref(knowledgeStore.suggestedArticles)

const debouncedSearch = debounce(async () => {
  if (form.title.length >= 5) {
    await knowledgeStore.fetchSuggestedArticles(form.title)
    suggestedArticles.value = knowledgeStore.suggestedArticles
  } else {
    suggestedArticles.value = []
  }
}, 500)

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('nav.submitTicket') }
  ])
  
  await ticketStore.fetchCategories()
  categories.value = ticketStore.categories
})

function viewArticle(id: string) {
  router.push(`/knowledge/${id}`)
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      const result = await ticketStore.createTicket({
        title: form.title,
        categoryId: form.categoryId,
        priority: form.priority,
        description: form.description
      })
      
      if (result.success && result.ticket) {
        // Upload attachments if any
        if (fileList.value.length > 0) {
          for (const file of fileList.value) {
            if (file.raw) {
              const formData = new FormData()
              formData.append('file', file.raw)
              try {
                await ticketApi.uploadAttachment(result.ticket.id, formData)
              } catch (uploadError) {
                console.error('Failed to upload attachment:', uploadError)
              }
            }
          }
        }
        
        ElMessage.success('Ticket submitted successfully!')
        // Navigate to my-tickets and trigger refresh
        router.push('/my-tickets')
      } else {
        ElMessage.error(result.message || 'Failed to submit ticket')
      }
    } catch (error) {
      ElMessage.error('An error occurred while submitting the ticket')
    } finally {
      submitting.value = false
    }
  })
}

function handleCancel() {
  router.back()
}
</script>

<style lang="scss" scoped>
.create-ticket-view {
  max-width: 800px;
  margin: 0 auto;
  
  .page-header {
    margin-bottom: 24px;
    
    h1 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .suggestions-card {
    margin-bottom: 24px;
    background: #f0f9eb;
    border-color: #c2e7b0;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #67c23a;
    }
    
    .suggestion-list {
      .suggestion-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 4px 0;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
        
        &:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #409eff;
        }
      }
    }
  }
  
  .form-card {
    :deep(.el-radio) {
      display: flex;
      align-items: flex-start;
      height: auto;
      margin-right: 0;
      margin-bottom: 12px;
      
      .el-radio__label {
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: normal;
      }
    }
    
    .priority-desc {
      color: #999;
      font-size: 12px;
    }
    
    .upload-area {
      width: 100%;
      
      :deep(.el-upload-dragger) {
        width: 100%;
        padding: 40px;
      }
      
      .upload-icon {
        font-size: 48px;
        color: #c0c4cc;
      }
      
      .upload-text {
        color: #606266;
        margin-top: 8px;
        
        em {
          color: #409eff;
          font-style: normal;
        }
      }
      
      .upload-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
      }
    }
  }
}
</style>
