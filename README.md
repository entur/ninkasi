# Ninkasi

This is the private admin GUI for managing the data pipeline and inspection of data status. Deployed to https://ninkasi.dev.entur.org/ and others.

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
endpoints, e.g.

```
ORGANISATIONS_BASE_URL=http://localhost:16001/services/organisations/ \
  PROVIDERS_BASE_URL=http://localhost:16001/services/providers/ \
  EVENTS_BASE_URL=http://localhost:10001/services/events/ \
  TIMETABLE_ADMIN_BASE_URL=http://localhost:11002/services/timetable_admin/ \
  MAP_ADMIN_BASE_URL=http://localhost:11002/services/map_admin/ \
  GEOCODER_ADMIN_BASE_URL=http://localhost:11002/services/geocodr_admin/ \
  npm start dev
```

Optional environment variable `ENDPOINTBASE` overrides namespace for client including slash, e.g.

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

We're using OIDC, not connected to any specific provider






