# Ninkasi

This is the private admin GUI for importing and exporting data.

## Run the app

```

npm install
npm start
```

## Developer note

```

In addition to the steps above, NABU_BASE_URL and MARDUK_BASE_URL should be provided
(otherwise defaulted to http://localhost:18081/ and http://localhost:18080/ respectively)

e.g.
NABU_BASE_URL=http://localhost:10001/ MARDUK_BASE_URL=http://localhost:11002/ npm start dev

```

## Configuration

We use convict.js for config. Set environment variables `MARDUK_BASE_URL`
and `NABU_BASE_URL` in order to override default configuration of these
endpoints.

## Authentification

```

Uses Keycloak-js for authentification
