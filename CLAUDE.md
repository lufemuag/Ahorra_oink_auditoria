# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ahorra Oink is a personal finance web application built with React and Vite. The app helps users manage income, expenses, and savings goals with an educational focus and gamification elements.

## Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.1.2
- **Routing**: React Router DOM 7.8.2  
- **Icons**: React Icons 5.5.0
- **Styling**: CSS with custom variables and utility classes
- **Data Storage**: localStorage (no backend)
- **Authentication**: Custom context with localStorage

## Development Commands

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/         # Reusable components (ProtectedRoute, etc.)
│   ├── layout/         # Layout components (Header, Layout)
│   ├── auth/          # Authentication components
│   └── dashboard/     # Dashboard-specific components
├── pages/
│   ├── Auth/          # Login, Register pages
│   ├── Dashboard/     # Main dashboard page
│   ├── Profile/       # User profile page
│   └── Information/   # Educational content page
├── context/           # React Context providers
├── services/          # API/localStorage services  
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── styles/            # Global CSS and style utilities
```

## Color Palette

- **Primary Green**: #3B8048
- **Dark Green**: #0C1A0E  
- **Primary Yellow**: #FED16A
- **Light Yellow**: #FFF4A4

## Key Architecture Decisions

- **Authentication**: Uses React Context + localStorage for user session management
- **Data Persistence**: All user data stored in localStorage with structured keys:
  - `ahorra_oink_auth` - Authentication data
  - `ahorra_oink_users` - User accounts
  - `ahorra_oink_transactions` - Financial transactions
  - `ahorra_oink_goals` - Savings goals
- **Routing**: Protected routes wrap authenticated pages
- **State Management**: React Context for global state, useState/useReducer for local state
- **Styling**: Custom CSS with CSS variables, no external CSS frameworks

## Component Patterns

- Use functional components with hooks
- Context providers for global state (auth, theme, etc.)
- Custom hooks for reusable logic
- CSS classes follow BEM-like naming convention
- Components have co-located CSS files

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  settings: { notifications: boolean, currency: string },
  achievements: array,
  stats: { totalSavings: number, totalIncome: number, ... }
}
```

### Transaction  
```javascript
{
  id: string,
  userId: string,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string
}
```

## Development Guidelines

- All new components should have TypeScript-style prop validation
- Use the established color variables for consistent theming
- Follow the existing folder structure when adding new features
- Implement responsive design (mobile-first approach)
- Add loading states and error handling for user interactions
- Use the existing animation classes for consistent UX

## Current Implementation Status

✅ **Completed:**
- Authentication system (login/register/logout)
- Dashboard with financial overview
- Responsive navigation and layout
- Basic routing and protected routes
- Color system and styling foundation

🔄 **In Progress/Planned:**
- Profile management page
- Information/education page  
- Financial transaction management
- Savings goals system
- Charts and statistics
- Notifications system
- Achievement/gamification system

## Testing

Currently no automated tests are set up. When adding tests:
- Use React Testing Library for component tests
- Test authentication flows thoroughly
- Mock localStorage for consistent test environment