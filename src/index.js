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
import Keycloak from 'keycloak-js';
import App from './containers/App';
import configureStore from './store/store';
import './sass/main.scss';
import cfgreader from './config/readConfig';

cfgreader.readConfig(
  function(config) {
    window.config = config;
    authWithKeyCloak(config.endpointBase);
  }.bind(this)
);

function authWithKeyCloak(endpointBase) {
  let kc = new Keycloak(endpointBase + 'config/keycloak.json');

  kc
    .init({ onLoad: 'login-required', checkLoginIframe: false })
    .success(authenticated => {
      if (authenticated) {
        localStorage.setItem('NINKASI::jwt', kc.token);

        setInterval(() => {
          kc.updateToken(10).error(() => kc.logout());
          localStorage.setItem('NINKASI::jwt', kc.token);
        }, 10000);

        renderIndex(kc);
      } else {
        kc.login();
      }
    });
}

function renderIndex(kc) {
  const store = configureStore(kc);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
