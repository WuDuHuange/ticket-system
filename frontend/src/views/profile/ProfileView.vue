<template>
  <div class="profile-view">
    <div class="page-header">
      <h1>{{ $t('profile.title') }}</h1>
    </div>

    <el-row :gutter="24">
      <!-- Profile Card -->
      <el-col :xs="24" :md="8">
        <el-card class="profile-card">
          <div class="profile-header">
            <el-avatar :size="100" :src="user?.avatar">
              {{ userInitials }}
            </el-avatar>
            <h2>{{ user?.name }}</h2>
            <el-tag :type="getRoleType(user?.role)">{{ formatRole(user?.role) }}</el-tag>
          </div>
          
          <el-divider />
          
          <div class="profile-info">
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <span>{{ user?.email }}</span>
            </div>
            <div class="info-item" v-if="user?.department">
              <el-icon><OfficeBuilding /></el-icon>
              <span>{{ user?.department }}</span>
            </div>
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ $t('profile.joined') }} {{ formatDate(user?.createdAt || new Date().toISOString()) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Stats & Activity -->
      <el-col :xs="24" :md="16">
        <!-- Stats -->
        <el-card class="stats-card">
          <template #header>
            <span>{{ $t('profile.activity') }}</span>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value">{{ stats.totalTickets }}</div>
                <div class="stat-label">{{ $t('profile.totalTickets') }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value">{{ stats.openTickets }}</div>
                <div class="stat-label">{{ $t('profile.openTickets') }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value">{{ stats.resolvedTickets }}</div>
                <div class="stat-label">{{ $t('profile.resolvedTickets') }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- Settings -->
        <el-card class="settings-card">
          <template #header>
            <span>{{ $t('profile.settings') }}</span>
          </template>
          
          <el-form label-position="left" label-width="200px">
            <el-form-item :label="$t('profile.language')">
              <el-select v-model="currentLanguage" @change="handleLanguageChange" style="width: 200px">
                <el-option value="en" label="English">
                  <span>🇺🇸 English</span>
                </el-option>
                <el-option value="zh" label="中文">
                  <span>🇨🇳 中文</span>
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-divider />
            
            <el-form-item :label="$t('profile.emailNotifications')">
              <el-switch v-model="settings.emailNotifications" />
            </el-form-item>
            
            <el-form-item :label="$t('admin.ticketUpdateNotify')">
              <el-switch v-model="settings.ticketUpdates" />
            </el-form-item>
            
            <el-form-item :label="$t('knowledge.title') + ' ' + $t('common.updated')">
              <el-switch v-model="settings.kbUpdates" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSettings">{{ $t('admin.saveChanges') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Recent Activity -->
        <el-card class="activity-card">
          <template #header>
            <span>{{ $t('profile.recentActivity') }}</span>
          </template>
          
          <el-timeline>
            <el-timeline-item
              v-for="activity in recentActivity"
              :key="activity.id"
              :timestamp="formatDate(activity.timestamp, 'datetime')"
              placement="top"
            >
              <span>{{ activity.description }}</span>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore, useTicketStore, useUIStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { Message, OfficeBuilding, Calendar } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/helpers'
import { setLocale, getLocale } from '@/i18n'

const { t, locale } = useI18n()
const userStore = useUserStore()
const ticketStore = useTicketStore()
const uiStore = useUIStore()

// Language settings
const currentLanguage = ref(getLocale())

function handleLanguageChange(lang: 'en' | 'zh') {
  setLocale(lang)
  locale.value = lang
  ElMessage.success(t('messages.languageChanged'))
}

const user = computed(() => userStore.user)
const userInitials = computed(() => {
  const name = user.value?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const stats = computed(() => ({
  totalTickets: ticketStore.pagination.total,
  openTickets: ticketStore.openTickets.length,
  resolvedTickets: ticketStore.resolvedTickets.length
}))

const settings = reactive({
  emailNotifications: true,
  ticketUpdates: true,
  kbUpdates: false
})

const recentActivity = ref([
  { id: '1', description: 'Submitted ticket TKT-2026-0008', timestamp: new Date().toISOString() },
  { id: '2', description: 'Viewed article "How to Connect to Campus WiFi"', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', description: 'Updated profile settings', timestamp: new Date(Date.now() - 172800000).toISOString() }
])

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('nav.myProfile') }
  ])
  
  await ticketStore.fetchMyTickets(1, 10)
})

function formatRole(role?: string): string {
  const roleMap: Record<string, string> = {
    end_user: t('roles.endUser'),
    support_staff: t('roles.supportStaff'),
    manager: t('roles.manager'),
    admin: t('roles.admin')
  }
  return roleMap[role || ''] || role || 'User'
}

function getRoleType(role?: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    end_user: 'info',
    support_staff: 'success',
    manager: 'warning',
    admin: 'danger'
  }
  return typeMap[role || ''] || 'info'
}

function saveSettings() {
  ElMessage.success('Settings saved successfully')
}
</script>

<style lang="scss" scoped>
.profile-view {
  .page-header {
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .profile-card {
    text-align: center;
    margin-bottom: 24px;
    
    .profile-header {
      padding: 20px 0;
      
      .el-avatar {
        margin-bottom: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-size: 36px;
        font-weight: 600;
      }
      
      h2 {
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    
    .profile-info {
      text-align: left;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        color: #666;
        font-size: 14px;
        
        .el-icon {
          color: #409eff;
        }
      }
    }
  }
  
  .stats-card {
    margin-bottom: 24px;
    
    .stat-item {
      text-align: center;
      padding: 20px;
      
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #409eff;
      }
      
      .stat-label {
        font-size: 14px;
        color: #666;
        margin-top: 8px;
      }
    }
  }
  
  .settings-card {
    margin-bottom: 24px;
  }
  
  .activity-card {
    margin-bottom: 24px;
  }
}
</style>
