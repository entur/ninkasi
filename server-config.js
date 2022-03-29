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

const path = require('path');
const express = require('express');
const fallback = require('express-history-api-fallback');
const convictConfig = require('./src/config/convict.js');

const contentRoot = path.resolve(process.env.CONTENT_BASE || './build');

const configureApp = async (app) => {
  const convict = await convictConfig;
  const endpointBase = convict.get('endpointBase');

  app.get(endpointBase + '_health', function(req, res) {
    res.sendStatus(200)
  });

  app.get(endpointBase + 'config.json', function(req, res) {
    res.send({
      providersBaseUrl: convict.get('providersBaseUrl'),
      organisationsBaseUrl: convict.get('organisationsBaseUrl'),
      eventsBaseUrl: convict.get('eventsBaseUrl'),
      timetableAdminBaseUrl: convict.get('timetableAdminBaseUrl'),
      mapAdminBaseUrl: convict.get('mapAdminBaseUrl'),
      mapboxAdminBaseUrl: convict.get('mapboxAdminBaseUrl'),
      geocoderAdminBaseUrl: convict.get('geocoderAdminBaseUrl'),
      poiFilterBaseUrl: convict.get('poiFilterBaseUrl'),
      endpointBase: convict.get('endpointBase'),
      chouetteBaseUrl: convict.get('chouetteBaseUrl'),
      udugBaseUrl: convict.get('udugBaseUrl'),
      udugMicroFrontendUrl: convict.get('udugMicroFrontendUrl'),
      ninsarBaseUrl: convict.get('ninsarBaseUrl'),
      ninsarMicroFrontendUrl: convict.get('ninsarMicroFrontendUrl'),
      auth0Domain: convict.get('auth0Domain'),
      auth0ClientId: convict.get('auth0ClientId'),
      auth0Audience: convict.get('auth0Audience'),
      auth0ClaimsNamespace: convict.get('auth0ClaimsNamespace'),
      defaultAuthMethod: convict.get('defaultAuthMethod')
    });
  });

  app.use(endpointBase, express.static(contentRoot))

  app.use(endpointBase, fallback('index.html', { root: contentRoot }))
    .use((err, req, res, next) => {
      console.log(`Request to ${req.url} failed: ${err.stack}`);
      next(err);
    });

  app.use(endpointBase, (err, req, res, next) => {
    res.status(500);
    res.send({
      code: 'INTERNAL_ERROR',
      message: 'Ooops. Something broke back here. Sorry!'
    });
  });

  return app;
}

module.exports = { configureApp };
