import { combineReducers } from 'redux'
import * as types from './../actions/actionTypes'

const suppliersReducer = (state = {}, action) => {

  switch (action.type) {

    case types.RECV_ERROR:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: true})
    case types.RECV_DATA:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: false })
    case types.REQ_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })
    case types.SELECT_SUPPLIER:
      return Object.assign({}, state, {activeId: action.payLoad})
    case types.ADD_NOTIFICATION:
      return Object.assign({}, state, {notification: {
        message: action.message,
        level: action.level
      }})

    default:
      return state
  }
}

const mardukReducer = (state = {}, action) => {

  switch(action.type) {

    case types.ERROR_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: false, import_data: action.payLoad, error: true})
    case types.SUCCESS_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: false, import_data: action.payLoad, error: false })
    case types.REQUEST_IMPORT_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })

    case types.ERROR_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: false, export_data: action.payLoad, error: true})
    case types.SUCCESS_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: false, export_data: action.payLoad, error: false })
    case types.REQUEST_EXPORT_DATA:
      return Object.assign({}, state, {isLoading: true, error: false })

    case types.ERROR_DELETE_DATA:
      return Object.assign({}, state, {isLoading: false, delete_data: action.payLoad, error: true})
    case types.SUCCESS_DELETE_DATA:
      return Object.assign({}, state, {isLoading: false, delete_data: action.payLoad, error: false})
    case types.REQUEST_DELETE_DATA:
      return Object.assign({}, state, {isLoading: true, error: false})

    case types.ERROR_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: false, build_graph: action.payLoad, error: true})
    case types.SUCCESS_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: false, build_graph: action.payLoad, error: false})
    case types.REQUEST_BUILD_GRAPH:
      return Object.assign({}, state, {isLoading: true, error: false})

    default:
      return state
  }
}

const reducer = combineReducers({
  suppliersReducer,
  mardukReducer
})

export default reducer
