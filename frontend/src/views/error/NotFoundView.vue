<template>
  <div class="not-found-view">
    <div class="content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">{{ $t('errors.notFound') }}</h2>
      <p class="error-message">
        {{ $t('errors.notFoundDesc') }}
      </p>
      <div class="actions">
        <el-button type="primary" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          {{ $t('errors.backHome') }}
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          {{ $t('common.back') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeFilled, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  .content {
    text-align: center;
    padding: 40px;
    
    .error-code {
      font-size: 120px;
      font-weight: 700;
      color: #409eff;
      margin: 0;
      line-height: 1;
      text-shadow: 4px 4px 0 rgba(64, 158, 255, 0.2);
    }
    
    .error-title {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin: 16px 0;
    }
    
    .error-message {
      font-size: 16px;
      color: #666;
      margin-bottom: 32px;
    }
    
    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }
}
</style>
