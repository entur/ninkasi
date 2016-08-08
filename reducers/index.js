import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

export const suppliersReducer = (state = {}, action) => {

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

    case types.SUCCESS_FETCH_PROVIDER:
      return Object.assign({}, state, {provider: action.payLoad})

    default:
      return state
  }
}


// Todo : clearform if submission succeeds, doc. http://redux-form.com/6.0.0-alpha.4/docs/faq/HowToClear.md/
export const form = formReducer.plugin({
  provider: (state, action) => {
    return state
  }
})

export const mardukReducer = (state = {}, action) => {

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

    case types.ERROR_FETCH_OSM:
      return Object.assign({}, state, {isLoading: false, fetch_osm: action.payLoad, error: true})
    case types.SUCCESS_FETCH_OSM:
      return Object.assign({}, state, {isLoading: false, fetch_osm: action.payLoad, error: false})
    case types.REQUEST_FETCH_OSM:
      return Object.assign({}, state, {isLoading: true, error: false})


    case types.ERROR_VALIDATE_PROVIDER:
      return Object.assign({}, state, {isLoading: false, validate_provider: action.payLoad, error: true})
    case types.SUCCESS_VALIDATE_PROVIDER:
      return Object.assign({}, state, {isLoading: false, validate_provider: action.payLoad, error: false})

    case types.REQUEST_FILENAMES:
      return Object.assign({}, state, {filenames: { isLoading: true, error: false}} )
    case types.SUCCESS_FILENAMES:
      return Object.assign({}, state, {filenames: {isLoading: false, fetch_filesnames: action.payLoad, error: false}})
    case types.ERROR_FILENAMES:
      return Object.assign({}, state, {filesnames: {isLoading: false, error: action.payLoad}})

    default:
      return state
  }
}
