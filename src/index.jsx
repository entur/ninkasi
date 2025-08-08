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

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from 'app';
import configureStore, { history } from 'store/store';
import './sass/main.scss';
import cfgreader from 'config/readConfig';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { startRouteChangeEmitter } from '@entur/micro-frontend';

startRouteChangeEmitter();

cfgreader.readConfig(function (config) {
  window.config = config;
  renderIndex(config);
});

const AuthenticatedApp = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  return (
    <Provider store={configureStore()}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
};

function renderIndex(config) {
  const oidcConfig = {
    authority: `https://${config.auth0Domain}`,
    client_id: config.auth0ClientId,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
  };

  if (config.auth0Audience) {
    oidcConfig.extraQueryParams = { audience: config.auth0Audience };
  }

  const root = createRoot(document.getElementById('root'));
  root.render(
    <AuthProvider {...oidcConfig}>
      <AuthenticatedApp />
    </AuthProvider>,
  );
}
