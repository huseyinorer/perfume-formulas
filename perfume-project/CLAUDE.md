# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a perfume formula management application built with React (frontend) and Express.js (backend). It allows users to browse perfume formulas, submit their own formulas, rate and comment on formulas, and manage perfume stock. The app includes user authentication with role-based access (admin/user).

## Architecture

### Frontend (React + TypeScript + Vite)
- **Component Structure**: Mix of `.tsx` and `.jsx` files, using Radix UI components and custom UI components
- **State Management**: Custom React hooks (`useAuth`, `usePerfumes`, `useFormulas`, `useAdmin`) manage application state
- **Routing**: Single-page application with dialog-based navigation (no react-router)
- **API Communication**: Centralized through services (`authApi`, `perfumesApi`, `formulasApi`, `favoritesApi`)
- **Styling**: TailwindCSS with dark mode support via ThemeContext

### Backend (Express.js + PostgreSQL)
- **Database**: PostgreSQL with connection pooling (pg library)
- **Authentication**: JWT-based authentication with middleware
- **Route Organization**: Separate route files for each domain (auth, perfumes, formulas, favorites, ratings, brands, stock)
- **Middleware**: Authentication middleware (`authenticateToken`, `requireAdmin`) and error handling middleware

### Key Data Flow
1. User authenticates → JWT token stored in localStorage
2. Frontend hooks fetch data through API services → Services use axios instance with interceptors
3. Axios interceptor adds JWT token to all requests
4. Backend routes validate token and check admin status via middleware
5. Database operations performed through pooled connections

## Common Commands

### Development
```bash
npm run dev              # Run both frontend and backend concurrently
npm run dev:frontend     # Run Vite dev server only (port 5173)
npm run dev:backend      # Run Express server only (port 10000 or PORT env)
```

### Testing
```bash
npm test                 # Run all tests with Vitest
npm run test:coverage    # Run tests with coverage report
```

### Code Quality
```bash
npm run lint             # Check for linting issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Database Migrations
```bash
npm run migrate          # Run pending migrations
npm run migrate:down     # Rollback last migration
npm run migrate:create   # Create new migration file
```

### Build & Deploy
```bash
npm run build            # Build frontend for production (outputs to dist/)
npm run predeploy        # Runs build automatically before deploy
npm run deploy           # Deploy to GitHub Pages
```

### Production
```bash
npm start                # Start production server (runs server.js)
```

## Environment Configuration

Required environment variables (not tracked in git):
- `DB_USER` - PostgreSQL user
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_PASSWORD` - Database password
- `DB_PORT` - PostgreSQL port (typically 5432)
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (defaults to 10000)
- `VITE_API_URL` - Frontend API URL (set in .env for Vite)

## Path Aliases

Both TypeScript and Vite configs use the same path aliases:
```typescript
@/*          → ./src/*
@/components → ./src/components/*
@/hooks      → ./src/hooks/*
@/services   → ./src/services/*
@/utils      → ./src/utils/*
@/types      → ./src/types/*
```

## Authentication Flow

1. **Login**: User submits credentials → Backend validates → Returns JWT token and user object
2. **Token Storage**: Token stored in localStorage with key "token"
3. **Token Verification**: `useAuth` hook decodes JWT and checks expiration on mount
4. **Auto-logout**: Timer set to check token expiration periodically (max 1 hour intervals)
5. **Request Authentication**: Axios interceptor adds `Authorization: Bearer <token>` header
6. **401 Response**: Interceptor catches 401, removes token, dispatches 'auth:logout' event

## Database Schema (Key Tables)

- `Users` - User accounts with username, password (bcrypt), isAdmin flag
- `Perfumes` - Perfume catalog with brand, name, notes, family info
- `PerfumeFormulas` - Approved formulas (fragrance%, alcohol%, water%, restDay)
- `FormulaPendingRequests` - User-submitted formulas awaiting admin approval
- `Brands` - Perfume brand information
- `Favorites` - User favorite perfumes (user_id, perfume_id)
- `FormulaRatings` - Formula ratings and comments by users
- `PerfumeStock` - Stock management and maturation tracking

## Important Patterns

### Hook-Based Architecture
The app uses custom hooks to encapsulate business logic:
- `useAuth()` - Authentication state, login/logout, token management
- `usePerfumes()` - Perfume listing, pagination, search
- `useFormulas()` - Formula fetching, submission, ratings, deletion
- `useAdmin()` - Admin-specific actions (pending requests, approval/rejection)

### Admin vs User Features
- **Admin Only**: Add/delete perfumes, add formulas directly, approve/reject pending formulas, manage stock
- **User**: Request formulas (goes to pending), rate/comment on formulas, favorite perfumes
- Admin status determined by `isAdmin` field in JWT payload

### Formula Workflow
1. **Admin Path**: Create formula → Directly added to `PerfumeFormulas` table
2. **User Path**: Request formula → Added to `FormulaPendingRequests` → Admin reviews → On approval, copied to `PerfumeFormulas`

### CORS Configuration
Backend allows origins:
- `http://localhost:5173` (dev)
- `https://huseyinorer.github.io`
- `https://huseyinorer.github.io/perfume-formulas`

### Production Build
- Vite base path set to `/perfume-formulas/` in production
- Deployed via gh-pages to GitHub Pages
- Backend expects to be deployed separately

## Testing Setup

- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library with jest-dom matchers
- **Setup File**: `src/test/setup.ts` imports @testing-library/jest-dom
- **Config**: Tests configured in vite.config.ts with globals enabled
- **Test Files**: Located in `__tests__` directories next to source files
- **Coverage**: Run `npm run test:coverage` for coverage report

## Security Features

### Input Validation
- **Library**: Joi for schema validation
- **Validators**: Located in `server/validators/`
  - `formula.validator.js` - Formula submission validation
  - `auth.validator.js` - Authentication validation
  - `perfume.validator.js` - Perfume CRUD validation
- **Custom Rules**: Percentage sum validation (must equal 100%)

### Rate Limiting
- **Middleware**: `server/middleware/rateLimit.middleware.js`
- **Limits**:
  - General API: 100 requests/15 minutes
  - Auth endpoints: 5 attempts/15 minutes
  - Formula submissions: 10/hour
  - Comments/Ratings: 20/10 minutes

### HttpOnly Cookie Authentication
- **Primary**: JWT tokens stored in httpOnly cookies (XSS protection)
- **Fallback**: Authorization header for backward compatibility
- **Cookie Settings**:
  - httpOnly: true
  - secure: true (production only)
  - sameSite: 'none' (production) / 'lax' (development)
  - maxAge: 30 days
- **Frontend**: axios configured with `withCredentials: true`

## Code Quality Tools

### ESLint
- **Config**: `eslint.config.js` using flat config format
- **Plugins**: TypeScript, React, React Hooks, Prettier
- **Rules**: Customized for TypeScript + React development

### Prettier
- **Config**: `.prettierrc`
- **Standards**:
  - Single quotes
  - Semicolons
  - 2 space indentation
  - 100 character line width

## Database Migrations

- **Tool**: node-pg-migrate
- **Config**: `.node-pg-migraterc.json`
- **Migrations**: Stored in `migrations/` directory
- **Environment**: Requires `DATABASE_URL` in .env
- **Best Practices**: Never modify existing migrations, always create new ones
