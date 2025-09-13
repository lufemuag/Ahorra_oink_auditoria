# Data Models - Ahorra Oink

## localStorage Keys (IMMUTABLE)
- `ahorra_oink_auth` - Authentication data
- `ahorra_oink_users` - User accounts
- `ahorra_oink_transactions` - Financial transactions  
- `ahorra_oink_goals` - Savings goals
- `ahorra_oink_notifications` - User notifications

## User Model (ESTABLISHED)
```javascript
{
  id: string,                    // Unique identifier
  username: string,              // Username (unique, alphanumeric + _)
  password: string,              // Encrypted password
  firstName: string,             // User first name
  lastName: string,              // User last name
  role: 'admin' | 'user',       // User role (admin/user)
  createdAt: string,            // ISO date string
  updatedAt: string,            // ISO date string
  settings: {
    notifications: boolean,      // App notifications enabled
    currency: string,           // Default: 'USD'
    theme: string              // Default: 'light'
  },
  achievements: array,          // Achievement IDs earned
  stats: {
    totalSavings: number,       // Total amount saved
    totalIncome: number,        // Total income recorded
    totalExpenses: number,      // Total expenses recorded
    streak: number             // Days streak of activity
  }
}
```

## Transaction Model
```javascript
{
  id: string,                   // Unique identifier
  userId: string,               // Reference to user
  type: 'income' | 'expense',   // Transaction type
  amount: number,               // Amount (positive number)
  category: string,             // Category name
  description: string,          // User description
  date: string,                // ISO date string
  createdAt: string,           // When recorded
  tags: array                  // Optional tags
}
```

## Savings Goal Model
```javascript
{
  id: string,                  // Unique identifier
  userId: string,              // Reference to user
  title: string,               // Goal title
  targetAmount: number,        // Target amount to save
  currentAmount: number,       // Current progress
  deadline: string,            // Target date (ISO)
  category: string,            // Goal category
  method: string,              // Saving method (50/30/20, fixed, etc.)
  isActive: boolean,           // Goal is active
  createdAt: string,          // Creation date
  completedAt: string         // Completion date (if completed)
}
```

## CRITICAL RULES
- **NEVER** change existing field names or types
- **ALWAYS** maintain backward compatibility
- **ADD** new fields with default values only
- **PRESERVE** all existing data relationships