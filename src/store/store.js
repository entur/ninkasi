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

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createRootReducer from 'reducers';

export const history = createBrowserHistory();

export default function configureStore() {
  let enchancer = {};

  if (process.env.NODE_ENV === 'development') {
    const loggerMiddleware = createLogger({ collapsed: true });
    const composeEnhancers = composeWithDevTools({});
    enchancer = composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware,
        loggerMiddleware
      )
    );
  } else {
    enchancer = compose(
      applyMiddleware(routerMiddleware(history), thunkMiddleware)
    );
  }

  let store = createStore(createRootReducer(history), {}, enchancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('reducers/');
      store.replaceReducer(nextRootReducer(history));
    });
  }

  return store;
}
