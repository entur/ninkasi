import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'

import MainPage from './components/MainPage'
import SupplierPage from './components/SupplierPage'

import configureStore from './store/store'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

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
  const history = syncHistoryWithStore(browserHistory, store)

  render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/admin/ninkasi/">
          <IndexRoute component={MainPage}/>
          <Route path="/admin/ninkasi/provider/:id/edit/" component={SupplierPage}/>
          <Route path="/admin/ninkasi/provider/new/" component={SupplierPage}/>
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
  )

}
