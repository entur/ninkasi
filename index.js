import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'

import MainPage from './containers/MainPage'
import SupplierPage from './containers/SupplierPage'

import configureStore from './store/store'

require('./sass/main.scss')

renderIndex()
/* use authWithKeyCloak(renderIndex) for keycloak authentification */
function authWithKeyCloak(renderCallback) {
  let keycloakAuth = new Keycloak('config/keycloak.json')

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
      renderCallback()
  })
}

function renderIndex() {

  const store = configureStore()

  render(
    <Provider store={store}>
      <MainPage/>
    </Provider>,
    document.getElementById('root')
  )

}
