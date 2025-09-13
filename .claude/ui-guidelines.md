# UI/UX Guidelines - Ahorra Oink

## Design System (IMMUTABLE)

### Color Usage Rules
- **Primary Green (#3B8048)**: Main actions, navigation, success states
- **Dark Green (#0C1A0E)**: Text, headers, serious content  
- **Primary Yellow (#FED16A)**: Highlights, warnings, secondary actions
- **Light Yellow (#FFF4A4)**: Backgrounds, subtle highlights

### Typography Hierarchy
```css
/* Use established font size variables */
--font-size-xs: 0.75rem    /* Small labels */
--font-size-sm: 0.875rem   /* Body text, captions */  
--font-size-base: 1rem     /* Default body text */
--font-size-lg: 1.125rem   /* Sub-headers */
--font-size-xl: 1.25rem    /* Section headers */
--font-size-2xl: 1.5rem    /* Page headers */
--font-size-3xl: 1.875rem  /* Main titles */
--font-size-4xl: 2.25rem   /* Hero text */
```

### Spacing System
```css
/* ALWAYS use spacing variables */
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
--spacing-3xl: 4rem     /* 64px */
```

### Button Styles (ESTABLISHED)
- `.btn-primary`: Green gradient, white text
- `.btn-secondary`: Yellow gradient, dark text  
- `.btn-outline`: Transparent with border
- `.btn-sm`, `.btn-lg`: Size variants

### Card Components
- Always use `.card` base class
- Include hover effects with `transform: translateY(-2px)`
- Use established shadow variables
- Maintain consistent padding with spacing variables

### Animation Standards
- **Fast**: 150ms for micro-interactions
- **Normal**: 300ms for standard transitions
- **Slow**: 500ms for major state changes
- Use `ease-in-out` timing function
- Subtle transforms (max 5px movement)

## Layout Patterns

### Grid Systems
```css
/* Use CSS Grid for complex layouts */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
```

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## Icon Usage
- Use React Icons (fa family)
- Consistent sizing with font-size variables
- Match icon style to content context
- Always provide accessible labels