// User related types
export type UserRole = 'end_user' | 'support_staff' | 'manager' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  department?: string
  phone?: string
  status?: 'active' | 'inactive'
  createdAt: string
  lastLoginAt?: string
  isActive: boolean
}

// Ticket related types
export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'pending_user' | 'resolved' | 'closed' | 'cancelled'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketChannel = 'web' | 'email' | 'mobile'

export interface TicketCategory {
  id: string
  name: string
  description?: string
  parentId?: string
  parent?: string | null
}

export interface TicketAttachment {
  id: string
  filename: string
  url: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  uploadedById?: string
  uploadedByName?: string
}

export interface TicketComment {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  content: string
  isInternal: boolean
  createdAt: string
}

export interface TicketStatusHistory {
  id: string
  ticketId: string
  previousStatus: TicketStatus
  newStatus: TicketStatus
  changedBy: string
  changedAt: string
  comment?: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  channel: TicketChannel
  requesterId: string
  requesterName: string
  requesterEmail: string
  assigneeId?: string
  assigneeName?: string
  teamId?: string
  teamName?: string
  attachments: TicketAttachment[]
  comments: TicketComment[]
  statusHistory: TicketStatusHistory[]
  slaResponseDeadline?: string
  slaResolutionDeadline?: string
  slaBreached: boolean
  satisfactionRating?: number
  satisfactionComment?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  closedAt?: string
}

export interface TicketCreateDTO {
  title: string
  description: string
  priority: TicketPriority
  categoryId: string
  contactInfo?: string
  attachments?: File[]
}

// Knowledge Base related types
export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleAccessLevel = 'public' | 'internal'

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  status: ArticleStatus
  accessLevel: ArticleAccessLevel
  isFAQ: boolean
  authorId: string
  authorName: string
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface ArticleCreateDTO {
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  accessLevel: ArticleAccessLevel
  isFAQ?: boolean
}

// Team related types
export interface Team {
  id: string
  name: string
  description?: string
  leaderId?: string
  leaderName?: string
  memberCount: number
  members: TeamMember[]
  createdAt: string
}

export interface TeamMember {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: 'leader' | 'member'
  joinedAt: string
}

// Analytics related types
export interface TicketAnalytics {
  totalCreated: number
  totalClosed: number
  totalOpen: number
  byPriority: Record<TicketPriority, number>
  byCategory: { category: string; count: number }[]
  byStatus: Record<TicketStatus, number>
  byChannel: Record<TicketChannel, number>
  averageResponseTime: number
  averageResolutionTime: number
  slaComplianceRate: number
}

export interface AgentPerformance {
  agentId: string
  agentName: string
  teamName: string
  resolvedTickets: number
  averageResponseTime: number
  averageResolutionTime: number
  satisfactionScore: number
}

export interface KnowledgeAnalytics {
  totalArticles: number
  totalViews: number
  topViewedArticles: { articleId: string; title: string; viewCount: number }[]
  helpfulRatio: number
  emptySearchQueries: string[]
}

// SLA related types
export interface SLAConfig {
  id: string
  priority: TicketPriority | string
  responseTime: number  // in hours
  resolutionTime: number  // in hours
  description?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Audit Log types
export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  details: string
  ipAddress: string
  timestamp: string
}

// API Response types
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Search and filter types
export interface TicketFilter {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  categoryId?: string
  assigneeId?: string
  teamId?: string
  dateFrom?: string
  dateTo?: string
  keyword?: string
}

export interface ArticleFilter {
  status?: ArticleStatus
  category?: string
  accessLevel?: ArticleAccessLevel
  isFAQ?: boolean
  keyword?: string
  tags?: string[]
}
