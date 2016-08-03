import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'

import {routerReducer} from 'react-router-redux'

const loggerMiddleware = createLogger()

const initialState = {}

const combinedReducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

export default function configureStore(history) {
  return createStore(
    combinedReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
