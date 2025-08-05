# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ninkasi is Entur's private admin GUI for managing data pipelines and inspecting data status. It's a React 18 application built with Vite, using Redux for state management and Material-UI for components.

## Development Commands

### Core Commands
- `npm start` - Start development server (Vite) on port 3000
- `npm run build` - Build production bundle to `build/` directory
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier
- `npm run check` - Check code formatting

### Testing
- `npm test` - Run all tests in watch mode
- `npm test -- --run` - Run tests once without watch mode
- Tests are located in `src/tests/` and use Vitest with jsdom environment

## Architecture

### Build System
- **Vite 7.0.6** with React plugin for fast development and optimized builds
- **Path aliases** configured in `vite.config.js` for clean imports:
  - `app` → `src/app`
  - `config` → `src/config`
  - `store` → `src/store`
  - `actions` → `src/actions`
  - `reducers` → `src/reducers`
  - `modals` → `src/modals`
  - `screens` → `src/screens`
  - `utils` → `src/utils`
  - `models` → `src/models`
  - `static` → `src/static`

### State Management (Redux)
- **Store**: Configured in `src/store/store.js` with Redux DevTools, logger middleware, and router integration
- **Reducers**: Combined in `src/reducers/index.js` with connected-react-router for navigation state
- **Actions**: Centralized action types in `src/actions/actionTypes.js` with extensive async action support
- **Key State Slices**:
  - `SuppliersReducer` - Data provider management
  - `MardukReducer` - Data pipeline operations
  - `OrganizationReducer` - Organization and user management
  - `UserReducer` - User-specific state
  - `UtilsReducer` - App configuration and utilities

### Environment Configuration
- **Dynamic config loading** via `src/config/readConfig.js`
- **Environment files**: `src/config/environments/{dev,test,prod}.json`
- **Runtime environment detection** with fallback to production
- **Key config properties**:
  - API base URLs for various microservices
  - Auth0 configuration
  - Micro-frontend URLs
  - Environment-specific feature flags

### Authentication
- **Auth0 + OIDC** via `react-oidc-context`
- **Keycloak integration** for JWT token handling
- **Environment variables** for auth server configuration:
  - Use `PORT=8000` or `PORT=9000` for development against dev Keycloak
  - Set `AUTH_SERVER_URL` for custom auth server

### UI Architecture
- **Routing**: React Router v5 with connected-react-router for Redux integration
- **Component hierarchy**:
  - `src/screens/` - Top-level page components
  - `src/modals/` - Dialog and modal components
  - `src/app/components/` - Shared UI components
- **Styling**: SCSS with Material-UI v4 and legacy material-ui v0.20
- **Icons**: react-icons v2.2.7 (use ES6 imports, not require())

### File Structure Patterns
- **JSX files**: Use `.jsx` extension for files containing JSX
- **Import style**: Use ES6 imports throughout (no CommonJS require())
- **Path imports**: Leverage configured aliases for clean import paths

## Critical Technical Details

### React Compatibility
- **Current version**: React 18.2.0
- **Material-UI limitation**: Legacy material-ui v0.20.0 prevents React 19 upgrade
- **Hot Module Replacement**: Uses Vite's `import.meta.hot` API

### Development Environment Variables
Required for local development against external services:
```bash
PROVIDERS_BASE_URL=<providers-api-url>
ORGANISATIONS_BASE_URL=<organizations-api-url>
TIMETABLE_ADMIN_BASE_URL=<timetable-api-url>
MAP_ADMIN_BASE_URL=<map-api-url>
GEOCODER_ADMIN_BASE_URL=<geocoder-api-url>
EVENTS_BASE_URL=<events-api-url>
```

Optional:
- `ENDPOINTBASE` - Override base path (include trailing slash)
- `AUTH_SERVER_URL` - Custom Keycloak server URL

### Code Style
- **Prettier** configured with single quotes
- **Pre-commit hooks** via Husky for automatic formatting
- **File extensions**: `.jsx` for React components, `.js` for utilities

## Material-UI Migration Status

### Current State (2024)
- **React**: 18.2.0 (stable, ready for React 19 post-migration)
- **Modern MUI**: @mui/material v7.3.0 ✅ (29 components migrated) 
- **Legacy Material-UI**: material-ui v0.20.0 ⚠️ (192 imports remaining)
- **Mixed Theme Setup**: Dual theme providers in `App.jsx` for compatibility

### Migration Strategy
- **Comprehensive plan**: See `MATERIAL_UI_MIGRATION_PLAN.md`
- **Prioritized by usage**: MenuItem (21×) → FlatButton (20×) → SelectField (15×) → Dialog (14×) → TextField (13×)
- **Phased approach**: 4 phases over 14-20 development days
- **Ready for parallel development** via git worktrees

### Key Migration Mappings
- `FlatButton` → `Button variant="text"` (20 uses)
- `SelectField` → `FormControl` + `Select` (15 uses) 
- `Dialog` → `Dialog` + sub-components (14 uses)
- `TextField` → `TextField` (13 uses, mostly compatible)
- SVG Icons → `@mui/icons-material` (50+ individual icons)

When migrating components, always check `MATERIAL_UI_MIGRATION_PLAN.md` for component-specific guidance and breaking changes.