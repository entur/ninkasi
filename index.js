import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'

import MainApp from './components/AppContainer'
import SupplierForm from './components/SupplierForm'

import configureStore from './store/store'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

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
  const history = syncHistoryWithStore(browserHistory, store)

  render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/ninkasi/">
          <IndexRoute component={MainApp}/>
          <Route path="/ninkasi/provider/:id/edit/" component={SupplierForm}/>
          <Route path="/ninkasi/provider/new/" component={SupplierForm}/>
        </Route>
    </Router>
    </Provider>,
    document.getElementById('root')
  )

}
