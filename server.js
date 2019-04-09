/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

var webpack = require('webpack')
var convictConfig = require('./config/convict.js')
var express = require('express')
var port = process.env.port || 8988
var app = express()
var fs = require('fs')

convictConfig.then( (convict) => {

  var ENDPOINTBASE = convict.get('endpointBase')

  console.info("ENDPOINTBASE is set to", ENDPOINTBASE)

  app.use(ENDPOINTBASE + 'public/', express.static(__dirname + '/public'))

  if (process.env.NODE_ENV !== 'production') {

    let config = require('./webpack.config')
    config.output.publicPath = ENDPOINTBASE + 'public/'

    var compiler = new webpack(config)

    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true, publicPath: config.output.publicPath, stats: {colors: true}
    }))

    app.use(require('webpack-hot-middleware')(compiler))
  } else {

    // expose build bundle for production
    app.get(ENDPOINTBASE + 'public/bundle.js', function(req, res) {
      res.sendFile(__dirname + '/public/bundle.js')
    })

    app.get(ENDPOINTBASE + 'public/react.bundle.js', function(req, res) {
      res.sendFile(__dirname + '/public/react.bundle.js')
    })
  }

  app.get(ENDPOINTBASE, function(req, res) {
    res.send(getPage())
  })

  app.get(ENDPOINTBASE, function(req, res) {
    res.sendFile(__dirname + '/index.html')
  })

  app.get(ENDPOINTBASE + '_health', function(req, res) {
    res.sendStatus(200)
  })


  if (process.env.NODE_ENV == 'production') {
    app.get(ENDPOINTBASE + "static/bundle.js", function(req, res) {
      res.sendFile(__dirname + '/admin/ninkasi/static/bundle.js')
    })
  }

  app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
    res.sendFile(__dirname + '/config/keycloak.json')
  })

  app.get(ENDPOINTBASE + 'config.json', function(req, res) {

    var cfg = {
      providersBaseUrl: convict.get('providersBaseUrl'),
      organisationsBaseUrl: convict.get('organisationsBaseUrl'),
      eventsBaseUrl: convict.get('eventsBaseUrl'),
      timetableAdminBaseUrl: convict.get('timetableAdminBaseUrl'),
      mapAdminBaseUrl: convict.get('mapAdminBaseUrl'),
      mapboxAdminBaseUrl: convict.get('mapboxAdminBaseUrl'),
      geocoderAdminBaseUrl: convict.get('geocoderAdminBaseUrl'),
      poiFilterBaseUrl: convict.get('poiFilterBaseUrl'),
      endpointBase: convict.get('endpointBase'),
      chouetteBaseUrl: convict.get('chouetteBaseUrl')
    }

    createKeyCloakConfig(convict.get('authServerUrl'))

    res.send(cfg)
  })

  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> Listening on port %s. Open up http://localhost:%s%s in your browser.", port, port, ENDPOINTBASE)
    }
  })

  const createKeyCloakConfig = authServerUrl => {
    let config = {
      "realm": "rutebanken",
      "tokens-not-before": 1490857383,
      "public-client" : true,
      "auth-server-url": authServerUrl,
      "resource": "neti-frontend"
    }
    fs.writeFileSync('./config/keycloak.json', JSON.stringify(config), 'utf8')
  }


  const getPage = () =>
    `<!DOCTYPE html>
     <html>
      <head>
        <title>Ninkasi</title>
      </head>
      <body>
        <div id="root">
        </div>
        ${getBundles()}
      </body>
    </html>`

  const getBundles = () => {
    if (process.env.NODE_ENV === 'production') {
      return (`
        <script src="${ENDPOINTBASE}public/react.bundle.js"></script>
        <script src="${ENDPOINTBASE}public/bundle.js"></script>
      `)
    }
    return `<script src="${ENDPOINTBASE}public/bundle.js"></script>`

  }

})
