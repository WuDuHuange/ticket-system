import type { KnowledgeArticle } from '@/types'

export const mockArticles: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'How to Connect to Campus WiFi',
    content: `# How to Connect to Campus WiFi

## Overview
This guide explains how to connect your device to the university's wireless network.

## Prerequisites
- A valid university account
- A WiFi-enabled device

## Steps for Windows

1. Click the WiFi icon in the system tray
2. Select "University-WiFi" from the list
3. Enter your university credentials:
   - Username: your_student_id@university.edu
   - Password: your university password
4. Click "Connect"

## Steps for macOS

1. Click the WiFi icon in the menu bar
2. Select "University-WiFi"
3. Enter your credentials when prompted
4. Click "Join"

## Steps for Mobile Devices

### iOS
1. Go to Settings > WiFi
2. Tap "University-WiFi"
3. Enter your credentials
4. Tap "Join"

### Android
1. Go to Settings > Network & Internet > WiFi
2. Tap "University-WiFi"
3. Enter your credentials
4. Tap "Connect"

## Troubleshooting

### Cannot see the network
- Make sure WiFi is enabled on your device
- Move closer to a WiFi access point
- Restart your device

### Authentication failed
- Verify your username format (include @university.edu)
- Check if your password is correct
- Ensure your account is not locked

### Connected but no internet
- Forget the network and reconnect
- Check if you need to accept terms of service
- Contact IT support if issue persists

## Related Articles
- VPN Setup Guide
- Password Reset Instructions
`,
    summary: 'Step-by-step guide to connect to the university wireless network on various devices.',
    category: 'Network & Connectivity',
    tags: ['wifi', 'network', 'connection', 'wireless'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 1523,
    helpfulCount: 342,
    notHelpfulCount: 15,
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-12-15T14:00:00Z',
    publishedAt: '2025-09-01T12:00:00Z'
  },
  {
    id: 'KB-002',
    title: 'Password Reset Guide',
    content: `# Password Reset Guide

## Self-Service Password Reset

### Step 1: Access the Reset Portal
Visit https://password.university.edu

### Step 2: Enter Your Username
Enter your full email address (e.g., john.doe@university.edu)

### Step 3: Verify Your Identity
Choose one of the following verification methods:
- Email to alternate address
- SMS to registered phone
- Security questions

### Step 4: Create New Password
Your new password must meet these requirements:
- At least 12 characters long
- Contains uppercase and lowercase letters
- Contains at least one number
- Contains at least one special character (!@#$%^&*)
- Cannot be any of your last 5 passwords

## If Self-Service Doesn't Work

If you cannot reset your password through self-service:
1. Submit a support ticket with category "Account"
2. Visit the IT Help Desk in person with valid ID
3. Call the IT Support Hotline: +1-234-567-8999

## Security Tips
- Never share your password
- Use a unique password for your university account
- Enable two-factor authentication when available
`,
    summary: 'Instructions for resetting your university account password using the self-service portal.',
    category: 'Account & Access',
    tags: ['password', 'reset', 'account', 'security', 'login'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 2847,
    helpfulCount: 612,
    notHelpfulCount: 23,
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-11-20T11:00:00Z',
    publishedAt: '2025-08-15T10:00:00Z'
  },
  {
    id: 'KB-003',
    title: 'VPN Setup and Configuration',
    content: `# VPN Setup and Configuration

## What is VPN?
VPN (Virtual Private Network) allows you to securely access university resources from off-campus locations.

## Download the VPN Client

### Windows
Download from: https://vpn.university.edu/windows
- Run the installer
- Follow the setup wizard

### macOS
Download from: https://vpn.university.edu/mac
- Open the .dmg file
- Drag to Applications folder

### Mobile
- iOS: Search "University VPN" in App Store
- Android: Search "University VPN" in Play Store

## Configuration

1. Open the VPN client
2. Server address: vpn.university.edu
3. Authentication: Use your university credentials
4. Connection type: SSL/TLS

## Common Issues

### VPN Disconnects Frequently
- Check your internet connection stability
- Try connecting to a different server
- Disable battery saver mode
- Update the VPN client

### Cannot Connect
- Verify credentials are correct
- Check if your account is active
- Ensure firewall isn't blocking VPN
- Try a different network

## Best Practices
- Only connect when you need campus resources
- Disconnect when finished
- Keep the client updated
`,
    summary: 'Complete guide for setting up and configuring VPN access to university resources.',
    category: 'Network & Connectivity',
    tags: ['vpn', 'remote', 'network', 'security'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 1156,
    helpfulCount: 289,
    notHelpfulCount: 18,
    createdAt: '2025-09-10T14:00:00Z',
    updatedAt: '2025-12-01T09:00:00Z',
    publishedAt: '2025-09-10T16:00:00Z'
  },
  {
    id: 'KB-004',
    title: 'Email Configuration for Mobile Devices',
    content: `# Email Configuration for Mobile Devices

## Server Settings

| Setting | Value |
|---------|-------|
| Server Type | Microsoft Exchange |
| Server | mail.university.edu |
| Port | 443 |
| Security | SSL/TLS |

## iOS Setup

1. Go to **Settings** > **Mail** > **Accounts**
2. Tap **Add Account**
3. Select **Microsoft Exchange**
4. Enter your email and description
5. Tap **Sign In**
6. Enter your password
7. Select which items to sync (Mail, Calendar, Contacts)
8. Tap **Save**

## Android Setup

1. Open **Settings** > **Accounts**
2. Tap **Add account**
3. Select **Exchange**
4. Enter your full email address
5. Enter your password
6. Configure sync options
7. Tap **Done**

## Troubleshooting

### Emails not syncing
- Check internet connection
- Verify account credentials
- Remove and re-add the account

### Certificate errors
- Accept the security certificate when prompted
- Ensure your device date/time is correct
`,
    summary: 'How to set up your university email on iOS and Android mobile devices.',
    category: 'Email & Communication',
    tags: ['email', 'mobile', 'outlook', 'configuration'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-002',
    authorName: 'Sarah Williams',
    viewCount: 892,
    helpfulCount: 201,
    notHelpfulCount: 12,
    createdAt: '2025-10-05T11:00:00Z',
    updatedAt: '2025-12-10T15:00:00Z',
    publishedAt: '2025-10-05T13:00:00Z'
  },
  {
    id: 'KB-005',
    title: 'How to Use Network Printers',
    content: `# How to Use Network Printers

## Finding Available Printers

Network printers are located throughout the campus:
- Library: 1st, 2nd, and 3rd floors
- Student Center: Main lobby
- Computer Labs: All locations
- Department offices

## Print from Windows

1. Press **Ctrl + P** in any application
2. Click **Add Printer** or select from list
3. Choose your nearest printer (format: BLDG-FLOOR-NUM)
4. Click **Print**

## Print from macOS

1. Press **Cmd + P**
2. Select printer from dropdown
3. Adjust settings if needed
4. Click **Print**

## Mobile Printing

1. Send document to print@university.edu
2. Go to any printer
3. Swipe your student ID
4. Select your document
5. Tap **Print**

## Print Costs
- B&W: $0.05 per page
- Color: $0.25 per page
- Add funds at the library service desk

## Common Issues

### Print job stuck in queue
- Cancel and resend the job
- Try a different printer
- Check printer display for errors

### Poor print quality
- Check paper type settings
- Report to IT if persistent
`,
    summary: 'Guide for using network printers across campus including mobile printing options.',
    category: 'Hardware & Equipment',
    tags: ['printing', 'printer', 'network', 'mobile'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: false,
    authorId: 'staff-002',
    authorName: 'Sarah Williams',
    viewCount: 654,
    helpfulCount: 145,
    notHelpfulCount: 8,
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-11-15T14:00:00Z',
    publishedAt: '2025-10-20T12:00:00Z'
  },
  {
    id: 'KB-006',
    title: 'Software Installation Request Process',
    content: `# Software Installation Request Process

## Overview
This article explains how to request software installation on university-managed computers.

## Available Software

Standard software is pre-installed on all university computers:
- Microsoft Office 365
- Adobe Acrobat Reader
- Web browsers (Chrome, Firefox, Edge)
- Antivirus software

## Requesting Additional Software

### Step 1: Check Software Catalog
Visit https://software.university.edu to see available software

### Step 2: Submit Request
1. Log into the IT Service Portal
2. Click "Submit Ticket"
3. Select category "Software"
4. Provide:
   - Computer ID or location
   - Software name and version
   - Business justification
   - License information (if personal)

### Step 3: Approval Process
- Standard software: Usually approved within 1 business day
- Specialized software: May require department head approval
- Licensed software: Requires valid license proof

### Step 4: Installation
IT staff will schedule installation or provide remote installation instructions.

## Self-Service Software
Some approved software can be installed via Software Center without a ticket.

## Important Notes
- Personal software may not be installed on university computers
- Software must be compatible with our security policies
- Some software may require training before installation
`,
    summary: 'Process and guidelines for requesting software installation on university computers.',
    category: 'Software & Applications',
    tags: ['software', 'installation', 'request', 'applications'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: false,
    authorId: 'staff-002',
    authorName: 'Sarah Williams',
    viewCount: 423,
    helpfulCount: 98,
    notHelpfulCount: 5,
    createdAt: '2025-11-01T09:00:00Z',
    updatedAt: '2025-12-05T11:00:00Z',
    publishedAt: '2025-11-01T11:00:00Z'
  },
  {
    id: 'KB-007',
    title: 'Two-Factor Authentication Setup',
    content: `# Two-Factor Authentication (2FA) Setup

## What is 2FA?
Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.

## Why Use 2FA?
- Protects against password theft
- Required for accessing sensitive systems
- Reduces risk of account compromise

## Setup Instructions

### Using Authenticator App (Recommended)

1. Download an authenticator app:
   - Microsoft Authenticator
   - Google Authenticator
   - Authy

2. Log into https://account.university.edu

3. Go to **Security Settings** > **Two-Factor Authentication**

4. Click **Set Up Authenticator App**

5. Scan the QR code with your app

6. Enter the 6-digit code from the app

7. Save your backup codes securely

### Using SMS (Backup Option)

1. Go to Security Settings
2. Select **SMS Verification**
3. Enter your mobile number
4. Verify with the code sent to your phone

## Using 2FA

When logging in:
1. Enter your username and password
2. Open your authenticator app
3. Enter the current 6-digit code
4. Click **Verify**

## Lost Your Device?
- Use one of your backup codes
- Contact IT Support with valid ID for reset
`,
    summary: 'Step-by-step guide to enable two-factor authentication for enhanced account security.',
    category: 'Security & Privacy',
    tags: ['2fa', 'security', 'authentication', 'account'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 756,
    helpfulCount: 189,
    notHelpfulCount: 7,
    createdAt: '2025-11-10T14:00:00Z',
    updatedAt: '2025-12-20T10:00:00Z',
    publishedAt: '2025-11-10T16:00:00Z'
  },
  {
    id: 'KB-008',
    title: 'Internal: Network Troubleshooting Procedures',
    content: `# Network Troubleshooting Procedures (IT Staff Only)

## Initial Diagnostics

### Step 1: Gather Information
- User location and device type
- Error messages observed
- When the issue started
- Recent changes made

### Step 2: Check Network Status
- Monitor dashboard: https://netmon.university.edu
- Check for ongoing outages
- Review recent alerts

## Common Issues and Solutions

### DHCP Failures
1. Check DHCP server status
2. Verify scope availability
3. Clear stale leases if needed
4. Restart DHCP service as last resort

### DNS Resolution Issues
1. Test with nslookup/dig
2. Check DNS server health
3. Flush DNS cache on affected device
4. Verify DNS records

### Switch/AP Issues
1. Check port status
2. Review error logs
3. Test with known-good device
4. Schedule hardware replacement if faulty

## Escalation Procedures
- Level 1: Basic troubleshooting (30 min)
- Level 2: Advanced diagnostics (2 hours)
- Level 3: Infrastructure team (critical only)

## Documentation
Always update the ticket with:
- Steps performed
- Results of each test
- Resolution applied
- Time spent
`,
    summary: 'Internal guide for IT staff on network troubleshooting procedures and escalation.',
    category: 'Troubleshooting Guides',
    tags: ['network', 'troubleshooting', 'internal', 'procedures'],
    status: 'published',
    accessLevel: 'internal',
    isFAQ: false,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 234,
    helpfulCount: 67,
    notHelpfulCount: 2,
    createdAt: '2025-09-20T09:00:00Z',
    updatedAt: '2025-12-18T11:00:00Z',
    publishedAt: '2025-09-20T11:00:00Z'
  },
  {
    id: 'KB-009',
    title: 'Getting Started with the IT Service Portal',
    content: `# Getting Started with the IT Service Portal

## Welcome!
The IT Service Portal is your one-stop destination for IT support at the university.

## What You Can Do

### Submit Support Tickets
- Report IT issues
- Request services
- Track your requests

### Browse Knowledge Base
- Find solutions to common problems
- Learn how to use IT services
- Access setup guides

### Check Service Status
- View current outages
- Planned maintenance schedules

## Creating Your First Ticket

1. Click **Submit Ticket** on the dashboard
2. Enter a descriptive **Title**
3. Select the appropriate **Category**
4. Describe your issue in detail
5. Set the **Priority** based on urgency
6. Attach any relevant screenshots
7. Click **Submit**

## Tips for Effective Tickets

**DO:**
- Be specific about the problem
- Include error messages
- Mention when it started
- Provide your contact info

**DON'T:**
- Submit duplicate tickets
- Use vague titles like "Help!"
- Include sensitive passwords

## Response Times
| Priority | First Response | Target Resolution |
|----------|----------------|-------------------|
| Urgent   | 30 minutes     | 4 hours          |
| High     | 1 hour         | 8 hours          |
| Medium   | 4 hours        | 24 hours         |
| Low      | 8 hours        | 48 hours         |

## Need Help?
- Check the FAQ section
- Search the Knowledge Base
- Contact IT Help Desk: x8999
`,
    summary: 'Introduction to using the IT Service Portal for submitting tickets and finding help.',
    category: 'Getting Started',
    tags: ['portal', 'getting started', 'tickets', 'help'],
    status: 'published',
    accessLevel: 'public',
    isFAQ: true,
    authorId: 'staff-001',
    authorName: 'Mike Johnson',
    viewCount: 1892,
    helpfulCount: 423,
    notHelpfulCount: 11,
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2026-01-05T09:00:00Z',
    publishedAt: '2025-08-01T12:00:00Z'
  },
  {
    id: 'KB-010',
    title: 'Draft: New Student Onboarding Guide',
    content: `# New Student Onboarding Guide

## Welcome New Students!

This guide will help you set up your IT services.

## TODO
- [ ] Add account activation steps
- [ ] Include WiFi setup link
- [ ] Add email configuration
- [ ] Include LMS access instructions
- [ ] Add software download links

## Draft Notes
- Need to coordinate with Student Services
- Screenshots pending
- Review deadline: January 30, 2026
`,
    summary: 'Comprehensive onboarding guide for new students (Draft)',
    category: 'Getting Started',
    tags: ['onboarding', 'new students', 'setup'],
    status: 'draft',
    accessLevel: 'public',
    isFAQ: false,
    authorId: 'staff-002',
    authorName: 'Sarah Williams',
    viewCount: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-14T15:00:00Z'
  }
]

// Get FAQ articles
export function getFAQArticles(): KnowledgeArticle[] {
  return mockArticles.filter(a => a.isFAQ && a.status === 'published')
}

// Get published articles
export function getPublishedArticles(): KnowledgeArticle[] {
  return mockArticles.filter(a => a.status === 'published')
}

// Search articles
export function searchArticles(keyword: string): KnowledgeArticle[] {
  const lowerKeyword = keyword.toLowerCase()
  return mockArticles.filter(a => 
    a.status === 'published' &&
    (a.title.toLowerCase().includes(lowerKeyword) ||
     a.content.toLowerCase().includes(lowerKeyword) ||
     a.tags.some(t => t.toLowerCase().includes(lowerKeyword)))
  )
}

// Get suggested articles based on query
export function getSuggestedArticles(query: string, limit = 5): KnowledgeArticle[] {
  const results = searchArticles(query)
  return results.slice(0, limit)
}
