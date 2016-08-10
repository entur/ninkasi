import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'
import {reducer as formReducer} from 'redux-form'
import {routerReducer} from 'react-router-redux'

const loggerMiddleware = createLogger()

const initialState = {}

const combinedReducer = combineReducers({
  ...reducers.default,
  form: formReducer,
  routing: routerReducer,
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
