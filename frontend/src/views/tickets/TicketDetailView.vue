<template>
  <div class="ticket-detail-view" v-loading="loading">
    <template v-if="ticket">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            {{ $t('common.back') }}
          </el-button>
          <h1>{{ ticket.id }}</h1>
          <el-tag :type="getStatusType(ticket.status)" size="large">
            {{ formatStatus(ticket.status) }}
          </el-tag>
          <el-tag v-if="ticket.slaBreached" type="danger" size="large">
            SLA
          </el-tag>
        </div>
        
        <div class="header-right" v-if="isStaff">
          <el-dropdown @command="handleStatusChange">
            <el-button type="primary">
              {{ $t('tickets.changeStatus') }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="assigned" :disabled="ticket.status === 'assigned'">
                  {{ $t('tickets.assignToMe') }}
                </el-dropdown-item>
                <el-dropdown-item command="in_progress" :disabled="ticket.status === 'in_progress'">
                  {{ $t('tickets.statusInProgress') }}
                </el-dropdown-item>
                <el-dropdown-item command="pending_user" :disabled="ticket.status === 'pending_user'">
                  {{ $t('tickets.statusPendingUser') }}
                </el-dropdown-item>
                <el-dropdown-item command="resolved" :disabled="ticket.status === 'resolved'">
                  {{ $t('tickets.markResolved') }}
                </el-dropdown-item>
                <el-dropdown-item command="closed" :disabled="ticket.status === 'closed'">
                  {{ $t('tickets.closeTicket') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <el-row :gutter="24">
        <!-- Main Content -->
        <el-col :xs="24" :lg="16">
          <!-- Ticket Info -->
          <el-card class="info-card">
            <h2 class="ticket-title">{{ ticket.title }}</h2>
            
            <div class="ticket-meta">
              <span>
                <el-icon><User /></el-icon>
                {{ ticket.requesterName }}
              </span>
              <span>
                <el-icon><Clock /></el-icon>
                {{ formatDate(ticket.createdAt, 'datetime') }}
              </span>
              <span>
                <el-icon><Folder /></el-icon>
                {{ ticket.category?.name || 'General' }}
              </span>
            </div>
            
            <el-divider />
            
            <div class="ticket-description">
              <h3>{{ $t('common.description') }}</h3>
              <p>{{ ticket.description }}</p>
            </div>
            
            <!-- Attachments -->
            <div v-if="ticket.attachments && ticket.attachments.length > 0" class="attachments-section">
              <h3>{{ $t('tickets.attachments') }}</h3>
              <div class="attachment-list">
                <a
                  v-for="attachment in ticket.attachments"
                  :key="attachment.id"
                  class="attachment-item"
                  :href="attachment.url"
                  target="_blank"
                >
                  <el-icon><Document /></el-icon>
                  <span>{{ attachment.filename }}</span>
                  <span class="attachment-size">{{ formatFileSize(attachment.fileSize) }}</span>
                </a>
              </div>
            </div>
          </el-card>

          <!-- Comments Section -->
          <el-card class="comments-card">
            <template #header>
              <div class="card-header">
                <span>{{ $t('tickets.comments') }} ({{ ticket.comments?.length || 0 }})</span>
              </div>
            </template>
            
            <div class="comments-list">
              <div
                v-for="comment in ticket.comments"
                :key="comment.id"
                class="comment-item"
                :class="{ 'internal': comment.isInternal }"
              >
                <div class="comment-header">
                  <div class="comment-author">
                    <el-avatar :size="32">{{ getInitials(comment.authorName) }}</el-avatar>
                    <span class="author-name">{{ comment.authorName }}</span>
                    <el-tag v-if="comment.isInternal" type="warning" size="small">{{ $t('tickets.internalNote') }}</el-tag>
                  </div>
                  <span class="comment-time">{{ formatRelativeTime(comment.createdAt) }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
              
              <el-empty v-if="!ticket.comments?.length" :description="$t('tickets.noComments')" />
            </div>
            
            <!-- Add Comment Form -->
            <div class="add-comment">
              <el-divider />
              <el-form @submit.prevent="submitComment">
                <el-form-item>
                  <el-input
                    v-model="newComment"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('tickets.addCommentPlaceholder')"
                  />
                </el-form-item>
                <div class="comment-actions">
                  <el-checkbox v-if="isStaff" v-model="isInternalComment">
                    {{ $t('tickets.internalNoteDesc') }}
                  </el-checkbox>
                  <el-button type="primary" @click="submitComment" :loading="submitting">
                    {{ $t('tickets.addComment') }}
                  </el-button>
                </div>
              </el-form>
            </div>
          </el-card>
        </el-col>

        <!-- Sidebar -->
        <el-col :xs="24" :lg="8">
          <!-- Details Card -->
          <el-card class="details-card">
            <template #header>
              <span>{{ $t('tickets.ticketDetails') }}</span>
            </template>
            
            <el-descriptions :column="1" border>
              <el-descriptions-item :label="$t('common.status')">
                <el-tag :type="getStatusType(ticket.status)">
                  {{ formatStatus(ticket.status) }}
                </el-tag>
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('common.priority')">
                <el-tag :type="getPriorityType(ticket.priority)" effect="plain">
                  {{ formatPriority(ticket.priority) }}
                </el-tag>
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('common.category')">
                {{ ticket.category?.name || 'General' }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('tickets.channel')">
                {{ ticket.channel }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('tickets.requester')">
                {{ ticket.requesterName }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('common.email')">
                {{ ticket.requesterEmail }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('tickets.assignee')">
                {{ ticket.assigneeName || $t('tickets.unassigned') }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('common.created')">
                {{ formatDate(ticket.createdAt, 'datetime') }}
              </el-descriptions-item>
              
              <el-descriptions-item :label="$t('common.updated')">
                {{ formatDate(ticket.updatedAt, 'datetime') }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- Status History -->
          <el-card class="history-card">
            <template #header>
              <span>{{ $t('tickets.statusHistory') }}</span>
            </template>
            
            <el-timeline>
              <el-timeline-item
                v-for="history in ticket.statusHistory"
                :key="history.id"
                :timestamp="formatDate(history.changedAt, 'datetime')"
                placement="top"
              >
                <div class="history-item">
                  <span class="history-change">
                    {{ formatStatus(history.previousStatus) }}
                    →
                    {{ formatStatus(history.newStatus) }}
                  </span>
                  <span class="history-by">by {{ history.changedBy }}</span>
                  <p v-if="history.comment" class="history-comment">{{ history.comment }}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
            
            <el-empty v-if="!ticket.statusHistory?.length" :description="$t('tickets.noHistory')" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- Not Found -->
    <el-empty v-else-if="!loading" :description="$t('tickets.ticketNotFound')">
      <el-button type="primary" @click="goBack">{{ $t('knowledge.goBack') }}</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTicketStore, useUserStore, useUIStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  ArrowDown,
  User,
  Clock,
  Folder,
  Document
} from '@element-plus/icons-vue'
import {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  getStatusType,
  getPriorityType,
  formatPriority
} from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const ticketStore = useTicketStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const loading = computed(() => ticketStore.loading)
const ticket = computed(() => ticketStore.currentTicket)
const isStaff = computed(() => userStore.isStaff)

const newComment = ref('')
const isInternalComment = ref(false)
const submitting = ref(false)

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
  const ticketId = route.params.id as string
  await ticketStore.fetchTicketById(ticketId)
  
  if (ticket.value) {
    uiStore.setBreadcrumbs([
      { label: t('nav.dashboard'), path: '/' },
      { label: t('nav.tickets'), path: '/my-tickets' },
      { label: ticket.value.id }
    ])
  }
})

// Watch for route changes to reload ticket data
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await ticketStore.fetchTicketById(newId as string)
    if (ticket.value) {
      uiStore.setBreadcrumbs([
        { label: t('nav.dashboard'), path: '/' },
        { label: t('nav.tickets'), path: '/my-tickets' },
        { label: ticket.value.id }
      ])
    }
  }
})

function goBack() {
  router.back()
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

async function handleStatusChange(status: string) {
  if (!ticket.value) return
  
  try {
    const { value: comment } = await ElMessageBox.prompt(
      t('tickets.statusChangeComment'),
      t('tickets.changeStatus'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        inputType: 'textarea'
      }
    )
    
    const result = await ticketStore.updateTicketStatus(ticket.value.id, status, comment)
    
    if (result.success) {
      ElMessage.success(t('tickets.statusUpdated'))
    } else {
      ElMessage.error(result.message || t('errors.operationFailed'))
    }
  } catch {
    // User cancelled
  }
}

async function submitComment() {
  if (!ticket.value || !newComment.value.trim()) {
    ElMessage.warning(t('tickets.enterComment'))
    return
  }
  
  submitting.value = true
  
  try {
    const result = await ticketStore.addComment(
      ticket.value.id,
      newComment.value,
      isInternalComment.value
    )
    
    if (result.success) {
      ElMessage.success(t('tickets.commentAdded'))
      newComment.value = ''
      isInternalComment.value = false
    } else {
      ElMessage.error(result.message || t('errors.operationFailed'))
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.ticket-detail-view {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  
  .info-card {
    margin-bottom: 24px;
    
    .ticket-title {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 600;
    }
    
    .ticket-meta {
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
    
    .ticket-description {
      h3 {
        font-size: 16px;
        margin: 0 0 12px;
      }
      
      p {
        margin: 0;
        line-height: 1.6;
        white-space: pre-wrap;
      }
    }
    
    .attachments-section {
      margin-top: 24px;
      
      h3 {
        font-size: 16px;
        margin: 0 0 12px;
      }
      
      .attachment-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        
        .attachment-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f5f7fa;
          border-radius: 4px;
          font-size: 14px;
          
          .attachment-size {
            color: #999;
          }
        }
      }
    }
  }
  
  .comments-card {
    margin-bottom: 24px;
    
    .comments-list {
      .comment-item {
        padding: 16px;
        margin-bottom: 16px;
        background: #f9f9f9;
        border-radius: 8px;
        
        &.internal {
          background: #fef9e7;
          border-left: 3px solid #e6a23c;
        }
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .comment-author {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .author-name {
              font-weight: 500;
            }
          }
          
          .comment-time {
            color: #999;
            font-size: 12px;
          }
        }
        
        .comment-content {
          line-height: 1.6;
          white-space: pre-wrap;
        }
      }
    }
    
    .add-comment {
      .comment-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  
  .details-card,
  .history-card {
    margin-bottom: 24px;
  }
  
  .history-card {
    .history-item {
      .history-change {
        font-weight: 500;
      }
      
      .history-by {
        display: block;
        color: #666;
        font-size: 12px;
        margin-top: 4px;
      }
      
      .history-comment {
        margin: 8px 0 0;
        padding: 8px;
        background: #f5f7fa;
        border-radius: 4px;
        font-size: 13px;
      }
    }
  }
}
</style>
