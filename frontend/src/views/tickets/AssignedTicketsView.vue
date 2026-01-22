<template>
  <div class="assigned-tickets-view">
    <div class="page-header">
      <h1>{{ $t('tickets.assignedToMe') }}</h1>
    </div>

    <!-- Filters -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item :label="$t('common.status')">
          <el-select v-model="filter.status" :placeholder="$t('tickets.filterByStatus')" clearable @change="handleFilter">
            <el-option :label="$t('tickets.statusNew')" value="new" />
            <el-option :label="$t('tickets.statusAssigned')" value="assigned" />
            <el-option :label="$t('tickets.statusInProgress')" value="in_progress" />
            <el-option :label="$t('tickets.statusPendingUser')" value="pending_user" />
            <el-option :label="$t('tickets.statusResolved')" value="resolved" />
            <el-option :label="$t('tickets.statusClosed')" value="closed" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('common.search')">
          <el-input
            v-model="filter.keyword"
            :placeholder="$t('tickets.searchTickets')"
            clearable
            @keyup.enter="handleFilter"
            @clear="handleFilter"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleFilter">{{ $t('common.search') }}</el-button>
          <el-button @click="clearFilter">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Tickets Table -->
    <el-card class="table-card">
      <el-table
        :data="tickets"
        v-loading="loading"
        style="width: 100%"
        @row-click="viewTicket"
        row-class-name="clickable-row"
      >
        <el-table-column prop="id" :label="$t('tickets.ticketId')" width="150" />
        
        <el-table-column prop="title" :label="$t('common.title')" min-width="250">
          <template #default="{ row }">
            <div class="ticket-title">
              <span>{{ row.title }}</span>
              <el-tag v-if="row.slaBreached" type="danger" size="small">SLA</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" :label="$t('common.category')" width="150">
          <template #default="{ row }">
            {{ row.category?.name || 'N/A' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="requesterName" :label="$t('tickets.requester')" width="130" />
        
        <el-table-column prop="status" :label="$t('common.status')" width="130">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" :label="$t('common.priority')" width="110">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small" effect="plain">
              {{ formatPriority(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" :label="$t('common.created')" width="140">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="updatedAt" :label="$t('common.updated')" width="140">
          <template #default="{ row }">
            {{ formatRelativeTime(row.updatedAt) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <el-empty v-if="!loading && tickets.length === 0" :description="$t('tickets.noAssignedTickets')" />

      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="tickets.length > 0">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTicketStore, useUIStore } from '@/stores'
import {
  formatDate,
  formatRelativeTime,
  getStatusType,
  getPriorityType,
  formatPriority
} from '@/utils/helpers'

const router = useRouter()
const { t } = useI18n()
const ticketStore = useTicketStore()
const uiStore = useUIStore()

const loading = computed(() => ticketStore.loading)
const tickets = computed(() => ticketStore.tickets)
const pagination = computed(() => ticketStore.pagination)

const filter = reactive({
  status: '',
  keyword: ''
})

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: t('tickets.statusNew'),
    assigned: t('tickets.statusAssigned'),
    in_progress: t('tickets.statusInProgress'),
    pending_user: t('tickets.statusPendingUser'),
    resolved: t('tickets.statusResolved'),
    closed: t('tickets.statusClosed')
  }
  return statusMap[status] || status
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('nav.assignedTickets') }
  ])
  
  await ticketStore.fetchAssignedTickets(1, 10)
})

// Refresh data when component is activated (from keep-alive cache)
onActivated(async () => {
  await ticketStore.fetchAssignedTickets(1, pagination.value.pageSize || 10, filter.status || undefined)
})

function viewTicket(row: { id: string }) {
  router.push(`/tickets/${row.id}`)
}

async function handleFilter() {
  await ticketStore.fetchAssignedTickets(1, pagination.value.pageSize, filter.status || undefined)
}

async function clearFilter() {
  filter.status = ''
  filter.keyword = ''
  await ticketStore.fetchAssignedTickets(1, pagination.value.pageSize)
}

async function handleSizeChange(size: number) {
  await ticketStore.fetchAssignedTickets(1, size, filter.status || undefined)
}

async function handlePageChange(page: number) {
  await ticketStore.fetchAssignedTickets(page, pagination.value.pageSize, filter.status || undefined)
}
</script>

<style lang="scss" scoped>
.assigned-tickets-view {
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
    :deep(.clickable-row) {
      cursor: pointer;
      
      &:hover {
        background-color: #f5f7fa;
      }
    }
    
    .ticket-title {
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
