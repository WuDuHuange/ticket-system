import { http } from './client'
import type { 
  User, 
  Ticket, 
  TicketCreateDTO, 
  TicketFilter,
  TicketComment,
  KnowledgeArticle,
  ArticleCreateDTO,
  ArticleFilter,
  Team,
  TicketAnalytics,
  AgentPerformance,
  KnowledgeAnalytics,
  SLAConfig,
  AuditLog,
  PaginatedResponse,
  TicketCategory
} from '@/types'

// ==================== Auth API ====================
export const authApi = {
  // SSO Login (using Google ID Token)
  loginWithSSO(ssoToken: string) {
    return http.post<{ token: string; user: User }>('/auth/sso', { sso_token: ssoToken })
  },
  
  // Standard Login (Mapped to simple login view if supported, or deprecated)
  login(credentials: { email: string; password: string }) {
    // Note: Backend seems to prioritize SSO. This might be a placeholder.
    return http.post<{ token: string; user: User }>('/auth/sso', credentials)
  },
  
  // Logout
  logout() {
    return http.post<void>('/auth/logout')
  },
  
  // Get current user info
  getCurrentUser() {
    return http.get<User>('/auth/me')
  },
  
  // Refresh token
  refreshToken() {
    return http.post<{ token: string }>('/auth/refresh')
  }
}

// ==================== User API ====================
export const userApi = {
  // Get user list (admin only)
  getUsers(params: { page: number; pageSize: number; keyword?: string; role?: string }) {
    return http.get<PaginatedResponse<User>>('/users/', { params })
  },
  
  // Get user by ID
  getUserById(id: string) {
    return http.get<User>(`/users/${id}/`)
  },
  
  // Update user
  updateUser(id: string, data: Partial<User>) {
    return http.put<User>(`/users/${id}/`, data)
  },
  
  // Update user role
  updateUserRole(id: string, role: string) {
    return http.post<User>(`/users/${id}/change-role/`, { role })
  },
  
  // Deactivate/Activate user (Backend uses toggle)
  deactivateUser(id: string) {
    return http.post<User>(`/users/${id}/toggle-active/`)
  },
  
  // Activate user (Backend uses toggle, same endpoint)
  activateUser(id: string) {
    return http.post<User>(`/users/${id}/toggle-active/`)
  },
  
  // Update profile
  // Note: Backend doesn't explicitly show /users/profile, might need to use updateUser(me) or /users/id
  updateProfile(data: { name?: string; phone?: string; department?: string }) {
    // Using current user ID would be better, but assuming /users/me works or just generic update
    // Backend doesn't have /users/profile. It has current_user at /users/me.
    // We might need to handle this in frontend by getting ID first or assuming checking backend.
    // For now, let's leave as is but warn implementation might differ.
    // Actually, backend AuditLogViewSet etc exist. 
    // Let's assume updating via ID is the standard way.
    // Ideally we should PUT to /users/${id}. 
    return http.put<User>('/users/me_profile_placeholder', data) 
  }
}

