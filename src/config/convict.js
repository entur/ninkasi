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

var convict = require('convict');
var request = require('request');
var fs = require('fs');

module.exports = new Promise(function(resolve, reject) {
  var conf = convict({
    env: {
      doc: 'The applicaton environment.',
      format: ['production', 'development'],
      default: 'development',
      env: 'NODE_ENV'
    },
    configUrl: {
      doc: 'URL for where to read the configuration',
      format: '*',
      default: 'http://rutebanken.org/do_not_read',
      env: 'CONFIG_URL'
    },
    organisationsBaseUrl: {
      doc: 'Base URL for for Organisations API including slash',
      format: 'url',
      default: 'http://localhost:16001/services/organisations/',
      env: 'ORGANISATIONS_BASE_URL'
    },
    providersBaseUrl: {
      doc: 'Base URL for for Providers API including slash',
      format: 'url',
      default: 'http://localhost:16001/services/providers/',
      env: 'PROVIDERS_BASE_URL'
    },
    eventsBaseUrl: {
      doc: 'Base URL for for Events API including slash',
      format: 'url',
      default: 'http://localhost:1888/services/events/',
      env: 'EVENTS_BASE_URL'
    },
    timetableAdminBaseUrl: {
      doc: 'Base URL for for Timatable admin API including slash',
      format: 'url',
      default: 'http://localhost:10011/services/timetable_admin/',
      env: 'TIMETABLE_ADMIN_BASE_URL'
    },
    mapAdminBaseUrl: {
      doc: 'Base URL for for Map admin API including slash',
      format: 'url',
      default: 'http://localhost:10011/services/map_admin/',
      env: 'MAP_ADMIN_BASE_URL'
    },
    mapboxAdminBaseUrl: {
      doc: 'Base URL for for Mapbox admin API including slash',
      format: 'url',
      default: 'http://localhost:10011/services/mapbox_admin/',
      env: 'MAPBOX_ADMIN_BASE_URL'
    },
    geocoderAdminBaseUrl: {
      doc: 'Base URL for for Geocoder admin API including slash',
      format: 'url',
      default: 'http://localhost:10011/services/geocoder_admin/',
      env: 'GEOCODER_ADMIN_BASE_URL'
    },
    poiFilterBaseUrl: {
      doc: 'Base URL for for POI filter API including slash',
      format: 'url',
      default:
        'http://localhost:10011/services/custom_configurations/poiFilter',
      env: 'POI_FILTER_BASE_URL'
    },
    endpointBase: {
      doc: 'Namespace for client including slash, e.g. /admin/bel/',
      format: String,
      default: '/',
      env: 'ENDPOINTBASE'
    },
    chouetteBaseUrl: {
      doc: 'URL to Chouette UI',
      format: String,
      default: 'https://redigering.rutebanken.org/',
      env: 'CHOUETTE_BASE_URL'
    },
    udugBaseUrl: {
      doc: 'URL to Udug (Netex validation reports)',
      format: String,
      default: 'https://udug-dev.web.app/',
      env: 'UDUG_BASE_URL'
    },
    auth0Domain: {
      doc: 'Auth0 domain',
      format: String,
      default: 'ror-entur-dev.eu.auth0.com',
      env: 'AUTH0_DOMAIN'
    },
    auth0ClientId: {
      doc: 'Auth0 Client Id',
      format: String,
      default: 'h5bjgdnSSJi0JcaG3ugigtyBEXaPASQM',
      env: 'AUTH0_CLIENT_ID'
    },
    auth0Audience: {
      doc: 'Auth0 Audience',
      format: String,
      default: 'https://ror.api.dev.entur.io',
      env: 'AUTH0_AUDIENCE'
    },
    auth0ClaimsNamespace: {
      doc: 'Namespace for auth0 ID token custom roles claims',
      format: String,
      default: 'https://ror.entur.io/role_assignments',
      env: 'AUTH0_CLAIMS_NAMESPACE'
    },
    defaultAuthMethod: {
      doc: 'Set default authentication method (kc or auth0)',
      format: String,
      default: 'auth0',
      env: 'DEFAULT_AUTH_METHOD'
    }
  });

  // If configuration URL exists, read it and update the configuration object
  var configUrl = conf.get('configUrl');

  console.log('configUrl', configUrl);

  if (configUrl.indexOf('do_not_read') === -1) {
    // Read contents from configUrl if it is given

    if (configUrl.indexOf('http') === -1) {
      fs.readFile(configUrl, (error, data) => {
        if (!error) {
          data = JSON.parse(data);
          conf.load(data);
          conf.validate();
          resolve(conf);
        } else {
          reject('Could not load data from ' + configUrl, error);
        }
      });
    } else {
      request(configUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          body = JSON.parse(body);
          conf.load(body);
          conf.validate();
          resolve(conf);
        } else {
          reject('Could not load data from ' + configUrl, error);
        }
      });
    }
  } else {
    console.log(
      'The CONFIG_URL element has not been set, so you use the default dev-mode configuration'
    );
    conf.validate();
    resolve(conf);
  }
});
