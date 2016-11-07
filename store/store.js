import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'

const loggerMiddleware = createLogger()

var enchancer = {}

if (process.env.NODE_ENV === 'development') {

  enchancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
  )

} else {
  enchancer = compose(
    applyMiddleware(thunkMiddleware)
  )
}

const initialState = {}

const combinedReducer = combineReducers({
  ...reducers
})

export default function configureStore(history) {

  let store = createStore(combinedReducer, initialState, enchancer)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
