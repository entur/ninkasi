# Ninkasi

This is the private admin GUI for importing and exporting data.

## Run the app

```

npm install
npm start
```

## Testing

Uses Nightwatch with Selenium for automated testing, cf. [documentation](http://nightwatchjs.org/)

Running the tests locally can be achived by (note: this required a running selenium-hub)
```
  nightwatch --env local

```

## Configuration

We use convict.js for config. Set environment variables `MARDUK_BASE_URL`
and `NABU_BASE_URL` in order to override default configuration of these
endpoints. E.g.

```
  NABU_BASE_URL=http://localhost:10001/ MARDUK_BASE_URL=http://localhost:11002/ npm start dev
```

Optional environment variable `ENDPOINTBASE` overrides namespace for client including slash. E.g.

```
  ENDPOINTBASE=/admin/ninkasi/ NABU_BASE_URL=http://localhost:10001/ MARDUK_BASE_URL=http://localhost:11002/ npm start dev
```


## Authentification

Uses Keycloak-js for authentification
