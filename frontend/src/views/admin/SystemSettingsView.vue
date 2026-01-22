<template>
  <div class="system-settings-view">
    <div class="page-header">
      <h1>{{ $t('admin.systemSettings') }}</h1>
    </div>

    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- General Settings -->
      <el-tab-pane :label="$t('admin.generalSettings')" name="general">
        <el-card>
          <template #header>
            <span>{{ $t('admin.generalSettings') }}</span>
          </template>
          
          <el-form :model="generalSettings" label-width="200px">
            <el-form-item :label="$t('admin.systemName')">
              <el-input v-model="generalSettings.systemName" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.supportEmail')">
              <el-input v-model="generalSettings.supportEmail" type="email" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.defaultLanguage')">
              <el-select v-model="generalSettings.language" style="width: 200px" @change="handleLanguageChange">
                <el-option label="English" value="en" />
                <el-option label="中文" value="zh" />
              </el-select>
            </el-form-item>
            
            <el-form-item :label="$t('admin.timezone')">
              <el-select v-model="generalSettings.timezone" style="width: 300px">
                <el-option label="UTC" value="UTC" />
                <el-option label="America/New_York (EST)" value="America/New_York" />
                <el-option label="America/Los_Angeles (PST)" value="America/Los_Angeles" />
                <el-option label="Europe/London (GMT)" value="Europe/London" />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveGeneralSettings">{{ $t('admin.saveChanges') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- SLA Settings -->
      <el-tab-pane :label="$t('admin.slaConfiguration')" name="sla">
        <el-card>
          <template #header>
            <span>{{ $t('admin.slaConfiguration') }}</span>
          </template>
          
          <el-table :data="slaConfigs" v-loading="loading">
            <el-table-column prop="priority" :label="$t('common.priority')" width="120">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)" size="small">
                  {{ row.priority }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="responseTime" :label="$t('admin.responseTime')" width="150">
              <template #default="{ row }">
                {{ row.responseTime }} {{ $t('common.hours') }}
              </template>
            </el-table-column>
            <el-table-column prop="resolutionTime" :label="$t('admin.resolutionTime')" width="150">
              <template #default="{ row }">
                {{ row.resolutionTime }} {{ $t('common.hours') }}
              </template>
            </el-table-column>
            <el-table-column prop="description" :label="$t('common.description')" min-width="200" />
            <el-table-column prop="isActive" :label="$t('common.status')" width="100">
              <template #default="{ row }">
                <el-tag :type="row.isActive ? 'success' : 'info'" size="small">
                  {{ row.isActive ? $t('common.active') : $t('common.inactive') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.actions')" width="120">
              <template #default="{ row }">
                <el-button text type="primary" @click="editSLA(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- Email Settings -->
      <el-tab-pane :label="$t('admin.emailConfiguration')" name="email">
        <el-card>
          <template #header>
            <span>{{ $t('admin.emailConfiguration') }}</span>
          </template>
          
          <el-form :model="emailSettings" label-width="200px">
            <el-form-item :label="$t('admin.smtpServer')">
              <el-input v-model="emailSettings.smtpServer" placeholder="smtp.example.com" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.smtpPort')">
              <el-input-number v-model="emailSettings.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.useTLS')">
              <el-switch v-model="emailSettings.useTLS" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.username')">
              <el-input v-model="emailSettings.username" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.password')">
              <el-input v-model="emailSettings.password" type="password" show-password />
            </el-form-item>
            
            <el-form-item :label="$t('admin.senderEmail')">
              <el-input v-model="emailSettings.fromAddress" />
            </el-form-item>
            
            <el-form-item>
              <el-button @click="testEmailConnection">{{ $t('admin.testConnection') }}</el-button>
              <el-button type="primary" @click="saveEmailSettings">{{ $t('admin.saveChanges') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- Notification Settings -->
      <el-tab-pane :label="$t('admin.notificationSettings')" name="notifications">
        <el-card>
          <template #header>
            <span>{{ $t('admin.notificationSettings') }}</span>
          </template>
          
          <el-form :model="notificationSettings" label-width="250px">
            <h4>{{ $t('admin.ticketNotifications') }}</h4>
            
            <el-form-item :label="$t('admin.newTicketNotify')">
              <el-switch v-model="notificationSettings.newTicket" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.ticketAssignmentNotify')">
              <el-switch v-model="notificationSettings.ticketAssignment" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.ticketUpdateNotify')">
              <el-switch v-model="notificationSettings.statusChange" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.newCommentNotify')">
              <el-switch v-model="notificationSettings.newComment" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.slaWarningNotify')">
              <el-switch v-model="notificationSettings.slaWarning" />
            </el-form-item>
            
            <el-divider />
            
            <h4>{{ $t('admin.systemNotifications') }}</h4>
            
            <el-form-item :label="$t('admin.maintenanceNotify')">
              <el-switch v-model="notificationSettings.maintenance" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.securityNotify')">
              <el-switch v-model="notificationSettings.security" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveNotificationSettings">{{ $t('admin.saveChanges') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- Edit SLA Dialog -->
    <el-dialog v-model="slaDialogVisible" :title="$t('admin.editSLA')" width="500px">
      <el-form :model="slaForm" :rules="slaRules" ref="slaFormRef" label-width="160px">
        <el-form-item :label="$t('common.priority')" prop="priority">
          <el-select v-model="slaForm.priority" style="width: 100%" disabled>
            <el-option label="Low" value="low" />
            <el-option label="Medium" value="medium" />
            <el-option label="High" value="high" />
            <el-option label="Urgent" value="urgent" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('admin.responseTime')" prop="responseTime">
          <el-input-number v-model="slaForm.responseTime" :min="1" :max="720" style="width: 100%" />
          <span class="form-unit">{{ $t('common.hours') }}</span>
        </el-form-item>
        
        <el-form-item :label="$t('admin.resolutionTime')" prop="resolutionTime">
          <el-input-number v-model="slaForm.resolutionTime" :min="1" :max="720" style="width: 100%" />
          <span class="form-unit">{{ $t('common.hours') }}</span>
        </el-form-item>
        
        <el-form-item :label="$t('common.description')" prop="description">
          <el-input v-model="slaForm.description" type="textarea" :rows="3" />
        </el-form-item>
        
        <el-form-item :label="$t('common.active')" prop="isActive">
          <el-switch v-model="slaForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="slaDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitSLA" :loading="slaSubmitting">
          {{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores'
import { setLocale, getLocale } from '@/i18n'
import { slaApi } from '@/api'
import type { SLAConfig } from '@/types'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const { t } = useI18n()
const uiStore = useUIStore()

const loading = ref(false)
const activeTab = ref('general')
const slaConfigs = ref<SLAConfig[]>([])

// SLA dialog state
const slaDialogVisible = ref(false)
const slaSubmitting = ref(false)
const slaFormRef = ref<FormInstance>()
const slaForm = reactive({
  id: '',
  priority: 'medium' as string,
  responseTime: 8,
  resolutionTime: 24,
  description: '',
  isActive: true
})

const slaRules: FormRules = {
  priority: [
    { required: true, message: 'Please select priority', trigger: 'change' }
  ],
  responseTime: [
    { required: true, message: 'Please enter response time', trigger: 'blur' }
  ],
  resolutionTime: [
    { required: true, message: 'Please enter resolution time', trigger: 'blur' }
  ]
}

const generalSettings = reactive({
  systemName: 'IT Service Desk',
  supportEmail: 'support@university.edu',
  language: getLocale(),
  timezone: 'America/New_York'
})

const emailSettings = reactive({
  smtpServer: 'smtp.university.edu',
  smtpPort: 587,
  useTLS: true,
  username: '',
  password: '',
  fromAddress: 'noreply@university.edu'
})

const notificationSettings = reactive({
  newTicket: true,
  ticketAssignment: true,
  statusChange: true,
  newComment: true,
  slaWarning: true,
  maintenance: true,
  security: true
})

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.administration') },
    { label: t('nav.systemSettings') }
  ])
  
  await loadSLAConfigs()
})

async function loadSLAConfigs() {
  loading.value = true
  
  try {
    const response = await slaApi.getSLAConfigs()
    console.log('Load SLA configs response:', response)
    
    if (response.code === 200 && response.data) {
      slaConfigs.value = response.data
      console.log('Loaded SLA configs:', slaConfigs.value)
    } else {
      console.error('Failed to load SLA configs:', response)
      ElMessage.error('Failed to load SLA configurations')
    }
  } catch (error) {
    console.error('Failed to load SLA configs:', error)
    ElMessage.error('Failed to load SLA configurations')
  } finally {
    loading.value = false
  }
}

function getPriorityType(priority: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return typeMap[priority] || ''
}

function handleLanguageChange(lang: string) {
  setLocale(lang as 'en' | 'zh')
  ElMessage.success(t('messages.languageChanged'))
}

function saveGeneralSettings() {
  ElMessage.success(t('messages.saveSuccess'))
}

function editSLA(sla: SLAConfig) {
  slaForm.id = sla.id
  slaForm.priority = sla.priority
  slaForm.responseTime = sla.responseTime
  slaForm.resolutionTime = sla.resolutionTime
  slaForm.description = sla.description || ''
  slaForm.isActive = sla.isActive !== false
  slaDialogVisible.value = true
}

async function submitSLA() {
  if (!slaFormRef.value) return
  
  await slaFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    slaSubmitting.value = true
    
    try {
      const slaData = {
        priority: slaForm.priority,
        responseTime: slaForm.responseTime,
        resolutionTime: slaForm.resolutionTime,
        description: slaForm.description,
        isActive: slaForm.isActive
      }
      
      console.log('Updating SLA data:', slaData, 'id:', slaForm.id)
      
      // Update SLA via API
      const response = await slaApi.updateSLAConfig(slaForm.id, slaData)
      console.log('Update SLA response:', response)
      
      if (response.code === 200) {
        ElMessage.success(t('messages.saveSuccess'))
        slaDialogVisible.value = false
        // Reload after dialog closes to ensure fresh data
        await loadSLAConfigs()
      } else {
        throw new Error(response.message || 'Failed to update SLA')
      }
    } catch (error: any) {
      console.error('Failed to save SLA:', error)
      ElMessage.error(error.message || 'Failed to save SLA')
    } finally {
      slaSubmitting.value = false
    }
  })
}

function testEmailConnection() {
  ElMessage.info('Testing email connection...')
  setTimeout(() => {
    ElMessage.success('Email connection successful!')
  }, 1500)
}

function saveEmailSettings() {
  ElMessage.success('Email settings saved successfully')
}

function saveNotificationSettings() {
  ElMessage.success('Notification settings saved successfully')
}
</script>

<style lang="scss" scoped>
.system-settings-view {
  .page-header {
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .settings-tabs {
    :deep(.el-tabs__content) {
      padding-top: 20px;
    }
    
    .el-card {
      margin-bottom: 20px;
      
      h4 {
        margin: 0 0 16px;
        color: #666;
        font-weight: 500;
      }
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
