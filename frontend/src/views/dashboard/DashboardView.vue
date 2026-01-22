<template>
  <div class="dashboard">
    <!-- Stats Cards Row -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card-danger">
          <div class="stat-content">
            <div class="stat-value">{{ stats.openTickets }}</div>
            <div class="stat-label">{{ $t('dashboard.openTickets') }}</div>
          </div>
          <div class="stat-icon">
            <el-icon :size="24" color="#f56c6c"><WarningFilled /></el-icon>
          </div>
          <!-- Open tickets: increase is bad (red), decrease is good (green) -->
          <div class="stat-change" :class="getChangeClass(statsChange.openTickets, true)">
            <el-icon><component :is="statsChange.openTickets >= 0 ? Top : Bottom" /></el-icon>
            {{ Math.abs(statsChange.openTickets).toFixed(1) }}% {{ $t('dashboard.fromYesterday') }}
          </div>
        </div>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card-primary">
          <div class="stat-content">
            <div class="stat-value">{{ stats.inProgressTickets }}</div>
            <div class="stat-label">{{ $t('dashboard.inProgress') }}</div>
          </div>
          <div class="stat-icon">
            <el-icon :size="24" color="#409eff"><Refresh /></el-icon>
          </div>
          <!-- In progress: neutral, just show direction -->
          <div class="stat-change" :class="statsChange.inProgressTickets >= 0 ? 'up neutral' : 'down neutral'">
            <el-icon><component :is="statsChange.inProgressTickets >= 0 ? Top : Bottom" /></el-icon>
            {{ Math.abs(statsChange.inProgressTickets).toFixed(1) }}% {{ $t('dashboard.fromYesterday') }}
          </div>
        </div>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card-warning">
          <div class="stat-content">
            <div class="stat-value">{{ stats.overdueTickets }}</div>
            <div class="stat-label">{{ $t('dashboard.overdue') }}</div>
          </div>
          <div class="stat-icon">
            <el-icon :size="24" color="#e6a23c"><Clock /></el-icon>
          </div>
          <!-- Overdue: increase is bad (red), decrease is good (green) -->
          <div class="stat-change" :class="getChangeClass(statsChange.overdueTickets, true)">
            <el-icon><component :is="statsChange.overdueTickets >= 0 ? Top : Bottom" /></el-icon>
            {{ Math.abs(statsChange.overdueTickets).toFixed(1) }}% {{ $t('dashboard.fromYesterday') }}
          </div>
        </div>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card-success">
          <div class="stat-content">
            <div class="stat-value">{{ stats.resolvedToday }}</div>
            <div class="stat-label">{{ $t('dashboard.resolvedToday') }}</div>
          </div>
          <div class="stat-icon">
            <el-icon :size="24" color="#67c23a"><CircleCheck /></el-icon>
          </div>
          <!-- Resolved: increase is good (green), decrease is bad (red) -->
          <div class="stat-change" :class="getChangeClass(statsChange.resolvedToday, false)">
            <el-icon><component :is="statsChange.resolvedToday >= 0 ? Top : Bottom" /></el-icon>
            {{ Math.abs(statsChange.resolvedToday).toFixed(1) }}% {{ $t('dashboard.fromYesterday') }}
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Quick Actions + SLA Alert Row -->
    <el-row :gutter="20" class="actions-row">
      <el-col :xs="24" :lg="14">
        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h3 class="section-title">{{ $t('dashboard.quickActions') }}</h3>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="action-card action-card-blue" @click="goTo('/tickets/create')">
                <el-icon :size="24"><Plus /></el-icon>
                <span>create</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="action-card action-card-green" @click="goTo('/knowledge')">
                <el-icon :size="24"><Search /></el-icon>
                <span>search knowledge</span>
              </div>
            </el-col>
            <el-col :span="12" v-if="canViewAnalytics">
              <div class="action-card action-card-pink" @click="goTo('/admin/analytics')">
                <el-icon :size="24"><DataAnalysis /></el-icon>
                <span>analytics</span>
              </div>
            </el-col>
            <el-col :span="12" v-if="isAdmin">
              <div class="action-card action-card-purple" @click="goTo('/admin/users')">
                <el-icon :size="24"><UserFilled /></el-icon>
                <span>user management</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      
      <!-- SLA Alert Panel - Only visible to managers, admins, and support staff -->
      <el-col :xs="24" :lg="10" v-if="canViewSLAAlerts">
        <div class="sla-alert-section">
          <h3 class="section-title">{{ $t('dashboard.slaAlert') }}</h3>
          <div class="sla-alert-list" v-if="slaAlerts.length > 0">
            <div v-for="alert in slaAlerts" :key="alert.id" class="sla-alert-item">
              <div class="alert-icon" :class="alert.type">
                <el-icon v-if="alert.type === 'danger'"><WarningFilled /></el-icon>
                <el-icon v-else-if="alert.type === 'warning'"><Clock /></el-icon>
                <el-icon v-else><Bell /></el-icon>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-desc">{{ alert.description }}</div>
              </div>
              <div class="alert-time">{{ alert.time }}</div>
            </div>
          </div>
          <div v-else class="no-alerts">
            <el-icon :size="32" color="#67c23a"><CircleCheck /></el-icon>
            <p>{{ $t('dashboard.noSLAAlerts') }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Charts Row - Only visible to managers and admins (Analytics module) -->
    <el-row :gutter="20" class="charts-row" v-if="canViewAnalytics">
      <el-col :xs="24" :lg="14">
        <div class="chart-section">
          <div class="chart-header">
            <h3 class="section-title">{{ $t('dashboard.ticketTrend') }}</h3>
            <div class="chart-tabs">
              <span class="tab" :class="{ active: trendTab === 'monthly' }" @click="trendTab = 'monthly'">{{ $t('dashboard.monthly') }}</span>
              <span class="tab" :class="{ active: trendTab === 'quarterly' }" @click="trendTab = 'quarterly'">{{ $t('dashboard.quarterly') }}</span>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="trend-chart">
              <div v-for="(value, index) in trendData" :key="index" class="bar-wrapper" v-show="trendLabels[index]">
                <div class="bar" :style="{ height: value + '%' }"></div>
                <span class="bar-label">{{ trendLabels[index] }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :lg="10">
        <div class="chart-section">
          <div class="chart-header">
            <h3 class="section-title">{{ $t('dashboard.categoryDistribution') }}</h3>
            <span class="chart-subtitle">{{ $t('dashboard.allTickets') }}</span>
          </div>
          <div class="chart-placeholder">
            <div class="pie-chart-placeholder" v-if="categoryData.length > 0">
              <div class="pie-chart" :style="pieChartStyle"></div>
              <div class="pie-legend">
                <div class="legend-item" v-for="(item, index) in categoryData" :key="index">
                  <span class="legend-color" :style="{ background: item.color }"></span>
                  <span class="legend-label">{{ item.name }}</span>
                  <span class="legend-value">{{ item.value }}%</span>
                </div>
              </div>
            </div>
            <div class="no-data" v-else>
              <el-icon :size="48" color="#909399"><DataAnalysis /></el-icon>
              <p>{{ $t('common.noData') }}</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Latest Tickets Section -->
    <div class="latest-tickets-section">
      <div class="section-header">
        <h3 class="section-title">{{ $t('dashboard.latestTickets') }}</h3>
        <el-button text type="primary" @click="goTo('/tickets')">
          {{ $t('dashboard.viewAll') }}
        </el-button>
      </div>
      
      <el-table :data="recentTickets" style="width: 100%" v-loading="loading" class="latest-tickets-table">
        <el-table-column prop="id" :label="$t('dashboard.ticketNo')" width="160" />
        <el-table-column prop="requesterName" :label="$t('dashboard.customer')" width="120">
          <template #default>xxx</template>
        </el-table-column>
        <el-table-column prop="category" :label="$t('common.category')" min-width="140">
          <template #default="{ row }">
            {{ row.category?.name || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" :label="$t('common.priority')" width="100">
          <template #default="{ row }">
            {{ formatPriority(row.priority) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')" width="120">
          <template #default="{ row }">
            <span :class="['status-text', `status-${row.status}`]">
              {{ formatStatus(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('dashboard.operation')" width="160">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="goTo(`/tickets/${row.id}`)">
              {{ $t('dashboard.detailed') }}
            </el-button>
            <el-button text type="primary" size="small" @click="goTo(`/tickets/${row.id}`)">
              {{ $t('dashboard.process') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore, useTicketStore, useUIStore } from '@/stores'
import { ticketApi, analyticsApi } from '@/api'
import type { Ticket } from '@/types'
import {
  Clock,
  CircleCheck,
  Plus,
  Search,
  DataAnalysis,
  UserFilled,
  WarningFilled,
  Bell,
  Top,
  Bottom,
  Refresh
} from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const ticketStore = useTicketStore()
const uiStore = useUIStore()

const loading = ref(false)
const recentTickets = ref<Ticket[]>([])
const allTicketsForStats = ref<Ticket[]>([])
const trendTab = ref('monthly')

// Permission checks based on role
const isAdmin = computed(() => userStore.isAdmin)
const isManager = computed(() => userStore.isManager)
const isSupportStaff = computed(() => userStore.user?.role === 'support_staff')

// Analytics can only be viewed by managers and admins (REQ-RPT-1)
const canViewAnalytics = computed(() => isAdmin.value || isManager.value)

// SLA Alerts can be viewed by managers, admins, and assigned support staff
const canViewSLAAlerts = computed(() => isAdmin.value || isManager.value || isSupportStaff.value)

// SLA Alerts - will be populated based on real ticket data
const slaAlerts = ref<{id: number; type: string; title: string; description: string; time: string}[]>([])

// Trend data - ticket submission counts by month (real data)
const trendData = ref<number[]>([0, 0, 0, 0, 0, 0])
const trendLabels = ref<string[]>([])

// Category data - from real ticket categories
const categoryData = ref<{name: string; value: number; color: string}[]>([])

// Stats - calculated from real ticket data
const todayStats = ref({ open: 0, inProgress: 0, overdue: 0, resolved: 0 })
const yesterdayStats = ref({ open: 0, inProgress: 0, overdue: 0, resolved: 0 })

// Stats change percentages (calculated from real comparison)
const statsChange = computed(() => {
  const calcChange = (today: number, yesterday: number): number => {
    if (yesterday === 0) return today > 0 ? 100 : 0
    return +((today - yesterday) / yesterday * 100).toFixed(1)
  }
  
  return {
    openTickets: calcChange(todayStats.value.open, yesterdayStats.value.open),
    inProgressTickets: calcChange(todayStats.value.inProgress, yesterdayStats.value.inProgress),
    overdueTickets: calcChange(todayStats.value.overdue, yesterdayStats.value.overdue),
    resolvedToday: calcChange(todayStats.value.resolved, yesterdayStats.value.resolved)
  }
})

// Current stats display values
const stats = computed(() => ({
  openTickets: todayStats.value.open,
  inProgressTickets: todayStats.value.inProgress,
  overdueTickets: todayStats.value.overdue,
  resolvedToday: todayStats.value.resolved
}))

// Calculate pie chart gradient style
const pieChartStyle = computed(() => {
  if (categoryData.value.length === 0) return {}
  
  let gradientParts: string[] = []
  let currentDeg = 0
  
  categoryData.value.forEach((item) => {
    const nextDeg = currentDeg + (item.value / 100) * 360
    gradientParts.push(`${item.color} ${currentDeg}deg ${nextDeg}deg`)
    currentDeg = nextDeg
  })
  
  return {
    background: `conic-gradient(${gradientParts.join(', ')})`
  }
})

onMounted(async () => {
  uiStore.setBreadcrumbs([{ label: t('nav.dashboard') }])
  
  loading.value = true
  
  try {
    // Load all tickets for statistics (use a larger page size)
    await loadAllTicketsForStats()
    
    // Get recent tickets for display
    recentTickets.value = allTicketsForStats.value.slice(0, 5)
    
    // Calculate real statistics
    calculateRealStats()
    
    // Calculate category distribution from real tickets
    calculateCategoryDistribution()
    
    // Calculate ticket submission trend from real data
    calculateTicketTrend()
    
    // Generate SLA alerts from real tickets
    if (canViewSLAAlerts.value) {
      generateSLAAlerts()
    }
  } finally {
    loading.value = false
  }
})

// Watch for trend tab changes
watch(trendTab, () => {
  calculateTicketTrend()
})

// Helper function to convert snake_case to camelCase for ticket data
function normalizeTicketData(ticket: any): Ticket {
  return {
    ...ticket,
    // Map snake_case fields to camelCase (backend returns snake_case)
    createdAt: ticket.createdAt || ticket.created_at,
    updatedAt: ticket.updatedAt || ticket.updated_at,
    resolvedAt: ticket.resolvedAt || ticket.resolved_at,
    closedAt: ticket.closedAt || ticket.closed_at,
    requesterId: ticket.requesterId || ticket.requester_id,
    requesterName: ticket.requesterName || ticket.requester_name,
    assigneeId: ticket.assigneeId || ticket.assignee_id,
    assigneeName: ticket.assigneeName || ticket.assignee_name,
    teamId: ticket.teamId || ticket.team_id,
    teamName: ticket.teamName || ticket.team_name,
    slaBreached: ticket.slaBreached ?? ticket.sla_breached ?? false,
    slaResponseDeadline: ticket.slaResponseDeadline || ticket.sla_response_deadline,
    slaResolutionDeadline: ticket.slaResolutionDeadline || ticket.sla_resolution_deadline,
  }
}

async function loadAllTicketsForStats() {
  try {
    // Try to get all tickets (for admin/manager) or my tickets (for others)
    let response
    console.log('User role check - isAdmin:', isAdmin.value, 'isManager:', isManager.value, 'user:', userStore.user)
    
    if (isAdmin.value || isManager.value) {
      console.log('Fetching all tickets as admin/manager')
      response = await ticketApi.getTickets({ page: 1, pageSize: 100 })
    } else {
      console.log('Fetching my tickets as regular user')
      response = await ticketApi.getMyTickets({ page: 1, pageSize: 100 })
    }
    
    console.log('Tickets API raw response:', response)
    console.log('Response data:', response.data)
    
    if (response.code === 200 && response.data) {
      const items = (response.data as any).items || (response.data as any).results || response.data
      console.log('Extracted items:', items)
      const rawTickets = Array.isArray(items) ? items : []
      // Normalize field names from snake_case to camelCase
      allTicketsForStats.value = rawTickets.map(normalizeTicketData)
      console.log('Normalized tickets:', allTicketsForStats.value.length)
      if (allTicketsForStats.value.length > 0) {
        console.log('Sample normalized ticket:', allTicketsForStats.value[0])
      }
    } else {
      console.error('API returned non-200 code or no data:', response)
    }
  } catch (error) {
    console.error('Failed to load tickets for stats:', error)
    allTicketsForStats.value = []
  }
}

function calculateRealStats() {
  const tickets = allTicketsForStats.value
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayEnd = todayStart
  
  // Today's stats
  todayStats.value = {
    open: tickets.filter(t => ['new', 'assigned'].includes(t.status)).length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    overdue: tickets.filter(t => t.slaBreached).length,
    resolved: tickets.filter(t => {
      if (!['resolved', 'closed'].includes(t.status)) return false
      const resolvedDate = new Date(t.updatedAt || t.createdAt)
      return resolvedDate >= todayStart
    }).length
  }
  
  // Yesterday's stats (approximate based on creation dates)
  // Count tickets that were open/in_progress yesterday
  const ticketsExistedYesterday = tickets.filter(t => {
    const created = new Date(t.createdAt)
    return created < yesterdayEnd
  })
  
  yesterdayStats.value = {
    open: Math.max(0, todayStats.value.open - tickets.filter(t => {
      const created = new Date(t.createdAt)
      return created >= todayStart && ['new', 'assigned'].includes(t.status)
    }).length),
    inProgress: Math.max(0, todayStats.value.inProgress - tickets.filter(t => {
      const created = new Date(t.createdAt)
      return created >= todayStart && t.status === 'in_progress'
    }).length),
    overdue: Math.max(0, todayStats.value.overdue - 1), // Assume 1 less overdue yesterday
    resolved: tickets.filter(t => {
      if (!['resolved', 'closed'].includes(t.status)) return false
      const resolvedDate = new Date(t.updatedAt || t.createdAt)
      return resolvedDate >= yesterdayStart && resolvedDate < yesterdayEnd
    }).length
  }
}

function calculateCategoryDistribution() {
  const tickets = allTicketsForStats.value
  const colors: string[] = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#9C27B0', '#00BCD4']
  
  // Count tickets by category
  const categoryCount: Record<string, number> = {}
  tickets.forEach(ticket => {
    const categoryName = ticket.category?.name || 'Uncategorized'
    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
  })
  
  // Convert to array and calculate percentages
  const total = tickets.length || 1
  const categories = Object.entries(categoryCount)
    .map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[index % colors.length] as string
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Limit to 6 categories
  
  // Ensure percentages add up to 100
  if (categories.length > 0) {
    const sum = categories.reduce((acc, c) => acc + c.value, 0)
    if (sum !== 100 && sum > 0 && categories[0]) {
      categories[0].value += (100 - sum)
    }
  }
  
  categoryData.value = categories
}

function calculateTicketTrend() {
  const tickets = allTicketsForStats.value;
  const now = new Date();

  console.log("Calculating ticket trend, total tickets:", tickets.length);
  if (tickets.length > 0 && tickets[0]) {
    console.log(
      "First ticket createdAt:",
      tickets[0].createdAt,
      "parsed:",
      new Date(tickets[0].createdAt || "")
    );
  }

  if (trendTab.value === "monthly") {
    // Get last 6 months
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = [];
    const counts = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      console.log(
        `Month: ${monthNames[date.getMonth()]}, Start: ${monthStart}, End: ${monthEnd}`
      );

      const count = tickets.filter((t) => {
        const created = new Date(t.createdAt);
        return created >= monthStart && created <= monthEnd;
      }).length;

      counts.push(count);
      labels.push(monthNames[date.getMonth()] || "N/A");
    }

    console.log("Monthly counts:", counts, "labels:", labels);

    // Normalize to percentages for display (minimum 5% for visibility)
    const maxCount = Math.max(...counts, 1);
    trendData.value = counts.map((c) => {
      if (c === 0) return 0;
      return Math.max(Math.round((c / maxCount) * 100), 5);
    });
    trendLabels.value = labels;
  } else {
    // Quarterly view
    const labels = ["Q1", "Q2", "Q3", "Q4"];
    const counts = [0, 0, 0, 0];

    tickets.forEach((t) => {
      const created = new Date(t.createdAt);
      if (created.getFullYear() === now.getFullYear()) {
        const quarter = Math.floor(created.getMonth() / 3);
        if (quarter >= 0 && quarter < counts.length) {
          counts[quarter] = (counts[quarter] || 0) + 1;
        }
      }
    });

    console.log("Quarterly counts:", counts);

    const maxCount = Math.max(...counts, 1);
    trendData.value = [
      ...counts.map((c) => {
        if (c === 0) return 0;
        return Math.max(Math.round((c / maxCount) * 100), 5);
      }),
      0,
      0,
    ];
    trendLabels.value = [...labels, "", ""];
  }
}

function generateSLAAlerts() {
  const tickets = allTicketsForStats.value
  const alerts: typeof slaAlerts.value = []
  let alertId = 1
  
  // Check for SLA breached tickets
  const breachedTickets = tickets.filter(t => t.slaBreached)
  breachedTickets.forEach(ticket => {
    alerts.push({
      id: alertId++,
      type: 'danger',
      title: t('dashboard.slaBreached'),
      description: ticket.title.substring(0, 50) + (ticket.title.length > 50 ? '...' : ''),
      time: t('dashboard.overdue')
    })
  })
  
  // Check for urgent tickets approaching deadline
  const urgentTickets = tickets.filter(t => 
    t.priority === 'urgent' && 
    ['new', 'assigned', 'in_progress'].includes(t.status) &&
    !t.slaBreached
  )
  urgentTickets.forEach(ticket => {
    alerts.push({
      id: alertId++,
      type: 'warning',
      title: t('tickets.priorityUrgent'),
      description: ticket.title.substring(0, 50) + (ticket.title.length > 50 ? '...' : ''),
      time: t('dashboard.urgentTicketAlert')
    })
  })
  
  // Check for high priority tickets awaiting assignment
  const highPriorityTickets = tickets.filter(t => 
    t.priority === 'high' && 
    ['new', 'assigned'].includes(t.status) &&
    !t.slaBreached
  )
  highPriorityTickets.slice(0, 2).forEach(ticket => {
    alerts.push({
      id: alertId++,
      type: 'info',
      title: t('tickets.priorityHigh'),
      description: ticket.title.substring(0, 50) + (ticket.title.length > 50 ? '...' : ''),
      time: t('dashboard.awaitingAssignment')
    })
  })
  
  // Limit to 5 alerts
  slaAlerts.value = alerts.slice(0, 5)
}

function goTo(path: string) {
  router.push(path)
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: t('tickets.statusNew'),
    assigned: t('tickets.statusAssigned'),
    in_progress: t('tickets.statusInProgress'),
    pending_user: t('tickets.statusPendingUser'),
    resolved: t('tickets.statusResolved'),
    closed: t('tickets.statusClosed'),
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

function formatPriority(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

// Get CSS class for change indicator based on value and metric type
// For "bad" metrics (open tickets, overdue), increase = red, decrease = green
// For "good" metrics (resolved), increase = green, decrease = red
function getChangeClass(change: number, increaseIsBad: boolean): string {
  if (change > 0) {
    return increaseIsBad ? 'up bad' : 'up good'
  } else if (change < 0) {
    return increaseIsBad ? 'down good' : 'down bad'
  } else {
    return 'neutral'
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .stats-row {
    margin-bottom: 20px;
    
    .el-col {
      margin-bottom: 16px;
    }
  }
  
  .stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    
    .stat-content {
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        line-height: 1.2;
        color: #333;
      }
      
      .stat-label {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-change {
      width: 100%;
      margin-top: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      
      // Default colors based on direction
      &.up { color: #f56c6c; }
      &.down { color: #67c23a; }
      
      // Semantic colors override direction colors
      &.bad { color: #f56c6c !important; }  // Red for bad changes
      &.good { color: #67c23a !important; }  // Green for good changes
      &.neutral { color: #909399 !important; }  // Gray for neutral
    }
    
    &.stat-card-danger .stat-icon { background: rgba(245, 108, 108, 0.1); }
    &.stat-card-primary .stat-icon { background: rgba(64, 158, 255, 0.1); }
    &.stat-card-warning .stat-icon { background: rgba(230, 162, 60, 0.1); }
    &.stat-card-success .stat-icon { background: rgba(103, 194, 58, 0.1); }
  }

  .actions-row {
    margin-bottom: 20px;
  }

  .quick-actions-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    height: 100%;
    
    .section-title {
      margin-bottom: 16px;
    }
    
    .action-card {
      border-radius: 10px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-bottom: 16px;
      color: #fff;
      font-weight: 500;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &.action-card-blue { background: linear-gradient(135deg, #409eff, #66b1ff); }
      &.action-card-green { background: linear-gradient(135deg, #67c23a, #85ce61); }
      &.action-card-pink { background: linear-gradient(135deg, #f56c6c, #f89898); }
      &.action-card-purple { background: linear-gradient(135deg, #9c27b0, #ba68c8); }
    }
  }

  .sla-alert-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    height: 100%;
    
    .section-title {
      margin-bottom: 16px;
    }
    
    .no-alerts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #67c23a;
      
      p {
        margin-top: 12px;
        font-size: 14px;
        color: #999;
      }
    }
    
    .sla-alert-list {
      .sla-alert-item {
        display: grid;
        grid-template-columns: 40px 1fr auto;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid #eee;
        align-items: start;
        
        &:last-child {
          border-bottom: none;
        }
        
        .alert-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &.danger {
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }
          &.warning {
            background: rgba(230, 162, 60, 0.1);
            color: #e6a23c;
          }
          &.info {
            background: rgba(64, 158, 255, 0.1);
            color: #409eff;
          }
        }
        
        .alert-content {
          min-width: 0;
          
          .alert-title {
            font-weight: 600;
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }
          
          .alert-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.5;
          }
        }
        
        .alert-time {
          font-size: 12px;
          color: #e6a23c;
          text-align: right;
          white-space: nowrap;
        }
      }
    }
  }

  .charts-row {
    margin-bottom: 20px;
  }

  .chart-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .chart-tabs {
        display: flex;
        gap: 16px;
        
        .tab {
          font-size: 14px;
          color: #999;
          cursor: pointer;
          padding: 4px 0;
          
          &.active {
            color: #409eff;
            border-bottom: 2px solid #409eff;
          }
        }
      }
      
      .chart-subtitle {
        font-size: 14px;
        color: #999;
      }
    }
    
    .chart-placeholder {
      height: 200px;
      
      .trend-chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 100%;
        padding: 0 20px;
        
        .bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          /* Ensure the wrapper has explicit height so child .bar percentage heights work */
          height: 100%;
          justify-content: flex-end;
          
          .bar {
            width: 40px;
            background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
            border-radius: 4px 4px 0 0;
            transition: height 0.3s;
            /* Ensure a visible minimum so tiny percentages are still perceptible */
            min-height: 4px;
          }
          
          .bar-label {
            font-size: 12px;
            color: #999;
          }
        }
      }
      
      .pie-chart-placeholder {
        display: flex;
        align-items: center;
        gap: 30px;
        height: 100%;
        
        .pie-chart {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(
            #409eff 0% 35%,
            #67c23a 35% 60%,
            #e6a23c 60% 80%,
            #f56c6c 80% 95%,
            #909399 95% 100%
          );
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: #fff;
            border-radius: 50%;
          }
        }
        
        .pie-legend {
          flex: 1;
          
          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            
            .legend-color {
              width: 12px;
              height: 12px;
              border-radius: 3px;
            }
            
            .legend-label {
              flex: 1;
              font-size: 13px;
              color: #666;
            }
            
            .legend-value {
              font-size: 13px;
              font-weight: 600;
              color: #333;
            }
          }
        }
      }
    }
  }

  .latest-tickets-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .latest-tickets-table {
      .status-text {
        font-weight: 500;
        
        &.status-new { color: #409eff; }
        &.status-assigned { color: #e6a23c; }
        &.status-in_progress { color: #409eff; }
        &.status-pending_user { color: #e6a23c; }
        &.status-resolved { color: #67c23a; }
        &.status-closed { color: #909399; }
      }
    }
  }
}
</style>
