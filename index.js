import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import helloReducer from './reducers'
import Keycloak from 'keycloak-js'
import App from './components/App'

let store = createStore(helloReducer)

renderIndex()
/* use authWithKeyCloak(renderIndex) for keycloak authentification */
function authWithKeyCloak(renderCallback) {
  let keycloakAuth = new Keycloak('config/keycloak.json');

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
      renderCallback()
  })
}


function renderIndex() {

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

}
