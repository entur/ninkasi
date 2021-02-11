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

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from 'app';
import configureStore, { history } from 'store/store';
import 'sass/main.scss';
import cfgreader from 'config/readConfig';
import { Auth0Provider } from '@auth0/auth0-react';
import Auth0AuthenticatedApp from 'app/Auth0AuthenticatedApp';
import KeycloakAuthenticatedApp from 'app/KeycloakAuthenticatedApp';

cfgreader.readConfig(function(config) {
  window.config = config;
  determineAuthMethod(config);
});

function determineAuthMethod(config) {
  if (window.location.search.indexOf('authMethod=auth0') > -1) {
    localStorage.setItem('NINKASI::authMethod', 'auth0');
  } else if (window.location.search.indexOf('authMethod=kc') > -1) {
    localStorage.setItem('NINKASI::authMethod', 'kc');
  } else if (localStorage.getItem('NINKASI::authMethod') === null) {
    localStorage.setItem('NINKASI::authMethod', 'kc');
  }

  renderIndex(localStorage.getItem('NINKASI::authMethod'), config);
}

function renderIndex(authMethod, config) {
  if (authMethod === 'kc') {
    render(
      <KeycloakAuthenticatedApp config={config}>
        {auth => (
          <Provider store={configureStore(auth)}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </Provider>
        )}
      </KeycloakAuthenticatedApp>,
      document.getElementById('root')
    );
  } else if (authMethod === 'auth0') {
    render(
      <Auth0Provider
        domain="ror-entur-dev.eu.auth0.com"
        clientId="h5bjgdnSSJi0JcaG3ugigtyBEXaPASQM"
        redirectUri={window.location.origin}
        audience={['https://ror.api.dev.entur.io']}
        useRefreshToken
        cacheLocation="localstorage" // <-- only enable on localhost
      >
        <Auth0AuthenticatedApp>
          {auth => (
            <Provider store={configureStore(auth)}>
              <ConnectedRouter history={history}>
                <App />
              </ConnectedRouter>
            </Provider>
          )}
        </Auth0AuthenticatedApp>
      </Auth0Provider>,
      document.getElementById('root')
    );
  }
}
