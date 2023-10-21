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
import './sass/main.scss';
import cfgreader from 'config/readConfig';
import AuthProvider, { useAuth } from '@entur/auth-provider';
import { startRouteChangeEmitter } from '@entur/micro-frontend';

startRouteChangeEmitter();

cfgreader.readConfig(function(config) {
  window.config = config;
  renderIndex(config);
});

const AuthenticatedApp = () => {
  const auth = useAuth();

  return (
    <Provider store={configureStore(auth)}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
};

function renderIndex(config) {
  render(
    <AuthProvider
      auth0Config={{
        domain: config.auth0Domain,
        clientId: config.auth0ClientId,
        audience: config.auth0Audience,
        redirectUri: window.location.origin
      }}
      auth0ClaimsNamespace={config.auth0ClaimsNamespace}
    >
      <AuthenticatedApp />
    </AuthProvider>,
    document.getElementById('root')
  );
}
