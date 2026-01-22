import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Lazy load views
const LoginView = () => import('@/views/auth/LoginView.vue')
const MainLayout = () => import('@/layouts/MainLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const DashboardView = () => import('@/views/dashboard/DashboardView.vue')
const TicketListView = () => import('@/views/tickets/TicketListView.vue')
const TicketDetailView = () => import('@/views/tickets/TicketDetailView.vue')
const CreateTicketView = () => import('@/views/tickets/CreateTicketView.vue')
const MyTicketsView = () => import('@/views/tickets/MyTicketsView.vue')
const AssignedTicketsView = () => import('@/views/tickets/AssignedTicketsView.vue')
const KnowledgeListView = () => import('@/views/knowledge/KnowledgeListView.vue')
const ArticleDetailView = () => import('@/views/knowledge/ArticleDetailView.vue')
const FAQView = () => import('@/views/knowledge/FAQView.vue')
const ProfileView = () => import('@/views/profile/ProfileView.vue')
const UserManagementView = () => import('@/views/admin/UserManagementView.vue')
const TeamManagementView = () => import('@/views/admin/TeamManagementView.vue')
const ArticleManagementView = () => import('@/views/admin/ArticleManagementView.vue')
const CategoryManagementView = () => import('@/views/admin/CategoryManagementView.vue')
const AnalyticsView = () => import('@/views/admin/AnalyticsView.vue')
const SystemSettingsView = () => import('@/views/admin/SystemSettingsView.vue')
const NotFoundView = () => import('@/views/error/NotFoundView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false, title: 'Login' }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'tickets',
        name: 'TicketList',
        component: TicketListView,
        meta: { title: 'All Tickets', roles: ['support_staff', 'manager', 'admin'] }
      },
      {
        path: 'tickets/create',
        name: 'CreateTicket',
        component: CreateTicketView,
        meta: { title: 'Submit Ticket' }
      },
      {
        path: 'tickets/:id',
        name: 'TicketDetail',
        component: TicketDetailView,
        meta: { title: 'Ticket Detail' }
      },
      {
        path: 'my-tickets',
        name: 'MyTickets',
        component: MyTicketsView,
        meta: { title: 'My Tickets' }
      },
      {
        path: 'assigned-tickets',
        name: 'AssignedTickets',
        component: AssignedTicketsView,
        meta: { title: 'Assigned Tickets', roles: ['support_staff', 'manager', 'admin'] }
      },
      {
        path: 'knowledge',
        name: 'KnowledgeList',
        component: KnowledgeListView,
        meta: { title: 'Knowledge Base' }
      },
      {
        path: 'knowledge/:id',
        name: 'ArticleDetail',
        component: ArticleDetailView,
        meta: { title: 'Article' }
      },
      {
        path: 'faq',
        name: 'FAQ',
        component: FAQView,
        meta: { title: 'FAQ' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
        meta: { title: 'My Profile' }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['manager', 'admin'] },
    children: [
      {
        path: '',
        redirect: '/admin/analytics'
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagementView,
        meta: { title: 'User Management', roles: ['admin'] }
      },
      {
        path: 'teams',
        name: 'TeamManagement',
        component: TeamManagementView,
        meta: { title: 'Team Management', roles: ['manager', 'admin'] }
      },
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: CategoryManagementView,
        meta: { title: 'Category Management', roles: ['manager', 'admin'] }
      },
      {
        path: 'articles',
        name: 'ArticleManagement',
        component: ArticleManagementView,
        meta: { title: 'Article Management', roles: ['support_staff', 'manager', 'admin'] }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: AnalyticsView,
        meta: { title: 'Analytics', roles: ['manager', 'admin'] }
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: SystemSettingsView,
        meta: { title: 'System Settings', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 Not Found' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  // Set document title
  const title = to.meta.title as string
  document.title = title ? `${title} - IT Service Desk` : 'IT Service Desk'
  
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  if (!requiresAuth) {
    next()
    return
  }
  
  // Get user store
  const userStore = useUserStore()
  
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    await userStore.fetchCurrentUser()
  }
  
  if (!userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based access
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && !requiredRoles.includes(userStore.user?.role || '')) {
    // User doesn't have required role, redirect to dashboard
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router