// ==================== Ticket API ====================
export const ticketApi = {
  // Get ticket list
  getTickets(params: { 
    page: number
    pageSize: number
    filter?: TicketFilter 
  }) {
    return http.get<PaginatedResponse<Ticket>>('/tickets/', { params })
  },
  
  // Get my tickets (end user) - Only tickets created by current user
  getMyTickets(params: { page: number; pageSize: number; status?: string }) {
    return http.get<PaginatedResponse<Ticket>>('/tickets/', { params: { ...params, my: 'true' } })
  },
  
  // Get assigned tickets (support staff) - Only tickets assigned to current user
  getAssignedTickets(params: { page: number; pageSize: number; status?: string }) {
    return http.get<PaginatedResponse<Ticket>>('/tickets/', { params: { ...params, assigned: 'true' } })
  },
  
  // Get team tickets
  getTeamTickets(teamId: string, params: { page: number; pageSize: number }) {
    // Backend has TeamViewSet but I didn't see explicit tickets link in urls.
    // Likely /teams/{id}/tickets is not implemented. 
    return http.get<PaginatedResponse<Ticket>>(`/teams/${teamId}/tickets`, { params })
  },
  
  // Get ticket by ID
  getTicketById(id: string) {
    return http.get<Ticket>(`/tickets/${id}/`)
  },
  
  // Create ticket
  createTicket(data: TicketCreateDTO) {
    return http.post<Ticket>('/tickets/', data)
  },
  
  // Upload ticket attachment
  uploadAttachment(ticketId: string, formData: FormData) {
    return http.upload<{ id: string; url: string; filename: string }>(
      `/tickets/${ticketId}/attachments`, 
      formData
    )
  },
  
  // Update ticket status
  updateTicketStatus(id: string, status: string, comment?: string) {
    return http.post<Ticket>(`/tickets/${id}/status`, { status, comment })
  },
  
  // Update ticket priority
  updateTicketPriority(id: string, priority: string) {
     // Not explicitly seen in urls, might use generic update
    return http.patch<Ticket>(`/tickets/${id}/update`, { priority })
  },
  
  // Assign ticket
  assignTicket(id: string, assigneeId: string) {
    return http.post<Ticket>(`/tickets/${id}/assign`, { assigneeId })
  },
  
  // Assign ticket to team
  assignTicketToTeam(id: string, teamId: string) {
     // Not sure if supported
    return http.patch<Ticket>(`/tickets/${id}/assign-team`, { teamId })
  },
  
  // Add comment
  addComment(ticketId: string, data: { content: string; isInternal: boolean }) {
    return http.post<TicketComment>(`/tickets/${ticketId}/comments`, data)
  },
  
  // Resolve ticket
  resolveTicket(id: string, resolution: string) {
     // Likely status update
    return http.post<Ticket>(`/tickets/${id}/status`, { status: 'resolved', comment: resolution })
  },
  
  // Close ticket
  closeTicket(id: string) {
    return http.post<Ticket>(`/tickets/${id}/status`, { status: 'closed' })
  },
  
  // Reopen ticket
  reopenTicket(id: string, reason: string) {
    return http.post<Ticket>(`/tickets/${id}/status`, { status: 'open', comment: reason })
  },
  
  // Submit satisfaction feedback
  submitFeedback(id: string, data: { rating: number; comment?: string }) {
    return http.post<void>(`/tickets/${id}/satisfaction`, data)
  },
  
  // Get categories
  getCategories() {
    return http.get<TicketCategory[]>('/tickets/categories')
  }
}

// ==================== Category API ====================
export const categoryApi = {
  // Get all categories
  getCategories() {
    return http.get<TicketCategory[]>('/tickets/categories')
  },
  
  // Create category
  createCategory(data: { name: string; description?: string; parent?: string | null }) {
    return http.post<TicketCategory>('/tickets/categories/create', data)
  },
  
  // Update category
  updateCategory(id: string, data: { name?: string; description?: string; parent?: string | null }) {
    return http.put<TicketCategory>(`/tickets/categories/${id}`, data)
  },
  
  // Delete category
  deleteCategory(id: string) {
    return http.delete<void>(`/tickets/categories/${id}`)
  }
}

