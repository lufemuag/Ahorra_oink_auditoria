# Ahorra Oink - Project Overview

## Core Principles
**NEVER change these fundamental decisions without explicit user request:**

### 1. Project Structure
- Frontend-only application using React + Vite
- All data stored in localStorage (NO backend, NO database)
- File structure is established and should NOT be reorganized
- Component organization follows the established pattern

### 2. Technology Stack (FIXED)
- React 19.1.1 + Vite 7.1.2
- React Router DOM for navigation
- React Icons for icons
- Vanilla CSS with CSS variables (NO CSS frameworks like Tailwind, Bootstrap)
- localStorage for all data persistence

### 3. Color Palette (IMMUTABLE)
- Primary Green: #3B8048
- Dark Green: #0C1A0E
- Primary Yellow: #FED16A  
- Light Yellow: #FFF4A4
**DO NOT suggest changing these colors or adding new color schemes**

### 4. Authentication System
- Uses React Context + localStorage
- Custom implementation (NO external auth libraries)
- Data structure is established in authService.js

## What You Can Modify
- Add new features following existing patterns
- Improve existing components without breaking functionality
- Add new pages using the established layout structure
- Enhance styling within the existing color system
- Add new localStorage data structures for new features

## What You MUST NOT Change
- File and folder structure
- Color palette
- Technology stack choices
- Authentication implementation approach
- Component naming patterns
- CSS architecture (variables, utility classes)