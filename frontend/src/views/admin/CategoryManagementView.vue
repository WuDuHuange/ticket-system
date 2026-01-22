<template>
  <div class="category-management">
    <div class="page-header">
      <h1>{{ $t('nav.categoryManagement') || 'Category Management' }}</h1>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>
        {{ $t('common.create') || 'Create Category' }}
      </el-button>
    </div>

    <!-- Categories Table -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="categories"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" :label="$t('common.name') || 'Name'" min-width="180">
          <template #default="{ row }">
            <span class="category-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" :label="$t('common.description') || 'Description'" min-width="250">
          <template #default="{ row }">
            <span class="description-text">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="parent" :label="$t('category.parent') || 'Parent Category'" min-width="150">
          <template #default="{ row }">
            <el-tag v-if="row.parent" type="info" size="small">
              {{ getParentName(row.parent) }}
            </el-tag>
            <span v-else class="no-parent">-</span>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('common.actions') || 'Actions'" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">
              <el-icon><Edit /></el-icon>
              {{ $t('common.edit') || 'Edit' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              {{ $t('common.delete') || 'Delete' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? ($t('category.edit') || 'Edit Category') : ($t('category.create') || 'Create Category')"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item :label="$t('common.name') || 'Name'" prop="name">
          <el-input v-model="form.name" :placeholder="$t('category.namePlaceholder') || 'Enter category name'" />
        </el-form-item>
        
        <el-form-item :label="$t('common.description') || 'Description'" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            :placeholder="$t('category.descriptionPlaceholder') || 'Enter description (optional)'"
          />
        </el-form-item>
        
        <el-form-item :label="$t('category.parent') || 'Parent Category'" prop="parent">
          <el-select
            v-model="form.parent"
            :placeholder="$t('category.selectParent') || 'Select parent category (optional)'"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="cat in availableParents"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') || 'Cancel' }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ $t('common.save') || 'Save' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { categoryApi } from '@/api'
import type { TicketCategory } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

// Initialize i18n
const { t } = useI18n()

// State
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const categories = ref<TicketCategory[]>([])
const editingId = ref<string | null>(null)

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: '',
  parent: null as string | null
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Please enter category name', trigger: 'blur' },
    { min: 2, max: 100, message: 'Name must be 2-100 characters', trigger: 'blur' }
  ]
}

// Computed - available parents (exclude self when editing)
const availableParents = computed(() => {
  if (!isEditing.value || !editingId.value) {
    return categories.value
  }
  return categories.value.filter(c => c.id !== editingId.value)
})

// Methods
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoryApi.getCategories()
    // Handle both direct array and wrapped response
    categories.value = Array.isArray(response) ? response : (response as any).data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error('Failed to load categories')
  } finally {
    loading.value = false
  }
}

const getParentName = (parentId: string) => {
  const parent = categories.value.find(c => c.id === parentId)
  return parent?.name || parentId
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.description = ''
  form.parent = null
  dialogVisible.value = true
}

const openEditDialog = (category: TicketCategory) => {
  isEditing.value = true
  editingId.value = category.id
  form.name = category.name
  form.description = category.description || ''
  form.parent = category.parent || null
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const data = {
        name: form.name,
        description: form.description,
        parent: form.parent
      }
      
      if (isEditing.value && editingId.value) {
        await categoryApi.updateCategory(editingId.value, data)
        ElMessage.success('Category updated successfully')
      } else {
        await categoryApi.createCategory(data)
        ElMessage.success('Category created successfully')
      }
      
      dialogVisible.value = false
      fetchCategories()
    } catch (error: any) {
      console.error('Failed to save category:', error)
      ElMessage.error(error.response?.data?.detail || 'Failed to save category')
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = async (category: TicketCategory) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete category "${category.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await categoryApi.deleteCategory(category.id)
    ElMessage.success('Category deleted successfully')
    fetchCategories()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete category:', error)
      ElMessage.error(error.response?.data?.detail || 'Failed to delete category')
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.table-card {
  border-radius: 8px;
}

.category-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.description-text {
  color: var(--el-text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-parent {
  color: var(--el-text-color-placeholder);
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
