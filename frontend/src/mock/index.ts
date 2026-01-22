import type { ApiResponse, PaginatedResponse, User, Ticket, KnowledgeArticle, Team } from '@/types'
import { 
  mockUsers, 
  mockTeams, 
  mockCategories, 
  mockSLAConfigs,
  mockKBCategories,
  mockTags,
  mockTickets,
  mockArticles,
  mockAuditLogs,
  mockTicketAnalytics,
  mockAgentPerformance,
  mockKnowledgeAnalytics
} from './data'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate successful response
function success<T>(data: T): ApiResponse<T> {
  return { code: 200, message: 'Success', data }
}

// Generate error response  
function error(message: string, code = 400): ApiResponse<never> {
  return { code, message, data: null as never }
}

// Paginate array
function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedItems = items.slice(start, end)
  
  return {
    items: paginatedItems,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize)
  }
}

// Current user state (simulating session)
let currentUser: User | null = null

// Mock API handlers
export const mockHandlers = {
  // ==================== Auth ====================
  async login(credentials: { email: string; password: string }) {
    await delay(500)
    
    const user = mockUsers.find(u => u.email === credentials.email)
    if (!user) {
      return error('Invalid email or password', 401)
    }
    
    // For demo, any password works
    currentUser = user
    return success({
      token: `mock-token-${user.id}-${Date.now()}`,
      user
    })
  },

  // SSO Login - Authentication via external SSO provider (no password)
  async ssoLogin(credentials: { email: string }) {
    await delay(800) // Simulate SSO redirect/callback delay
    
    const user = mockUsers.find(u => u.email === credentials.email)
    if (!user) {
      return error('User not found in university directory', 401)
    }
    
    if (!user.isActive) {
      return error('User account is disabled', 403)
    }
    
    // SSO authentication successful
    currentUser = user
    return success({
      token: `sso-token-${user.id}-${Date.now()}`,
      user
    })
  },

  async logout() {
    await delay(200)
    currentUser = null
    return success(null)
  },

  async getCurrentUser() {
    await delay(200)
    if (!currentUser) {
      // Return demo user for testing
      currentUser = mockUsers[0] ?? null
    }
    return success(currentUser)
  },

  // ==================== Users ====================
  async getUsers(params: { page: number; pageSize: number; keyword?: string; role?: string }) {
    await delay(300)
    
    let filtered = [...mockUsers]
    
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(kw) || 
        u.email.toLowerCase().includes(kw)
      )
    }
    
    if (params.role) {
      filtered = filtered.filter(u => u.role === params.role)
    }
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getUserById(id: string) {
    await delay(200)
    const user = mockUsers.find(u => u.id === id)
    if (!user) return error('User not found', 404)
    return success(user)
  },

  async updateUserRole(id: string, role: string) {
    await delay(300)
    const user = mockUsers.find(u => u.id === id)
    if (!user) return error('User not found', 404)
    user.role = role as User['role']
    return success(user)
  },

  // ==================== Tickets ====================
  async getTickets(params: { page: number; pageSize: number; filter?: Record<string, unknown> }) {
    await delay(400)
    
    let filtered = [...mockTickets]
    
    if (params.filter) {
      if (params.filter.status) {
        const statuses = params.filter.status as string[]
        filtered = filtered.filter(t => statuses.includes(t.status))
      }
      if (params.filter.priority) {
        const priorities = params.filter.priority as string[]
        filtered = filtered.filter(t => priorities.includes(t.priority))
      }
      if (params.filter.keyword) {
        const kw = (params.filter.keyword as string).toLowerCase()
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(kw) ||
          t.description.toLowerCase().includes(kw)
        )
      }
    }
    
    // Sort by created date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getMyTickets(params: { page: number; pageSize: number; status?: string }) {
    await delay(300)
    
    const userId = currentUser?.id || 'user-001'
    let filtered = mockTickets.filter(t => t.requesterId === userId)
    
    if (params.status) {
      filtered = filtered.filter(t => t.status === params.status)
    }
    
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getAssignedTickets(params: { page: number; pageSize: number; status?: string }) {
    await delay(300)
    
    const userId = currentUser?.id || 'staff-001'
    let filtered = mockTickets.filter(t => t.assigneeId === userId)
    
    if (params.status) {
      filtered = filtered.filter(t => t.status === params.status)
    }
    
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getTicketById(id: string) {
    await delay(300)
    const ticket = mockTickets.find(t => t.id === id)
    if (!ticket) return error('Ticket not found', 404)
    return success(ticket)
  },

  async createTicket(data: Record<string, unknown>) {
    await delay(500)
    
    const category = mockCategories.find(c => c.id === data.categoryId)
    const newTicket: Ticket = {
      id: `TKT-2026-${String(mockTickets.length + 1).padStart(4, '0')}`,
      title: data.title as string,
      description: data.description as string,
      status: 'new',
      priority: data.priority as Ticket['priority'],
      category: category ?? mockCategories[7]!,
      channel: 'web',
      requesterId: currentUser?.id || 'user-001',
      requesterName: currentUser?.name || 'John Doe',
      requesterEmail: currentUser?.email || 'john.doe@university.edu',
      attachments: [],
      comments: [],
      statusHistory: [],
      slaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockTickets.unshift(newTicket)
    return success(newTicket)
  },

  async updateTicketStatus(id: string, status: string, comment?: string) {
    await delay(300)
    const ticket = mockTickets.find(t => t.id === id)
    if (!ticket) return error('Ticket not found', 404)
    
    const oldStatus = ticket.status
    ticket.status = status as Ticket['status']
    ticket.updatedAt = new Date().toISOString()
    
    ticket.statusHistory.push({
      id: `sh-${Date.now()}`,
      ticketId: id,
      previousStatus: oldStatus,
      newStatus: status as Ticket['status'],
      changedBy: currentUser?.name || 'System',
      changedAt: new Date().toISOString(),
      comment
    })
    
    return success(ticket)
  },

  async addComment(ticketId: string, data: { content: string; isInternal: boolean }) {
    await delay(300)
    const ticket = mockTickets.find(t => t.id === ticketId)
    if (!ticket) return error('Ticket not found', 404)
    
    const comment = {
      id: `cmt-${Date.now()}`,
      ticketId,
      authorId: currentUser?.id || 'staff-001',
      authorName: currentUser?.name || 'Support Staff',
      content: data.content,
      isInternal: data.isInternal,
      createdAt: new Date().toISOString()
    }
    
    ticket.comments.push(comment)
    ticket.updatedAt = new Date().toISOString()
    
    return success(comment)
  },

  async getCategories() {
    await delay(200)
    return success(mockCategories)
  },

  // ==================== Knowledge Base ====================
  async getArticles(params: { page: number; pageSize: number; filter?: Record<string, unknown> }) {
    await delay(400)
    
    let filtered = [...mockArticles]
    
    if (params.filter) {
      if (params.filter.status) {
        filtered = filtered.filter(a => a.status === params.filter!.status)
      }
      if (params.filter.category) {
        filtered = filtered.filter(a => a.category === params.filter!.category)
      }
      if (params.filter.keyword) {
        const kw = (params.filter.keyword as string).toLowerCase()
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(kw) ||
          a.content.toLowerCase().includes(kw)
        )
      }
    }
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getPublishedArticles(params: { page: number; pageSize: number; keyword?: string; category?: string }) {
    await delay(400)
    
    let filtered = mockArticles.filter(a => a.status === 'published' && a.accessLevel === 'public')
    
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(kw) ||
        a.content.toLowerCase().includes(kw) ||
        a.tags.some(t => t.toLowerCase().includes(kw))
      )
    }
    
    if (params.category) {
      filtered = filtered.filter(a => a.category === params.category)
    }
    
    return success(paginate(filtered, params.page, params.pageSize))
  },

  async getFAQArticles() {
    await delay(300)
    const faqs = mockArticles.filter(a => a.isFAQ && a.status === 'published')
    return success(faqs)
  },

  async getSuggestedArticles(query: string) {
    await delay(400)
    
    const kw = query.toLowerCase()
    const suggestions = mockArticles
      .filter(a => 
        a.status === 'published' &&
        a.accessLevel === 'public' &&
        (a.title.toLowerCase().includes(kw) ||
         a.content.toLowerCase().includes(kw) ||
         a.tags.some(t => t.toLowerCase().includes(kw)))
      )
      .slice(0, 5)
    
    return success(suggestions)
  },

  async getArticleById(id: string) {
    await delay(300)
    const article = mockArticles.find(a => a.id === id)
    if (!article) return error('Article not found', 404)
    
    // Increment view count
    article.viewCount++
    
    return success(article)
  },

  async createArticle(data: Record<string, unknown>) {
    await delay(500)
    
    const newArticle: KnowledgeArticle = {
      id: `KB-${String(mockArticles.length + 1).padStart(3, '0')}`,
      title: data.title as string,
      content: data.content as string,
      summary: data.summary as string,
      category: data.category as string,
      tags: data.tags as string[] || [],
      status: 'draft',
      accessLevel: data.accessLevel as KnowledgeArticle['accessLevel'] || 'public',
      isFAQ: data.isFAQ as boolean || false,
      authorId: currentUser?.id || 'staff-001',
      authorName: currentUser?.name || 'Staff',
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockArticles.push(newArticle)
    return success(newArticle)
  },

  async updateArticle(id: string, data: Record<string, unknown>) {
    await delay(400)
    const article = mockArticles.find(a => a.id === id)
    if (!article) return error('Article not found', 404)
    
    Object.assign(article, data, { updatedAt: new Date().toISOString() })
    return success(article)
  },

  async publishArticle(id: string) {
    await delay(300)
    const article = mockArticles.find(a => a.id === id)
    if (!article) return error('Article not found', 404)
    
    article.status = 'published'
    article.publishedAt = new Date().toISOString()
    article.updatedAt = new Date().toISOString()
    
    return success(article)
  },

  async getKBCategories() {
    await delay(200)
    return success(mockKBCategories)
  },

  async getTags() {
    await delay(200)
    return success(mockTags)
  },

  // ==================== Teams ====================
  async getTeams() {
    await delay(300)
    return success(mockTeams)
  },

  async getTeamById(id: string) {
    await delay(200)
    const team = mockTeams.find(t => t.id === id)
    if (!team) return error('Team not found', 404)
    return success(team)
  },

  async createTeam(data: { name: string; description?: string }) {
    await delay(400)
    
    const newTeam: Team = {
      id: `team-${String(mockTeams.length + 1).padStart(3, '0')}`,
      name: data.name,
      description: data.description,
      memberCount: 0,
      members: [],
      createdAt: new Date().toISOString()
    }
    
    mockTeams.push(newTeam)
    return success(newTeam)
  },

  // ==================== Analytics ====================
  async getTicketAnalytics() {
    await delay(500)
    return success(mockTicketAnalytics)
  },

  async getAgentPerformance() {
    await delay(400)
    return success(mockAgentPerformance)
  },

  async getKnowledgeAnalytics() {
    await delay(400)
    return success(mockKnowledgeAnalytics)
  },

  // ==================== Audit Logs ====================
  async getAuditLogs(params: { page: number; pageSize: number }) {
    await delay(400)
    return success(paginate(mockAuditLogs, params.page, params.pageSize))
  },

  // ==================== SLA ====================
  async getSLAConfigs() {
    await delay(200)
    return success(mockSLAConfigs)
  }
}

// Export mock service
export default mockHandlers
