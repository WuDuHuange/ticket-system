<template>
  <div class="analytics-view">
    <!-- Stats Overview -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-icon primary">
            <el-icon :size="24"><Tickets /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ analytics?.totalCreated || 0 }}</div>
            <div class="stat-label">{{ $t('admin.totalTickets') }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-icon warning">
            <el-icon :size="24"><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ analytics?.totalOpen || 0 }}</div>
            <div class="stat-label">{{ $t('admin.openTickets') }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-icon success">
            <el-icon :size="24"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ analytics?.totalClosed || 0 }}</div>
            <div class="stat-label">{{ $t('admin.resolved') }}</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-icon info">
            <el-icon :size="24"><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatTime(analytics?.averageResolutionTime) }}</div>
            <div class="stat-label">{{ $t('admin.avgResolution') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- Tickets by Status -->
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <span>{{ $t('admin.ticketsByStatus') }}</span>
          </template>
          
          <div class="chart-placeholder">
            <div class="status-bars">
              <div v-for="(item, index) in statusData" :key="index" class="status-bar-item">
                <div class="bar-label">{{ item.label }}</div>
                <div class="bar-container">
                  <div 
                    class="bar-fill" 
                    :style="{ width: item.percentage + '%', backgroundColor: item.color }"
                  ></div>
                </div>
                <div class="bar-value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Tickets by Priority -->
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <span>{{ $t('admin.ticketsByPriority') }}</span>
          </template>
          
          <div class="chart-placeholder">
            <div class="priority-grid">
              <div v-for="(item, index) in priorityData" :key="index" class="priority-item">
                <div class="priority-value" :style="{ color: item.color }">{{ item.value }}</div>
                <div class="priority-label">{{ item.label }}</div>
                <el-tag :type="item.type" size="small" effect="plain">{{ item.percentage }}%</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Agent Performance -->
    <el-card class="performance-card">
      <template #header>
        <div class="card-header">
          <span>Agent Performance</span>
          <el-select v-model="selectedPeriod" size="small">
            <el-option label="Last 7 Days" value="7d" />
            <el-option label="Last 30 Days" value="30d" />
            <el-option label="This Month" value="month" />
          </el-select>
        </div>
      </template>
      
      <el-table :data="agentPerformance" v-loading="loading">
        <el-table-column prop="agentName" label="Agent" min-width="150">
          <template #default="{ row }">
            <div class="agent-info">
              <el-avatar :size="32">{{ getInitials(row.agentName) }}</el-avatar>
              <span>{{ row.agentName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="teamName" label="Team" width="140" />
        
        <el-table-column prop="resolvedTickets" label="Resolved" width="100" align="center" />
        
        <el-table-column prop="averageResponseTime" label="Avg Response" width="130" align="center">
          <template #default="{ row }">
            {{ row.averageResponseTime }}m
          </template>
        </el-table-column>
        
        <el-table-column prop="averageResolutionTime" label="Avg Resolution" width="130" align="center">
          <template #default="{ row }">
            {{ formatMinutes(row.averageResolutionTime) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="satisfactionScore" label="Satisfaction" width="150" align="center">
          <template #default="{ row }">
            <div class="satisfaction">
              <el-rate
                :model-value="row.satisfactionScore || 0"
                disabled
                :max="5"
                size="small"
              />
              <span>{{ (row.satisfactionScore || 0).toFixed(1) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Recent Activity -->
    <el-card class="activity-card">
      <template #header>
        <span>Recent Activity (Audit Log)</span>
      </template>
      
      <el-table :data="auditLogs" v-loading="loading">
        <el-table-column prop="timestamp" label="Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.timestamp, 'datetime') }}
          </template>
        </el-table-column>
        
        <el-table-column prop="userName" label="User" width="150" />
        
        <el-table-column prop="action" label="Action" width="150">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)" size="small">
              {{ formatAction(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="resourceType" label="Resource" width="120" />
        
        <el-table-column prop="details" label="Details" min-width="200">
          <template #default="{ row }">
            {{ row.details }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores'
import { analyticsApi, auditApi } from '@/api'
import type { TicketAnalytics, AgentPerformance, AuditLog } from '@/types'
import { formatDate } from '@/utils/helpers'
import {
  Tickets,
  Clock,
  CircleCheck,
  Timer
} from '@element-plus/icons-vue'

const { t } = useI18n()
const uiStore = useUIStore()

const loading = ref(false)
const selectedPeriod = ref('30d')
const analytics = ref<TicketAnalytics | null>(null)
const agentPerformance = ref<AgentPerformance[]>([])
const auditLogs = ref<AuditLog[]>([])

const statusData = computed(() => {
  if (!analytics.value) return []
  const byStatus = analytics.value.byStatus
  const total = analytics.value.totalCreated || 1
  return [
    { label: 'New', value: byStatus.new || 0, percentage: ((byStatus.new || 0) / total) * 100, color: '#909399' },
    { label: 'In Progress', value: byStatus.in_progress || 0, percentage: ((byStatus.in_progress || 0) / total) * 100, color: '#e6a23c' },
    { label: 'Resolved', value: byStatus.resolved || 0, percentage: ((byStatus.resolved || 0) / total) * 100, color: '#67c23a' },
    { label: 'Closed', value: byStatus.closed || 0, percentage: ((byStatus.closed || 0) / total) * 100, color: '#409eff' }
  ]
})

const priorityData = computed(() => {
  if (!analytics.value) return []
  const total = analytics.value.totalCreated || 1
  const byPriority = analytics.value.byPriority || { low: 0, medium: 0, high: 0, urgent: 0 }
  return [
    { label: 'Low', value: byPriority.low, percentage: Math.round((byPriority.low / total) * 100), color: '#909399', type: 'info' as const },
    { label: 'Medium', value: byPriority.medium, percentage: Math.round((byPriority.medium / total) * 100), color: '#409eff', type: '' as const },
    { label: 'High', value: byPriority.high, percentage: Math.round((byPriority.high / total) * 100), color: '#e6a23c', type: 'warning' as const },
    { label: 'Urgent', value: byPriority.urgent, percentage: Math.round((byPriority.urgent / total) * 100), color: '#f56c6c', type: 'danger' as const }
  ]
})

function formatTime(minutes?: number): string {
  if (!minutes) return '0h'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.administration') },
    { label: t('nav.analytics') }
  ])
  
  loading.value = true
  
  try {
    const [analyticsRes, performanceRes, logsRes] = await Promise.all([
      analyticsApi.getTicketAnalytics({}).catch(() => ({ code: 500, data: null })),
      analyticsApi.getAgentPerformance({}).catch(() => ({ code: 500, data: [] })),
      auditApi.getAuditLogs({ page: 1, pageSize: 10 }).catch(() => ({ code: 500, data: { items: [] } }))
    ])
    
    if (analyticsRes.code === 200 && analyticsRes.data) {
      analytics.value = analyticsRes.data
    }
    if (performanceRes.code === 200 && performanceRes.data) {
      agentPerformance.value = performanceRes.data
    }
    if (logsRes.code === 200 && logsRes.data) {
      auditLogs.value = logsRes.data.items
    }
  } finally {
    loading.value = false
  }
})

function getActionType(action: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    login: 'info',
    logout: 'info'
  }
  return typeMap[action] || ''
}

function formatAction(action: string): string {
  return action.charAt(0).toUpperCase() + action.slice(1)
}
</script>

<style lang="scss" scoped>
.analytics-view {
  .stats-row {
    margin-bottom: 24px;
    
    .el-col {
      margin-bottom: 16px;
    }
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    
    :deep(.el-card__body) {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      
      &.primary {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
      }
      &.warning {
        background: rgba(230, 162, 60, 0.1);
        color: #e6a23c;
      }
      &.success {
        background: rgba(103, 194, 58, 0.1);
        color: #67c23a;
      }
      &.info {
        background: rgba(144, 147, 153, 0.1);
        color: #909399;
      }
    }
    
    .stat-content {
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        line-height: 1.2;
      }
      
      .stat-label {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  .chart-card {
    margin-bottom: 24px;
    
    .chart-placeholder {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .status-bars {
      width: 100%;
      
      .status-bar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        
        .bar-label {
          width: 100px;
          font-size: 14px;
        }
        
        .bar-container {
          flex: 1;
          height: 24px;
          background: #f5f7fa;
          border-radius: 4px;
          overflow: hidden;
          
          .bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s;
          }
        }
        
        .bar-value {
          width: 40px;
          text-align: right;
          font-weight: 600;
        }
      }
    }
    
    .priority-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      width: 100%;
      
      .priority-item {
        text-align: center;
        
        .priority-value {
          font-size: 32px;
          font-weight: 700;
        }
        
        .priority-label {
          font-size: 14px;
          color: #666;
          margin: 8px 0;
        }
      }
    }
  }
  
  .performance-card {
    margin-bottom: 24px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .agent-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .satisfaction {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .activity-card {
    margin-bottom: 24px;
  }
}
</style>
