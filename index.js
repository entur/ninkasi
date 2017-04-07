import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Keycloak from 'keycloak-js'
import App from './containers/App'
import configureStore from './store/store'
import './sass/main.scss'
import injectTapEventPlugin from 'react-tap-event-plugin'
import cfgreader from './config/readConfig'
import axios from 'axios'

cfgreader.readConfig( (function(config) {
  window.config = config
  authWithKeyCloak(config.endpointBase)
}).bind(this))



function authWithKeyCloak(endpointBase) {

  let kc = new Keycloak(endpointBase + 'config/keycloak.json')

  kc.init({ onLoad: 'login-required', checkLoginIframe: false }).success( authenticated => {

    if (authenticated) {
      setInterval(() => {
        kc.updateToken(10).error(() => kc.logout())
        axios.interceptors.request.use(config => {
          config.headers = {...config.headers, ...{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + kc.token
          }}
          return config;
        })

      }, 10000)

      renderIndex(kc)

    } else {
      kc.login()
    }
  })
}

function renderIndex(kc) {

  const store = configureStore(kc)
  injectTapEventPlugin()

  render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  )

}
