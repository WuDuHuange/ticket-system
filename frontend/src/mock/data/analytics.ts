import type { AuditLog, TicketAnalytics, AgentPerformance, KnowledgeAnalytics } from '@/types'

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    userId: 'user-001',
    userEmail: 'john.doe@university.edu',
    action: 'LOGIN',
    details: 'User logged in successfully via SSO',
    ipAddress: '192.168.1.100',
    timestamp: '2026-01-15T08:30:00Z'
  },
  {
    id: 'audit-002',
    userId: 'staff-001',
    userEmail: 'mike.tech@university.edu',
    action: 'LOGIN',
    details: 'User logged in successfully via SSO',
    ipAddress: '192.168.1.50',
    timestamp: '2026-01-15T08:00:00Z'
  },
  {
    id: 'audit-003',
    userId: 'admin-001',
    userEmail: 'admin@university.edu',
    action: 'USER_ROLE_CHANGE',
    details: 'Changed user jane.smith@university.edu role from end_user to support_staff',
    ipAddress: '192.168.1.10',
    timestamp: '2026-01-14T15:30:00Z'
  },
  {
    id: 'audit-004',
    userId: 'admin-001',
    userEmail: 'admin@university.edu',
    action: 'TEAM_UPDATE',
    details: 'Added user staff-003 to team Network Support',
    ipAddress: '192.168.1.10',
    timestamp: '2026-01-14T14:00:00Z'
  },
  {
    id: 'audit-005',
    userId: 'manager-001',
    userEmail: 'david.manager@university.edu',
    action: 'LOGIN',
    details: 'User logged in successfully via SSO',
    ipAddress: '192.168.1.25',
    timestamp: '2026-01-14T09:00:00Z'
  },
  {
    id: 'audit-006',
    userId: 'user-002',
    userEmail: 'jane.smith@university.edu',
    action: 'LOGIN_FAILED',
    details: 'Login failed - incorrect password',
    ipAddress: '192.168.1.105',
    timestamp: '2026-01-13T16:45:00Z'
  },
  {
    id: 'audit-007',
    userId: 'admin-001',
    userEmail: 'admin@university.edu',
    action: 'USER_DEACTIVATE',
    details: 'Deactivated user account test.user@university.edu',
    ipAddress: '192.168.1.10',
    timestamp: '2026-01-13T11:00:00Z'
  }
]

// Mock Ticket Analytics
export const mockTicketAnalytics: TicketAnalytics = {
  totalCreated: 156,
  totalClosed: 142,
  totalOpen: 14,
  byPriority: {
    urgent: 8,
    high: 32,
    medium: 78,
    low: 38
  },
  byCategory: [
    { category: 'Network', count: 45 },
    { category: 'Software', count: 38 },
    { category: 'Account', count: 28 },
    { category: 'Hardware', count: 22 },
    { category: 'Email', count: 12 },
    { category: 'Printing', count: 8 },
    { category: 'Other', count: 3 }
  ],
  byStatus: {
    new: 3,
    assigned: 4,
    in_progress: 5,
    pending_user: 2,
    resolved: 8,
    closed: 134,
    cancelled: 0
  },
  byChannel: {
    web: 112,
    email: 32,
    mobile: 12
  },
  averageResponseTime: 45, // minutes
  averageResolutionTime: 320, // minutes
  slaComplianceRate: 92.3
}

// Mock Agent Performance
export const mockAgentPerformance: AgentPerformance[] = [
  {
    agentId: 'staff-001',
    agentName: 'Mike Johnson',
    teamName: 'Network Support',
    resolvedTickets: 68,
    averageResponseTime: 35,
    averageResolutionTime: 280,
    satisfactionScore: 4.7
  },
  {
    agentId: 'staff-002',
    agentName: 'Sarah Williams',
    teamName: 'Hardware Support',
    resolvedTickets: 54,
    averageResponseTime: 42,
    averageResolutionTime: 350,
    satisfactionScore: 4.5
  }
]

// Mock Knowledge Analytics
export const mockKnowledgeAnalytics: KnowledgeAnalytics = {
  totalArticles: 45,
  totalViews: 12543,
  topViewedArticles: [
    { articleId: 'KB-002', title: 'Password Reset Guide', viewCount: 2847 },
    { articleId: 'KB-009', title: 'Getting Started with the IT Service Portal', viewCount: 1892 },
    { articleId: 'KB-001', title: 'How to Connect to Campus WiFi', viewCount: 1523 },
    { articleId: 'KB-003', title: 'VPN Setup and Configuration', viewCount: 1156 },
    { articleId: 'KB-004', title: 'Email Configuration for Mobile Devices', viewCount: 892 }
  ],
  helpfulRatio: 0.94,
  emptySearchQueries: [
    'zoom installation',
    'matlab license',
    'lab computer booking',
    'guest wifi',
    'microsoft teams'
  ]
}
