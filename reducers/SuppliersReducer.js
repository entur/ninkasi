import * as types from './../actions/actionTypes'
import {reducer as formReducer} from 'redux-form'

const initialState = {
  data: [],
  statusList: []
}

const SuppliersReducer = (state = initialState, action) => {


  switch (action.type) {

    case types.ERRORS_SUPPLIERS:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: true})
    case types.RECEIVED_SUPPLIERS:
      return Object.assign({}, state, {isLoading: false, data: action.payLoad, error: false })
    case types.REQUEST_SUPPLIERS:
      return Object.assign({}, state, {isLoading: true, error: false })
    case types.SELECT_SUPPLIER:
      return Object.assign({}, state, {activeId: action.payLoad})
    case types.SUCCESS_FETCH_PROVIDER:
      return Object.assign({}, state, {provider: action.payLoad})
    case types.RECEIVED_SUPPLIER_STATUS:
      return Object.assign({}, state, {statusList: action.payLoad})

    default:
      return state
  }
}

export default SuppliersReducer