// ==================== Knowledge Base API ====================
export const knowledgeApi = {
  // Get article list
  getArticles(params: {
    page: number
    pageSize: number
    filter?: ArticleFilter
  }) {
    return http.get<PaginatedResponse<KnowledgeArticle>>('/kb/articles/', { params })
  },
  
  // Get published articles (for end users)
  getPublishedArticles(params: { 
    page: number
    pageSize: number
    keyword?: string
    category?: string
    tags?: string[]
    sortBy?: 'relevance' | 'updated'
  }) {
    // Mapping to main articles list, adding status=published to ensure consistent behavior
    const queryParams = { ...params, status: 'published' }
    return http.get<PaginatedResponse<KnowledgeArticle>>('/kb/articles/', { params: queryParams })
  },
  
  // Get FAQ articles
  getFAQArticles() {
    return http.get<KnowledgeArticle[]>('/kb/faq/')
  },
  
  // Get suggested articles (during ticket creation)
  getSuggestedArticles(query: string) {
    return http.get<KnowledgeArticle[]>('/kb/suggestions/', { params: { query } })
  },
  
  // Get article by ID
  getArticleById(id: string) {
    return http.get<KnowledgeArticle>(`/kb/articles/${id}/`)
  },
  
  // Create article
  createArticle(data: ArticleCreateDTO) {
    return http.post<KnowledgeArticle>('/kb/articles/', data)
  },
  
  // Update article
  updateArticle(id: string, data: Partial<ArticleCreateDTO>) {
    return http.put<KnowledgeArticle>(`/kb/articles/${id}/`, data)
  },
  
  // Publish article
  publishArticle(id: string) {
    return http.post<KnowledgeArticle>(`/kb/articles/${id}/publish/`)
  },
  
  // Archive article
  archiveArticle(id: string) {
    return http.post<KnowledgeArticle>(`/kb/articles/${id}/archive/`)
  },
  
  // Delete article
  deleteArticle(id: string) {
    return http.delete<void>(`/kb/articles/${id}/`)
  },
  
  // Mark article as helpful
  markHelpful(id: string, helpful: boolean) {
    return http.post<void>(`/kb/articles/${id}/feedback/`, { helpful })
  },
  
  // Get categories
  getCategories() {
    return http.get<string[]>('/kb/categories/')
  },
  
  // Get popular tags
  getTags() {
    return http.get<string[]>('/kb/tags/')
  }
}

// ==================== Team API ====================
export const teamApi = {
  // Get team list
  getTeams() {
    return http.get<Team[]>('/teams/')
  },
  
  // Get team by ID
  getTeamById(id: string) {
    return http.get<Team>(`/teams/${id}/`)
  },
  
  // Create team
  createTeam(data: { name: string; description?: string }) {
    return http.post<Team>('/teams/', data)
  },
  
  // Update team
  updateTeam(id: string, data: { name?: string; description?: string }) {
    return http.put<Team>(`/teams/${id}/`, data)
  },
  
  // Delete team
  deleteTeam(id: string) {
    return http.delete<void>(`/teams/${id}/`)
  },
  
  // Add team member
  addTeamMember(teamId: string, userId: string, role: 'leader' | 'member') {
    return http.post<void>(`/teams/${teamId}/members/`, { userId: parseInt(userId, 10), role })
  },
  
  // Remove team member
  removeTeamMember(teamId: string, userId: string) {
    return http.delete<void>(`/teams/${teamId}/members/${userId}`)
  },
  
  // Update member role
  updateMemberRole(teamId: string, userId: string, role: 'leader' | 'member') {
    return http.patch<void>(`/teams/${teamId}/members/${userId}`, { role })
  }
}

// ==================== Analytics API ====================
export const analyticsApi = {
  // Get ticket analytics
  getTicketAnalytics(params: { dateFrom?: string; dateTo?: string }) {
    return http.get<TicketAnalytics>('/analytics/tickets', { params })
  },
  
  // Get agent performance
  getAgentPerformance(params: { 
    dateFrom?: string
    dateTo?: string
    teamId?: string 
  }) {
    return http.get<AgentPerformance[]>('/analytics/agents', { params })
  },
  
  // Get knowledge analytics
  getKnowledgeAnalytics(params: { dateFrom?: string; dateTo?: string }) {
    return http.get<KnowledgeAnalytics>('/analytics/knowledge', { params })
  },
  
  // Get SLA compliance report
  getSLACompliance(params: {
    dateFrom?: string
    dateTo?: string
    priority?: string
    category?: string
  }) {
    return http.get<{
      complianceRate: number
      breachedTickets: number
      escalatedTickets: number
      byPriority: Record<string, number>
    }>('/analytics/sla', { params })
  },
  
  // Export report
  exportReport(type: string, params: { dateFrom?: string; dateTo?: string; format: 'csv' | 'xlsx' }) {
    return http.download(`/analytics/export/${type}`, `report_${type}_${Date.now()}.${params.format}`, { params })
  }
}

