# Ninkasi

Internal admin GUI for managing Entur's NeTEx data pipeline and inspecting data
status. Used by Entur staff to register and configure data providers, run
pipeline operations (import / validate / transfer / export), and look at
delivery and processing history.

Production: <https://ninkasi.entur.org>
Staging: <https://ninkasi.staging.entur.org>
Dev: <https://ninkasi.dev.entur.org>

## Stack

- React 19 + TypeScript, Vite 8 (rolldown)
- MUI v9 with a thin Entur-token theme (`src/theme/theme.ts`)
- Redux Toolkit (`@reduxjs/toolkit`) — slices in `src/reducers/`, async work via
  `createAsyncThunk`
- React Router v7
- OIDC auth via `react-oidc-context`
- Vitest + Testing Library
- date-fns, axios
- Deployed to Firebase Hosting via GitHub Actions

The three former micro-frontends (NeTEx validation reports, events/upload,
line-statistics) are now inlined under `src/screens/providers/components/`.

## Run locally

```bash
npm install
npm run start          # vite dev server on :9000
```

Node 24 is required (the GitHub Actions workflow pins `node-version: 24.16.0`).

By default the dev server reads `public/config.json`, which points at local
mock services. To point a local dev server at the dev environment APIs instead:

```bash
cp public/config.dev.json public/config.json
npm run start
```

`public/config.json` is gitignored from changes in this workflow — see
"Configuration" below.

## Configuration

Ninkasi uses **runtime config**: a single `config.json` is fetched at boot, no
env vars are baked into the bundle. The repo carries four versions:

| File                         | When it's served                                                  |
| ---------------------------- | ----------------------------------------------------------------- |
| `public/config.json`         | Local dev — points at the localhost mock services in this repo.   |
| `public/config.dev.json`     | Copied over `config.json` by the GHA deploy step for the dev env. |
| `public/config.staging.json` | Same, for staging.                                                |
| `public/config.prod.json`    | Same, for prod.                                                   |

The same build artifact ships to every environment; only the JSON differs.
Adding or renaming an environment doesn't require a code change — just edit
the JSON and the deploy workflow.

Each config carries:

- `appEnv` — `local | dev | test | prod`
- `envLabel` / `envLabelColor` — drives the chip next to the wordmark.
  Omitted for prod so the chip disappears.
- API base URLs for each upstream service (timetable-admin, providers,
  organisations, events, map-admin, chouette, …)
- `auth0Domain` / `auth0ClientId` / `auth0Audience` /
  `auth0ClaimsNamespace` — OIDC settings
- `defaultAuthMethod` — `auth0` everywhere except local, which uses a mock
  OAuth2 server (`mockOauth2TokenUrl`)

The `Config` type is in `src/contexts/ConfigContext.tsx`. Components read
config via `useConfig()` or `window.config`.

## Scripts

| Script            | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `npm run start`   | Vite dev server with HMR on port 9000                   |
| `npm run build`   | Type-check (`tsc -b`) then production build to `build/` |
| `npm run preview` | Serve the production build locally                      |
| `npm test`        | Vitest watch                                            |
| `npm run lint`    | ESLint (flat config in `eslint.config.js`)              |
| `npm run check`   | Prettier check                                          |
| `npm run format`  | Prettier write                                          |

Pre-commit hook runs Prettier + ESLint via lint-staged.

## Project layout

```
src/
├── actions/         Legacy thin re-export shims (kept for one-line back-compat)
├── app/             App shell — Router, Header/Menu, NotificationContainer,
│                    LoadingState / EmptyState / ErrorState
├── auth/            OIDC AuthProvider, useAccessToken hook
├── config/          fetchConfig.ts — runtime config loader
├── contexts/        ConfigContext (typed runtime config)
├── modals/          All dialogs (provider editor, role / responsibility /
│                    entity-type / user / M2M client editors, confirmations)
├── reducers/        RTK slices (Suppliers, Marduk, Utils, Organization,
│                    UserContext, App)
├── screens/         Top-level routes
│   ├── common/      SelectSupplier
│   ├── organization/Permissions admin (sidebar of users/roles/orgs/etc.)
│   └── providers/   Timetable-pipeline admin (provider list, tabs for
│                    migrate-data / events / chouette jobs / line statistics,
│                    NeTEx validation reports)
├── store/           configureStore + typed hooks
├── theme/           theme factory + globalStyles
└── utils/           getApiConfig, sort helpers, useAccessToken
```

## Authentication

OIDC via [react-oidc-context](https://github.com/authts/react-oidc-context),
configured against Entur's Auth0 tenants per env. Access is gated on the
`isRouteDataAdmin` role assignment (see `UserContextReducer`); users without
the role see a `NoAccess` screen.

For local development, the `local` config switches `defaultAuthMethod` to
`local` and fetches a token from a mock OAuth2 server at
`http://localhost:21999/default/token`. The `auth/` module handles both paths
transparently.

## Deployment

Two GitHub Actions workflows in `.github/workflows/`:

- **`firebase-hosting-merge.yml`** — runs on every push to `master`. Builds
  once, then deploys to dev → staging → prod sequentially. Each deploy step
  copies `build/config.{env}.json` over `build/config.json` before uploading.
- **`firebase-hosting-pull-request.yml`** — builds and posts a preview URL on
  every PR, using the dev config.

`firebase.json` carves out a no-store cache rule for `/config.json` (above the
catch-all `*.json` 1-year rule) so runtime config changes propagate
immediately.
