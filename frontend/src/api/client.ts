import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API base configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TIMEOUT = 30000

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - inject token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ApiResponse<unknown>
    
    // Check business logic errors - accept 0, 200, 201 as success codes
    const isSuccessCode = res.code === 0 || (res.code >= 200 && res.code < 300)
    if (!isSuccessCode) {
      ElMessage.error(res.message || 'Request failed')
      
      // Handle specific error codes
      if (res.code === 401) {
        // Token expired or invalid
        const userStore = useUserStore()
        userStore.resetState() // Don't call API loop
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || 'Request failed'))
    }
    
    return response
  },
  (error) => {
    console.error('Response error:', error)
    
    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 401:
          // Check if we are already logging out to avoid infinite loop
          if (!error.config.url?.endsWith('logout')) {
            ElMessage.error('Authentication failed. Please login again.')
            const userStore = useUserStore()
            userStore.resetState()
            router.push('/login')
          }
          break
        case 403:
          ElMessage.error('Access denied. You do not have permission.')
          break
        case 404:
          ElMessage.error('Resource not found.')
          break
        case 500:
          ElMessage.error('Server error. Please try again later.')
          break
        default:
          ElMessage.error(error.message || 'Network error')
      }
    } else if (error.request) {
      ElMessage.error('Network error. Please check your connection.')
    } else {
      ElMessage.error('Request error: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

// Generic request methods
export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.get(url, config).then(res => res.data)
  },
  
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.post(url, data, config).then(res => res.data)
  },
  
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.put(url, data, config).then(res => res.data)
  },
  
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.patch(url, data, config).then(res => res.data)
  },
  
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.delete(url, config).then(res => res.data)
  },
  
  // Upload file with FormData
  upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data)
  },
  
  // Download file
  download(url: string, filename: string, config?: AxiosRequestConfig): Promise<void> {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob',
    }).then(res => {
      const blob = new Blob([res.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    })
  }
}

export default apiClient
