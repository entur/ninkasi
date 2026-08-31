# Ninkasi

Internal admin GUI for the transit data pipeline. Staff use it to register and
configure data providers, run pipeline operations (import, validate, transfer,
export), and inspect delivery and processing history.

## Stack

- React 19 + TypeScript, Vite 8 (rolldown)
- MUI v9 with a thin Entur-token theme (`src/theme/theme.ts`)
- Redux Toolkit — slices in `src/reducers/`, async work via `createAsyncThunk`
- React Router v7
- OIDC auth via `react-oidc-context`
- Vitest + Testing Library, Biome for lint and format
- Deployed to Firebase Hosting via GitHub Actions

## Run locally

```bash
npm ci
npm run start          # vite dev server on :9000
```

Node 24 is required; the workflows in `.github/workflows` pin the exact patch CI uses.

The dev server reads `public/config.json`, which points at the localhost mock
services. To run against the dev environment APIs instead:

```bash
cp public/config.dev.json public/config.json
npm run start
```

`public/config.json` is a tracked file, so revert it before committing.

## Configuration

Runtime config: a single `config.json` is fetched at boot, and no env vars are
baked into the bundle. The repo carries four versions:

| File                         | When it's served                                          |
| ---------------------------- | --------------------------------------------------------- |
| `public/config.json`         | Local dev, pointing at the localhost mock services        |
| `public/config.dev.json`     | Copied over `config.json` by the deploy workflow, for dev |
| `public/config.staging.json` | Same, for staging                                         |
| `public/config.prod.json`    | Same, for prod                                            |

The same build artifact ships to every environment and only the JSON differs, so
adding or renaming an environment means editing JSON and the deploy workflow,
not code.

Each config carries:

- `envLabel` / `envLabelColor` — the chip next to the wordmark, omitted for prod
  so the chip disappears
- API base URLs for each upstream service (timetable-admin, providers,
  organisations, events, map-admin, chouette, ...)
- `auth0Domain` / `auth0ClientId` / `auth0Audience` / `auth0ClaimsNamespace`
- `defaultAuthMethod` — `auth0` everywhere except local, which uses a mock
  OAuth2 server (`mockOauth2TokenUrl`)

The `Config` type is in `src/contexts/ConfigContext.tsx`. Components read config
via `useConfig()` or `window.config`.

## Scripts

| Script            | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `npm run start`   | Vite dev server with HMR on port 9000                   |
| `npm run build`   | Type-check (`tsc -b`) then production build to `build/` |
| `npm run preview` | Serve the production build locally                      |
| `npm test`        | Vitest watch                                            |
| `npm run check`   | Biome lint and format check                             |
| `npm run format`  | Biome check with `--write`                              |
| `npm run lint`    | Biome lint only                                         |

The pre-commit hook runs `biome check --write` over staged files via lint-staged.

## Project layout

```
src/
├── actions/         Thunks and helpers for the organisation and provider APIs
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
│   ├── netexValidationReports/
│   │                A single NeTEx validation report
│   ├── organization/Permissions admin (sidebar of users/roles/orgs/etc.)
│   └── providers/   Timetable-pipeline admin (provider list, tabs for
│                    migrate-data / events / chouette jobs / line statistics,
│                    NeTEx validation reports)
├── store/           configureStore + typed hooks
├── theme/           theme factory + globalStyles
└── utils/           graphqlFetch, useAccessToken, sort helpers, username rules
```

Routes live in `src/app/Router.tsx`: `/`, `/timetable-admin` and
`/timetable-pipeline` all render Providers, `/permissions` renders Organization,
and `/netex-validation-reports/report/:codespace/:id` renders one report.

## Authentication

OIDC via [react-oidc-context](https://github.com/authts/react-oidc-context),
configured against a compatible OIDC provider. Access is gated on the
`isRouteDataAdmin` role assignment (see `UserContextReducer`); users without the
role see a `NoAccess` screen.

For local development the config switches `defaultAuthMethod` to `local` and
fetches a token from a mock OAuth2 server at
`http://localhost:21999/default/token`. The `auth/` module handles both paths
transparently.

## Deployment

Workflows in `.github/workflows/`:

- **`firebase-hosting-merge.yml`** — every push to `master`. Builds once, then
  deploys to dev → staging → prod sequentially. Each deploy step copies
  `build/config.{env}.json` over `build/config.json` before uploading.
- **`firebase-hosting-pull-request.yml`** — builds every PR and posts a preview
  URL, using the dev config.
- **`maintenance_mode_{dev,staging,production}.yml`** — `workflow_dispatch`
  only. Deploys `public/maintenance.html` as `index.html` for that environment.

`firebase.json` carves out a no-store cache rule for `/config.json` (above the
catch-all `*.json` 1-year rule) so runtime config changes propagate immediately.
