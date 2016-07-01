import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'
import App from './components/AppContainer'
import configureStore from './store/store';

require('./sass/main.scss')


renderIndex()
/* use authWithKeyCloak(renderIndex) for keycloak authentification */
function authWithKeyCloak(renderCallback) {
  let keycloakAuth = new Keycloak('config/keycloak.json');

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
      renderCallback()
  })
}

function renderIndex() {

  const store = configureStore()

  render(
    <Provider store={store}>
      <App store={store}/>
    </Provider>,
    document.getElementById('root')
  )

}
