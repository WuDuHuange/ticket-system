# IT Service Ticketing and Knowledge Base Platform

A Vue 3 + TypeScript frontend for IT service ticket management and knowledge base system.

## Features

- **User Authentication**: Login with SSO support, role-based access control
- **Ticket Management**: Create, view, update, and manage support tickets
- **Knowledge Base**: Browse articles, FAQ, and search for solutions
- **Admin Dashboard**: Analytics, user management, team management, system settings
- **Mock API**: Complete mock service for frontend development

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **State Management**: Pinia
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **Mock Service**: MockJS patterns
- **Markdown Editor**: md-editor-v3
- **CSS**: Sass/SCSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd ticket-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Accounts

The application includes mock data with the following demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | Any |
| Manager | manager@university.edu | Any |
| Support Staff | staff1@university.edu | Any |
| End User | john.doe@university.edu | Any |

Use the "Quick Fill" buttons on the login page to auto-fill credentials.

## Project Structure

```
src/
├── api/                 # API client and endpoints
│   ├── client.ts       # Axios configuration
│   └── endpoints.ts    # API endpoint definitions
├── assets/             # Static assets
├── components/         # Shared components
├── layouts/            # Layout components
│   ├── MainLayout.vue  # Main application layout
│   └── AdminLayout.vue # Admin section layout
├── mock/               # Mock service
│   ├── data/          # Mock data files
│   └── index.ts       # Mock handlers
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
│   ├── user.ts        # User authentication state
│   ├── ticket.ts      # Ticket management state
│   ├── knowledge.ts   # Knowledge base state
│   └── ui.ts          # UI state (sidebar, theme)
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── views/              # Page components
    ├── admin/         # Admin pages
    ├── auth/          # Authentication pages
    ├── dashboard/     # Dashboard page
    ├── error/         # Error pages
    ├── knowledge/     # Knowledge base pages
    ├── profile/       # User profile page
    └── tickets/       # Ticket management pages
```

## User Roles

1. **End User (end_user)**
   - Submit tickets
   - View own tickets
   - Browse knowledge base
   - Submit satisfaction ratings

2. **Support Staff (support_staff)**
   - All end user capabilities
   - View and manage assigned tickets
   - Access internal knowledge articles

3. **Manager (manager)**
   - All support staff capabilities
   - View all tickets
   - Access analytics dashboard
   - Manage teams

4. **Admin (admin)**
   - Full system access
   - User management
   - Team management
   - Knowledge base management
   - System settings
   - Audit logs

## Pages Overview

| Page | Path | Access |
|------|------|--------|
| Login | /login | Public |
| Dashboard | /dashboard | All authenticated |
| Create Ticket | /tickets/create | All authenticated |
| My Tickets | /tickets/my | All authenticated |
| All Tickets | /tickets | Staff, Manager, Admin |
| Ticket Detail | /tickets/:id | Owner or Staff+ |
| Knowledge Base | /knowledge | All authenticated |
| Article Detail | /knowledge/:id | All authenticated |
| FAQ | /knowledge/faq | All authenticated |
| Profile | /profile | All authenticated |
| Analytics | /admin/analytics | Manager, Admin |
| User Management | /admin/users | Admin |
| Team Management | /admin/teams | Manager, Admin |
| Article Management | /admin/articles | Manager, Admin |
| System Settings | /admin/settings | Admin |

## API Documentation

See [docs/API_INTERFACES.md](docs/API_INTERFACES.md) for complete API specification.

## Development Notes

### Mock Service

The application uses a mock service (`src/mock/index.ts`) to simulate backend API responses. When integrating with a real backend:

1. Update `src/api/endpoints.ts` to call actual API endpoints
2. Remove or disable mock imports in `src/stores/`
3. Configure API base URL in environment variables

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=/api
```

### Customization

- **Theme**: Modify `src/styles/main.scss` for global styles
- **Element Plus Theme**: Customize via CSS variables
- **Dark Mode**: Built-in support, toggle via UI

## License

MIT
