<template>
  <div class="admin-layout">
    <el-container class="layout-container">
      <!-- Sidebar -->
      <el-aside width="220px" class="sidebar">
        <div class="logo-container">
          <el-icon :size="28" class="logo-icon">
            <Setting />
          </el-icon>
          <span class="logo-text">Admin Panel</span>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><Back /></el-icon>
            <template #title>Back to Site</template>
          </el-menu-item>
          
          <el-divider />
          
          <el-menu-item index="/admin/analytics">
            <el-icon><DataLine /></el-icon>
            <template #title>Analytics</template>
          </el-menu-item>
          
          <el-menu-item v-if="isAdmin" index="/admin/users">
            <el-icon><User /></el-icon>
            <template #title>User Management</template>
          </el-menu-item>
          
          <el-menu-item index="/admin/teams">
            <el-icon><UserFilled /></el-icon>
            <template #title>Team Management</template>
          </el-menu-item>
          
          <el-menu-item index="/admin/categories">
            <el-icon><Folder /></el-icon>
            <template #title>Category Management</template>
          </el-menu-item>
          
          <el-menu-item index="/admin/articles">
            <el-icon><Document /></el-icon>
            <template #title>Article Management</template>
          </el-menu-item>
          
          <el-menu-item v-if="isAdmin" index="/admin/settings">
            <el-icon><Tools /></el-icon>
            <template #title>System Settings</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Content -->
      <el-container class="main-container">
        <!-- Header -->
        <el-header class="header">
          <div class="header-left">
            <h2 class="page-title">{{ pageTitle }}</h2>
          </div>
          
          <div class="header-right">
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
                    My Profile
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    Logout
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {
  Setting,
  Back,
  DataLine,
  User,
  UserFilled,
  Document,
  Folder,
  Tools,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Computed
const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta.title as string || 'Administration')
const userName = computed(() => userStore.userName || 'Admin')
const userAvatar = computed(() => userStore.userAvatar)
const userInitials = computed(() => {
  const name = userStore.userName || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
const isAdmin = computed(() => userStore.isAdmin)

// Methods
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
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  
  .logo-container {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .logo-icon {
      color: #e94560;
    }
    
    .logo-text {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
    background-color: transparent;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.65);
      
      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.08);
      }
      
      &.is-active {
        color: #fff;
        background-color: #e94560;
      }
    }
    
    :deep(.el-divider) {
      margin: 12px 16px;
      border-color: rgba(255, 255, 255, 0.15);
    }
  }
}

.main-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  
  .header-left {
    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
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
