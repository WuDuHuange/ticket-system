<template>
  <div class="ticket-list-view">
    <!-- Page Header -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Ticket Management</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="page-title-row">
      <h1>Ticket List</h1>
    </div>

    <!-- Collapsible Ticket Cards -->
    <div class="ticket-cards-container">
      <el-collapse v-model="activeTickets" accordion v-loading="loading">
        <el-collapse-item 
          v-for="ticket in tickets" 
          :key="ticket.id" 
          :name="ticket.id"
          class="ticket-collapse-item"
        >
          <template #title>
            <div class="ticket-collapse-header">
              <span class="ticket-title-text">{{ ticket.title || `Ticket${tickets.indexOf(ticket) + 1}` }}</span>
            </div>
          </template>
          
          <div class="ticket-detail-content">
            <div class="ticket-info-section">
              <!-- Left Info -->
              <div class="info-left">
                <div class="info-row">
                  <span class="info-label">Ticket ID:</span>
                  <span class="info-value">{{ ticket.id }}</span>
                  <span class="info-label" style="margin-left: 40px;">Category:</span>
                  <span class="info-value">{{ ticket.category?.name || 'N/A' }}</span>
                  <span class="sla-tag" :class="getSlaClass(ticket)">
                    SLA: {{ getSlaStatus(ticket) }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Requester:</span>
                  <span class="info-value">{{ ticket.requesterName || 'xxx' }}</span>
                  <span class="info-label" style="margin-left: 40px;">{{ $t('tickets.contactInfo') }}:</span>
                  <span class="info-value">{{ ticket.requesterEmail || 'xxxxxx' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Priority:</span>
                  <el-select 
                    v-model="ticket.priority" 
                    size="small" 
                    style="width: 100px"
                    @change="handlePriorityChange(ticket)"
                  >
                    <el-option label="Low" value="low" />
                    <el-option label="Medium" value="medium" />
                    <el-option label="High" value="high" />
                    <el-option label="Urgent" value="urgent" />
                  </el-select>
                </div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <el-select 
                    v-model="ticket.status" 
                    size="small" 
                    style="width: 120px"
                    @change="handleStatusChange(ticket)"
                  >
                    <el-option label="New" value="new" />
                    <el-option label="Assigned" value="assigned" />
                    <el-option label="In Progress" value="in_progress" />
                    <el-option label="Pending User" value="pending_user" />
                    <el-option label="Resolved" value="resolved" />
                    <el-option label="Closed" value="closed" />
                  </el-select>
                </div>
                <div class="info-row">
                  <span class="info-label">Description:</span>
                </div>
                <div class="description-text">
                  {{ ticket.description || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }}
                </div>
                
                <!-- Attachments -->
                <div class="attachments-section" v-if="ticket.attachments && ticket.attachments.length > 0">
                  <span class="info-label">{{ $t('tickets.attachments') }}:</span>
                  <div class="attachment-list">
                    <div v-for="att in ticket.attachments" :key="att.id" class="attachment-item">
                      <span>- {{ att.filename }}</span>
                      <el-button type="primary" size="small" text>{{ $t('tickets.download') }}</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right - Status Timeline -->
              <div class="info-right">
                <div class="status-timeline">
                  <div class="timeline-item" :class="{ active: isStatusReached(ticket, 'assigned'), current: ticket.status === 'assigned' }">
                    <div class="timeline-dot">
                      <el-icon v-if="isStatusReached(ticket, 'assigned')"><Check /></el-icon>
                    </div>
                    <span class="timeline-label">Assigned</span>
                  </div>
                  <div class="timeline-line" :class="{ active: isStatusReached(ticket, 'in_progress') }"></div>
                  <div class="timeline-item" :class="{ active: isStatusReached(ticket, 'in_progress'), current: ticket.status === 'in_progress' }">
                    <div class="timeline-dot">
                      <span v-if="ticket.status === 'in_progress'" class="step-number">2</span>
                      <el-icon v-else-if="isStatusReached(ticket, 'in_progress')"><Check /></el-icon>
                    </div>
                    <span class="timeline-label">In Progress</span>
                  </div>
                  <div class="timeline-line" :class="{ active: isStatusReached(ticket, 'resolved') }"></div>
                  <div class="timeline-item" :class="{ active: isStatusReached(ticket, 'resolved'), current: ticket.status === 'resolved' }">
                    <div class="timeline-dot">
                      <span v-if="!isStatusReached(ticket, 'resolved')" class="step-number">3</span>
                      <el-icon v-else><Check /></el-icon>
                    </div>
                    <span class="timeline-label">Resolved</span>
                  </div>
                  <div class="timeline-line" :class="{ active: isStatusReached(ticket, 'closed') }"></div>
                  <div class="timeline-item" :class="{ active: isStatusReached(ticket, 'closed'), current: ticket.status === 'closed' }">
                    <div class="timeline-dot">
                      <span v-if="!isStatusReached(ticket, 'closed')" class="step-number">4</span>
                      <el-icon v-else><Check /></el-icon>
                    </div>
                    <span class="timeline-label">Closed</span>
                  </div>
                </div>
                
                <el-button type="primary" text class="see-more-btn" @click="viewTicket(ticket)">
                  {{ $t('tickets.seeMoreDetails') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTicketStore, useUIStore } from '@/stores'
import { Check } from '@element-plus/icons-vue'
import type { Ticket } from '@/types'

const router = useRouter()
const { t } = useI18n()
const ticketStore = useTicketStore()
const uiStore = useUIStore()

const loading = computed(() => ticketStore.loading)
const tickets = computed(() => ticketStore.tickets)

const currentPage = ref(1)
const pageSize = ref(10)
const activeTickets = ref<string[]>([])

const totalCount = computed(() => ticketStore.pagination.total)

// Status order for timeline
const statusOrder = ['new', 'assigned', 'in_progress', 'pending_user', 'resolved', 'closed']

function isStatusReached(ticket: Ticket, status: string): boolean {
  const currentIndex = statusOrder.indexOf(ticket.status)
  const targetIndex = statusOrder.indexOf(status)
  return currentIndex >= targetIndex
}

function getSlaStatus(ticket: Ticket): string {
  if (ticket.slaBreached) return t('tickets.slaBreached')
  // Simple logic - check if deadline is approaching
  if (ticket.slaResolutionDeadline) {
    const deadline = new Date(ticket.slaResolutionDeadline)
    const now = new Date()
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursLeft < 2) return t('tickets.slaAtRisk')
  }
  return t('tickets.slaOnTrack')
}

function getSlaClass(ticket: Ticket): string {
  if (ticket.slaBreached) return 'sla-breached'
  if (ticket.slaResolutionDeadline) {
    const deadline = new Date(ticket.slaResolutionDeadline)
    const now = new Date()
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursLeft < 2) return 'sla-at-risk'
  }
  return 'sla-on-track'
}

function viewTicket(ticket: Ticket) {
  router.push(`/tickets/${ticket.id}`)
}

function handlePriorityChange(ticket: Ticket) {
  // In real app, would call API to update
  console.log('Priority changed:', ticket.id, ticket.priority)
}

function handleStatusChange(ticket: Ticket) {
  // In real app, would call API to update  
  console.log('Status changed:', ticket.id, ticket.status)
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: t('nav.dashboard'), path: '/' },
    { label: t('nav.allTickets') }
  ])
  
  await loadTickets()
})