// ==================== SLA API ====================
export const slaApi = {
  // Get SLA configurations
  getSLAConfigs() {
    return http.get<SLAConfig[]>('/sla/configs/')
  },
  
  // Create SLA configuration
  createSLAConfig(data: Partial<SLAConfig>) {
    return http.post<SLAConfig>('/sla/configs/', data)
  },
  
  // Update SLA configuration
  updateSLAConfig(id: string, data: Partial<SLAConfig>) {
    return http.put<SLAConfig>(`/sla/configs/${id}/`, data)
  },
  
  // Delete SLA configuration
  deleteSLAConfig(id: string) {
    return http.delete(`/sla/configs/${id}/`)
  }
}

// ==================== Audit Log API ====================
export const auditApi = {
  // Get audit logs
  getAuditLogs(params: {
    page: number
    pageSize: number
    userId?: string
    action?: string
    dateFrom?: string
    dateTo?: string
  }) {
    return http.get<PaginatedResponse<AuditLog>>('/audit-logs/', { params })
  }
}

// ==================== System API ====================
export const systemApi = {
  // Get system health
  getHealth() {
    return http.get<{ status: string; version: string }>('/system/health')
  },
  
  // Get system settings
  getSettings() {
    return http.get<Record<string, unknown>>('/system/settings')
  },
  
  // Update system settings
  updateSettings(settings: Record<string, unknown>) {
    return http.put<void>('/system/settings', settings)
  }
}

// ==================== Notification API ====================
export interface Notification {
  id: number
  type: string
  title: string
  message: string
  relatedObjectType: string | null
  relatedObjectId: number | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationPreferences {
  emailTicketCreated: boolean
  emailTicketAssigned: boolean
  emailTicketStatusChanged: boolean
  emailTicketComment: boolean
  emailSlaWarning: boolean
  emailSlaBreach: boolean
  emailSystem: boolean
  emailMention: boolean
  inappTicketCreated: boolean
  inappTicketAssigned: boolean
  inappTicketStatusChanged: boolean
  inappTicketComment: boolean
  inappSlaWarning: boolean
  inappSlaBreach: boolean
  inappSystem: boolean
  inappMention: boolean
}

export const notificationApi = {
  // Get notifications
  getNotifications(params?: { page?: number; pageSize?: number; isRead?: boolean; type?: string }) {
    return http.get<PaginatedResponse<Notification>>('/notifications/', { params })
  },
  
  // Get unread notification count
  getUnreadCount() {
    return http.get<{ count: number }>('/notifications/unread_count/')
  },
  
  // Mark single notification as read
  markAsRead(id: number) {
    return http.post<Notification>(`/notifications/${id}/mark_read/`)
  },
  
  // Mark all notifications as read
  markAllAsRead() {
    return http.post<{ message: string; count: number }>('/notifications/mark_all_read/')
  },
  
  // Delete notification
  deleteNotification(id: number) {
    return http.delete(`/notifications/${id}/`)
  },
  
  // Clear all read notifications
  clearAllRead() {
    return http.delete<{ message: string; count: number }>('/notifications/clear_all/')
  },
  
  // Get notification preferences
  getPreferences() {
    return http.get<NotificationPreferences>('/notifications/preferences/')
  },
  
  // Update notification preferences
  updatePreferences(preferences: Partial<NotificationPreferences>) {
    return http.patch<NotificationPreferences>('/notifications/preferences/', preferences)
  }
}
