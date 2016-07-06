# Ninkasi

This is the private admin GUI for importing and exporting data.

## Run the app

```

npm install
npm start
```

Take a look at package.json for dependencies and scripts


## Configuration

We use convict.js for config. Set environment variables `MARDUK_BASE_URL`
and `NABU_BASE_URL` in order to override default configuration of these
endpoints.

## Authentification

```

Uses Keycloak-js for authentification
