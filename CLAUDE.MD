# Claude AI Assistant Guide for Ninkasi

## Project Overview

Ninkasi is a private admin GUI for managing Entur's data pipeline and inspecting data status. It's an internal tool used by Entur (Norwegian public transport authority) staff to manage their data infrastructure.

**Production URL:** https://ninkasi.dev.entur.org/

## Tech Stack

- **Frontend Framework:** React 19 with TypeScript/JSX
- **Build Tool:** Vite 7
- **State Management:** Redux with redux-thunk and redux-logger
- **UI Library:** Material-UI (MUI) v7
- **Routing:** React Router v5
- **Authentication:** OIDC via react-oidc-context
- **Styling:** Sass/SCSS with Emotion
- **Testing:** Vitest with React Testing Library
- **Code Quality:** ESLint, Prettier, Husky, lint-staged
- **Deployment:** Firebase Hosting

## Project Structure

```
ninkasi/
├── src/
│   ├── actions/           # Redux actions and API calls
│   │   ├── AppActions.js
│   │   ├── OrganizationRegisterActions.js
│   │   ├── SuppliersActions.js
│   │   └── UserActions.js
│   ├── reducers/          # Redux reducers
│   │   ├── AppReducer.js
│   │   ├── OrganizationReducer.js
│   │   ├── SuppliersReducer.js
│   │   └── UserReducer.js
│   ├── app/               # Main app components
│   │   ├── App.tsx        # Root component
│   │   ├── Router.jsx     # Route definitions
│   │   └── components/    # Shared components
│   ├── screens/           # Feature screens
│   │   ├── common/
│   │   ├── geocoder/
│   │   ├── organization/
│   │   └── providers/
│   ├── modals/            # Modal dialogs
│   ├── auth/              # Authentication setup
│   ├── config/            # Environment configuration
│   ├── contexts/          # React contexts
│   ├── models/            # Data models
│   ├── sass/              # Global styles
│   ├── static/            # Static assets
│   ├── store/             # Redux store setup
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── public/                # Static files
└── build/                 # Production build output
```

## Key Architecture Patterns

### State Management

- Uses Redux with thunk middleware for async actions
- Reducers organized by domain (App, Organization, Suppliers, User, Marduk, UserContext, Utils)
- Redux DevTools integration for debugging

### Authentication

- OIDC authentication via Auth0 (dev/staging) and auth2.entur.org (production)
- Protected routes require admin role (`isRouteDataAdmin` in UserContextReducer)
- Token management handled by react-oidc-context
- Automatic signin redirect for unauthenticated users

### Configuration

- Environment-based config loaded from `src/config/environments/`
- Backend API endpoints configurable via environment variables:
  - `PROVIDERS_BASE_URL`
  - `ORGANISATIONS_BASE_URL`
  - `TIMETABLE_ADMIN_BASE_URL`
  - `MAP_ADMIN_BASE_URL`
  - `GEOCODER_ADMIN_BASE_URL`
  - `EVENTS_BASE_URL`
  - `ENDPOINTBASE` (optional namespace override)

### Component Structure

- Migrating from JSX to TSX (mixed codebase)
- Material-UI components with custom theming
- Functional components with hooks
- Redux connected components using `connect()` HOC

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 9000)
npm run start

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run check

# Preview production build
npm run preview
```

## Working with the Codebase

### Adding New Features

1. Create action creators in `src/actions/`
2. Add reducers in `src/reducers/`
3. Build UI components in `src/screens/` or `src/app/components/`
4. Connect components to Redux using `connect()` or hooks
5. Update routes in `src/app/Router.jsx` if needed

### Making API Calls

- Use existing action creators as templates
- API config utilities in `src/actions/getApiConfig.js`
- Token retrieval pattern: `getToken` callback passed to actions
- Axios for HTTP requests

### Styling

- Global styles in `src/sass/`
- Component-level styles using Emotion or MUI's `sx` prop
- Follow existing Material-UI theming

### Testing

- Test files colocated in `tests/` directory
- Use Vitest and React Testing Library
- Run tests before committing

## Important Conventions

### Code Style

- Use ESLint and Prettier (enforced via Husky pre-commit hooks)
- TypeScript preferred for new files
- Functional components with hooks
- Minimal comments (code should be self-documenting)

### File Organization

- Actions and reducers named after their domain
- Components organized by feature/screen
- Shared components in `app/components/`
- Keep files focused on single responsibility

### State Updates

- Always use Redux actions for state changes
- Avoid local state for data that needs to be shared
- Use React Context for configuration and auth

## Common Pitfalls

1. **Mixed JS/TS codebase:** Some files are `.jsx`, others `.tsx`. Maintain consistency within each file.
2. **Router version:** Using React Router v5 (not v6), so use older API patterns.
3. **Authentication:** Always check `auth.isAuthenticated` before rendering protected content.
4. **Build vs Dev:** Vite dev server runs on port 9000; production builds to `build/` directory.
5. **Path aliases:** Use configured aliases (`@`, `app`, `config`, etc.) instead of relative imports.

## Security Considerations

- Content Security Policy configured in `firebase.json`
- OIDC authentication required for all access
- Admin role check via `isRouteDataAdmin`
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- No secrets in source code

## Deployment

- Builds to `build/` directory
- Deployed via Firebase Hosting
- Single-page app with client-side routing (all routes serve `index.html`)
- Cache headers configured for static assets (1 year) and HTML (60 seconds)

## External Integrations

The app integrates with multiple Entur backend services:

- **Organizations API:** Manage organizations and users
- **Providers API:** Manage data providers
- **Timetable Admin:** Timetable data management
- **Map Admin:** Geographic data management
- **Geocoder Admin:** Geocoding services
- **Events API:** Event tracking and monitoring
- **Marduk:** Data pipeline service (inferred from MardukReducer)

## Node.js Requirements

- Node.js v18 or newer required
- npm for package management

## Tips for AI Assistants

1. **Read before modifying:** Always check existing patterns in similar files
2. **Minimal changes:** This is a production system; make surgical changes only
3. **Test before committing:** Run `npm run lint` and `npm run test`
4. **Follow conventions:** Match existing code style and patterns
5. **TypeScript migration:** Prefer TypeScript for new files, but don't force-migrate existing JS
6. **Redux patterns:** Follow established action/reducer patterns
7. **Authentication flow:** Respect the OIDC authentication requirements
8. **Environment config:** Never hardcode URLs; use configuration system

## Getting Help

- Check `README.md` for setup and configuration details
- Review existing components for patterns and examples
- Redux DevTools available in development for debugging state
- Vite dev server provides detailed error messages
