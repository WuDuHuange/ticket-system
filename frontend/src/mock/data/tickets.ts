import type { Ticket, TicketStatus, TicketPriority } from '@/types'
import { mockUsers, mockCategories, mockTeams } from './base'

const statuses: TicketStatus[] = ['new', 'assigned', 'in_progress', 'pending_user', 'resolved', 'closed']
const priorities: TicketPriority[] = ['low', 'medium', 'high', 'urgent']

// Generate mock tickets
export const mockTickets: Ticket[] = [
  {
    id: 'TKT-2026-0001',
    title: 'Cannot connect to campus WiFi',
    description: 'I have been trying to connect to the campus WiFi network since this morning, but my laptop keeps showing "Unable to connect". I have tried restarting my laptop and forgetting the network, but the issue persists. This is affecting my ability to attend online classes.',
    status: 'in_progress',
    priority: 'high',
    category: mockCategories[0]!, // Network
    channel: 'web',
    requesterId: 'user-001',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@university.edu',
    assigneeId: 'staff-001',
    assigneeName: 'Mike Johnson',
    teamId: 'team-001',
    teamName: 'Network Support',
    attachments: [
      {
        id: 'att-001',
        filename: 'wifi_error_screenshot.png',
        url: '/mock/attachments/wifi_error.png',
        fileSize: 245000,
        mimeType: 'image/png',
        uploadedAt: '2026-01-14T09:30:00Z'
      }
    ],
    comments: [
      {
        id: 'cmt-001',
        ticketId: 'TKT-2026-0001',
        authorId: 'staff-001',
        authorName: 'Mike Johnson',
        content: 'Hi John, I am looking into this issue. Could you please provide your device MAC address? You can find it in network settings.',
        isInternal: false,
        createdAt: '2026-01-14T10:00:00Z'
      },
      {
        id: 'cmt-002',
        ticketId: 'TKT-2026-0001',
        authorId: 'staff-001',
        authorName: 'Mike Johnson',
        content: 'Checked network logs - appears to be a certificate issue affecting some devices.',
        isInternal: true,
        createdAt: '2026-01-14T10:15:00Z'
      }
    ],
    statusHistory: [
      { id: 'sh-001', ticketId: 'TKT-2026-0001', previousStatus: 'new', newStatus: 'assigned', changedBy: 'System', changedAt: '2026-01-14T09:35:00Z' },
      { id: 'sh-002', ticketId: 'TKT-2026-0001', previousStatus: 'assigned', newStatus: 'in_progress', changedBy: 'Mike Johnson', changedAt: '2026-01-14T10:00:00Z' }
    ],
    slaResponseDeadline: '2026-01-14T10:30:00Z',
    slaResolutionDeadline: '2026-01-14T17:30:00Z',
    slaBreached: false,
    createdAt: '2026-01-14T09:30:00Z',
    updatedAt: '2026-01-14T10:15:00Z'
  },
  {
    id: 'TKT-2026-0002',
    title: 'Request for Microsoft Office installation',
    description: 'I need Microsoft Office Suite (Word, Excel, PowerPoint) installed on my office computer for preparing course materials. The computer ID is LAB-PC-042.',
    status: 'pending_user',
    priority: 'medium',
    category: mockCategories[2]!, // Software
    channel: 'web',
    requesterId: 'user-002',
    requesterName: 'Jane Smith',
    requesterEmail: 'jane.smith@university.edu',
    assigneeId: 'staff-002',
    assigneeName: 'Sarah Williams',
    teamId: 'team-003',
    teamName: 'Software Support',
    attachments: [],
    comments: [
      {
        id: 'cmt-003',
        ticketId: 'TKT-2026-0002',
        authorId: 'staff-002',
        authorName: 'Sarah Williams',
        content: 'Hello Jane, I can schedule the installation for tomorrow. Please confirm a convenient time slot: 9-11 AM or 2-4 PM?',
        isInternal: false,
        createdAt: '2026-01-14T11:00:00Z'
      }
    ],
    statusHistory: [
      { id: 'sh-003', ticketId: 'TKT-2026-0002', previousStatus: 'new', newStatus: 'assigned', changedBy: 'System', changedAt: '2026-01-14T10:35:00Z' },
      { id: 'sh-004', ticketId: 'TKT-2026-0002', previousStatus: 'assigned', newStatus: 'pending_user', changedBy: 'Sarah Williams', changedAt: '2026-01-14T11:00:00Z' }
    ],
    slaResponseDeadline: '2026-01-14T14:30:00Z',
    slaResolutionDeadline: '2026-01-15T10:30:00Z',
    slaBreached: false,
    createdAt: '2026-01-14T10:30:00Z',
    updatedAt: '2026-01-14T11:00:00Z'
  },
  {
    id: 'TKT-2026-0003',
    title: 'Password reset not working',
    description: 'I tried to reset my university account password using the self-service portal, but I am not receiving the reset email. I have checked my spam folder as well. I need urgent access to submit my assignment.',
    status: 'resolved',
    priority: 'urgent',
    category: mockCategories[3]!, // Account
    channel: 'email',
    requesterId: 'user-001',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@university.edu',
    assigneeId: 'staff-001',
    assigneeName: 'Mike Johnson',
    teamId: 'team-004',
    teamName: 'Account Support',
    attachments: [],
    comments: [
      {
        id: 'cmt-004',
        ticketId: 'TKT-2026-0003',
        authorId: 'staff-001',
        authorName: 'Mike Johnson',
        content: 'Hi John, I have manually reset your password and sent the new credentials to your personal email address registered in the system. Please change it upon first login.',
        isInternal: false,
        createdAt: '2026-01-13T15:30:00Z'
      }
    ],
    statusHistory: [
      { id: 'sh-005', ticketId: 'TKT-2026-0003', previousStatus: 'new', newStatus: 'in_progress', changedBy: 'Mike Johnson', changedAt: '2026-01-13T15:15:00Z' },
      { id: 'sh-006', ticketId: 'TKT-2026-0003', previousStatus: 'in_progress', newStatus: 'resolved', changedBy: 'Mike Johnson', changedAt: '2026-01-13T15:30:00Z' }
    ],
    slaResponseDeadline: '2026-01-13T15:30:00Z',
    slaResolutionDeadline: '2026-01-13T19:00:00Z',
    slaBreached: false,
    satisfactionRating: 5,
    satisfactionComment: 'Quick and helpful response!',
    createdAt: '2026-01-13T15:00:00Z',
    updatedAt: '2026-01-13T16:00:00Z',
    resolvedAt: '2026-01-13T15:30:00Z',
    closedAt: '2026-01-13T16:00:00Z'
  },
  {
    id: 'TKT-2026-0004',
    title: 'Printer not printing - Library 2nd Floor',
    description: 'The printer on the 2nd floor of the main library is not printing. It shows "Ready" status but jobs are stuck in queue. Multiple students are affected.',
    status: 'new',
    priority: 'high',
    category: mockCategories[5]!, // Printing
    channel: 'web',
    requesterId: 'user-002',
    requesterName: 'Jane Smith',
    requesterEmail: 'jane.smith@university.edu',
    attachments: [
      {
        id: 'att-002',
        filename: 'printer_queue.png',
        url: '/mock/attachments/printer_queue.png',
        fileSize: 156000,
        mimeType: 'image/png',
        uploadedAt: '2026-01-15T08:00:00Z'
      }
    ],
    comments: [],
    statusHistory: [],
    slaResponseDeadline: '2026-01-15T09:00:00Z',
    slaResolutionDeadline: '2026-01-15T16:00:00Z',
    slaBreached: false,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'TKT-2026-0005',
    title: 'VPN connection keeps disconnecting',
    description: 'When working from home, the university VPN disconnects every 10-15 minutes. This happens on both my laptop and phone. I have tried reinstalling the VPN client.',
    status: 'assigned',
    priority: 'medium',
    category: mockCategories[0]!, // Network
    channel: 'mobile',
    requesterId: 'user-001',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@university.edu',
    assigneeId: 'staff-001',
    assigneeName: 'Mike Johnson',
    teamId: 'team-001',
    teamName: 'Network Support',
    attachments: [],
    comments: [],
    statusHistory: [
      { id: 'sh-007', ticketId: 'TKT-2026-0005', previousStatus: 'new', newStatus: 'assigned', changedBy: 'System', changedAt: '2026-01-14T16:05:00Z' }
    ],
    slaResponseDeadline: '2026-01-14T20:00:00Z',
    slaResolutionDeadline: '2026-01-15T16:00:00Z',
    slaBreached: false,
    createdAt: '2026-01-14T16:00:00Z',
    updatedAt: '2026-01-14T16:05:00Z'
  },
  {
    id: 'TKT-2026-0006',
    title: 'Email account storage full',
    description: 'I am receiving warnings that my email storage is almost full (98% used). I need assistance in either increasing my quota or archiving old emails.',
    status: 'closed',
    priority: 'low',
    category: mockCategories[4]!, // Email
    channel: 'web',
    requesterId: 'user-002',
    requesterName: 'Jane Smith',
    requesterEmail: 'jane.smith@university.edu',
    assigneeId: 'staff-002',
    assigneeName: 'Sarah Williams',
    teamId: 'team-004',
    teamName: 'Account Support',
    attachments: [],
    comments: [
      {
        id: 'cmt-005',
        ticketId: 'TKT-2026-0006',
        authorId: 'staff-002',
        authorName: 'Sarah Williams',
        content: 'Hello Jane, I have increased your email storage quota from 5GB to 10GB. You should now have sufficient space.',
        isInternal: false,
        createdAt: '2026-01-12T14:00:00Z'
      }
    ],
    statusHistory: [
      { id: 'sh-008', ticketId: 'TKT-2026-0006', previousStatus: 'new', newStatus: 'in_progress', changedBy: 'Sarah Williams', changedAt: '2026-01-12T13:30:00Z' },
      { id: 'sh-009', ticketId: 'TKT-2026-0006', previousStatus: 'in_progress', newStatus: 'resolved', changedBy: 'Sarah Williams', changedAt: '2026-01-12T14:00:00Z' },
      { id: 'sh-010', ticketId: 'TKT-2026-0006', previousStatus: 'resolved', newStatus: 'closed', changedBy: 'Jane Smith', changedAt: '2026-01-12T15:00:00Z' }
    ],
    slaResponseDeadline: '2026-01-12T21:00:00Z',
    slaResolutionDeadline: '2026-01-14T13:00:00Z',
    slaBreached: false,
    satisfactionRating: 4,
    createdAt: '2026-01-12T13:00:00Z',
    updatedAt: '2026-01-12T15:00:00Z',
    resolvedAt: '2026-01-12T14:00:00Z',
    closedAt: '2026-01-12T15:00:00Z'
  },
  {
    id: 'TKT-2025-0150',
    title: 'Computer running extremely slow',
    description: 'My office computer has become extremely slow over the past week. Applications take forever to open and sometimes freeze completely.',
    status: 'closed',
    priority: 'medium',
    category: mockCategories[1]!, // Hardware
    channel: 'web',
    requesterId: 'user-001',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@university.edu',
    assigneeId: 'staff-002',
    assigneeName: 'Sarah Williams',
    teamId: 'team-002',
    teamName: 'Hardware Support',
    attachments: [],
    comments: [
      {
        id: 'cmt-006',
        ticketId: 'TKT-2025-0150',
        authorId: 'staff-002',
        authorName: 'Sarah Williams',
        content: 'Diagnosed as failing hard drive. Replaced with SSD and restored data from backup. System is now running normally.',
        isInternal: false,
        createdAt: '2025-12-20T16:00:00Z'
      }
    ],
    statusHistory: [
      { id: 'sh-011', ticketId: 'TKT-2025-0150', previousStatus: 'new', newStatus: 'in_progress', changedBy: 'Sarah Williams', changedAt: '2025-12-19T10:00:00Z' },
      { id: 'sh-012', ticketId: 'TKT-2025-0150', previousStatus: 'in_progress', newStatus: 'resolved', changedBy: 'Sarah Williams', changedAt: '2025-12-20T16:00:00Z' },
      { id: 'sh-013', ticketId: 'TKT-2025-0150', previousStatus: 'resolved', newStatus: 'closed', changedBy: 'John Doe', changedAt: '2025-12-21T09:00:00Z' }
    ],
    slaResponseDeadline: '2025-12-19T13:00:00Z',
    slaResolutionDeadline: '2025-12-20T09:00:00Z',
    slaBreached: true,
    satisfactionRating: 5,
    satisfactionComment: 'Great work! Computer is much faster now.',
    createdAt: '2025-12-19T09:00:00Z',
    updatedAt: '2025-12-21T09:00:00Z',
    resolvedAt: '2025-12-20T16:00:00Z',
    closedAt: '2025-12-21T09:00:00Z'
  }
]

// Helper function to get tickets by user
export function getTicketsByUser(userId: string): Ticket[] {
  return mockTickets.filter(t => t.requesterId === userId)
}

// Helper function to get assigned tickets
export function getAssignedTickets(assigneeId: string): Ticket[] {
  return mockTickets.filter(t => t.assigneeId === assigneeId)
}

// Helper function to get team tickets
export function getTeamTickets(teamId: string): Ticket[] {
  return mockTickets.filter(t => t.teamId === teamId)
}
