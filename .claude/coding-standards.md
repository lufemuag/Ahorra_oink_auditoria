# Coding Standards - Ahorra Oink

## Component Patterns (MANDATORY)

### File Structure
- Each component has its own folder with .jsx and .css files
- Use PascalCase for component names
- CSS files should match component names
- Import CSS files in component files

### React Patterns
```javascript
// CORRECT: Functional components with hooks
import React, { useState, useEffect } from 'react';

const ComponentName = () => {
  // hooks first
  const [state, setState] = useState();
  
  // effects
  useEffect(() => {
    // logic
  }, []);
  
  // handlers
  const handleAction = () => {
    // logic
  };

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### CSS Standards
```css
/* Use CSS variables from globals.css */
.component-name {
  background: var(--white);
  color: var(--dark-green);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Follow BEM-like naming */
.component-name__element {
  /* styles */
}

.component-name--modifier {
  /* styles */
}
```

### localStorage Integration
```javascript
// ALWAYS use the established service patterns
import { authService } from '../services/authService';

// Data keys follow naming convention
const DATA_KEY = 'ahorra_oink_feature_name';
```

## Error Handling Patterns
- Always handle loading states
- Show user-friendly error messages
- Use established error styling classes
- Never crash the app, always provide fallbacks

## Animation Standards
- Use established CSS animation classes
- Follow existing transition patterns
- Keep animations subtle and performant
- Use established timing variables