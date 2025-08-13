# Ninkasi

This is the private admin GUI for managing the data pipeline and inspection of data status

## Run the app

### Dev

```
npm install
npm run start
```

Requires Node.js v18 or newer.

### Production

```
npm install
npm run build
npm start
```

## Configuration

We use convict.js for config. Set environment variables `PROVIDERS_BASE_URL`, `ORGANISATIONS_BASE_URL`, `TIMETABLE_ADMIN_BASE_URL`, `MAP_ADMIN_BASE_URL`, `GEOCODER_ADMIN_BASE_URL`
and `EVENTS_BASE_URL` in order to override default configuration of these
endpoints. E.g.

```
ORGANISATIONS_BASE_URL=http://localhost:16001/services/organisations/ \
  PROVIDERS_BASE_URL=http://localhost:16001/services/providers/ \
  EVENTS_BASE_URL=http://localhost:10001/services/events/ \
  TIMETABLE_ADMIN_BASE_URL=http://localhost:11002/services/timetable_admin/ \
  MAP_ADMIN_BASE_URL=http://localhost:11002/services/map_admin/ \
  GEOCODER_ADMIN_BASE_URL=http://localhost:11002/services/geocodr_admin/ \
  npm start dev
```

Optional environment variable `ENDPOINTBASE` overrides namespace for client including slash. E.g.

```
ENDPOINTBASE=/admin/ninkasi/ \
  ORGANISATIONS_BASE_URL=http://localhost:16001/services/organisations/ \
  PROVIDERS_BASE_URL=http://localhost:16001/services/providers/ \
  EVENTS_BASE_URL=http://localhost:10001/services/events/ \
  TIMETABLE_ADMIN_BASE_URL=http://localhost:11002/services/timetable_admin/ \
  MAP_ADMIN_BASE_URL=http://localhost:11002/services/map_admin/ \
  GEOCODER_ADMIN_BASE_URL=http://localhost:11002/services/geocodr_admin/ \
  npm start dev
```

### Authentication

Uses Keycloak to authenticate user and read JWT, set `auth-server-url`:

```
AUTH_SERVER_URL=https://kc-dev.devstage.entur.io/auth \
  PORT=9000 \
  ENDPOINTBASE=/admin/ninkasi/ \
  EVENTS_BASE_URL=http://localhost:10001/services/events/ \
  TIMETABLE_ADMIN_BASE_URL=http://localhost:11002/services/timetable_admin/ \
  MAP_ADMIN_BASE_URL=http://localhost:11002/services/map_admin/ \
  GEOCODER_ADMIN_BASE_URL=http://localhost:11002/services/geocodr_admin/ \
  npm start dev
```

**_NB_** Use `PORT=8000` or `PORT=9000` for development against `https://kc-dev.devstage.entur.io/auth` since these are whitelisted.