async function loadTickets() {
  await ticketStore.fetchTickets(currentPage.value, pageSize.value, {})
}

async function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  await loadTickets()
}

async function handlePageChange(page: number) {
  currentPage.value = page
  await loadTickets()
}
</script>

<style lang="scss" scoped>
.ticket-list-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;

  .page-header {
    margin-bottom: 8px;
  }

  .page-title-row {
    margin-bottom: 20px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }
  }

  .ticket-cards-container {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
    
    :deep(.el-collapse) {
      border: none;
      
      .el-collapse-item {
        margin-bottom: 12px;
        border: 1px solid #ebeef5;
        border-radius: 8px;
        overflow: hidden;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .el-collapse-item__header {
          padding: 16px 20px;
          background: #fafafa;
          border-bottom: none;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          height: auto;
          line-height: 1.5;
          
          &.is-active {
            background: #f0f7ff;
            border-bottom: 1px solid #ebeef5;
          }
        }
        
        .el-collapse-item__wrap {
          border-bottom: none;
        }
        
        .el-collapse-item__content {
          padding: 0;
        }
      }
    }
  }

  .ticket-collapse-header {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .ticket-title-text {
      font-weight: 500;
    }
  }

  .ticket-detail-content {
    padding: 20px;
    
    .ticket-info-section {
      display: flex;
      gap: 40px;
      
      .info-left {
        flex: 1;
        
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
          
          .info-label {
            font-weight: 500;
            color: #666;
            min-width: 80px;
          }
          
          .info-value {
            color: #333;
          }
          
          .sla-tag {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-left: auto;
            
            &.sla-on-track {
              background: #e8f5e9;
              color: #4caf50;
            }
            &.sla-at-risk {
              background: #fff3e0;
              color: #ff9800;
            }
            &.sla-breached {
              background: #ffebee;
              color: #f44336;
            }
          }
        }
        
        .description-text {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        
        .attachments-section {
          margin-top: 16px;
          
          .attachment-list {
            margin-top: 8px;
            
            .attachment-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 8px 0;
              
              span {
                color: #666;
              }
            }
          }
        }
      }
      
      .info-right {
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .status-timeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .timeline-item {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .timeline-dot {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #e0e0e0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
              font-size: 12px;
              
              .step-number {
                font-weight: 500;
              }
            }
            
            .timeline-label {
              font-size: 14px;
              color: #999;
              min-width: 80px;
            }
            
            &.active {
              .timeline-dot {
                background: #409eff;
                color: #fff;
              }
              .timeline-label {
                color: #333;
              }
            }
            
            &.current {
              .timeline-dot {
                background: #409eff;
                box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2);
              }
            }
          }
          
          .timeline-line {
            width: 2px;
            height: 24px;
            background: #e0e0e0;
            margin: 4px 0;
            margin-right: 92px;
            
            &.active {
              background: #409eff;
            }
          }
        }
        
        .see-more-btn {
          margin-top: 20px;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 768px) {
  .ticket-list-view {
    .ticket-detail-content {
      .ticket-info-section {
        flex-direction: column;
        
        .info-right {
          width: 100%;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
}
</style>
