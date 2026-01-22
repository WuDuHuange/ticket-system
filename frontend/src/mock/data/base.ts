import type { User, Team, TeamMember, TicketCategory, SLAConfig } from '@/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'john.doe@university.edu',
    name: 'John Doe',
    role: 'end_user',
    department: 'Computer Science',
    phone: '+1-234-567-8901',
    createdAt: '2024-09-01T08:00:00Z',
    lastLoginAt: '2026-01-14T10:30:00Z',
    isActive: true
  },
  {
    id: 'user-002',
    email: 'jane.smith@university.edu',
    name: 'Jane Smith',
    role: 'end_user',
    department: 'Mathematics',
    phone: '+1-234-567-8902',
    createdAt: '2024-09-15T09:00:00Z',
    lastLoginAt: '2026-01-13T14:20:00Z',
    isActive: true
  },
  {
    id: 'staff-001',
    email: 'mike.tech@university.edu',
    name: 'Mike Johnson',
    role: 'support_staff',
    department: 'IT Support',
    phone: '+1-234-567-8903',
    createdAt: '2023-06-01T08:00:00Z',
    lastLoginAt: '2026-01-15T08:00:00Z',
    isActive: true
  },
  {
    id: 'staff-002',
    email: 'sarah.tech@university.edu',
    name: 'Sarah Williams',
    role: 'support_staff',
    department: 'IT Support',
    phone: '+1-234-567-8904',
    createdAt: '2023-08-01T08:00:00Z',
    lastLoginAt: '2026-01-14T16:00:00Z',
    isActive: true
  },
  {
    id: 'manager-001',
    email: 'david.manager@university.edu',
    name: 'David Brown',
    role: 'manager',
    department: 'IT Department',
    phone: '+1-234-567-8905',
    createdAt: '2022-01-01T08:00:00Z',
    lastLoginAt: '2026-01-15T09:00:00Z',
    isActive: true
  },
  {
    id: 'admin-001',
    email: 'admin@university.edu',
    name: 'System Administrator',
    role: 'admin',
    department: 'IT Department',
    phone: '+1-234-567-8900',
    createdAt: '2021-01-01T08:00:00Z',
    lastLoginAt: '2026-01-15T07:00:00Z',
    isActive: true
  }
]

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Network Support',
    description: 'Handles network connectivity and infrastructure issues',
    leaderId: 'staff-001',
    leaderName: 'Mike Johnson',
    memberCount: 3,
    members: [
      { id: 'tm-001', userId: 'staff-001', userName: 'Mike Johnson', userEmail: 'mike.tech@university.edu', role: 'leader', joinedAt: '2023-06-01T08:00:00Z' },
      { id: 'tm-002', userId: 'staff-002', userName: 'Sarah Williams', userEmail: 'sarah.tech@university.edu', role: 'member', joinedAt: '2023-08-01T08:00:00Z' }
    ],
    createdAt: '2023-01-01T08:00:00Z'
  },
  {
    id: 'team-002',
    name: 'Hardware Support',
    description: 'Handles hardware issues and equipment maintenance',
    leaderId: 'staff-002',
    leaderName: 'Sarah Williams',
    memberCount: 2,
    members: [
      { id: 'tm-003', userId: 'staff-002', userName: 'Sarah Williams', userEmail: 'sarah.tech@university.edu', role: 'leader', joinedAt: '2023-08-01T08:00:00Z' }
    ],
    createdAt: '2023-02-01T08:00:00Z'
  },
  {
    id: 'team-003',
    name: 'Software Support',
    description: 'Handles software installation and troubleshooting',
    leaderId: 'staff-001',
    leaderName: 'Mike Johnson',
    memberCount: 2,
    members: [
      { id: 'tm-004', userId: 'staff-001', userName: 'Mike Johnson', userEmail: 'mike.tech@university.edu', role: 'leader', joinedAt: '2023-06-01T08:00:00Z' }
    ],
    createdAt: '2023-03-01T08:00:00Z'
  },
  {
    id: 'team-004',
    name: 'Account Support',
    description: 'Handles account access and authentication issues',
    leaderId: 'staff-001',
    leaderName: 'Mike Johnson',
    memberCount: 2,
    members: [
      { id: 'tm-005', userId: 'staff-001', userName: 'Mike Johnson', userEmail: 'mike.tech@university.edu', role: 'leader', joinedAt: '2023-06-01T08:00:00Z' }
    ],
    createdAt: '2023-04-01T08:00:00Z'
  }
]

// Mock Ticket Categories
export const mockCategories: TicketCategory[] = [
  { id: 'cat-001', name: 'Network', description: 'Network connectivity issues' },
  { id: 'cat-002', name: 'Hardware', description: 'Hardware problems and repairs' },
  { id: 'cat-003', name: 'Software', description: 'Software installation and issues' },
  { id: 'cat-004', name: 'Account', description: 'Account access and permissions' },
  { id: 'cat-005', name: 'Email', description: 'Email system issues' },
  { id: 'cat-006', name: 'Printing', description: 'Printer and printing issues' },
  { id: 'cat-007', name: 'Security', description: 'Security concerns and incidents' },
  { id: 'cat-008', name: 'Other', description: 'Other IT related issues' }
]

// Mock SLA Configurations
export const mockSLAConfigs: SLAConfig[] = [
  { id: 'sla-001', priority: 'urgent', responseTime: 1, resolutionTime: 4, description: 'Urgent priority - Critical issues requiring immediate attention', isActive: true },
  { id: 'sla-002', priority: 'high', responseTime: 4, resolutionTime: 8, description: 'High priority - Important issues that need quick resolution', isActive: true },
  { id: 'sla-003', priority: 'medium', responseTime: 8, resolutionTime: 24, description: 'Medium priority - Standard issues with normal handling time', isActive: true },
  { id: 'sla-004', priority: 'low', responseTime: 24, resolutionTime: 72, description: 'Low priority - Non-urgent issues that can be handled when time permits', isActive: true }
]

// Knowledge Base Categories
export const mockKBCategories: string[] = [
  'Getting Started',
  'Network & Connectivity',
  'Account & Access',
  'Software & Applications',
  'Hardware & Equipment',
  'Email & Communication',
  'Security & Privacy',
  'Troubleshooting Guides'
]

// Popular Tags
export const mockTags: string[] = [
  'wifi',
  'vpn',
  'password',
  'email',
  'outlook',
  'printing',
  'software',
  'login',
  'network',
  'security',
  'installation',
  'error',
  'slow',
  'access'
]
