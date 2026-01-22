<template>
  <div class="main-layout">
    <el-container class="layout-container">
      <!-- Sidebar -->
      <el-aside :width="sidebarWidth" class="sidebar">
        <div class="logo-container">
          <el-icon :size="28" class="logo-icon">
            <Monitor />
          </el-icon>
          <span v-show="!collapsed" class="logo-text">{{ $t('header.title') }}</span>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="collapsed"
          router
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title>{{ $t('nav.dashboard') }}</template>
          </el-menu-item>
          
          <el-menu-item v-if="isStaff" index="/tickets">
            <el-icon><Tickets /></el-icon>
            <template #title>{{ $t('nav.allTickets') }}</template>
          </el-menu-item>
          
          <el-menu-item v-if="isStaff" index="/assigned-tickets">
            <el-icon><Avatar /></el-icon>
            <template #title>{{ $t('nav.assignedTickets') }}</template>
          </el-menu-item>
          
          <el-menu-item index="/my-tickets">
            <el-icon><List /></el-icon>
            <template #title>{{ $t('nav.myTickets') }}</template>
          </el-menu-item>
          
          <el-menu-item index="/tickets/create">
            <el-icon><Plus /></el-icon>
            <template #title>{{ $t('nav.submitTicket') }}</template>
          </el-menu-item>
          
          <el-divider />
          
          <el-menu-item index="/knowledge">
            <el-icon><Reading /></el-icon>
            <template #title>{{ $t('nav.knowledgeBase') }}</template>
          </el-menu-item>
          
          <el-menu-item index="/faq">
            <el-icon><QuestionFilled /></el-icon>
            <template #title>{{ $t('nav.faq') }}</template>
          </el-menu-item>
          
          <!-- Article Management for Support Staff (outside Admin submenu) -->
          <el-menu-item v-if="isStaff && !isManager" index="/admin/articles">
            <el-icon><EditPen /></el-icon>
            <template #title>{{ $t('nav.articleManagement') }}</template>
          </el-menu-item>
          
          <template v-if="isManager">
            <el-divider />
            <el-sub-menu index="/admin">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>{{ $t('nav.administration') }}</span>
              </template>
              
              <el-menu-item v-if="isAdmin" index="/admin/users">
                <el-icon><User /></el-icon>
                {{ $t('nav.userManagement') }}
              </el-menu-item>
              
              <el-menu-item index="/admin/teams">
                <el-icon><UserFilled /></el-icon>
                {{ $t('nav.teamManagement') }}
              </el-menu-item>
              
              <el-menu-item index="/admin/categories">
                <el-icon><Folder /></el-icon>
                {{ $t('nav.categoryManagement') || 'Category Management' }}
              </el-menu-item>
              
              <el-menu-item index="/admin/articles">
                <el-icon><Document /></el-icon>
                {{ $t('nav.articleManagement') }}
              </el-menu-item>
              
              <el-menu-item index="/admin/analytics">
                <el-icon><DataLine /></el-icon>
                {{ $t('nav.analytics') }}
              </el-menu-item>
              
              <el-menu-item v-if="isAdmin" index="/admin/settings">
                <el-icon><Tools /></el-icon>
                {{ $t('nav.systemSettings') }}
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
        
        <div class="sidebar-footer">
          <el-button 
            :icon="collapsed ? Expand : Fold" 
            @click="toggleSidebar"
            text
            class="collapse-btn"
          />
        </div>
      </el-aside>

      <!-- Main Content -->
      <el-container class="main-container">
        <!-- Header -->
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item 
                v-for="(item, index) in breadcrumbs" 
                :key="index"
                :to="item.path ? { path: item.path } : undefined"
              >
                {{ item.label }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <el-input
              v-model="searchQuery"
              :placeholder="$t('common.search')"
              prefix-icon="Search"
              class="search-input"
              clearable
              @keyup.enter="handleSearch"
            />
            
            <el-popover
              placement="bottom-end"
              :width="360"
              trigger="click"
              @show="onNotificationPanelOpen"
            >
              <template #reference>
                <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
                  <el-button :icon="Bell" circle />
                </el-badge>
              </template>
              
              <div class="notification-panel">
                <div class="notification-header">
                  <span class="notification-title">{{ $t('nav.notifications') }}</span>
                  <el-button v-if="notifications.length > 0" type="primary" link size="small" @click="markAllRead">
                    {{ $t('profile.markAllRead') }}
                  </el-button>
                </div>
                
                <el-divider style="margin: 8px 0" />
                
                <div v-if="notifications.length === 0" class="notification-empty">
                  <el-empty :description="$t('nav.noNotifications')" :image-size="60" />
                </div>
                
                <div v-else class="notification-list">
                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    class="notification-item"
                    :class="{ unread: !notification.read }"
                    @click="handleNotificationClick(notification)"
                  >
                    <el-icon class="notification-icon" :class="notification.type">
                      <component :is="getNotificationIcon(notification.type)" />
                    </el-icon>
                    <div class="notification-content">
                      <div class="notification-text">{{ notification.message }}</div>
                      <div class="notification-time">{{ formatNotificationTime(notification.time) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-popover>
            
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar">
                  {{ userInitials }}
                </el-avatar>
                <span class="user-name">{{ userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    {{ $t('nav.myProfile') }}
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    {{ $t('common.logout') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- Content -->
        <el-main class="main-content">
          <router-view v-slot="{ Component, route }">
            <keep-alive :max="10">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore, useUIStore } from '@/stores'
import { notificationApi, type Notification as ApiNotification } from '@/api'
import {
  HomeFilled,
  Tickets,
  List,
  Plus,
  Reading,
  QuestionFilled,
  Setting,
  User,
  UserFilled,
  Document,
  DataLine,
  Tools,
  Bell,
  ArrowDown,
  SwitchButton,
  Expand,
  Fold,
  Monitor,
  Folder,
  EditPen,
  Avatar
} from '@element-plus/icons-vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const uiStore = useUIStore()

const searchQuery = ref('')

// Notification data - using API data
interface LocalNotification {
  id: number
  type: string
  message: string
  title: string
  time: Date
  read: boolean
  link?: string
  relatedObjectType?: string | null
  relatedObjectId?: number | null
}

const notifications = ref<LocalNotification[]>([])
const notificationCount = ref(0)
let notificationPollingTimer: number | null = null

// Fetch notifications from API
async function fetchNotifications() {
  try {
    const response = await notificationApi.getNotifications({ page: 1, pageSize: 10 })
    if (response && response.data && response.data.items) {
      notifications.value = response.data.items.map((n: ApiNotification) => ({
        id: n.id,
        type: getNotificationType(n.type),
        title: n.title,
        message: n.message,
        time: new Date(n.createdAt),
        read: n.isRead,
        relatedObjectType: n.relatedObjectType,
        relatedObjectId: n.relatedObjectId,
        link: n.relatedObjectType === 'ticket' && n.relatedObjectId 
          ? `/tickets/${n.relatedObjectId}` 
          : undefined
      }))
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

// Fetch unread count and auto-refresh list when new notifications arrive
async function fetchUnreadCount() {
  try {
    const response = await notificationApi.getUnreadCount()
    if (response && response.data && typeof response.data.count === 'number') {
      const newCount = response.data.count
      // If count increased, refresh the notifications list so new items appear
      if (newCount > notificationCount.value) {
        await fetchNotifications()
      }
      notificationCount.value = newCount
    }
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
  }
}

// Called when user opens the notification popover
async function onNotificationPanelOpen() {
  await fetchNotifications()
  await fetchUnreadCount()
}

// Map API notification type to local type
function getNotificationType(apiType: string): string {
  if (apiType.includes('ticket')) return 'ticket'
  if (apiType.includes('sla')) return 'system'
  if (apiType === 'system') return 'system'
  return 'info'
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'ticket': return Tickets
    case 'system': return Setting
    default: return Bell
  }
}

function formatNotificationTime(time: Date): string {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return t('common.justNow')
  if (minutes < 60) return t('common.minutesAgo', { n: minutes })
  if (hours < 24) return t('common.hoursAgo', { n: hours })
  return t('common.daysAgo', { n: days })
}

async function handleNotificationClick(notification: LocalNotification) {
  if (!notification.read) {
    try {
      await notificationApi.markAsRead(notification.id)
      notification.read = true
      notificationCount.value = Math.max(0, notificationCount.value - 1)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
  if (notification.link) {
    router.push(notification.link)
  }
}

async function markAllRead() {
  try {
    await notificationApi.markAllAsRead()
    notifications.value.forEach(n => n.read = true)
    notificationCount.value = 0
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

// Start polling for notifications
function startNotificationPolling() {
  fetchNotifications()
  fetchUnreadCount()
  
  // Poll every 30 seconds
  notificationPollingTimer = window.setInterval(() => {
    fetchUnreadCount()
  }, 30000)
}

// Stop polling
function stopNotificationPolling() {
  if (notificationPollingTimer) {
    clearInterval(notificationPollingTimer)
    notificationPollingTimer = null
  }
}

// Lifecycle hooks
onMounted(() => {
  if (userStore.isAuthenticated) {
    startNotificationPolling()
  }
})

onUnmounted(() => {
  stopNotificationPolling()
})

// Computed
const collapsed = computed(() => uiStore.sidebarCollapsed)
const sidebarWidth = computed(() => collapsed.value ? '64px' : '220px')
const activeMenu = computed(() => route.path)
const breadcrumbs = computed(() => uiStore.breadcrumbs)
const userName = computed(() => userStore.userName || 'User')
const userAvatar = computed(() => userStore.userAvatar)
const userInitials = computed(() => {
  const name = userStore.userName || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
const isStaff = computed(() => userStore.isStaff)
const isManager = computed(() => userStore.isManager)
const isAdmin = computed(() => userStore.isAdmin)

// Methods
function toggleSidebar() {
  uiStore.toggleSidebar()
}

function handleSearch() {
  if (searchQuery.value) {
    router.push({ path: '/knowledge', query: { q: searchQuery.value } })
  }
}

async function handleUserCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      await userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #001529;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  
  .logo-container {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    color: #fff;
    
    .logo-icon {
      color: #1890ff;
    }
    
    .logo-text {
      margin-left: 12px;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
    background-color: transparent;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      color: rgba(255, 255, 255, 0.65);
      
      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.08);
      }
      
      &.is-active {
        color: #fff;
        background-color: #1890ff;
      }
    }
    
    :deep(.el-sub-menu) {
      .el-menu {
        background-color: #000c17;
      }
    }
    
    :deep(.el-divider) {
      margin: 12px 16px;
      border-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    
    .collapse-btn {
      width: 100%;
      color: rgba(255, 255, 255, 0.65);
      
      &:hover {
        color: #fff;
      }
    }
  }
}

.main-container {
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .search-input {
      width: 240px;
    }
    
    .notification-badge {
      cursor: pointer;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      .user-name {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.main-content {
  padding: 24px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
// Notification panel styles (unscoped for popover content)
.notification-panel {
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .notification-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .notification-empty {
    padding: 20px 0;
  }
  
  .notification-list {
    max-height: 350px;
    overflow-y: auto;
  }
  
  .notification-item {
    display: flex;
    gap: 12px;
    padding: 12px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    &.unread {
      background-color: #e6f7ff;
      
      &:hover {
        background-color: #bae7ff;
      }
    }
    
    .notification-icon {
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
      
      &.ticket {
        color: #1890ff;
      }
      
      &.system {
        color: #faad14;
      }
      
      &.info {
        color: #52c41a;
      }
    }
    
    .notification-content {
      flex: 1;
      min-width: 0;
      
      .notification-text {
        font-size: 14px;
        color: #333;
        line-height: 1.5;
        word-break: break-word;
      }
      
      .notification-time {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }
}
</style>
